import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';
import {
  LEDGER_TRACK,
  isOiarfReadinessTrack,
  normalizeLedgerTrackType,
} from '../config/ledgerTracks.js';

const LEDGER_REQUEST_TIMEOUT_MS = 15_000;

/** In-bundle fallback when config hydration is incomplete on static hosts. */
const FALLBACK_WAQFLEDGER_ENDPOINT =
  'https://waqfledger-api.vercel.app/api/v1/ledger/log-compliance';

const FALLBACK_WAQFLEDGER_VERIFY_ENDPOINT =
  'https://waqfledger-api.vercel.app/api/v1/ledger/verify';

function resolveWaqfLedgerEndpoint() {
  return (
    SAFEAI_MASTER_CONFIG?.infrastructure?.waqfLedgerApiEndpoint
    ?? FALLBACK_WAQFLEDGER_ENDPOINT
  );
}

/**
 * Resolves the live attestation lookup endpoint (GET ?hash=).
 * Prefers an explicit verify URL; otherwise derives /verify from the log-compliance path.
 */
function resolveWaqfLedgerVerifyEndpoint() {
  const configured = SAFEAI_MASTER_CONFIG?.infrastructure?.waqfLedgerVerifyEndpoint;
  if (typeof configured === 'string' && configured.trim()) {
    return configured.trim();
  }

  try {
    const logUrl = new URL(resolveWaqfLedgerEndpoint());
    logUrl.pathname = logUrl.pathname.replace(/\/log-compliance\/?$/i, '/verify');
    if (!/\/verify\/?$/i.test(logUrl.pathname)) {
      logUrl.pathname = '/api/v1/ledger/verify';
    }
    logUrl.search = '';
    logUrl.hash = '';
    return logUrl.toString().replace(/\/$/, '');
  } catch {
    return FALLBACK_WAQFLEDGER_VERIFY_ENDPOINT;
  }
}

/**
 * @param {unknown} value
 * @returns {number}
 */
