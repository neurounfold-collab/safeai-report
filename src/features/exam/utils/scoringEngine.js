/**
 * Examination Scoring & Analytics Engine — safeAI.report
 *
 * Processes the authoritative 30-scenario EU AI Act Article 4 compliance matrix,
 * computes weighted institutional certification scores, emits anonymous doctoral
 * research packets, and fabricates immutable WaqfLedger.tech cryptographic states.
 */

import { SAFEAI_MASTER_CONFIG } from "../../../config/constants.js";
import {
  EXAM_SCENARIO_MATRIX,
  EXAM_SCENARIO_COUNT,
  EXAM_TIER_BOUNDARIES
} from "../data/scenarios.js";

// ── Certification Threshold ───────────────────────────────────────────────────

/** Minimum weighted compliance percentage required for institutional certification. */
export const INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT = 85;

/** Decimal multiplier derived from the institutional threshold (e.g. 0.85). */
export const INSTITUTIONAL_CERTIFICATION_THRESHOLD_RATIO =
  INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT / 100;

/** Minimum composite literacy score (Sc) before registry firewall remediation. */
export const REGISTRY_FIREWALL_THRESHOLD_PERCENT = 66;

/** Role-adaptive A4-ALAM cohort profile identifiers. */
export const COHORT_PROFILE_IDS = ["ExL", "CLL", "OEL"];

/**
 * Cohort weight vectors (w1–w4) mapped to evaluation pillars P1–P4.
 * Weights sum to 1.0 per profile.
 */
export const COHORT_WEIGHT_PROFILES = {
  ExL: { w1: 0.2, w2: 0.4, w3: 0.1, w4: 0.3 },
  CLL: { w1: 0.1, w2: 0.5, w3: 0.2, w4: 0.2 },
  OEL: { w1: 0.4, w2: 0.1, w3: 0.4, w4: 0.1 }
};

/** Scenario id ranges for Alam Matrix pillars (FLA, RTRA, GOC, IVC). */
const PILLAR_SCENARIO_BLOCKS = {
  p1: { minId: 1, maxId: 10 },
  p2: { minId: 11, maxId: 20 },
  p3: { minId: 21, maxId: 29 },
  p4: { minId: 30, maxId: 30 }
};

// ── Internal Lookups ──────────────────────────────────────────────────────────

/** O(1) scenario lookup keyed by authoritative matrix id. */
const SCENARIO_BY_ID = new Map(
  EXAM_SCENARIO_MATRIX.map((scenario) => [scenario.id, scenario])
);

/**
 * Resolves a scenario definition from the matrix or throws on unknown ids.
 * @param {number} scenarioId
 * @returns {import("../data/scenarios.js").EXAM_SCENARIO_MATRIX[number]}
 */
function resolveScenario(scenarioId) {
  const scenario = SCENARIO_BY_ID.get(scenarioId);
  if (!scenario) {
    throw new RangeError(
      `Unknown scenario id ${scenarioId}; matrix accepts ids 1–${EXAM_SCENARIO_COUNT}.`
    );
  }
  return scenario;
}

/**
 * Determines whether a single response is correct against the matrix answer key.
 * @param {object} scenario
 * @param {number} chosenOptionIndex
 * @returns {boolean}
 */
function isResponseCorrect(scenario, chosenOptionIndex) {
  return chosenOptionIndex === scenario.correctOptionIndex;
}

/**
 * @param {object[]} evaluatedResponses
 * @param {number} minId
 * @param {number} maxId
 * @returns {number} Pillar performance Pi as 0–100 weighted percentage.
 */
function calculatePillarPerformance(evaluatedResponses, minId, maxId) {
  let earned = 0;
  let maximum = 0;

  for (const entry of evaluatedResponses) {
    if (entry.scenarioId < minId || entry.scenarioId > maxId) continue;
    maximum += entry.complianceWeight;
    if (entry.isCorrect) {
      earned += entry.complianceWeight;
    }
  }

  if (maximum <= 0) return 0;
  return roundToTwoDecimals((earned / maximum) * 100);
}

/**
 * Derives pillar performances P1–P4 from evaluated response audit trail.
 * @param {object[]} evaluatedResponses
 * @returns {{ p1: number, p2: number, p3: number, p4: number }}
 */
