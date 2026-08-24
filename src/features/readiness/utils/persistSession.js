import {
  ASSESSMENT_DIMENSION_KEYS,
  DEFAULT_ASSESSMENT_DIMENSION_KEY,
  OIARF_DIMENSIONS,
  READINESS_PERSIST_SCHEMA_VERSION,
  READINESS_STORAGE_KEY,
  SECTOR_OPTIONS,
  getDimensionByKey,
  isValidDimensionKey,
} from '../data/oiarfAssessment.js';
import {
  FRIA_DIMENSION,
  createEmptyAnnexUseCases,
  isSetupComplete,
  isValidRegulatoryRole,
  normalizeAnnexUseCases,
} from '../data/verifiaRiskEngine.js';
import { LEDGER_ANCHOR_STATUS } from '../../../config/ledgerTracks.js';
import { packageAnonymousTelemetry } from './anonymousTelemetry.js';
import { buildAssessmentProfile } from './assessmentProfile.js';

const SECTOR_IDS = new Set(SECTOR_OPTIONS.map((option) => option.id));

/** All diagnostic dimensions including Article 27 FRIA. */
const ALL_DIMENSIONS = [FRIA_DIMENSION, ...OIARF_DIMENSIONS];

/**
 * @returns {Record<string, number>}
 */
export function createEmptyAnswers() {
  /** @type {Record<string, number>} */
  const answers = {};
  for (const dimension of ALL_DIMENSIONS) {
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
 * @returns {object | null}
 */
function parseV1Session(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.version !== 1) return null;

  const activeDimension = isValidDimensionKey(raw.activeDimension)
    ? raw.activeDimension
    : DEFAULT_ASSESSMENT_DIMENSION_KEY;

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
    activeDimension,
    answers: baseAnswers,
    sector,
    completed: Boolean(raw.completed),
    stateHash,
    overallIndex,
    overallIndexRaw: overallIndex,
    dimensionScoresRaw: null,
    regulatoryRole: null,
    annexUseCases: createEmptyAnnexUseCases(),
    setupComplete: false,
    assessmentProfile: null,
    ledgerAnchored: false,
    ledgerStatus: LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
    sealedAt: null,
  };
}

/**
 * @param {unknown} raw
 * @returns {object | null}
 */
export function parsePersistedSession(raw) {
  if (!raw || typeof raw !== 'object') return null;

  if (raw.version === 1) {
    return parseV1Session(raw);
  }

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

  const overallIndexRaw =
    typeof raw.overallIndexRaw === 'number' && Number.isFinite(raw.overallIndexRaw)
      ? raw.overallIndexRaw
      : overallIndex;

  const regulatoryRole = isValidRegulatoryRole(raw.regulatoryRole)
    ? raw.regulatoryRole
    : null;

  const annexUseCases = normalizeAnnexUseCases(raw.annexUseCases);

  const setupComplete =
    typeof raw.setupComplete === 'boolean'
      ? raw.setupComplete
      : isSetupComplete(regulatoryRole, annexUseCases);

  const dimensionScoresRaw =
    raw.dimensionScoresRaw && typeof raw.dimensionScoresRaw === 'object'
      ? raw.dimensionScoresRaw
      : null;

  const ledgerAnchored = raw.ledgerAnchored === true || raw.assessmentProfile?.ledgerAnchored === true;
  const ledgerStatus =
    raw.ledgerStatus === LEDGER_ANCHOR_STATUS.ANCHORED && ledgerAnchored
      ? LEDGER_ANCHOR_STATUS.ANCHORED
      : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK;

  const sealedAt =
    typeof raw.sealedAt === 'string' && raw.sealedAt.trim()
      ? raw.sealedAt.trim()
      : (typeof raw.assessmentProfile?.sealedAt === 'string'
        ? raw.assessmentProfile.sealedAt
        : null);

  return {
    version: READINESS_PERSIST_SCHEMA_VERSION,
    activeDimension: raw.activeDimension,
    answers: baseAnswers,
    sector,
    completed: Boolean(raw.completed),
    stateHash,
    overallIndex,
    overallIndexRaw,
    dimensionScoresRaw,
    regulatoryRole,
    annexUseCases,
    setupComplete,
    assessmentProfile: null,
    ledgerAnchored,
    ledgerStatus,
    sealedAt,
  };
}

