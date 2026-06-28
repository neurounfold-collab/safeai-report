/**
 * Sovereign verification registry — known ledger anchors and local persistence keys.
 * Ledger seed data mirrors institutional dashboard feed until live partner API is wired.
 */

import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import { DEFAULT_PARTNER_METRICS } from '../../dashboard/components/PartnerOverview.jsx';

export const VERIFICATION_STORAGE_KEYS = {
  CREDENTIAL_HASH: 'SAFEAI_CREDENTIAL_STATE_HASH',
  CANDIDATE_NAME: 'SAFEAI_EXAMINEE_LEGAL_NAME',
  CERTIFICATION_TIER: 'SAFEAI_CERTIFICATION_TIER',
  CREDENTIAL_TIMESTAMP: 'SAFEAI_CREDENTIAL_TIMESTAMP',
  MASTER_TEST_AUDIT: 'SAFEAI_MASTER_TEST_AUDIT',
};

export const MASTER_TEST_AUDIT_CODE = 'A4I_MASTER_TEST_AUDIT';

const DEFAULT_SESSION_CANDIDATE_NAME = 'Official Test Auditor';
const LOCAL_SESSION_REGISTRY_AUTHORITY =
  'WaqfLedger.tech (Vercel Simulation Core Network)';

/** @type {Map<string, { credentialId: string; timestamp: string; tier: string }>} */
const LEDGER_REGISTRY = new Map();

const TIER_SLUG_TO_LEVEL = {
  level01: 'Level 01',
  level02: 'Level 02',
  level03: 'Level 03',
};

for (const entry of DEFAULT_PARTNER_METRICS.ledgerFeed) {
  const certification = DEFAULT_PARTNER_METRICS.activeCertifications.find(
    (item) => item.credentialId === entry.credentialId,
  );
  const tierSlug = certification?.tierKey?.match(/level0[1-3]/)?.[0];
  const tier = tierSlug ? TIER_SLUG_TO_LEVEL[tierSlug] : 'Level 01';

  LEDGER_REGISTRY.set(entry.stateHash.toLowerCase(), {
    credentialId: entry.credentialId,
    timestamp: entry.timestamp,
    tier,
  });
}

/**
 * @param {string} tierLevel — e.g. "Level 01"
 * @returns {string}
 */
export function resolveTierDescription(tierLevel) {
  const tierConfig = SAFEAI_MASTER_CONFIG.evaluationTiers.publicTiers.find(
    (tier) => tier.level === tierLevel,
  );

  if (!tierConfig) {
    return tierLevel;
  }

  return `${tierConfig.level} — ${tierConfig.name}`;
}

/**
 * Normalizes a stored tier token (slug or Level 0x label) to a canonical level key.
 * @param {string | null | undefined} rawTier
 * @returns {'Level 01' | 'Level 02' | 'Level 03'}
 */
function normalizeStoredTierLevel(rawTier) {
  if (typeof rawTier !== 'string') {
    return 'Level 01';
  }

  const trimmed = rawTier.trim();
  if (!trimmed) {
    return 'Level 01';
  }

  const levelMatch = trimmed.match(/^Level 0([1-3])$/);
  if (levelMatch) {
    return `Level 0${levelMatch[1]}`;
  }

  const slug = trimmed.toLowerCase().match(/level0[1-3]/)?.[0];
  return slug ? TIER_SLUG_TO_LEVEL[slug] : 'Level 01';
}

/**
 * @param {unknown} rawValue
 * @returns {string}
 */
function resolveCandidateDisplayName(rawValue) {
  if (typeof rawValue !== 'string') {
    return DEFAULT_SESSION_CANDIDATE_NAME;
  }

  const trimmed = rawValue.trim();
  return trimmed || DEFAULT_SESSION_CANDIDATE_NAME;
}

/**
 * @param {unknown} rawValue
 * @returns {string}
 */
function sanitizeStoredTimestamp(rawValue) {
  if (typeof rawValue === 'string' && rawValue.trim()) {
    const epochMs = Date.parse(rawValue.trim());
    if (Number.isFinite(epochMs)) {
      return new Date(epochMs).toISOString();
    }
  }

  return new Date().toISOString();
}

/**
 * Resolves a hash against the active session credential anchored in localStorage.
 * @param {string} normalizedHash — lowercase 64-char SHA-256 hex digest
 * @returns {object | null}
 */
export function resolveVerificationHash(normalizedHash) {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawStoredHash = window.localStorage.getItem(VERIFICATION_STORAGE_KEYS.CREDENTIAL_HASH);
    const storedHash =
      typeof rawStoredHash === 'string' ? rawStoredHash.trim().toLowerCase() : '';

    if (!storedHash || storedHash !== normalizedHash) {
      return null;
    }

    const candidateName = resolveCandidateDisplayName(
      window.localStorage.getItem(VERIFICATION_STORAGE_KEYS.CANDIDATE_NAME),
    );

    const tierLevel = normalizeStoredTierLevel(
      window.localStorage.getItem(VERIFICATION_STORAGE_KEYS.CERTIFICATION_TIER),
    );

    const tierLabel = resolveTierDescription(tierLevel);

    const timestamp = sanitizeStoredTimestamp(
      window.localStorage.getItem(VERIFICATION_STORAGE_KEYS.CREDENTIAL_TIMESTAMP),
    );

    const masterTestFlag = window.localStorage.getItem(VERIFICATION_STORAGE_KEYS.MASTER_TEST_AUDIT);
    const isMasterTestAudit = typeof masterTestFlag === 'string' && masterTestFlag.trim() === 'true';

    const tracking = {
      isValid: true,
      verified: true,
      candidateName,
      candidateNameIsCredentialId: false,
      tierLabel,
      complianceLevel: tierLabel,
      timestamp,
      authority: LOCAL_SESSION_REGISTRY_AUTHORITY,
      registryAuthority: LOCAL_SESSION_REGISTRY_AUTHORITY,
      stateHash: normalizedHash,
    };

    if (isMasterTestAudit) {
      tracking.masterTestAuditSession = true;
    }

    return tracking;
  } catch {
    return null;
  }
}

/**
 * @param {string} normalizedHash — lowercase 64-char SHA-256 hex digest
 * @returns {object | null}
 */
export function resolveVerificationRecord(normalizedHash) {
  const ledgerEntry = LEDGER_REGISTRY.get(normalizedHash);
  if (ledgerEntry) {
    return {
      verified: true,
      candidateName: ledgerEntry.credentialId,
      candidateNameIsCredentialId: true,
      complianceLevel: resolveTierDescription(ledgerEntry.tier),
      timestamp: ledgerEntry.timestamp,
      stateHash: normalizedHash,
      registryAuthority: SAFEAI_MASTER_CONFIG.infrastructure.ledgerHost,
    };
  }

  return resolveVerificationHash(normalizedHash);
}
