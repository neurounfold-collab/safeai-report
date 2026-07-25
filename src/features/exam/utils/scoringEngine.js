/**
 * Examination Scoring & Analytics Engine — safeAI.report
 *
 * DISPLAY / DOCS UTILITIES ONLY for the client bundle.
 * Authoritative MCDA grading, pass/fail, SHA-256 hashing, and WaqfLedger sealing
 * are performed exclusively by POST /api/grade-exam (api/grade-exam.js).
 *
 * Remaining exports support documentation (AlamMatrixBrief), cohort UI labels,
 * and score-band display. Do not call calculateExamScore / createWaqfLedgerPayload
 * from the examination player — answer keys are not present in the client bundle.
 */

// ── Certification Threshold ───────────────────────────────────────────────────

/** Minimum weighted compliance percentage required for institutional certification. */
export const INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT = 85;

/** Minimum composite literacy score (Sc) before registry firewall remediation. */
export const REGISTRY_FIREWALL_THRESHOLD_PERCENT = 66;

/** Role-adaptive A4-ALAM cohort profile identifiers. */
export const COHORT_PROFILE_IDS = ["ExL", "CLL", "OEL"];

/**
 * Cohort weight vectors (w1–w4) mapped to evaluation pillars P1–P4.
 * Weights sum to 1.0 per profile.
 */
/** Unified cohort weights — mirrored by api/grade-exam.js (server is authoritative). */
export const COHORT_WEIGHT_PROFILES = {
  ExL: { w1: 0.3, w2: 0.3, w3: 0.2, w4: 0.2 },
  CLL: { w1: 0.1, w2: 0.5, w3: 0.2, w4: 0.2 },
  OEL: { w1: 0.4, w2: 0.1, w3: 0.4, w4: 0.1 }
};

/** Scenario id ranges for A4-ALAM pillars (P1–P4 / OIARF v2.0.0). */
const PILLAR_SCENARIO_BLOCKS = {
  p1: { minId: 1, maxId: 10 },
  p2: { minId: 11, maxId: 20 },
  p3: { minId: 21, maxId: 29 },
  p4: { minId: 30, maxId: 30 }
};

/**
 * @param {object[]} evaluatedResponses — Server-evaluated audit trail (isCorrect + complianceWeight).
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
 * Derives pillar performances P1–P4 from a server-evaluated response audit trail.
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
 * @param {object[]} evaluatedResponses — Must already include server-side isCorrect + complianceWeight.
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

/**
 * @deprecated Client answer keys are stripped. Use POST /api/grade-exam.
 * @throws {Error} Always — browser-side answer-key grading is disabled.
 */
export function calculateExamScore() {
  throw new Error(
    "calculateExamScore is disabled in the client bundle. Submit examinations to POST /api/grade-exam.",
  );
}

/**
 * @deprecated Research packets require server-side grading. Use POST /api/grade-exam.
 * @throws {Error} Always — client answer keys are stripped.
 */
export function buildResearchDataPacket() {
  throw new Error(
    "buildResearchDataPacket is disabled in the client bundle. Use POST /api/grade-exam.",
  );
}

/**
 * @deprecated Ledger sealing runs exclusively in api/grade-exam.js.
 * @throws {Error} Always — client-side WaqfLedger payload fabrication is disabled.
 */
export async function createWaqfLedgerPayload() {
  throw new Error(
    "createWaqfLedgerPayload is disabled in the client bundle. Sealing is performed by POST /api/grade-exam.",
  );
}

/**
 * @param {number} value
 * @returns {number}
 */
function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}