/**
 * Synchronous parse of localStorage with no cryptographic check.
 * Used only for non-sealed fields such as the active dimension.
 * @returns {ReturnType<typeof parsePersistedSession>}
 */
export function peekPersistedSession() {
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
 * Restore a session only when the SHA-256 of stored answers still matches stateHash.
 * Mismatched or forged profiles are purged.
 * @returns {Promise<ReturnType<typeof parsePersistedSession>>}
 */
export async function loadPersistedSession() {
  const parsed = peekPersistedSession();
  if (!parsed) return null;

  const needsIntegrityCheck = Boolean(parsed.stateHash || parsed.completed);
  if (!needsIntegrityCheck) {
    return parsed;
  }

  try {
    const { stateHash: recomputed } = await packageAnonymousTelemetry(parsed.answers, {
      sector: parsed.sector,
      regulatoryRole: parsed.regulatoryRole,
      annexUseCases: parsed.annexUseCases,
    });

    if (parsed.stateHash && parsed.stateHash !== recomputed) {
      clearPersistedSession();
      return null;
    }

    if (!parsed.stateHash) {
      return {
        ...parsed,
        completed: false,
        assessmentProfile: null,
        ledgerAnchored: false,
        ledgerStatus: LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
      };
    }

    const ledgerAnchored = parsed.ledgerAnchored === true;
    const profile = buildAssessmentProfile({
      answers: parsed.answers,
      sector: parsed.sector,
      regulatoryRole: parsed.regulatoryRole,
      annexUseCases: parsed.annexUseCases,
      stateHash: recomputed,
      ledgerAnchored,
      ledgerStatus: ledgerAnchored
        ? LEDGER_ANCHOR_STATUS.ANCHORED
        : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
      sealedAt: parsed.sealedAt,
    });

    return {
      ...parsed,
      stateHash: recomputed,
      completed: true,
      assessmentProfile: profile,
      ledgerAnchored,
      ledgerStatus: profile.ledgerStatus,
    };
  } catch {
    clearPersistedSession();
    return null;
  }
}

/**
 * @param {object} session
 */
export function persistSession(session) {
  if (typeof window === 'undefined') return;

  const activeDimension = isValidDimensionKey(session?.activeDimension)
    ? session.activeDimension
    : DEFAULT_ASSESSMENT_DIMENSION_KEY;

  const payload = {
    version: READINESS_PERSIST_SCHEMA_VERSION,
    activeDimension,
    answers: session?.answers ?? createEmptyAnswers(),
    sector: session?.sector ?? null,
    completed: Boolean(session?.completed),
    stateHash: session?.stateHash ?? null,
    overallIndex:
      typeof session?.overallIndex === 'number' ? session.overallIndex : null,
    overallIndexRaw:
      typeof session?.overallIndexRaw === 'number'
        ? session.overallIndexRaw
        : null,
    dimensionScoresRaw: session?.dimensionScoresRaw ?? null,
    regulatoryRole: isValidRegulatoryRole(session?.regulatoryRole)
      ? session.regulatoryRole
      : null,
    annexUseCases: normalizeAnnexUseCases(session?.annexUseCases),
    setupComplete: Boolean(session?.setupComplete),
    assessmentProfile: session?.assessmentProfile ?? null,
    ledgerAnchored: Boolean(session?.ledgerAnchored) && Boolean(session?.stateHash),
    ledgerStatus:
      session?.ledgerAnchored === true && session?.stateHash
        ? LEDGER_ANCHOR_STATUS.ANCHORED
        : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
    sealedAt:
      session?.stateHash
        && typeof (session?.sealedAt ?? session?.assessmentProfile?.sealedAt) === 'string'
        && String(session?.sealedAt ?? session?.assessmentProfile?.sealedAt).trim()
        ? String(session.sealedAt ?? session.assessmentProfile.sealedAt).trim()
        : null,
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
  const dimension = getDimensionByKey(dimensionKey);
  if (!dimension) return false;
  return dimension.questions.every((question) => isLikertValue(answers?.[question.id]));
}

/**
 * @param {Record<string, number>} answers
 * @returns {boolean}
 */
export function isAssessmentComplete(answers) {
  return ASSESSMENT_DIMENSION_KEYS.every((key) => isDimensionComplete(answers, key));
}

export { ASSESSMENT_DIMENSION_KEYS, DEFAULT_ASSESSMENT_DIMENSION_KEY };
