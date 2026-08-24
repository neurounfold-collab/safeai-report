import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getActiveLanguage,
  getLanguageMeta,
  normalizeLanguage,
  translate,
} from '../i18n/index.js';

export const SITE_ORIGIN = 'https://safeai.report';
export const ZENODO_DOI = '10.5281/zenodo.21516198';
export const ZENODO_URL = `https://doi.org/${ZENODO_DOI}`;
export const OG_IMAGE_URL = `${SITE_ORIGIN}/assets/og-preview.png`;
export const JSON_LD_SCRIPT_ID = 'safeai-jsonld';
export const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const BRAND = SAFEAI_MASTER_CONFIG.branding;
const LEGAL = SAFEAI_MASTER_CONFIG.legalAnchors;
const REGISTRY = LEGAL.registry;
const INFRA = SAFEAI_MASTER_CONFIG.infrastructure;
const RESEARCH_SUPPORT = SAFEAI_MASTER_CONFIG.evaluationTiers.institutionalResearchSupport;

/**
 * Authoritative Schema.org offer catalog from constants.js pricing registry.
 * @returns {object}
 */
export function buildOfferCatalogJsonLd() {
  const tierA = RESEARCH_SUPPORT.tierA;
  const tierB = RESEARCH_SUPPORT.tierB;
  const formatPrice = (value) => Number(value).toFixed(2);

  return {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: '0.00',
    highPrice: formatPrice(tierB.price),
    offerCount: 3,
    offers: [
      {
        '@type': 'Offer',
        name: 'Community / Individual Tier',
        price: '0.00',
        priceCurrency: 'USD',
        description: 'Free community and individual diagnostic access under EU AI Act Article 4.',
      },
      {
        '@type': 'Offer',
        name: `Tier A ${tierA.name}`,
        price: formatPrice(tierA.price),
        priceCurrency: tierA.currency,
        description: `${tierA.tierLabel} Institutional Research Support — USD ${formatPrice(tierA.price)} / ${tierA.period.toLowerCase()}`,
      },
      {
        '@type': 'Offer',
        name: `Tier B ${tierB.name}`,
        price: formatPrice(tierB.price),
        priceCurrency: tierB.currency,
        description: `${tierB.tierLabel} Consortium Node Sponsorship — USD ${formatPrice(tierB.price)} / ${tierB.period.toLowerCase()}`,
      },
    ],
  };
}

export const OG_LOCALE_MAP = Object.freeze({
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  ar: 'ar_MA',
});

export const REGULATORY_SCOPES = Object.freeze([
  'EU AI Act Regulation (EU) 2024/1689 Annex III Section 3',
  'Article 4 Deployer Literacy',
  'ISO/IEC 42001 AIMS',
]);

/**
 * Canonical public routes indexed for SEO / GEO / hreflang.
 * `titleKey` maps to page_titles.*; `descriptionKey` maps to seo.descriptions.*.
 */
export const PRIMARY_ROUTES = Object.freeze([
  {
    path: '/',
    key: 'home',
    titleKey: 'page_titles.home',
    descriptionKey: 'seo.descriptions.home',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/academy',
    key: 'academy',
    titleKey: 'page_titles.academy',
    descriptionKey: 'seo.descriptions.academy',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/academy/exam',
    key: 'exam',
    titleKey: 'page_titles.exam',
    descriptionKey: 'seo.descriptions.exam',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/readiness',
    key: 'readiness',
    titleKey: 'page_titles.readiness',
    descriptionKey: 'seo.descriptions.readiness',
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: '/academic-centers',
    key: 'academicCenters',
    titleKey: 'page_titles.industrial',
    descriptionKey: 'seo.descriptions.industrial',
    changefreq: 'weekly',
    priority: '0.8',
  },
  {
    path: '/verify',
    key: 'verify',
    titleKey: 'page_titles.verify',
    descriptionKey: 'seo.descriptions.verify',
    changefreq: 'weekly',
    priority: '0.9',
  },
]);

const PATH_ALIASES = Object.freeze({
  '/access': '/',
  '/centers': '/academic-centers',
  '/industrial': '/academic-centers',
});

/**
 * @param {string} pathname
 * @returns {string}
 */
export function canonicalizePath(pathname) {
  if (typeof pathname !== 'string' || pathname.length === 0) return '/';
  const stripped = pathname.replace(/\/+$/, '') || '/';
  return PATH_ALIASES[stripped] ?? stripped;
}

/**
 * @param {string} pathname
 * @returns {(typeof PRIMARY_ROUTES)[number]}
 */
