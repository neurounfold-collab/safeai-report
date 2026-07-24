/**
 * WaqfLedger.tech hash validation helpers — safeAI.report
 *
 * Provenance query simulation lives behind the live ledger client;
 * this module retains the shared SHA-256 shape guard used by VerifyView.
 */

/** Required SHA-256 hex digest length. */
export const SHA256_HEX_LENGTH = 64;

/**
 * @param {string} value
 * @returns {boolean}
 */
export function isValidSha256HexHash(value) {
  return (
    typeof value === 'string' &&
    new RegExp(`^[a-fA-F0-9]{${SHA256_HEX_LENGTH}}$`).test(value.trim())
  );
}
