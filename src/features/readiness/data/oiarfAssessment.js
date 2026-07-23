/**
 * OIARF institutional readiness assessment — 8-dimension question bank.
 * Authoritative dimension keys align with schemas/institutional-readiness-spec.json.
 *
 * Dimension scores D_d are normalized to [0, 1]. Expert-judgment MCDA weights W_d
 * sum to 1.0 and are intended for empirical refinement via institutional validation.
 *
 * Prompt copy lives in i18n (readiness.dimensions.*.prompts.q1–q3) for EN/FR/ES/AR parity.
 */

export const OIARF_SPEC_VERSION = '2.0.0-OIARF';

export const READINESS_STORAGE_KEY = 'safeai.oiarf.readiness.v1';

export const READINESS_PERSIST_SCHEMA_VERSION = 1;

/** Likert maturity scale — mapped to 0–1 contribution per answer. */
export const LIKERT_SCALE = Object.freeze([
  { value: 1, labelKey: 'readiness.likert.1' },
  { value: 2, labelKey: 'readiness.likert.2' },
  { value: 3, labelKey: 'readiness.likert.3' },
  { value: 4, labelKey: 'readiness.likert.4' },
  { value: 5, labelKey: 'readiness.likert.5' },
]);

export const LIKERT_MAX = 5;

/**
 * Optional sector classification tags for anonymous telemetry packaging.
 * @type {ReadonlyArray<{ id: string, labelKey: string }>}
 */
export const SECTOR_OPTIONS = Object.freeze([
  { id: 'Higher-Education', labelKey: 'readiness.sectors.higherEducation' },
  { id: 'Healthcare', labelKey: 'readiness.sectors.healthcare' },
  { id: 'Public-Sector', labelKey: 'readiness.sectors.publicSector' },
  { id: 'Financial-Services', labelKey: 'readiness.sectors.financialServices' },
  { id: 'Industrial', labelKey: 'readiness.sectors.industrial' },
  { id: 'Other', labelKey: 'readiness.sectors.other' },
]);

/**
 * Eight OIARF dimensions with MCDA weights and diagnostic prompts.
 */
