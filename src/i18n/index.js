import en from './locales/en.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import ar from './locales/ar.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'ar'];
export const DEFAULT_LANGUAGE = 'en';

const dictionaries = { en, fr, es, ar };

/** Locales that render with right-to-left document flow. */
export const RTL_LANGUAGES = ['ar'];

const STORAGE_KEY = 'safeai.language';

/**
 * Resolve a dot-notated key against a nested translation object.
 * Returns undefined when the path is missing.
 */
function resolveKey(dictionary, key) {
  if (!dictionary || !key) return undefined;

  const segments = key.split('.');
  let value = dictionary;

  for (const segment of segments) {
    if (value == null || typeof value !== 'object') return undefined;
    value = value[segment];
  }

  return typeof value === 'string' ? value : undefined;
}

/**
 * Normalize a language code to a supported locale (en, fr, es, ar).
 */
export function normalizeLanguage(lang) {
  if (!lang || typeof lang !== 'string') return DEFAULT_LANGUAGE;
  const code = lang.trim().toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.includes(code) ? code : DEFAULT_LANGUAGE;
}

/**
 * Return the full dictionary for a supported language.
 */
export function getDictionary(lang) {
  return dictionaries[normalizeLanguage(lang)];
}

/**
 * Translate a key for the given language with English fallback.
 */
export function translate(lang, key, fallback = key) {
  const normalized = normalizeLanguage(lang);
  const primary = resolveKey(dictionaries[normalized], key);
  if (primary !== undefined) return primary;

  if (normalized !== DEFAULT_LANGUAGE) {
    const english = resolveKey(dictionaries[DEFAULT_LANGUAGE], key);
    if (english !== undefined) return english;
  }

  return fallback;
}

/**
 * Factory for a language-bound translator (t) function.
 */
export function createTranslator(lang) {
  const normalized = normalizeLanguage(lang);
  const t = (key, fallback = key) => translate(normalized, key, fallback);
  return { t, language: normalized };
}

/**
 * Detect browser language when it maps to a supported locale.
 */
export function detectBrowserLanguage() {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE;
  const candidates = navigator.languages ?? [navigator.language];
  for (const candidate of candidates) {
    const normalized = normalizeLanguage(candidate);
    if (SUPPORTED_LANGUAGES.includes(normalized)) return normalized;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Persist and apply the active locale (en | fr | es | ar).
 */
export function setActiveLanguage(lang) {
  const normalized = normalizeLanguage(lang);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, normalized);
  }
  return normalized;
}

/**
 * Read persisted locale or fall back to browser detection.
 */
export function getActiveLanguage() {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return normalizeLanguage(stored);
  }
  return detectBrowserLanguage();
}

/**
 * Whether the given locale requires RTL document direction.
 */
export function isRtlLanguage(lang) {
  return RTL_LANGUAGES.includes(normalizeLanguage(lang));
}

export { dictionaries };

export default {
  SUPPORTED_LANGUAGES,
  RTL_LANGUAGES,
  DEFAULT_LANGUAGE,
  dictionaries,
  isRtlLanguage,
  normalizeLanguage,
  getDictionary,
  translate,
  createTranslator,
  detectBrowserLanguage,
  setActiveLanguage,
  getActiveLanguage,
};
