/**
 * Localized Examination Matrix loader — safeAI.report
 * Quadlingual scenario datasets (EN / FR / ES / AR) with identical IDs and option indices
 * so server-side grading via api/grade-exam.js (MASTER_ANSWER_KEY) remains language-invariant.
 *
 * Tier sequencing mirrors evaluationTiers.publicTiers in src/config/constants.js.
 */

import { EXAM_SCENARIO_MATRIX_EN } from './scenarios_en.js';
import { EXAM_SCENARIO_MATRIX_FR } from './scenarios_fr.js';
import { EXAM_SCENARIO_MATRIX_ES } from './scenarios_es.js';
import { EXAM_SCENARIO_MATRIX_AR } from './scenarios_ar.js';

/** @typedef {{ id: number; tier: string; category: string; scenarioText: string; options: string[] }} ExamScenario */

/**
 * Locale → full 30-scenario matrix. Option array positions (0–3) are aligned across locales.
 * @type {Readonly<Record<'en' | 'fr' | 'es' | 'ar', ExamScenario[]>>}
 */
export const scenariosByLanguage = Object.freeze({
  en: EXAM_SCENARIO_MATRIX_EN,
  fr: EXAM_SCENARIO_MATRIX_FR,
  es: EXAM_SCENARIO_MATRIX_ES,
  ar: EXAM_SCENARIO_MATRIX_AR,
});

/**
 * Normalize a language tag to a supported exam locale code.
 * @param {string | null | undefined} lang
 * @returns {'en' | 'fr' | 'es' | 'ar'}
 */
export function normalizeExamLanguage(lang) {
  if (!lang || typeof lang !== 'string') return 'en';
  const code = lang.trim().toLowerCase().slice(0, 2);
  if (code === 'fr' || code === 'es' || code === 'ar') return code;
  return 'en';
}

/**
 * Resolve the localized scenario set for the active examinee language.
 * Falls back to English when the locale is unsupported or missing.
 * @param {string | null | undefined} lang
 * @returns {ExamScenario[]}
 */
export function getScenariosForLanguage(lang) {
  const currentLang = normalizeExamLanguage(lang);
  return scenariosByLanguage[currentLang] || scenariosByLanguage.en;
}

/**
 * Build an id → scenario map for a given matrix (used when reconstituting persisted sessions).
 * @param {ExamScenario[]} matrix
 * @returns {Map<number, ExamScenario>}
 */
export function buildScenarioMap(matrix) {
  return new Map((matrix ?? []).map((scenario) => [scenario.id, scenario]));
}

/** Default English matrix — retained for backward-compatible imports. */
export const EXAM_SCENARIO_MATRIX = EXAM_SCENARIO_MATRIX_EN;

/** Total scenario count — must remain 30 for Cisco-grade assessment integrity. */
export const EXAM_SCENARIO_COUNT = EXAM_SCENARIO_MATRIX_EN.length;

/** Tier boundary indices for validation engines (inclusive ranges). */
export const EXAM_TIER_BOUNDARIES = {
  'Level 01': {
    startId: 1,
    endId: 10,
    focus: 'Baseline AI Literacy, User Responsibilities, Everyday Risk Recognition',
  },
  'Level 02': {
    startId: 11,
    endId: 20,
    focus: 'Procurement Risks, Red-Teaming, Vendor Model Disclosures, Institutional Liability',
  },
  'Level 03': {
    startId: 21,
    endId: 30,
    focus:
      'High-risk System Deployments, Human-in-the-loop Auditing, WaqfLedger Hashing Verification',
  },
};