export const OIARF_DIMENSIONS = Object.freeze([
  Object.freeze({
    key: 'leadership',
    id: 1,
    nameKey: 'readiness.dimensions.leadership.name',
    focusKey: 'readiness.dimensions.leadership.focus',
    weight: 0.14,
    questions: Object.freeze([
      Object.freeze({
        id: 'leadership_q1',
        promptKey: 'readiness.dimensions.leadership.prompts.q1',
      }),
      Object.freeze({
        id: 'leadership_q2',
        promptKey: 'readiness.dimensions.leadership.prompts.q2',
      }),
      Object.freeze({
        id: 'leadership_q3',
        promptKey: 'readiness.dimensions.leadership.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'governance',
    id: 2,
    nameKey: 'readiness.dimensions.governance.name',
    focusKey: 'readiness.dimensions.governance.focus',
    weight: 0.14,
    questions: Object.freeze([
      Object.freeze({
        id: 'governance_q1',
        promptKey: 'readiness.dimensions.governance.prompts.q1',
      }),
      Object.freeze({
        id: 'governance_q2',
        promptKey: 'readiness.dimensions.governance.prompts.q2',
      }),
      Object.freeze({
        id: 'governance_q3',
        promptKey: 'readiness.dimensions.governance.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'ai_literacy',
    id: 3,
    nameKey: 'readiness.dimensions.aiLiteracy.name',
    focusKey: 'readiness.dimensions.aiLiteracy.focus',
    weight: 0.15,
    questions: Object.freeze([
      Object.freeze({
        id: 'ai_literacy_q1',
        promptKey: 'readiness.dimensions.aiLiteracy.prompts.q1',
      }),
      Object.freeze({
        id: 'ai_literacy_q2',
        promptKey: 'readiness.dimensions.aiLiteracy.prompts.q2',
      }),
      Object.freeze({
        id: 'ai_literacy_q3',
        promptKey: 'readiness.dimensions.aiLiteracy.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'technology',
    id: 4,
    nameKey: 'readiness.dimensions.technology.name',
    focusKey: 'readiness.dimensions.technology.focus',
    weight: 0.11,
    questions: Object.freeze([
      Object.freeze({
        id: 'technology_q1',
        promptKey: 'readiness.dimensions.technology.prompts.q1',
      }),
      Object.freeze({
        id: 'technology_q2',
        promptKey: 'readiness.dimensions.technology.prompts.q2',
      }),
      Object.freeze({
        id: 'technology_q3',
        promptKey: 'readiness.dimensions.technology.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'data_readiness',
    id: 5,
    nameKey: 'readiness.dimensions.dataReadiness.name',
    focusKey: 'readiness.dimensions.dataReadiness.focus',
    weight: 0.12,
    questions: Object.freeze([
      Object.freeze({
        id: 'data_readiness_q1',
        promptKey: 'readiness.dimensions.dataReadiness.prompts.q1',
      }),
      Object.freeze({
        id: 'data_readiness_q2',
        promptKey: 'readiness.dimensions.dataReadiness.prompts.q2',
      }),
      Object.freeze({
        id: 'data_readiness_q3',
        promptKey: 'readiness.dimensions.dataReadiness.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'risk_compliance',
    id: 6,
    nameKey: 'readiness.dimensions.riskCompliance.name',
    focusKey: 'readiness.dimensions.riskCompliance.focus',
    weight: 0.14,
    questions: Object.freeze([
      Object.freeze({
        id: 'risk_compliance_q1',
        promptKey: 'readiness.dimensions.riskCompliance.prompts.q1',
      }),
      Object.freeze({
        id: 'risk_compliance_q2',
        promptKey: 'readiness.dimensions.riskCompliance.prompts.q2',
      }),
      Object.freeze({
        id: 'risk_compliance_q3',
        promptKey: 'readiness.dimensions.riskCompliance.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'workforce_culture',
    id: 7,
    nameKey: 'readiness.dimensions.workforceCulture.name',
    focusKey: 'readiness.dimensions.workforceCulture.focus',
    weight: 0.1,
    questions: Object.freeze([
      Object.freeze({
        id: 'workforce_culture_q1',
        promptKey: 'readiness.dimensions.workforceCulture.prompts.q1',
      }),
      Object.freeze({
        id: 'workforce_culture_q2',
        promptKey: 'readiness.dimensions.workforceCulture.prompts.q2',
      }),
      Object.freeze({
        id: 'workforce_culture_q3',
        promptKey: 'readiness.dimensions.workforceCulture.prompts.q3',
      }),
    ]),
  }),
  Object.freeze({
    key: 'operational_readiness',
    id: 8,
    nameKey: 'readiness.dimensions.operationalReadiness.name',
    focusKey: 'readiness.dimensions.operationalReadiness.focus',
    weight: 0.1,
    questions: Object.freeze([
      Object.freeze({
        id: 'operational_readiness_q1',
        promptKey: 'readiness.dimensions.operationalReadiness.prompts.q1',
      }),
      Object.freeze({
        id: 'operational_readiness_q2',
        promptKey: 'readiness.dimensions.operationalReadiness.prompts.q2',
      }),
      Object.freeze({
        id: 'operational_readiness_q3',
        promptKey: 'readiness.dimensions.operationalReadiness.prompts.q3',
      }),
    ]),
  }),
]);

/** Ordered dimension keys for navigation and completion checks. */
export const DIMENSION_KEYS = Object.freeze(
  OIARF_DIMENSIONS.map((dimension) => dimension.key),
);

export const DEFAULT_DIMENSION_KEY = DIMENSION_KEYS[0];

const DIMENSION_BY_KEY = new Map(
  OIARF_DIMENSIONS.map((dimension) => [dimension.key, dimension]),
);

/**
 * @param {unknown} key
 * @returns {boolean}
 */
export function isValidDimensionKey(key) {
  return typeof key === 'string' && DIMENSION_BY_KEY.has(key);
}

/**
 * @param {unknown} key
 * @returns {object | null}
 */
export function getDimensionByKey(key) {
  if (!isValidDimensionKey(key)) return null;
  return DIMENSION_BY_KEY.get(key) ?? null;
}

/**
 * @param {string} key
 * @returns {string | null}
 */
export function getNextDimensionKey(key) {
  const index = DIMENSION_KEYS.indexOf(key);
  if (index < 0 || index >= DIMENSION_KEYS.length - 1) return null;
  return DIMENSION_KEYS[index + 1];
}

/**
 * @param {string} key
 * @returns {string | null}
 */
export function getPreviousDimensionKey(key) {
  const index = DIMENSION_KEYS.indexOf(key);
  if (index <= 0) return null;
  return DIMENSION_KEYS[index - 1];
}

/**
 * Normalize a URL/search-param dimension token (accepts aliases like ai-literacy).
 * @param {unknown} raw
 * @returns {string | null}
 */
export function normalizeDimensionParam(raw) {
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toLowerCase().replace(/-/g, '_');
  return isValidDimensionKey(normalized) ? normalized : null;
}
