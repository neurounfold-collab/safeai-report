import { translate, getActiveLanguage, normalizeLanguage } from '../i18n/index.js';

const LINKEDIN_SHARE_HANDLER_URL =
  'https://www.linkedin.com/sharing/share-offsite/?url=https://safeai.report/academy';
const VERIFY_URL_BASE = 'https://safeai.report/verify';
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/i;
const CREDENTIAL_HASH_STORAGE_KEY = 'SAFEAI_CREDENTIAL_STATE_HASH';
const INSTITUTE_ORG_NAME = "L'INSTITUT ARTICLE 4 (A4I)";

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
 * Builds the official LinkedIn "Add to Profile" certification URL.
 * @param {{ certTitle: string; hash: string; assessmentId: string; issueYear?: number; issueMonth?: number }} params
 */
export function buildLinkedInAddToProfileUrl({
  certTitle,
  hash,
  assessmentId,
  issueYear = 2026,
  issueMonth = 7,
}) {
  const certUrl = `${VERIFY_URL_BASE}/${hash}`;
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: certTitle,
    organizationName: INSTITUTE_ORG_NAME,
    issueYear: String(issueYear),
    issueMonth: String(issueMonth),
    certUrl,
    certId: assessmentId,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
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
export function buildLinkedInSharePayload({
  stateHash,
  language,
  certTitle,
  assessmentId,
} = {}) {
  const hash = resolveSessionStateHash(stateHash);
  if (!hash) {
    throw new Error('Session SHA-256 verification hash unavailable.');
  }

  const locale = normalizeLanguage(language ?? getActiveLanguage());
  const verifyUrl = `${VERIFY_URL_BASE}/${hash}`;
  const template = translate(locale, 'academy.sharing.linkedin.postText');
  const postText = hydrateLinkedInPostText(template, hash, verifyUrl);
  const resolvedTitle =
    typeof certTitle === 'string' && certTitle.trim()
      ? certTitle.trim()
      : "EU AI Act Article 4 AI Literacy Certification — L'INSTITUT ARTICLE 4 (A4I)";
  const resolvedAssessmentId =
    typeof assessmentId === 'string' && assessmentId.trim()
      ? assessmentId.trim()
      : hash.slice(0, 12).toUpperCase();

  return {
    hash,
    verifyUrl,
    postText,
    copySuccessMessage: translate(locale, 'academy.sharing.linkedin.copySuccess'),
    broadcastSuccessMessage: translate(
      locale,
      'academy.sharing.linkedin.broadcastSuccess',
    ),
    linkedInShareUrl: LINKEDIN_SHARE_HANDLER_URL,
    linkedInAddUrl: buildLinkedInAddToProfileUrl({
      certTitle: resolvedTitle,
      hash,
      assessmentId: resolvedAssessmentId,
    }),
  };
}

/**
 * Opens the official LinkedIn Add-to-Profile certification flow and returns the payload.
 */
export async function triggerLinkedInSocialUnlock({
  stateHash,
  language,
  certTitle,
  assessmentId,
} = {}) {
  const payload = buildLinkedInSharePayload({
    stateHash,
    language,
    certTitle,
    assessmentId,
  });

  return payload;
}