export function matchPrimaryRoute(pathname) {
  const canonical = canonicalizePath(pathname);
  const ranked = [...PRIMARY_ROUTES].sort((a, b) => b.path.length - a.path.length);
  return (
    ranked.find((route) =>
      route.path === '/'
        ? canonical === '/'
        : canonical === route.path || canonical.startsWith(`${route.path}/`),
    ) ?? PRIMARY_ROUTES[0]
  );
}

/**
 * @param {string} path
 * @param {string} lang
 * @returns {string}
 */
export function localizedUrl(path, lang) {
  const normalizedPath = path === '/' ? '/' : path;
  const code = normalizeLanguage(lang);
  const url = new URL(normalizedPath, SITE_ORIGIN);
  url.searchParams.set('lang', code);
  return url.toString();
}

/**
 * @param {string} path
 * @returns {string}
 */
export function canonicalUrl(path) {
  return new URL(path === '/' ? '/' : path, SITE_ORIGIN).toString();
}

/**
 * @returns {object}
 */
export function buildOrganizationJsonLd() {
  return {
    '@type': ['EducationalOrganization', 'NGO'],
    '@id': `${SITE_ORIGIN}/#organization`,
    name: "L'Institut Article 4 (A4I)",
    legalName: LEGAL.academicInstitution,
    alternateName: ['A4I', "L'INSTITUT ARTICLE 4"],
    url: SITE_ORIGIN,
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'RNA',
        name: 'French RNA',
        value: REGISTRY.rna,
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'SIRET',
        name: 'SIRET',
        value: REGISTRY.siret,
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'ICE',
        name: 'ICE',
        value: REGISTRY.ice,
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '975 Avenue de Fès',
      addressLocality: 'Montpellier',
      postalCode: '34080',
      addressCountry: 'FR',
    },
    founder: {
      '@type': 'Person',
      '@id': `${SITE_ORIGIN}/#founder`,
      name: BRAND.authority,
      jobTitle: 'Doctoral Researcher & Academic Authority',
      sameAs: [BRAND.authorityProfiles.linkedIn, BRAND.authorityProfiles.x],
    },
    knowsAbout: [...REGULATORY_SCOPES, 'WaqfLedger.tech', 'TOEFL of AI Literacy'],
    sameAs: [ZENODO_URL, BRAND.authorityProfiles.linkedIn, BRAND.authorityProfiles.x],
  };
}

/**
 * @returns {object}
 */
export function buildSoftwareApplicationJsonLd() {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_ORIGIN}/#software`,
    name: 'SafeAI Framework',
    alternateName: [
      BRAND.name,
      'VerifIA',
      'OIARF',
      'TOEFL of AI Literacy',
      BRAND.standardName,
    ],
    url: SITE_ORIGIN,
    applicationCategory: 'EducationalApplication',
    applicationSubCategory: 'RegTech / AI Governance',
    operatingSystem: 'Web',
    inLanguage: SUPPORTED_LANGUAGES,
    description: BRAND.platformClaim,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'DOI',
      value: ZENODO_DOI,
    },
    citation: ZENODO_URL,
    sameAs: [ZENODO_URL],
    educationalUse: 'Article 4 Deployer Literacy',
    educationalAlignment: REGULATORY_SCOPES.map((name) => ({
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      targetName: name,
      educationalFramework: 'EU AI Act Regulation (EU) 2024/1689',
    })),
    about: REGULATORY_SCOPES.map((name) => ({ '@type': 'Thing', name })),
    creator: { '@id': `${SITE_ORIGIN}/#organization` },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    provider: { '@id': `${SITE_ORIGIN}/#organization` },
    offers: buildOfferCatalogJsonLd(),
    featureList: [
      'Cisco-Grade 30-Scenario Article 4 assessment',
      'VerifIA 3-Layer Assurance Suite',
      'SHA-256 tamper-evident state hashing',
      `Cryptographic logging via ${INFRA.ledgerHost}`,
    ],
  };
}

/**
 * @param {string} [pathname]
 * @returns {object}
 */
export function buildSiteJsonLdGraph(pathname = '/') {
  const route = matchPrimaryRoute(pathname);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationJsonLd(),
      buildSoftwareApplicationJsonLd(),
      {
        '@type': 'TechArticle',
        '@id': `${SITE_ORIGIN}/#oiarf`,
        headline: 'Open Institutional AI Readiness Framework (OIARF v2.0.0)',
        identifier: ZENODO_URL,
        citation: ZENODO_URL,
        about: REGULATORY_SCOPES,
        author: { '@id': `${SITE_ORIGIN}/#founder` },
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        mainEntityOfPage: `${SITE_ORIGIN}/readiness`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: BRAND.name,
        description: BRAND.platformClaim,
        inLanguage: SUPPORTED_LANGUAGES,
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl(route.path)}#webpage`,
        url: canonicalUrl(route.path),
        name: translate(DEFAULT_LANGUAGE, route.titleKey),
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: REGULATORY_SCOPES,
        citation: ZENODO_URL,
      },
    ],
  };
}

