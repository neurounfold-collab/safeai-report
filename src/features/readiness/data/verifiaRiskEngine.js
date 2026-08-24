/**
 * VerifIA Risk Engine — regulatory role taxonomy, Annex III §3 use cases, and Article 27 FRIA module.
 * Aligns with SAFEAI_MASTER_CONFIG.verifIA (constants.js).
 */

export const REGULATORY_ROLES = Object.freeze([
  Object.freeze({
    id: 'deployer',
    labelKey: 'readiness.verifia.roles.deployer.label',
    focusKey: 'readiness.verifia.roles.deployer.focus',
  }),
  Object.freeze({
    id: 'edtech',
    labelKey: 'readiness.verifia.roles.edtech.label',
    focusKey: 'readiness.verifia.roles.edtech.focus',
  }),
]);

export const ANNEX_III_USE_CASES = Object.freeze([
  Object.freeze({
    id: '3a',
    labelKey: 'readiness.verifia.annexIII.useCases.3a.label',
  }),
  Object.freeze({
    id: '3b',
    labelKey: 'readiness.verifia.annexIII.useCases.3b.label',
  }),
  Object.freeze({
    id: '3c',
    labelKey: 'readiness.verifia.annexIII.useCases.3c.label',
  }),
  Object.freeze({
    id: '3d',
    labelKey: 'readiness.verifia.annexIII.useCases.3d.label',
  }),
]);

/** Article 27 Fundamental Rights Impact Assessment — dedicated diagnostic step. */
export const FRIA_DIMENSION = Object.freeze({
  key: 'fria',
  id: 0,
  nameKey: 'readiness.verifia.fria.name',
  focusKey: 'readiness.verifia.fria.focus',
  questions: Object.freeze([
    Object.freeze({
      id: 'fria_q1',
      promptKey: 'readiness.verifia.fria.prompts.q1',
    }),
    Object.freeze({
      id: 'fria_q2',
      promptKey: 'readiness.verifia.fria.prompts.q2',
    }),
    Object.freeze({
      id: 'fria_q3',
      promptKey: 'readiness.verifia.fria.prompts.q3',
    }),
  ]),
});

const ROLE_IDS = new Set(REGULATORY_ROLES.map((role) => role.id));
const ANNEX_IDS = ANNEX_III_USE_CASES.map((item) => item.id);

/**
 * @returns {Record<string, boolean>}
 */
export function createEmptyAnnexUseCases() {
  return ANNEX_IDS.reduce((acc, id) => {
    acc[id] = false;
    return acc;
  }, {});
}

/**
 * @param {unknown} role
 * @returns {boolean}
 */
export function isValidRegulatoryRole(role) {
  return typeof role === 'string' && ROLE_IDS.has(role);
}

/**
 * @param {unknown} annexUseCases
 * @returns {Record<string, boolean>}
 */
export function normalizeAnnexUseCases(annexUseCases) {
  const base = createEmptyAnnexUseCases();
  if (!annexUseCases || typeof annexUseCases !== 'object') return base;

  for (const id of ANNEX_IDS) {
    if (annexUseCases[id] === true) {
      base[id] = true;
    }
  }
  return base;
}

/**
 * @param {Record<string, boolean>} annexUseCases
 * @returns {boolean}
 */
export function hasAnnexSelection(annexUseCases) {
  return ANNEX_IDS.some((id) => annexUseCases?.[id] === true);
}

/**
 * @param {string | null} regulatoryRole
 * @param {Record<string, boolean>} annexUseCases
 * @returns {boolean}
 */
export function isSetupComplete(regulatoryRole, annexUseCases) {
  return isValidRegulatoryRole(regulatoryRole) && hasAnnexSelection(annexUseCases);
}