function sanitizeLedgerScore(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function sanitizeLedgerTimestamp(value) {
  if (typeof value === 'string' && value.trim()) {
    const epochMs = Date.parse(value.trim());
    if (Number.isFinite(epochMs)) {
      return new Date(epochMs).toISOString();
    }
  }

  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString();
  }

  return new Date().toISOString();
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function sanitizeLedgerHash(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return /^[a-fA-F0-9]{64}$/.test(trimmed) ? trimmed.toLowerCase() : null;
}

/**
 * @param {unknown} value
 * @returns {string | null}
 */
function sanitizeOptionalString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * @param {unknown} payload
 * @returns {boolean}
 */
function attestationIndicatesMatch(payload) {
  if (!payload || typeof payload !== 'object') return false;

  if (
    payload.verified === true
    || payload.found === true
    || payload.match === true
    || payload.anchored === true
    || payload.exists === true
  ) {
    return true;
  }

  const nested = payload.attestation ?? payload.record ?? payload.data;
  if (nested && nested !== payload) {
    return attestationIndicatesMatch(nested);
  }

  const hash = sanitizeLedgerHash(payload.hash ?? payload.stateHash);
  const hasScore =
    payload.score != null
    || payload.compositeScore != null
    || payload.composite_score != null;

  return Boolean(hash && hasScore);
}

/**
 * Query live WaqfLedger attestation metadata by SHA-256 state hash.
 * Never trusts localStorage or forged client strings — API match only.
 *
 * @param {string} hash
 * @returns {Promise<{
 *   verified: boolean,
 *   pending?: boolean,
 *   score?: number | null,
 *   timestamp?: string | null,
 *   stateHash?: string | null,
 *   candidateName?: string | null,
 *   complianceLevel?: string | null,
 *   registryAuthority?: string,
 *   trackType?: string | null,
 * }>}
 */
export async function queryLedgerAttestation(hash) {
  const sanitized = sanitizeLedgerHash(hash);
  if (!sanitized) {
    return { verified: false, pending: true, stateHash: null };
  }

  try {
    const endpoint = new URL(resolveWaqfLedgerVerifyEndpoint());
    endpoint.searchParams.set('hash', sanitized);

    const response = await fetch(endpoint.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(LEDGER_REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return { verified: false, pending: true, stateHash: sanitized };
    }

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      return { verified: false, pending: true, stateHash: sanitized };
    }

    if (!attestationIndicatesMatch(payload)) {
      return { verified: false, pending: true, stateHash: sanitized };
    }

    const record = payload.attestation ?? payload.record ?? payload.data ?? payload;
    const scoreRaw =
      record.score ?? record.compositeScore ?? record.composite_score ?? null;
    const scoreNumber =
      scoreRaw == null || scoreRaw === ''
        ? null
        : Number.parseFloat(String(scoreRaw));

    return {
      verified: true,
      score: Number.isFinite(scoreNumber) ? scoreNumber : null,
      timestamp: sanitizeOptionalString(
        record.timestamp ?? record.date ?? record.anchoredAt ?? record.createdAt,
      ),
      stateHash:
        sanitizeLedgerHash(record.hash ?? record.stateHash ?? sanitized) ?? sanitized,
      candidateName: sanitizeOptionalString(
        record.candidateName ?? record.holder ?? record.name,
      ),
      complianceLevel: sanitizeOptionalString(
        record.complianceLevel ?? record.tierId ?? record.tier ?? record.level,
      ),
      registryAuthority:
        SAFEAI_MASTER_CONFIG?.infrastructure?.ledgerHost ?? 'WaqfLedger.tech',
      trackType: normalizeLedgerTrackType(
        record.trackType ?? record.track_type ?? payload.trackType ?? payload.track_type,
      ),
    };
  } catch (error) {
    console.warn('WaqfLedger attestation lookup failed:', error);
    return { verified: false, pending: true, stateHash: sanitized };
  }
}

/**
 * Stream compliance records to the WaqfLedger serverless core.
 * Network failures are non-blocking — callers always receive a success flag.
 * `anchored` is true only for HTTP 200/201 receipts.
 *
 * @returns {Promise<{ success: boolean, status?: number, anchored: boolean }>}
 */
export async function streamComplianceToLedger(complianceData) {
  try {
    const hash = sanitizeLedgerHash(complianceData?.hash);
    if (!hash) {
      console.warn('WaqfLedger compliance stream skipped: invalid or missing state hash');
      return { success: false, anchored: false };
    }

    const requestedTrack = normalizeLedgerTrackType(complianceData?.trackType);
    const trackType = isOiarfReadinessTrack(requestedTrack)
      ? LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS
      : LEDGER_TRACK.ARTICLE_4_LITERACY_EXAM;

    const payload = {
      hash,
      candidateName:
        typeof complianceData?.candidateName === 'string' && complianceData.candidateName.trim()
          ? complianceData.candidateName.trim()
          : (trackType === LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS
            ? 'Anonymous Deployer'
            : 'Anonymous Candidate'),
      tierId:
        typeof complianceData?.tierId === 'string' && complianceData.tierId.trim()
          ? complianceData.tierId.trim()
          : (trackType === LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS
            ? 'oiarf_readiness'
            : 'level01'),
      score: sanitizeLedgerScore(complianceData?.score),
      timestamp: sanitizeLedgerTimestamp(complianceData?.timestamp),
      trackType,
    };

    if (trackType === LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS) {
      if (typeof complianceData?.regulatoryRole === 'string') {
        payload.regulatoryRole = complianceData.regulatoryRole;
      }
      if (Array.isArray(complianceData?.annexIIISection3)) {
        payload.annexIIISection3 = complianceData.annexIIISection3;
      }
    }

    const response = await fetch(
      resolveWaqfLedgerEndpoint(),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(LEDGER_REQUEST_TIMEOUT_MS),
      },
    );

    const anchored = response.status === 200 || response.status === 201;
    if (!anchored) {
      console.warn(
        `WaqfLedger compliance stream rejected (${response.status})`,
      );
      return { success: false, status: response.status, anchored: false };
    }

    return { success: true, status: response.status, anchored: true };
  } catch (error) {
    console.warn('WaqfLedger compliance stream failed:', error);
    return { success: false, anchored: false };
  }
}
