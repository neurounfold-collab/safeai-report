/**
 * Sovereign verification registry — live WaqfLedger attestation lookup.
 * Public /verify never trusts localStorage or forged client strings.
 */

import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import { DEFAULT_PARTNER_METRICS } from '../../dashboard/components/PartnerOverview.jsx';
import { queryLedgerAttestation } from '../../../utils/waqfLedgerClient.js';

export const VERIFICATION_STORAGE_KEYS = {
  CREDENTIAL_HASH: 'SAFEAI_CREDENTIAL_STATE_HASH',
  CANDIDATE_NAME: 'SAFEAI_EXAMINEE_LEGAL_NAME',
  CERTIFICATION_TIER: 'SAFEAI_CERTIFICATION_TIER',
  CREDENTIAL_TIMESTAMP: 'SAFEAI_CREDENTIAL_TIMESTAMP',
  MASTER_TEST_AUDIT: 'SAFEAI_MASTER_TEST_AUDIT',
};

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
 * Admin/dashboard seed resolver only — never used by the public /verify portal.
 * @param {string} normalizedHash — lowercase 64-char SHA-256 hex digest
 * @returns {object | null}
 */
export function resolveSeededVerificationRecord(normalizedHash) {
  if (typeof normalizedHash !== 'string' || !normalizedHash) {
    return null;
  }

  const ledgerEntry = LEDGER_REGISTRY.get(normalizedHash.toLowerCase());
  if (!ledgerEntry) {
    return null;
  }

  return {
    verified: true,
    candidateName: ledgerEntry.credentialId,
    candidateNameIsCredentialId: true,
    complianceLevel: resolveTierDescription(ledgerEntry.tier),
    timestamp: ledgerEntry.timestamp,
    stateHash: normalizedHash.toLowerCase(),
    registryAuthority: SAFEAI_MASTER_CONFIG.infrastructure.ledgerHost,
  };
}

/**
 * Live WaqfLedger attestation lookup for the public cryptographic verification portal.
 * Returns verified metadata only when the remote ledger confirms a hash match.
 *
 * @param {string} normalizedHash — lowercase 64-char SHA-256 hex digest
 * @returns {Promise<object>}
 */
export async function resolveVerificationRecord(normalizedHash) {
  const hash =
    typeof normalizedHash === 'string' ? normalizedHash.trim().toLowerCase() : '';

  if (!/^[a-f0-9]{64}$/.test(hash)) {
    return {
      verified: false,
      pending: true,
      stateHash: hash || null,
    };
  }

  const attestation = await queryLedgerAttestation(hash);

  if (!attestation?.verified) {
    return {
      verified: false,
      pending: true,
      stateHash: attestation?.stateHash ?? hash,
    };
  }

  const complianceRaw = attestation.complianceLevel;
  let complianceLevel = complianceRaw;
  if (typeof complianceRaw === 'string') {
    const levelMatch = complianceRaw.match(/level\s*0?([1-3])/i);
    if (levelMatch) {
      complianceLevel = resolveTierDescription(`Level 0${levelMatch[1]}`);
    } else if (/^Level 0[1-3]$/.test(complianceRaw.trim())) {
      complianceLevel = resolveTierDescription(complianceRaw.trim());
    }
  }

  return {
    verified: true,
    score: attestation.score ?? null,
    candidateName: attestation.candidateName ?? null,
    candidateNameIsCredentialId: false,
    complianceLevel: complianceLevel ?? null,
    timestamp: attestation.timestamp ?? null,
    stateHash: attestation.stateHash ?? hash,
    registryAuthority:
      attestation.registryAuthority
      ?? SAFEAI_MASTER_CONFIG.infrastructure.ledgerHost,
  };
}
