/**
 * Resolve a Vite build-time env override with an in-bundle production fallback.
 * Static hosts do not inject .env at runtime — hardcoded defaults must always ship.
 * @param {string} key - Vite env key (e.g. VITE_WAQFLEDGER_API_ENDPOINT)
 * @param {string} fallback - Authoritative default when env is missing or empty
 * @returns {string}
 */
function envString(key, fallback) {
  const value = import.meta.env[key];
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

/** Production-safe endpoint defaults — never rely solely on host .env injection. */
const DEPLOYMENT_DEFAULTS = {
  waqfLedgerApiEndpoint: 'https://waqfledger-api.vercel.app/api/v1/ledger/log-compliance',
  waqfLedgerVerifyEndpoint: 'https://waqfledger-api.vercel.app/api/v1/ledger/verify',
  emailRouterEndpoint: '/api/contact.php',
  stripeTierAUrl: 'https://donate.stripe.com/eVq9ATfOzfLkaTj3kQ3Nm03',
  stripeTierBUrl: 'https://donate.stripe.com/eVq6oH45R7eO7H76x23Nm04',
  stripeTierAUrlSandbox: 'https://buy.stripe.com/test_your_1500_link_here',
  stripeTierBUrlSandbox: 'https://buy.stripe.com/test_your_3500_link_here',
  wiseTierAUrl: 'https://wise.com/pay/r/AChI0X2nedH6fGA',
  wiseTierBUrl: 'https://wise.com/pay/r/l8xtNaVvRj8iO-M',
};

export const SAFEAI_MASTER_CONFIG = {
  branding: {
    name: "safeAI.report",
    standardName: "TOEFL AI Literacy Standard Certification",
    platformClaim:
      "Quadlingual Sovereign AI Governance & Deployer Literacy Platform (EN / FR / ES / AR)",
    authority: "Professor Adel El Bouzagaoui",
    authorityProfiles: {
      linkedIn: "https://www.linkedin.com/in/adel-el-bouzagaoui",
      x: "https://x.com/safeai_report"
    }
  },
  legalAnchors: {
    processingEntity: "Global Capital Intelligence LLC",
    academicInstitution: "L'INSTITUT ARTICLE 4 (A4I)",
    registry: {
      rna: "W343030686",
      siret: "92288647800010",
      address: "975 Avenue de Fès, 34080 Montpellier, France",
      ice: "001625897000071"
    }
  },
  infrastructure: {
    ledgerHost: "WaqfLedger.tech",
    waqfLedgerApiEndpoint: envString(
      'VITE_WAQFLEDGER_API_ENDPOINT',
      DEPLOYMENT_DEFAULTS.waqfLedgerApiEndpoint,
    ),
    waqfLedgerVerifyEndpoint: envString(
      'VITE_WAQFLEDGER_VERIFY_ENDPOINT',
      DEPLOYMENT_DEFAULTS.waqfLedgerVerifyEndpoint,
    ),
    protocol: "Sovereign Algorithmic Governance Ledger",
    encryptionProtocol: "SHA-256 tamper-evident state hashing",
    targetFramework: "EU AI Act Article 4 Compliance Metrics",
    emailRouterEndpoint: envString(
      'VITE_EMAIL_ROUTER_ENDPOINT',
      DEPLOYMENT_DEFAULTS.emailRouterEndpoint,
    ),
  },
  fundingGateways: {
    /**
     * Live multi-channel institutional payment clearing registry — Global Capital Intelligence LLC.
     * Stripe production (live): stripeTierAUrl (EUR 1,500) / stripeTierBUrl (EUR 3,500).
     * Admin dashboard switch SAFEAI_ADMIN_STRIPE_PRODUCTION (/admin switchboard): when ON, CTAs
     * resolve to the production URLs above; when OFF (sandbox testing), stripeGateway.js swaps to
     * stripeTierAUrlSandbox / stripeTierBUrlSandbox (Stripe Test Mode links).
     * Wise reusable requests: wiseTierAUrl / wiseTierBUrl (tier-aligned institutional settlement).
     */
    stripeTierAUrl: envString(
      'VITE_STRIPE_TIER_A_URL',
      DEPLOYMENT_DEFAULTS.stripeTierAUrl,
    ),
    stripeTierBUrl: envString(
      'VITE_STRIPE_TIER_B_URL',
      DEPLOYMENT_DEFAULTS.stripeTierBUrl,
    ),
    stripeTierAUrlSandbox: envString(
      'VITE_STRIPE_TIER_A_URL_SANDBOX',
      DEPLOYMENT_DEFAULTS.stripeTierAUrlSandbox,
    ),
    stripeTierBUrlSandbox: envString(
      'VITE_STRIPE_TIER_B_URL_SANDBOX',
      DEPLOYMENT_DEFAULTS.stripeTierBUrlSandbox,
    ),
    wiseTierAUrl: DEPLOYMENT_DEFAULTS.wiseTierAUrl,
    wiseTierBUrl: DEPLOYMENT_DEFAULTS.wiseTierBUrl,
    /**
     * Wire settlement coordinates are never shipped in the client bundle.
     * Institutional invoice / SWIFT details are fulfilled out-of-band via secure contact intake.
     */
    wireInvoiceRequestPath: '/contact?subject=wire_invoice',
  },
  growthMarketing: {
    allowFreeTierWithSocialUnlock: true,
    linkedInSharePayload: {
      title: "I just earned my Official Article 4 AI Literacy Certification Badge!",
      summary: "Verified by L'Institut Article 4 (A4I). Compliance audited via WaqfLedger.tech.",
      hashtags: ["AILiteracy", "EUAIAct", "SafeAI", "RegTech"],
      verificationUrl: "https://safeai.report/verification"
    }
  },
  evaluationTiers: {
    title: "landing.pricing.title",
    publicTiers: [
      {
        level: "Level 01",
        name: "Assurance Certification Badge",
        allowSocialUnlock: true,
      },
      {
        level: "Level 02",
        name: "Executive Governance Badge",
        description:
          "Executive Governance & Corporate Supply-Chain Alignment (Open-Access Research Tier)",
        allowSocialUnlock: true,
      },
      {
        level: "Level 03",
        name: "Institutional Partner Badge",
        description:
          "High-Risk Algorithmic Auditing & Deep Technical Verification (Open-Access Research Tier)",
        allowSocialUnlock: true,
      },
    ],
    institutionalB2B: {
      id: "institutional_b2b_center",
      name: "Infrastructure Node Sponsorship",
      price: 3500,
      currency: "USD",
      allottedTokens: 50,
      features: [
        "50 Pre-paid Level 01 Examination Tokens for Faculty/Students",
        "Dedicated Institutional Dashboard & Analytics Space",
        "Immutable Verification Logging natively on WaqfLedger.tech",
        "Authorized Article 4 Training Syllabus Framework Packages",
      ],
    },
    /**
     * Authoritative Institutional Research Support Matrix — voluntary contribution tracks.
     * Tier A: Voluntary Research Support Grant ($1,500 USD / Year)
     * Tier B: Infrastructure Node Sponsorship ($3,500 USD / Year)
     */
    institutionalResearchSupport: {
      tierA: {
        key: 'contributor',
        tierLabel: 'Tier A',
        name: 'Voluntary Research Support Grant',
        price: 1500,
        currency: 'USD',
        period: 'Year',
        stripeGateway: 'researchContributor',
      },
      tierB: {
        key: 'sponsor',
        tierLabel: 'Tier B',
        name: 'Infrastructure Node Sponsorship',
        price: 3500,
        currency: 'USD',
        period: 'Year',
        stripeGateway: 'nodeSponsor',
      },
      pillars: [
        'complianceTelemetryAnchoring',
        'turnkeyCurriculumIntegration',
        'advancedRegistrarTelemetry',
      ],
      consortiumFooter:
        'Powered by the WaqfLedger Open-Access Consortium Engine — A permanent, public-benefit trust registry dedicated to maintaining the cryptographic integrity of global AI compliance records.',
    },
  },
};