/**
 * @param {string} pathname
 * @param {string} [lang]
 */
export function resolveRouteSeo(pathname, lang) {
  const language = normalizeLanguage(lang ?? getActiveLanguage());
  const route = matchPrimaryRoute(pathname);
  const title = translate(language, route.titleKey);
  const description = translate(language, route.descriptionKey, BRAND.platformClaim);
  const imageAlt = translate(language, 'seo.imageAlt', BRAND.platformClaim);

  return {
    language,
    route,
    title,
    description,
    imageAlt,
    canonical: canonicalUrl(route.path),
    locale: OG_LOCALE_MAP[language] ?? 'en_US',
    dir: getLanguageMeta(language).dir,
  };
}

function upsertNamedMeta(attr, key, content) {
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(rel, href, extra = {}) {
  const hreflang = extra.hreflang;
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
  Object.entries(extra).forEach(([name, value]) => {
    if (value == null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  });
}

/**
 * Apply route-local title, Open Graph, Twitter Card, hreflang, and JSON-LD.
 * @param {string} pathname
 * @param {string} [lang]
 */
export function applyRouteSeo(pathname, lang) {
  if (typeof document === 'undefined') return;

  const seo = resolveRouteSeo(pathname, lang);
  const twitterHandle = '@safeai_report';

  document.title = seo.title;
  document.documentElement.lang = seo.language;
  document.documentElement.dir = seo.dir;

  upsertNamedMeta('name', 'title', seo.title);
  upsertNamedMeta('name', 'description', seo.description);
  upsertNamedMeta('name', 'citation_doi', ZENODO_DOI);
  upsertNamedMeta('name', 'robots', 'index, follow, max-image-preview:large');
  upsertNamedMeta('name', 'author', BRAND.authority);

  upsertNamedMeta('property', 'og:type', 'website');
  upsertNamedMeta('property', 'og:site_name', BRAND.name);
  upsertNamedMeta('property', 'og:url', seo.canonical);
  upsertNamedMeta('property', 'og:title', seo.title);
  upsertNamedMeta('property', 'og:description', seo.description);
  upsertNamedMeta('property', 'og:image', OG_IMAGE_URL);
  upsertNamedMeta('property', 'og:image:alt', seo.imageAlt);
  upsertNamedMeta('property', 'og:locale', seo.locale);

  const existingAlternates = document.head.querySelectorAll(
    'meta[property="og:locale:alternate"]',
  );
  existingAlternates.forEach((node) => node.remove());
  SUPPORTED_LANGUAGES.filter((code) => code !== seo.language).forEach((code) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:locale:alternate');
    meta.setAttribute('content', OG_LOCALE_MAP[code]);
    document.head.appendChild(meta);
  });

  upsertNamedMeta('property', 'twitter:card', 'summary_large_image');
  upsertNamedMeta('property', 'twitter:site', twitterHandle);
  upsertNamedMeta('property', 'twitter:creator', twitterHandle);
  upsertNamedMeta('property', 'twitter:url', seo.canonical);
  upsertNamedMeta('property', 'twitter:title', seo.title);
  upsertNamedMeta('property', 'twitter:description', seo.description);
  upsertNamedMeta('property', 'twitter:image', OG_IMAGE_URL);
  upsertNamedMeta('property', 'twitter:image:alt', seo.imageAlt);

  upsertLink('canonical', seo.canonical);
  upsertLink('alternate', localizedUrl(seo.route.path, seo.language), {
    hreflang: seo.language,
  });
  SUPPORTED_LANGUAGES.forEach((code) => {
    upsertLink('alternate', localizedUrl(seo.route.path, code), { hreflang: code });
  });
  upsertLink('alternate', canonicalUrl(seo.route.path), { hreflang: 'x-default' });

  let jsonLd = document.getElementById(JSON_LD_SCRIPT_ID);
  if (!jsonLd) {
    jsonLd = document.createElement('script');
    jsonLd.id = JSON_LD_SCRIPT_ID;
    jsonLd.type = 'application/ld+json';
    document.head.appendChild(jsonLd);
  }
  jsonLd.textContent = JSON.stringify(buildSiteJsonLdGraph(pathname));
}