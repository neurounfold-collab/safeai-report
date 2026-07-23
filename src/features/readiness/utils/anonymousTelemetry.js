import { OIARF_SPEC_VERSION } from '../data/oiarfAssessment.js';
import { computeMcdaComposite } from './mcdaComposite.js';

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
 * 8 numeric dimension scores, overall MCDA index, optional sector tag.
 *
 * @param {Record<string, number>} answers
 * @param {string | null | undefined} sector
 * @returns {{
 *   schemaVersion: string,
 *   trackType: string,
 *   dimensionScores: Record<string, number>,
 *   overallIndex: number,
 *   overallIndexPercent: number,
 *   sector: string | null
 * }}
 */
export function buildAnonymousTelemetryPayload(answers, sector) {
  const composite = computeMcdaComposite(answers);
  const sectorTag =
    typeof sector === 'string' && sector.trim().length > 0
      ? sector.trim()
      : null;

  return {
    schemaVersion: OIARF_SPEC_VERSION,
    trackType: 'OIARF_INSTITUTIONAL_READINESS',
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
 * @param {string | null | undefined} sector
 * @returns {Promise<{
 *   payload: ReturnType<typeof buildAnonymousTelemetryPayload>,
 *   stateHash: string
 * }>}
 */
export async function packageAnonymousTelemetry(answers, sector) {
  const payload = buildAnonymousTelemetryPayload(answers, sector);
  const stateHash = await computeSha256Hex(payload);
  return { payload, stateHash };
}