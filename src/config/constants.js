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

/**
 * Production-safe endpoint defaults — never rely solely on host .env injection.
 * Canonical WaqfLedger log path (client logger + serverless grader):
 *   https://waqfledger-api.vercel.app/api/v1/ledger/log-compliance
 * Alternate host form (env-overridable via VITE_WAQFLEDGER_API_ENDPOINT /
 * WAQFLEDGER_ENDPOINT): https://api.waqfledger.tech/api/log-compliance
 */
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
      verificationUrl: "https://safeai.report/verify"
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
  /**
   * VerifIA 3-Layer Assurance Suite — EU AI Act Annex III Section 3 (Education & Vocational Training).
   * Authoritative registry for high-risk educational AI deployer assurance under L'INSTITUT ARTICLE 4 (A4I).
   */
  verifIA: {
    suiteId: 'verifia_educational_assurance_v1',
    suiteName: 'VerifIA 3-Layer Assurance Suite for Educational AI',
    regulatoryAnchor: 'EU AI Act Annex III Section 3 — Education and Vocational Training',
    highRiskClassification: 'Annex III §3 High-Risk Educational AI System',
    annexIII: {
      section: 3,
      title: 'Education and Vocational Training',
      useCases: {
        '3a': {
          id: '3a',
          key: 'admissionsAccessRanking',
          label: 'Admissions, access, and candidate ranking algorithms',
          articleRef: 'Annex III §3(a)',
        },
        '3b': {
          id: '3b',
          key: 'learningOutcomeEvaluation',
          label: 'Learning outcome evaluation, grading, and pedagogical steering',
          articleRef: 'Annex III §3(b)',
        },
        '3c': {
          id: '3c',
          key: 'educationalLevelDetermination',
          label: 'Educational level determination and aptitude placement',
          articleRef: 'Annex III §3(c)',
        },
        '3d': {
          id: '3d',
          key: 'behavioralMonitoringProctoring',
          label: 'Student behavioral monitoring and automated proctoring',
          articleRef: 'Annex III §3(d)',
        },
      },
    },
    assurancePipeline: {
      title: '3-Layer Assurance Pipeline',
      layers: {
        layer1: {
          id: 1,
          key: 'complianceEvidence',
          label: 'Layer 1: Compliance Evidence',
          scope: ['Articles 9–15', 'ISO/IEC 42001 AIMS controls', 'Article 14 Human Oversight SOPs'],
          ledgerAnchor: 'WaqfLedger.tech',
        },
        layer2: {
          id: 2,
          key: 'algorithmicAssurance',
          label: 'Layer 2: Algorithmic Assurance',
          scope: [
            'Demographic parity',
            'Calibration curves',
            'Error-rate disparities',
          ],
        },
        layer3: {
          id: 3,
          key: 'cryptographicProvenance',
          label: 'Layer 3: Cryptographic Provenance',
          scope: ['Tokenless SHA-256 state sealing', 'WaqfLedger anchoring'],
          encryptionProtocol: 'SHA-256 tamper-evident state hashing',
        },
      },
    },
    modules: {
      registry: {
        key: 'registry',
        label: 'Registry',
        description: 'Sovereign educational AI system registration and Annex III §3 classification index',
      },
      riskEngine: {
        key: 'riskEngine',
        label: 'Risk Engine',
        description: 'High-risk educational AI scoring against Annex III Section 3 use-case vectors',
      },
      assuranceLab: {
        key: 'assuranceLab',
        label: 'Assurance Lab',
        description: '3-layer assurance pipeline execution: compliance evidence, algorithmic assurance, provenance sealing',
      },
      evidenceVault: {
        key: 'evidenceVault',
        label: 'Evidence Vault',
        description: 'Immutable conformity evidence repository aligned with Articles 9–15 and ISO/IEC 42001 AIMS',
      },
      auditPassport: {
        key: 'auditPassport',
        label: 'Audit Passport™',
        description: 'Portable cryptographic audit credential with WaqfLedger-anchored SHA-256 provenance seal',
      },
    },
    permanentAccessDataFlywheel: {
      policyId: 'permanent_access_data_flywheel_v1',
      enabled: true,
      baselineAccessPercent: 100,
      rule:
        '100% permanent baseline access is granted upon submitting anonymized evaluation data to the A4I National/Regional Barometer.',
      trigger: 'anonymizedEvaluationDataSubmission',
      destination: "A4I National/Regional Barometer",
      academicAuthority: "L'INSTITUT ARTICLE 4 (A4I)",
    },
  },
};
