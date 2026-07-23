import {
  LIKERT_MAX,
  OIARF_DIMENSIONS,
} from '../data/oiarfAssessment.js';

/**
 * Compute a single dimension score D_d in [0, 1] from Likert answers.
 * Unanswered questions contribute 0 to the average numerator but still count
 * toward the denominator only when at least one answer exists — incomplete
 * dimensions return 0.
 *
 * @param {Record<string, number>} answers
 * @param {{ questions: ReadonlyArray<{ id: string }>, weight: number, key: string }} dimension
 * @returns {number}
 */
export function computeDimensionScore(answers, dimension) {
  const questions = dimension?.questions ?? [];
  if (questions.length === 0) return 0;

  let sum = 0;
  let answered = 0;

  for (const question of questions) {
    const value = answers?.[question.id];
    if (Number.isInteger(value) && value >= 1 && value <= LIKERT_MAX) {
      sum += value / LIKERT_MAX;
      answered += 1;
    }
  }

  if (answered === 0) return 0;
  return sum / questions.length;
}

/**
 * Multi-Criteria Decision Analysis composite institutional readiness index:
 *   I_sr = Σ_{d=1}^{8} (W_d × D_d)
 *
 * @param {Record<string, number>} answers
 * @returns {{
 *   dimensionScores: Record<string, number>,
 *   weights: Record<string, number>,
 *   overallIndex: number,
 *   overallIndexPercent: number
 * }}
 */
export function computeMcdaComposite(answers) {
  /** @type {Record<string, number>} */
  const dimensionScores = {};
  /** @type {Record<string, number>} */
  const weights = {};
  let overallIndex = 0;

  for (const dimension of OIARF_DIMENSIONS) {
    const D_d = computeDimensionScore(answers, dimension);
    const W_d = dimension.weight;
    dimensionScores[dimension.key] = Number(D_d.toFixed(6));
    weights[dimension.key] = W_d;
    overallIndex += W_d * D_d;
  }

  const clamped = Math.min(1, Math.max(0, overallIndex));

  return {
    dimensionScores,
    weights,
    overallIndex: Number(clamped.toFixed(6)),
    overallIndexPercent: Number((clamped * 100).toFixed(2)),
  };
}