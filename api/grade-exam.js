/**
 * Vercel Serverless Function — A4-ALAM Exam Grading & WaqfLedger State Sealing
 *
 * Authoritative MCDA scoring and SHA-256 attestation sealing run exclusively
 * on the server. The client must never evaluate the master answer key.
 */

import { createHash } from 'node:crypto';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const PASS_THRESHOLD = 85.0;
const LEDGER_TIMEOUT_MS = 12_000;
const DEFAULT_WAQFLEDGER_ENDPOINT =
  'https://waqfledger-api.vercel.app/api/log-compliance';

/** Unified cohort weights: Sc = Σ(wi × Pi) for pillars P1–P4. */
const COHORT_WEIGHTS = Object.freeze({
  CLL: Object.freeze([0.1, 0.5, 0.2, 0.2]),
  ExL: Object.freeze([0.3, 0.3, 0.2, 0.2]),
  OEL: Object.freeze([0.4, 0.1, 0.4, 0.1]),
});

const PILLAR_BLOCKS = Object.freeze([
  Object.freeze({ minId: 1, maxId: 10 }),
  Object.freeze({ minId: 11, maxId: 20 }),
  Object.freeze({ minId: 21, maxId: 29 }),
  Object.freeze({ minId: 30, maxId: 30 }),
]);

/**
 * Server-side master answer key (scenario id → correct option + compliance weight).
 * Never ship this map in the client bundle.
 * correctOptionIndex is evenly distributed across A(0)/B(1)/C(2)/D(3) (8/8/7/7).
 * ExamPlayer may Fisher–Yates shuffle display order and must map choices back
 * to these original option indices before submission.
 */
const MASTER_ANSWER_KEY = Object.freeze(
  Object.fromEntries(
    [
      [1, 0, 1.0],
      [2, 1, 1.1],
      [3, 2, 1.2],
      [4, 3, 1.0],
      [5, 0, 1.1],
      [6, 1, 1.2],
      [7, 2, 1.1],
      [8, 3, 1.2],
      [9, 0, 1.3],
      [10, 1, 1.4],
      [11, 2, 1.6],
      [12, 3, 1.7],
      [13, 0, 1.8],
      [14, 1, 1.9],
      [15, 2, 2.0],
      [16, 3, 1.8],
      [17, 0, 1.9],
      [18, 1, 2.0],
      [19, 2, 1.7],
      [20, 3, 2.1],
      [21, 0, 2.5],
      [22, 1, 2.6],
      [23, 2, 2.8],
      [24, 3, 2.7],
      [25, 0, 2.6],
      [26, 1, 2.5],
      [27, 2, 2.7],
      [28, 3, 2.8],
      [29, 0, 2.9],
      [30, 1, 3.0],
    ].map(([id, correctOptionIndex, complianceWeight]) => [
      id,
      Object.freeze({ correctOptionIndex, complianceWeight }),
    ]),
  ),
);

const CORS_HEADERS = Object.freeze({
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
});

/**
 * @param {import('http').ServerResponse} res
 * @param {number} status
 * @param {object} body
 */
function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value);
  }
  res.end(JSON.stringify(body));
}

/**
 * Recursively sort object keys for deterministic JSON serialization.
 * @param {unknown} value
 * @returns {unknown}
 */
function canonicalize(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }

  return Object.keys(value)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = canonicalize(value[key]);
      return sorted;
    }, {});
}

/**
 * @param {object} payload
 * @returns {string} 64-character lowercase hex SHA-256 digest
 */
