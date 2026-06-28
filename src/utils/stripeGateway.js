import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';

/** Canonical localStorage key — mirrored on /admin switchboard. */
export const STRIPE_PRODUCTION_STORAGE_KEY = 'SAFEAI_ADMIN_STRIPE_PRODUCTION';

/** Legacy aliases retained for backward-compatible reads only. */
const STRIPE_PRODUCTION_LEGACY_KEYS = ['SAFEAI_ADMIN_STRIPE_MODE'];

const STRIPE_GATEWAY_RESOLVERS = {
  researchContributor: (fundingGateways, production) =>
    production ? fundingGateways.stripeTierAUrl : fundingGateways.stripeTierAUrlSandbox,
  nodeSponsor: (fundingGateways, production) =>
    production ? fundingGateways.stripeTierBUrl : fundingGateways.stripeTierBUrlSandbox,
};

/** Known sandbox placeholder markers shipped in DEPLOYMENT_DEFAULTS — never serve at checkout. */
const STRIPE_PLACEHOLDER_MARKERS = ['test_your_', 'link_here'];

function readStripeProductionPreference(storageKey) {
  const raw = window.localStorage.getItem(storageKey);
  if (raw === null || raw === undefined) {
    return null;
  }

  const normalized = typeof raw === 'string' ? raw.trim() : raw;
  if (normalized === 'false') {
    return false;
  }
  if (normalized === 'true') {
    return true;
  }

  return null;
}

function isStripePlaceholderUrl(url, fundingGateways) {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  if (STRIPE_PLACEHOLDER_MARKERS.some((marker) => url.includes(marker))) {
    return true;
  }

  const sandboxFallbacks = [
    fundingGateways?.stripeTierAUrlSandbox,
    fundingGateways?.stripeTierBUrlSandbox,
  ];

  return sandboxFallbacks.some((sandboxUrl) => typeof sandboxUrl === 'string' && sandboxUrl === url);
}

function resolveLiveProductionUrl(gateway, fundingGateways) {
  if (gateway === 'researchContributor') {
    return fundingGateways.stripeTierAUrl ?? '';
  }
  if (gateway === 'nodeSponsor') {
    return fundingGateways.stripeTierBUrl ?? '';
  }
  return '';
}

/**
 * Returns true when the admin switchboard routes checkout to live Stripe Payment Links.
 * Defaults to production when localStorage is unavailable, missing, null, or undefined.
 * Sandbox links apply only when localStorage explicitly equals the string "false".
 */
export function isStripeProductionMode() {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const keysToInspect = [STRIPE_PRODUCTION_STORAGE_KEY, ...STRIPE_PRODUCTION_LEGACY_KEYS];
    for (const storageKey of keysToInspect) {
      const preference = readStripeProductionPreference(storageKey);
      if (preference === false) {
        return false;
      }
      if (preference === true) {
        return true;
      }
    }
    return true;
  } catch {
    return true;
  }
}

/**
 * Resolves an institutional Stripe Payment Link from SAFEAI_MASTER_CONFIG.fundingGateways.
 * @param {'researchContributor' | 'nodeSponsor'} gateway
 */
export function resolveStripeGatewayUrl(gateway) {
  const fundingGateways = SAFEAI_MASTER_CONFIG?.fundingGateways;
  const resolver = STRIPE_GATEWAY_RESOLVERS[gateway];

  if (!fundingGateways || !resolver) {
    return '';
  }

  const resolvedUrl = resolver(fundingGateways, isStripeProductionMode()) ?? '';

  if (isStripePlaceholderUrl(resolvedUrl, fundingGateways)) {
    return resolveLiveProductionUrl(gateway, fundingGateways);
  }

  return resolvedUrl;
}
