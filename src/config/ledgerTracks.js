/**
 * Authoritative WaqfLedger trackType registry.
 * Never coerce exam attestations into OIARF / VerifIA / FRIA documents.
 */

export const LEDGER_TRACK = Object.freeze({
  OIARF_INSTITUTIONAL_READINESS: 'OIARF_INSTITUTIONAL_READINESS',
  ARTICLE_4_LITERACY_EXAM: 'ARTICLE_4_LITERACY_EXAM',
  /** Legacy exam posts prior to the dedicated literacy-exam track. */
  ARTICLE_4_COMPLIANCE_VALIDATION: 'ARTICLE_4_COMPLIANCE_VALIDATION',
});

export const LEDGER_ANCHOR_STATUS = Object.freeze({
  ANCHORED: 'ANCHORED',
  LOCAL_FALLBACK: 'LOCAL_FALLBACK',
});

/**
 * @param {unknown} trackType
 * @returns {boolean}
 */
export function isOiarfReadinessTrack(trackType) {
  return trackType === LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS;
}

/**
 * @param {unknown} trackType
 * @returns {boolean}
 */
export function isArticle4ExamTrack(trackType) {
  return (
    trackType === LEDGER_TRACK.ARTICLE_4_LITERACY_EXAM
    || trackType === LEDGER_TRACK.ARTICLE_4_COMPLIANCE_VALIDATION
  );
}

/**
 * Normalize inbound ledger track strings. Unknown values stay unknown (fail closed for passports).
 * @param {unknown} trackType
 * @returns {string | null}
 */
export function normalizeLedgerTrackType(trackType) {
  if (typeof trackType !== 'string') return null;
  const trimmed = trackType.trim();
  if (!trimmed) return null;

  if (isOiarfReadinessTrack(trimmed)) {
    return LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS;
  }
  if (isArticle4ExamTrack(trimmed)) {
    return LEDGER_TRACK.ARTICLE_4_LITERACY_EXAM;
  }

  return trimmed;
}
