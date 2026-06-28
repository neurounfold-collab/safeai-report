import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';

const LEDGER_REQUEST_TIMEOUT_MS = 15_000;

/** In-bundle fallback when config hydration is incomplete on static hosts. */
const FALLBACK_WAQFLEDGER_ENDPOINT =
  'https://waqfledger-api.vercel.app/api/v1/ledger/log-compliance';

function resolveWaqfLedgerEndpoint() {
  return (
    SAFEAI_MASTER_CONFIG?.infrastructure?.waqfLedgerApiEndpoint
    ?? FALLBACK_WAQFLEDGER_ENDPOINT
  );
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
 * Stream Article 4 compliance validation records to the WaqfLedger serverless core.
 * Network failures are non-blocking — callers always receive a success flag.
 */
export async function streamComplianceToLedger(complianceData) {
  try {
    const hash = sanitizeLedgerHash(complianceData?.hash);
    if (!hash) {
      console.warn('WaqfLedger compliance stream skipped: invalid or missing state hash');
      return { success: false };
    }

    const payload = {
      hash,
      candidateName:
        typeof complianceData?.candidateName === 'string' && complianceData.candidateName.trim()
          ? complianceData.candidateName.trim()
          : 'Anonymous Candidate',
      tierId:
        typeof complianceData?.tierId === 'string' && complianceData.tierId.trim()
          ? complianceData.tierId.trim()
          : 'level01',
      score: sanitizeLedgerScore(complianceData?.score),
      timestamp: sanitizeLedgerTimestamp(complianceData?.timestamp),
      trackType: 'ARTICLE_4_COMPLIANCE_VALIDATION',
    };

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

    if (!response.ok) {
      console.warn(
        `WaqfLedger compliance stream rejected (${response.status})`,
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.warn('WaqfLedger compliance stream failed:', error);
    return { success: false };
  }
}