export function calculatePillarPerformances(evaluatedResponses) {
  return {
    p1: calculatePillarPerformance(
      evaluatedResponses,
      PILLAR_SCENARIO_BLOCKS.p1.minId,
      PILLAR_SCENARIO_BLOCKS.p1.maxId
    ),
    p2: calculatePillarPerformance(
      evaluatedResponses,
      PILLAR_SCENARIO_BLOCKS.p2.minId,
      PILLAR_SCENARIO_BLOCKS.p2.maxId
    ),
    p3: calculatePillarPerformance(
      evaluatedResponses,
      PILLAR_SCENARIO_BLOCKS.p3.minId,
      PILLAR_SCENARIO_BLOCKS.p3.maxId
    ),
    p4: calculatePillarPerformance(
      evaluatedResponses,
      PILLAR_SCENARIO_BLOCKS.p4.minId,
      PILLAR_SCENARIO_BLOCKS.p4.maxId
    )
  };
}

/**
 * Computes composite literacy score Sc = Σ(wi × Pi) with Pi expressed as 0–100 percentages.
 * @param {{ p1: number, p2: number, p3: number, p4: number }} pillarPerformances
 * @param {{ w1: number, w2: number, w3: number, w4: number }} cohortWeights
 * @returns {number}
 */
export function calculateCompositeLiteracyScore(pillarPerformances, cohortWeights) {
  const composite =
    cohortWeights.w1 * pillarPerformances.p1 +
    cohortWeights.w2 * pillarPerformances.p2 +
    cohortWeights.w3 * pillarPerformances.p3 +
    cohortWeights.w4 * pillarPerformances.p4;

  return roundToTwoDecimals(composite);
}

/**
 * Resolves theme-aligned score band for composite literacy display.
 * @param {number} compositeScore
 * @returns {'exposure' | 'developing' | 'certified'}
 */
export function resolveCompositeScoreBand(compositeScore) {
  if (compositeScore < REGISTRY_FIREWALL_THRESHOLD_PERCENT) return "exposure";
  if (compositeScore < INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT) return "developing";
  return "certified";
}

/**
 * @param {string} cohortProfileId
 * @returns {{ w1: number, w2: number, w3: number, w4: number }}
 */
export function resolveCohortWeights(cohortProfileId) {
  const weights = COHORT_WEIGHT_PROFILES[cohortProfileId];
  if (!weights) {
    throw new RangeError(
      `Unknown cohort profile "${cohortProfileId}"; expected one of ${COHORT_PROFILE_IDS.join(", ")}.`
    );
  }
  return weights;
}

/**
 * @param {object[]} evaluatedResponses
 * @param {string} cohortProfileId
 */
export function buildCompositeScoreResult(evaluatedResponses, cohortProfileId) {
  const cohortWeights = resolveCohortWeights(cohortProfileId);
  const pillarPerformances = calculatePillarPerformances(evaluatedResponses);
  const score = calculateCompositeLiteracyScore(pillarPerformances, cohortWeights);

  return {
    score,
    pillarPerformances,
    cohortWeights,
    cohortProfileId,
    registryFirewallActive: score < REGISTRY_FIREWALL_THRESHOLD_PERCENT,
    scoreBand: resolveCompositeScoreBand(score)
  };
}

// ── 1. Score Calculation ──────────────────────────────────────────────────────

/**
 * @typedef {object} ExamResponse
 * @property {number} scenarioId — Matrix id (1–30).
 * @property {number} chosenOptionIndex — Zero-based option index selected by the candidate.
 * @property {number} [timeSpentMs=0] — Milliseconds elapsed on this scenario (analytics only).
 */

/**
 * @typedef {object} RawScoreResult
 * @property {number} correct — Count of correctly answered scenarios.
 * @property {number} total — Total scenarios evaluated.
 * @property {number} percentage — Unweighted correctness as a 0–100 percentage.
 */

/**
 * @typedef {object} WeightedScoreResult
 * @property {number} earned — Sum of complianceWeight for correct responses.
 * @property {number} maximum — Sum of complianceWeight across all evaluated scenarios.
 * @property {number} percentage — Weighted compliance as a 0–100 percentage.
 */

/**
 * @typedef {object} TierScoreBreakdown
 * @property {string} tier
 * @property {number} correct
 * @property {number} total
 * @property {number} rawPercentage
 * @property {number} weightedEarned
 * @property {number} weightedMaximum
 * @property {number} weightedPercentage
 */

/**
 * @typedef {object} ExamScoreResult
 * @property {RawScoreResult} raw
 * @property {WeightedScoreResult} weighted
 * @property {TierScoreBreakdown[]} tierBreakdown
 * @property {number} certificationThresholdPercent
 * @property {boolean} passesCertification
 * @property {object[]} evaluatedResponses — Per-scenario evaluation audit trail.
 */

