import { LEDGER_TRACK } from '../../../config/ledgerTracks.js';
import { OIARF_SPEC_VERSION } from '../data/oiarfAssessment.js';
import { FRIA_DIMENSION } from '../data/verifiaRiskEngine.js';
import { computeDimensionScore, computeMcdaComposite } from './mcdaComposite.js';

/**
 * Recursively sorts object keys for deterministic JSON serialization prior to hashing.
 * @param {unknown} value
 * @returns {unknown}
 */
function canonicalizeForHashing(value) {
  if (value === null || typeof value !== 'object') {
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
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Computes a SHA-256 hex digest over a canonical JSON payload.
 * @param {object} payload
 * @returns {Promise<string>}
 */
export async function computeSha256Hex(payload) {
  const canonicalJson = JSON.stringify(canonicalizeForHashing(payload));
  const encoder = new TextEncoder();
  const data = encoder.encode(canonicalJson);

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      'Web Crypto API unavailable; SHA-256 digest required for OIARF state sealing.',
    );
  }

  const digestBuffer = await subtle.digest('SHA-256', data);
  return bufferToHex(digestBuffer);
}

/**
 * Compile an anonymous readiness telemetry payload (no PII):
 * unrounded MCDA scores, FRIA score, VerifIA role and Annex III selections.
 *
 * @param {Record<string, number>} answers
 * @param {{
 *   sector?: string | null,
 *   regulatoryRole?: string | null,
 *   annexUseCases?: Record<string, boolean> | null,
 * }} [context]
 */
export function buildAnonymousTelemetryPayload(answers, context = {}) {
  const composite = computeMcdaComposite(answers, { unrounded: true });
  const friaScore = computeDimensionScore(answers, FRIA_DIMENSION);

  const sectorTag =
    typeof context.sector === 'string' && context.sector.trim().length > 0
      ? context.sector.trim()
      : null;

  const annexIIISection3 =
    context.annexUseCases && typeof context.annexUseCases === 'object'
      ? Object.keys(context.annexUseCases)
          .filter((id) => context.annexUseCases[id] === true)
          .sort()
      : [];

  return {
    schemaVersion: OIARF_SPEC_VERSION,
    trackType: LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS,
    engine: 'VerifIA-Risk-Engine',
    regulatoryRole:
      typeof context.regulatoryRole === 'string' ? context.regulatoryRole : null,
    annexIIISection3,
    friaScore,
    dimensionScores: { ...composite.dimensionScores },
    overallIndex: composite.overallIndex,
    overallIndexPercent: composite.overallIndexPercent,
    sector: sectorTag,
  };
}

/**
 * Package anonymous telemetry and seal with SHA-256 validation string.
 *
 * @param {Record<string, number>} answers
 * @param {{
 *   sector?: string | null,
 *   regulatoryRole?: string | null,
 *   annexUseCases?: Record<string, boolean> | null,
 * }} [context]
 * @returns {Promise<{
 *   payload: ReturnType<typeof buildAnonymousTelemetryPayload>,
 *   stateHash: string
 * }>}
 */
export async function packageAnonymousTelemetry(answers, context = {}) {
  const payload = buildAnonymousTelemetryPayload(answers, context);
  const stateHash = await computeSha256Hex(payload);
  return { payload, stateHash };
}
