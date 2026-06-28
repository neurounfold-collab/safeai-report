/**
 * WaqfLedger.tech Network Simulator — safeAI.report Sprint 3
 *
 * Asynchronous mock handler that simulates sovereign ledger provenance lookups.
 * Registry anchors are sourced exclusively from constants.js.
 */

import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';

/** Simulated round-trip latency for WaqfLedger.tech network requests. */
export const WAQF_LEDGER_SIMULATED_LATENCY_MS = 850;

/** Required SHA-256 hex digest length. */
export const SHA256_HEX_LENGTH = 64;

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidSha256HexHash(value) {
  return typeof value === 'string' && /^[a-fA-F0-9]{64}$/.test(value.trim());
}

/**
 * Simulates an authenticated provenance query against WaqfLedger.tech.
 *
 * @param {string} stateHash — 64-character SHA-256 hex digest.
 * @returns {Promise<object>} Structural provenance payload for audit desk rendering.
 */
export async function queryWaqfLedgerProvenance(stateHash) {
  const normalizedHash = stateHash.trim().toLowerCase();

  if (!isValidSha256HexHash(normalizedHash)) {
    throw new RangeError(
      `WaqfLedger query rejected: state hash must be exactly ${SHA256_HEX_LENGTH} hexadecimal characters.`
    );
  }

  await new Promise((resolve) => setTimeout(resolve, WAQF_LEDGER_SIMULATED_LATENCY_MS));

  const { legalAnchors, infrastructure } = SAFEAI_MASTER_CONFIG;

  return Object.freeze({
    verified: true,
    ledgerHost: infrastructure.ledgerHost,
    protocol: infrastructure.protocol,
    encryptionProtocol: infrastructure.encryptionProtocol,
    targetFramework: infrastructure.targetFramework,
    academicAuthority: legalAnchors.academicInstitution,
    processingEntity: legalAnchors.processingEntity,
    timestamp: new Date().toISOString(),
    stateHash: normalizedHash,
  });
}