/**
 * Tallies raw and weighted compliance scores for a completed examination session.
 *
 * Weighting model (structurally invariant):
 *   earnedWeight  = Σ (complianceWeightᵢ) for each correct response i
 *   maximumWeight = Σ (complianceWeightⱼ) for every evaluated scenario j
 *   weightedPct   = (earnedWeight / maximumWeight) × 100
 *
 * Certification is granted when weightedPct ≥ INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT.
 *
 * @param {ExamResponse[]} responses — Candidate answers; one entry per evaluated scenario.
 * @param {object} [options]
 * @param {number} [options.certificationThresholdPercent] — Override institutional threshold.
 * @param {string} [options.cohortProfileId] — ExL | CLL | OEL for role-adaptive Sc computation.
 * @returns {ExamScoreResult}
 */
export function calculateExamScore(responses, options = {}) {
  if (!Array.isArray(responses) || responses.length === 0) {
    throw new TypeError("calculateExamScore requires a non-empty responses array.");
  }

  const certificationThresholdPercent =
    options.certificationThresholdPercent ?? INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT;

  let rawCorrect = 0;
  let weightedEarned = 0;
  let weightedMaximum = 0;

  /** @type {Map<string, TierScoreBreakdown>} */
  const tierAccumulator = new Map();

  const evaluatedResponses = responses.map((response) => {
    const scenario = resolveScenario(response.scenarioId);
    const chosenOptionIndex = response.chosenOptionIndex;
    const correct = isResponseCorrect(scenario, chosenOptionIndex);
    const weight = scenario.complianceWeight;

    // Accumulate global tallies.
    weightedMaximum += weight;
    if (correct) {
      rawCorrect += 1;
      weightedEarned += weight;
    }

    // Accumulate per-tier tallies for governance analytics.
    const tierStats = tierAccumulator.get(scenario.tier) ?? {
      tier: scenario.tier,
      correct: 0,
      total: 0,
      rawPercentage: 0,
      weightedEarned: 0,
      weightedMaximum: 0,
      weightedPercentage: 0
    };

    tierStats.total += 1;
    tierStats.weightedMaximum += weight;
    if (correct) {
      tierStats.correct += 1;
      tierStats.weightedEarned += weight;
    }
    tierAccumulator.set(scenario.tier, tierStats);

    return {
      scenarioId: scenario.id,
      tier: scenario.tier,
      category: scenario.category,
      chosenOptionIndex,
      correctOptionIndex: scenario.correctOptionIndex,
      isCorrect: correct,
      complianceWeight: weight,
      weightedPointsEarned: correct ? weight : 0,
      timeSpentMs: response.timeSpentMs ?? 0
    };
  });

  const total = evaluatedResponses.length;

  const rawPercentage = total > 0 ? (rawCorrect / total) * 100 : 0;
  const weightedPercentage =
    weightedMaximum > 0 ? (weightedEarned / weightedMaximum) * 100 : 0;

  const tierBreakdown = [...tierAccumulator.values()]
    .sort((a, b) => {
      const orderA = EXAM_TIER_BOUNDARIES[a.tier]?.startId ?? 0;
      const orderB = EXAM_TIER_BOUNDARIES[b.tier]?.startId ?? 0;
      return orderA - orderB;
    })
    .map((tierStats) => ({
      ...tierStats,
      rawPercentage:
        tierStats.total > 0 ? (tierStats.correct / tierStats.total) * 100 : 0,
      weightedPercentage:
        tierStats.weightedMaximum > 0
          ? (tierStats.weightedEarned / tierStats.weightedMaximum) * 100
          : 0
    }));

  const passesCertification = weightedPercentage >= certificationThresholdPercent;

  const composite = options.cohortProfileId
    ? buildCompositeScoreResult(evaluatedResponses, options.cohortProfileId)
    : null;

  return {
    raw: {
      correct: rawCorrect,
      total,
      percentage: roundToTwoDecimals(rawPercentage)
    },
    weighted: {
      earned: roundToTwoDecimals(weightedEarned),
      maximum: roundToTwoDecimals(weightedMaximum),
      percentage: roundToTwoDecimals(weightedPercentage)
    },
    tierBreakdown,
    certificationThresholdPercent,
    passesCertification,
    evaluatedResponses,
    composite
  };
}

// ── 2. Research Data Logging ──────────────────────────────────────────────────

