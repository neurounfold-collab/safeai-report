import {
  DEFAULT_DIMENSION_KEY,
  DIMENSION_KEYS,
  OIARF_DIMENSIONS,
  READINESS_PERSIST_SCHEMA_VERSION,
  READINESS_STORAGE_KEY,
  SECTOR_OPTIONS,
  isValidDimensionKey,
} from '../data/oiarfAssessment.js';

const SECTOR_IDS = new Set(SECTOR_OPTIONS.map((option) => option.id));

/**
 * @returns {Record<string, number>}
 */
export function createEmptyAnswers() {
  /** @type {Record<string, number>} */
  const answers = {};
  for (const dimension of OIARF_DIMENSIONS) {
    for (const question of dimension.questions) {
      answers[question.id] = 0;
    }
  }
  return answers;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isLikertValue(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

/**
 * @param {unknown} raw
 * @returns {{
 *   version: number,
 *   activeDimension: string,
 *   answers: Record<string, number>,
 *   sector: string | null,
 *   completed: boolean,
 *   stateHash: string | null,
 *   overallIndex: number | null,
 * } | null}
 */
export function parsePersistedSession(raw) {
  if (!raw || typeof raw !== 'object') return null;

  if (raw.version !== READINESS_PERSIST_SCHEMA_VERSION) return null;
  if (!isValidDimensionKey(raw.activeDimension)) return null;

  const baseAnswers = createEmptyAnswers();
  const incoming =
    raw.answers && typeof raw.answers === 'object' ? raw.answers : {};

  for (const questionId of Object.keys(baseAnswers)) {
    const value = incoming[questionId];
    if (isLikertValue(value)) {
      baseAnswers[questionId] = value;
    }
  }

  const sector =
    typeof raw.sector === 'string' && SECTOR_IDS.has(raw.sector)
      ? raw.sector
      : null;

  const stateHash =
    typeof raw.stateHash === 'string' && /^[a-f0-9]{64}$/i.test(raw.stateHash.trim())
      ? raw.stateHash.trim().toLowerCase()
      : null;

  const overallIndex =
    typeof raw.overallIndex === 'number' && Number.isFinite(raw.overallIndex)
      ? raw.overallIndex
      : null;

  return {
    version: READINESS_PERSIST_SCHEMA_VERSION,
    activeDimension: raw.activeDimension,
    answers: baseAnswers,
    sector,
    completed: Boolean(raw.completed),
    stateHash,
    overallIndex,
  };
}

/**
 * @returns {{
 *   version: number,
 *   activeDimension: string,
 *   answers: Record<string, number>,
 *   sector: string | null,
 *   completed: boolean,
 *   stateHash: string | null,
 *   overallIndex: number | null,
 * } | null}
 */
export function loadPersistedSession() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(READINESS_STORAGE_KEY);
    if (!raw) return null;
    return parsePersistedSession(JSON.parse(raw));
  } catch {
    clearPersistedSession();
    return null;
  }
}

/**
 * @param {{
 *   activeDimension: string,
 *   answers: Record<string, number>,
 *   sector?: string | null,
 *   completed?: boolean,
 *   stateHash?: string | null,
 *   overallIndex?: number | null,
 * }} session
 */
export function persistSession(session) {
  if (typeof window === 'undefined') return;

  const activeDimension = isValidDimensionKey(session?.activeDimension)
    ? session.activeDimension
    : DEFAULT_DIMENSION_KEY;

  const payload = {
    version: READINESS_PERSIST_SCHEMA_VERSION,
    activeDimension,
    answers: session?.answers ?? createEmptyAnswers(),
    sector: session?.sector ?? null,
    completed: Boolean(session?.completed),
    stateHash: session?.stateHash ?? null,
    overallIndex:
      typeof session?.overallIndex === 'number' ? session.overallIndex : null,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota or privacy mode — persistence is best-effort.
  }
}

export function clearPersistedSession() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(READINESS_STORAGE_KEY);
  } catch {
    // Storage may be unavailable in hardened browser profiles.
  }
}

/**
 * @param {Record<string, number>} answers
 * @param {string} dimensionKey
 * @returns {boolean}
 */
export function isDimensionComplete(answers, dimensionKey) {
  const dimension = OIARF_DIMENSIONS.find((item) => item.key === dimensionKey);
  if (!dimension) return false;
  return dimension.questions.every((question) => isLikertValue(answers?.[question.id]));
}

/**
 * @param {Record<string, number>} answers
 * @returns {boolean}
 */
export function isAssessmentComplete(answers) {
  return DIMENSION_KEYS.every((key) => isDimensionComplete(answers, key));
}