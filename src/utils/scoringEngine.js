/**
 * A4-ALAM Adaptive Scoring Engine — safeAI.report
 *
 * Isolated, immutable cohort-weight matrix for role-adaptive composite literacy
 * calculation. Decoupled from certification analytics to prevent scoring mismatches.
 */

import {
  EXAM_SCENARIO_MATRIX,
  EXAM_SCENARIO_COUNT,
} from '../features/exam/data/scenarios.js';

/** Role-adaptive A4-ALAM cohort weight descriptors (sum = 1.0 per profile). */
export const COHORT_WEIGHTS = Object.freeze({
  ExL: Object.freeze({ p1: 0.2, p2: 0.4, p3: 0.1, p4: 0.3 }),
  CLL: Object.freeze({ p1: 0.25, p2: 0.35, p3: 0.3, p4: 0.1 }),
  OEL: Object.freeze({ p1: 0.35, p2: 0.15, p3: 0.2, p4: 0.3 }),
});

export const COHORT_SELECTION_IDS = Object.freeze(['ExL', 'CLL', 'OEL']);

const PILLAR_KEYS = Object.freeze(['p1', 'p2', 'p3', 'p4']);

/** Authoritative scenario-id blocks mapped to baseline pillar categories. */
const PILLAR_SCENARIO_BLOCKS = Object.freeze({
  p1: Object.freeze({ minId: 1, maxId: 10 }),
  p2: Object.freeze({ minId: 11, maxId: 20 }),
  p3: Object.freeze({ minId: 21, maxId: 29 }),
  p4: Object.freeze({ minId: 30, maxId: 30 }),
});

const SCENARIO_BY_ID = new Map(
  EXAM_SCENARIO_MATRIX.map((scenario) => [scenario.id, scenario]),
);

/**
 * @param {number} scenarioId
 * @param {string | undefined} metadataPillar
 * @returns {'p1' | 'p2' | 'p3' | 'p4'}
 */
function resolvePillarTag(scenarioId, metadataPillar) {
  if (metadataPillar && PILLAR_KEYS.includes(metadataPillar)) {
    return metadataPillar;
  }

  for (const pillar of PILLAR_KEYS) {
    const block = PILLAR_SCENARIO_BLOCKS[pillar];
    if (scenarioId >= block.minId && scenarioId <= block.maxId) {
      return pillar;
    }
  }

  throw new RangeError(
    `Scenario id ${scenarioId} does not map to a pillar block (1–${EXAM_SCENARIO_COUNT}).`,
  );
}

/**
 * @typedef {object} AdaptiveUserAnswer
 * @property {number} scenarioId
 * @property {number} chosenOptionIndex
 * @property {string} [pillar] — Optional metadata pillar tag (p1–p4).
 */

/**
 * Computes role-adaptive composite literacy score from 30 scenario responses.
 *
 * Matrix equation: Sc = (Σ wp × Pp) × 100
 *   Pp = pillar correct/total ratio (0–1)
 *   wp = cohort weight component for pillar p
 *
 * @param {AdaptiveUserAnswer[]} userAnswers
 * @param {'ExL' | 'CLL' | 'OEL'} cohortSelection
 * @returns {{ score: number, pillarPerformances: Record<string, number>, cohortWeights: Readonly<object> }}
 */
export function calculateAdaptiveScore(userAnswers, cohortSelection) {
  if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
    throw new TypeError('calculateAdaptiveScore requires a non-empty userAnswers array.');
  }

  const cohortWeights = COHORT_WEIGHTS[cohortSelection];
  if (!cohortWeights) {
    throw new RangeError(
      `Unknown cohort "${cohortSelection}"; expected one of ${COHORT_SELECTION_IDS.join(', ')}.`,
    );
  }

  /** @type {Record<string, { correct: number, total: number }>} */
  const pillarTallies = Object.fromEntries(
    PILLAR_KEYS.map((pillar) => [pillar, { correct: 0, total: 0 }]),
  );

  for (const answer of userAnswers) {
    const scenarioId = answer?.scenarioId;
    const scenario = SCENARIO_BY_ID.get(scenarioId);
    if (!scenario) {
      throw new RangeError(
        `Unknown scenario id ${scenarioId}; matrix accepts ids 1–${EXAM_SCENARIO_COUNT}.`,
      );
    }

    const pillar = resolvePillarTag(scenarioId, answer.pillar ?? scenario.pillar);
    const isCorrect = answer.chosenOptionIndex === scenario.correctOptionIndex;

    pillarTallies[pillar].total += 1;
    if (isCorrect) {
      pillarTallies[pillar].correct += 1;
    }
  }

  /** @type {Record<string, number>} */
  const pillarPerformances = {};
  let compositeRatio = 0;

  for (const pillar of PILLAR_KEYS) {
    const { correct, total } = pillarTallies[pillar];
    const performanceRatio = total > 0 ? correct / total : 0;
    pillarPerformances[pillar] = performanceRatio;
    compositeRatio += cohortWeights[pillar] * performanceRatio;
  }

  const score = compositeRatio * 100;

  return {
    score,
    pillarPerformances,
    cohortWeights,
  };
}