/**
 * @typedef {object} ResearchSessionMeta
 * @property {string} anonymousSessionKey — De-identified session identifier (no PII).
 * @property {string} examinationStartedAt — ISO-8601 timestamp.
 * @property {string} examinationCompletedAt — ISO-8601 timestamp.
 * @property {string} [locale] — Trilingual locale code (en | fr | es).
 * @property {string} [targetTier] — Certification tier under evaluation, if scoped.
 */

/**
 * Builds an anonymous, doctoral-research-optimized data packet from examination telemetry.
 *
 * Each observation records only: scenario id, chosen index, correctness, and time spent.
 * No candidate-identifying fields are emitted.
 *
 * @param {ResearchSessionMeta} sessionMeta
 * @param {ExamResponse[]} responses
 * @returns {object} Clean research data packet.
 */
export function buildResearchDataPacket(sessionMeta, responses) {
  validateResearchSessionMeta(sessionMeta);

  const scoreResult = calculateExamScore(responses);

  const observations = scoreResult.evaluatedResponses.map((entry) => ({
    questionId: entry.scenarioId,
    chosenIndex: entry.chosenOptionIndex,
    correctness: entry.isCorrect,
    timeSpentMs: entry.timeSpentMs
  }));

  const totalDurationMs = observations.reduce(
    (sum, observation) => sum + observation.timeSpentMs,
    0
  );

  const meanTimePerScenarioMs =
    observations.length > 0 ? totalDurationMs / observations.length : 0;

  return {
    meta: {
      protocol: "safeAI.report Research Instrument v1",
      schemaVersion: "1.0.0",
      instrumentId: "EU-AI-ACT-A4-30-SCENARIO",
      anonymityClass: "de-identified",
      collectionPurpose: "doctoral-research-compliance-analytics",
      regulatoryFramework: SAFEAI_MASTER_CONFIG.infrastructure.targetFramework,
      scenarioCount: EXAM_SCENARIO_COUNT
    },
    session: {
      anonymousSessionKey: sessionMeta.anonymousSessionKey,
      examinationStartedAt: sessionMeta.examinationStartedAt,
      examinationCompletedAt: sessionMeta.examinationCompletedAt,
      totalDurationMs,
      locale: sessionMeta.locale ?? null,
      targetTier: sessionMeta.targetTier ?? null
    },
    observations,
    aggregates: {
      rawCorrectCount: scoreResult.raw.correct,
      rawCorrectPercentage: scoreResult.raw.percentage,
      weightedCompliancePercent: scoreResult.weighted.percentage,
      weightedPointsEarned: scoreResult.weighted.earned,
      weightedPointsMaximum: scoreResult.weighted.maximum,
      meanTimePerScenarioMs: roundToTwoDecimals(meanTimePerScenarioMs),
      passesCertification: scoreResult.passesCertification
    }
  };
}

// ── 3. WaqfLedger Payload Factory ─────────────────────────────────────────────

/**
 * @typedef {object} WaqfLedgerExamMetadata
 * @property {string} credentialId — Opaque, institution-issued credential identifier.
 * @property {string} examinationCompletedAt — ISO-8601 timestamp of successful completion.
 * @property {string} tier — Certification tier (e.g. "Level 01").
 * @property {string} [anonymousCandidateRef] — Non-PII reference token for ledger reconciliation.
 */

/**
 * Produces an immutable cryptographic state object ready for WaqfLedger.tech block-hash logging.
 *
 * Requires a passing examination score (≥ institutional certification threshold).
 * Legal anchors and infrastructure constants are sourced exclusively from constants.js.
 *
 * @param {ExamScoreResult} scoreResult — Output of calculateExamScore.
 * @param {WaqfLedgerExamMetadata} examMetadata
 * @returns {Promise<object>} Immutable ledger state with SHA-256 integrity digest.
 */
