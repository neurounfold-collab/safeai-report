import { translate, getActiveLanguage, normalizeLanguage } from '../i18n/index.js';

const LINKEDIN_SHARE_HANDLER_URL =
  'https://www.linkedin.com/sharing/share-offsite/?url=https://safeai.report/academy';
const VERIFY_URL_BASE = 'https://safeai.report/verify?hash=';
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i;
const CREDENTIAL_HASH_STORAGE_KEY = 'SAFEAI_CREDENTIAL_STATE_HASH';

/**
 * Resolves the active session's 64-character SHA-256 verification hash.
 */
function resolveSessionStateHash(stateHash) {
  const direct = typeof stateHash === 'string' ? stateHash.trim().toLowerCase() : '';
  if (SHA256_HEX_PATTERN.test(direct)) return direct;

  try {
    const stored = window.localStorage?.getItem(CREDENTIAL_HASH_STORAGE_KEY);
    const normalized = typeof stored === 'string' ? stored.trim().toLowerCase() : '';
    if (SHA256_HEX_PATTERN.test(normalized)) return normalized;
  } catch {
    // Storage may be unavailable in hardened browser profiles.
  }

  return null;
}

/**
 * Hydrates localized LinkedIn post template tokens with live session values.
 */
export function hydrateLinkedInPostText(template, hash, verifyUrl) {
  return template.replace(/\{hash\}/g, hash).replace(/\{verifyUrl\}/g, verifyUrl);
}

/**
 * Builds the hydrated LinkedIn achievement broadcast payload for the active session.
 */
export function buildLinkedInSharePayload({ stateHash, language } = {}) {
  const hash = resolveSessionStateHash(stateHash);
  if (!hash) {
    throw new Error('Session SHA-256 verification hash unavailable.');
  }

  const locale = normalizeLanguage(language ?? getActiveLanguage());
  const verifyUrl = `${VERIFY_URL_BASE}${hash}`;
  const template = translate(locale, 'academy.sharing.linkedin.postText');
  const postText = hydrateLinkedInPostText(template, hash, verifyUrl);

  return {
    hash,
    verifyUrl,
    postText,
    copySuccessMessage: translate(locale, 'academy.sharing.linkedin.copySuccess'),
    linkedInShareUrl: LINKEDIN_SHARE_HANDLER_URL,
  };
}

/**
 * Copies the hydrated LinkedIn post to clipboard for the candidate's achievement broadcast.
 */
export async function triggerLinkedInSocialUnlock({ stateHash, language } = {}) {
  const payload = buildLinkedInSharePayload({ stateHash, language });

  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    throw new Error('Clipboard API unavailable.');
  }

  await navigator.clipboard.writeText(payload.postText);

  return payload;
}
