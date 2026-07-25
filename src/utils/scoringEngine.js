/**
 * @deprecated Client-side adaptive scoring has been retired.
 *
 * Authoritative MCDA grading, pass/fail determination, SHA-256 state hashing,
 * and WaqfLedger sealing now run exclusively in the Vercel serverless function:
 *   POST /api/grade-exam  →  api/grade-exam.js
 *
 * Do not reintroduce answer-key evaluation or composite score calculation in the
 * browser bundle. Import thresholds or cohort id lists from
 * `src/features/exam/utils/scoringEngine.js` for display-only UI concerns.
 */

export const COHORT_SELECTION_IDS = Object.freeze(['ExL', 'CLL', 'OEL']);

/**
 * @deprecated Use POST /api/grade-exam instead.
 * @throws {Error} Always — client grading is disabled.
 */
export function calculateAdaptiveScore() {
  throw new Error(
    'calculateAdaptiveScore is deprecated. Submit examinations to POST /api/grade-exam.',
  );
}