export async function createWaqfLedgerPayload(scoreResult, examMetadata) {
  validateWaqfLedgerMetadata(examMetadata);

  if (!scoreResult.passesCertification) {
    throw new Error(
      `WaqfLedger payload rejected: weighted compliance ${scoreResult.weighted.percentage}% ` +
        `is below the ${scoreResult.certificationThresholdPercent}% institutional threshold.`
    );
  }

  const { legalAnchors, infrastructure, branding } = SAFEAI_MASTER_CONFIG;

  const tierConfig = SAFEAI_MASTER_CONFIG.evaluationTiers.publicTiers.find(
    (tier) => tier.level === examMetadata.tier
  );

  if (!tierConfig) {
    throw new RangeError(
      `Unknown certification tier "${examMetadata.tier}"; must match a publicTiers.level entry.`
    );
  }

  const certificationState = {
    schemaVersion: "1.0.0",
    emittedAt: new Date().toISOString(),
    branding: {
      platform: branding.name,
      standard: branding.standardName,
      certifyingAuthority: branding.authority
    },
    legalAnchors: {
      processingEntity: legalAnchors.processingEntity,
      academicInstitution: legalAnchors.academicInstitution,
      registry: { ...legalAnchors.registry }
    },
    infrastructure: {
      ledgerHost: infrastructure.ledgerHost,
      protocol: infrastructure.protocol,
      encryptionProtocol: infrastructure.encryptionProtocol,
      targetFramework: infrastructure.targetFramework
    },
    certification: {
      credentialId: examMetadata.credentialId,
      anonymousCandidateRef: examMetadata.anonymousCandidateRef ?? null,
      tier: examMetadata.tier,
      badgeName: tierConfig.name,
      price: tierConfig.price,
      currency: tierConfig.currency,
      examinationCompletedAt: examMetadata.examinationCompletedAt,
      rawCorrectCount: scoreResult.raw.correct,
      scenarioCount: scoreResult.raw.total,
      rawCorrectPercentage: scoreResult.raw.percentage,
      weightedCompliancePercent: scoreResult.weighted.percentage,
      weightedPointsEarned: scoreResult.weighted.earned,
      weightedPointsMaximum: scoreResult.weighted.maximum,
      certificationThresholdPercent: scoreResult.certificationThresholdPercent,
      verificationUrl: SAFEAI_MASTER_CONFIG.growthMarketing.linkedInSharePayload.verificationUrl
    }
  };

  const canonicalPayload = canonicalizeForHashing(certificationState);
  const stateHash = await computeSha256Hex(canonicalPayload);

  return Object.freeze({
    ...certificationState,
    integrity: Object.freeze({
      hashAlgorithm: "SHA-256",
      canonicalSerialization: "JSON.stringify sorted-keys UTF-8",
      stateHash,
      ledgerDestination: infrastructure.ledgerHost
    })
  });
}

// ── Cryptographic & Serialization Utilities ─────────────────────────────────────

/**
 * Recursively sorts object keys for deterministic JSON serialization prior to hashing.
 * @param {unknown} value
 * @returns {unknown}
 */
function canonicalizeForHashing(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(canonicalizeForHashing);
  }

  return Object.keys(value)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = canonicalizeForHashing(value[key]);
      return sorted;
    }, {});
}

/**
 * Computes a SHA-256 hex digest over a canonical JSON payload.
 * Uses Web Crypto (browser / Node 18+) for standards-compliant hashing.
 *
 * @param {object} payload
 * @returns {Promise<string>}
 */
async function computeSha256Hex(payload) {
  const canonicalJson = JSON.stringify(canonicalizeForHashing(payload));
  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalJson);

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      "Web Crypto API unavailable; SHA-256 digest required for WaqfLedger state sealing."
    );
  }

  const digestBuffer = await subtle.digest("SHA-256", data);
  return bufferToHex(digestBuffer);
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ── Validation Helpers ────────────────────────────────────────────────────────

/**
 * @param {ResearchSessionMeta} sessionMeta
 */
function validateResearchSessionMeta(sessionMeta) {
  if (!sessionMeta || typeof sessionMeta !== "object") {
    throw new TypeError("buildResearchDataPacket requires a sessionMeta object.");
  }

  const required = [
    "anonymousSessionKey",
    "examinationStartedAt",
    "examinationCompletedAt"
  ];

  for (const field of required) {
    if (!sessionMeta[field]) {
      throw new TypeError(`sessionMeta.${field} is required for anonymous research logging.`);
    }
  }
}

/**
 * @param {WaqfLedgerExamMetadata} examMetadata
 */
function validateWaqfLedgerMetadata(examMetadata) {
  if (!examMetadata || typeof examMetadata !== "object") {
    throw new TypeError("createWaqfLedgerPayload requires an examMetadata object.");
  }

  const required = ["credentialId", "examinationCompletedAt", "tier"];

  for (const field of required) {
    if (!examMetadata[field]) {
      throw new TypeError(`examMetadata.${field} is required for WaqfLedger payload fabrication.`);
    }
  }
}

/**
 * @param {number} value
 * @returns {number}
 */
function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}