function sha256Hex(payload) {
  const canonicalJson = JSON.stringify(canonicalize(payload));
  return createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

/**
 * Exact (unrounded) pillar performance Pi as 0–100 weighted percentage.
 * @param {Array<{ scenarioId: number; isCorrect: boolean; complianceWeight: number }>} evaluated
 * @param {{ minId: number; maxId: number }} block
 * @returns {number}
 */
function pillarPerformance(evaluated, block) {
  let earned = 0;
  let maximum = 0;

  for (const entry of evaluated) {
    if (entry.scenarioId < block.minId || entry.scenarioId > block.maxId) continue;
    maximum += entry.complianceWeight;
    if (entry.isCorrect) {
      earned += entry.complianceWeight;
    }
  }

  if (maximum <= 0) return 0;
  return (earned / maximum) * 100;
}

/**
 * MCDA composite: Sc = Σ(wi × Pi) — exact, unrounded.
 * @param {unknown} scenarioAnswers
 * @param {string} roleId
 * @returns {number}
 */
function calculateMcdaScore(scenarioAnswers, roleId) {
  const weights = COHORT_WEIGHTS[roleId];
  if (!weights) {
    throw new RangeError(
      `Unknown roleId "${roleId}"; expected one of ${Object.keys(COHORT_WEIGHTS).join(', ')}.`,
    );
  }

  if (!Array.isArray(scenarioAnswers) || scenarioAnswers.length === 0) {
    throw new TypeError('scenarioAnswers must be a non-empty array.');
  }

  const evaluated = scenarioAnswers.map((answer) => {
    const scenarioId = Number(answer?.scenarioId);
    const chosenOptionIndex = Number(answer?.chosenOptionIndex);
    const key = MASTER_ANSWER_KEY[scenarioId];

    if (!key) {
      throw new RangeError(`Unknown scenarioId ${scenarioId}; matrix accepts ids 1–30.`);
    }

    if (!Number.isInteger(chosenOptionIndex) || chosenOptionIndex < 0) {
      throw new TypeError(
        `Invalid chosenOptionIndex for scenario ${scenarioId}.`,
      );
    }

    return {
      scenarioId,
      isCorrect: chosenOptionIndex === key.correctOptionIndex,
      complianceWeight: key.complianceWeight,
    };
  });

  let score = 0;
  for (let index = 0; index < PILLAR_BLOCKS.length; index += 1) {
    const pi = pillarPerformance(evaluated, PILLAR_BLOCKS[index]);
    score += weights[index] * pi;
  }

  return score;
}

/**
 * Persist seal locally when the remote ledger is unavailable.
 * @param {object} sealRecord
 */
async function writeFallbackSeal(sealRecord) {
  const fallbackPath = join(tmpdir(), 'safeai-waqfledger-fallback', 'seals.jsonl');
  await mkdir(dirname(fallbackPath), { recursive: true });
  await appendFile(fallbackPath, `${JSON.stringify(sealRecord)}\n`, 'utf8');
  console.error('[grade-exam] WaqfLedger fallback seal persisted', {
    path: fallbackPath,
    assessment_id: sealRecord.assessment_id,
    hash: sealRecord.hash,
  });
}

/**
 * @param {object} canonicalPayload
 * @param {string} hash
 * @returns {Promise<{ sealed: boolean; mode: 'remote' | 'local'; ledgerStatus: 'remote_sealed' | 'local_fallback'; remoteStatus?: number }>}
 */
async function sealOnWaqfLedger(canonicalPayload, hash) {
  const endpoint =
    (typeof process.env.WAQFLEDGER_ENDPOINT === 'string'
      && process.env.WAQFLEDGER_ENDPOINT.trim())
    || DEFAULT_WAQFLEDGER_ENDPOINT;

  const apiSecret =
    typeof process.env.WAQFLEDGER_API_SECRET === 'string'
      ? process.env.WAQFLEDGER_API_SECRET.trim()
      : '';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LEDGER_TIMEOUT_MS);

  try {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        ...canonicalPayload,
        hash,
        stateHash: hash,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`WaqfLedger rejected seal (${response.status})`);
    }

    return {
      sealed: true,
      mode: 'remote',
      ledgerStatus: 'remote_sealed',
      remoteStatus: response.status,
    };
  } catch (error) {
    const sealRecord = {
      ...canonicalPayload,
      hash,
      fallbackReason: error instanceof Error ? error.message : 'unknown_ledger_failure',
      fallbackAt: new Date().toISOString(),
    };

    try {
      await writeFallbackSeal(sealRecord);
    } catch (fallbackError) {
      console.error('[grade-exam] Fallback storage failed', fallbackError);
    }

    return { sealed: true, mode: 'local', ledgerStatus: 'local_fallback' };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<object>}
 */
async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw.trim()) {
    throw new TypeError('Request body is empty.');
  }

  return JSON.parse(raw);
}

/**
 * Vercel / Node serverless entrypoint.
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value);
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, {
      success: false,
      error: 'Method not allowed. Use POST.',
    });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const {
      scenarioAnswers,
      roleId,
      language,
      examineeName,
      cohort,
      securityBreach,
    } = body ?? {};

    if (!roleId || !COHORT_WEIGHTS[roleId]) {
      sendJson(res, 400, {
        success: false,
        error: `Invalid roleId. Expected one of: ${Object.keys(COHORT_WEIGHTS).join(', ')}.`,
      });
      return;
    }

    const breachFlag = Boolean(securityBreach);
    const calculatedScore = breachFlag
      ? 0
      : calculateMcdaScore(scenarioAnswers, roleId);
    const passed = !breachFlag && calculatedScore >= PASS_THRESHOLD;
    const timestamp = new Date().toISOString();
    const assessmentId = `A4-ALAM-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const canonicalPayload = {
      assessment_id: assessmentId,
      cohort: cohort || 'CLL_COMPLIANCE_LEGAL',
      composite_score: parseFloat(calculatedScore.toFixed(2)),
      examinee_name: examineeName || 'Anonymous Operator',
      language: language || 'en',
      passed,
      security_breach: breachFlag,
      timestamp,
    };

    const hash = sha256Hex(canonicalPayload);
    const ledgerResult = await sealOnWaqfLedger(canonicalPayload, hash);

    sendJson(res, 200, {
      success: true,
      passed,
      score: parseFloat(calculatedScore.toFixed(2)),
      hash,
      timestamp,
      assessmentId,
      sealMode: ledgerResult.mode,
      ledgerStatus: ledgerResult.ledgerStatus,
      securityBreach: breachFlag,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Grading failed.';
    const status =
      error instanceof RangeError || error instanceof TypeError || error instanceof SyntaxError
        ? 400
        : 500;

    console.error('[grade-exam] handler error', error);
    sendJson(res, status, {
      success: false,
      error: message,
    });
  }
}
