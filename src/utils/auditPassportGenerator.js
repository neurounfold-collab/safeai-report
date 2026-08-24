import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';
import {
  LEDGER_ANCHOR_STATUS,
  LEDGER_TRACK,
  isArticle4ExamTrack,
  isOiarfReadinessTrack,
  normalizeLedgerTrackType,
} from '../config/ledgerTracks.js';
import { computeSha256Hex } from '../features/readiness/utils/anonymousTelemetry.js';

export const PASSPORT_SCHEMA_ID = 'https://safeai.report/schemas/passport_schema.json';
export const PASSPORT_JSONLD_CONTEXT = Object.freeze({
  '@vocab': 'https://safeai.report/schema/verifia#',
  passport: 'https://safeai.report/schema/passport#',
  schema: 'https://schema.org/',
});

const VERIFIA = SAFEAI_MASTER_CONFIG?.verifIA ?? {};
const INFRA = SAFEAI_MASTER_CONFIG?.infrastructure ?? {};
const LEDGER_ENGINE = INFRA.ledgerHost ?? 'WaqfLedger.tech';
const ISSUER =
  SAFEAI_MASTER_CONFIG?.legalAnchors?.academicInstitution ??
  "L'INSTITUT ARTICLE 4 (A4I)";
const VERIFY_ORIGIN = 'https://safeai.report/verify';

const ANNEX_III_IDS = Object.freeze(['3a', '3b', '3c', '3d']);

const ALGORITHMIC_ASSURANCE_SELF_ATTESTED = Object.freeze({
  status: 'SELF_ATTESTED_POLICY_CONTROLS',
  subgroup_fairness_testing: 'NOT_EMPIRICALLY_ASSESSED',
  methodology: 'OIARF_LIKERT_READINESS_REVIEW',
});

/**
 * Deterministic A4I-2026-EU-XXXXXXXX identifier derived from the sealed SHA-256 state hash.
 * @param {string} stateHash
 * @returns {string}
 */
export function generatePassportId(stateHash) {
  const hash = typeof stateHash === 'string' ? stateHash.trim().toLowerCase() : '';
  if (!/^[a-f0-9]{64}$/.test(hash)) {
    throw new Error(
      'A sealed SHA-256 state hash is required to mint a deterministic Audit Passport ID.',
    );
  }
  return `A4I-2026-EU-${hash.substring(0, 8).toUpperCase()}`;
}

/**
 * @param {number | null | undefined} score Normalized dimension score in [0, 1].
 * @returns {'within_threshold' | 'partial_gap' | 'gap_identified' | 'not_assessed'}
 */
export function scoreToAssuranceStatus(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return 'not_assessed';
  if (score >= 0.8) return 'within_threshold';
  if (score >= 0.5) return 'partial_gap';
  return 'gap_identified';
}

/**
 * @param {number[]} scores
 * @returns {number | null}
 */
function averageScore(scores) {
  const valid = scores.filter((value) => typeof value === 'number' && Number.isFinite(value));
  if (valid.length === 0) return null;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

/**
 * @param {number | null} score
 * @param {string} articleRef
 */
function assuranceRecord(score, articleRef) {
  return {
    status: scoreToAssuranceStatus(score),
    score: typeof score === 'number' ? score : null,
    article_ref: articleRef,
    basis: 'OIARF_LIKERT_READINESS_REVIEW',
  };
}

/**
 * Map VerifIA role ids (`deployer` / `edtech`) to EU AI Act Deployer vs Provider.
 * @param {string | null | undefined} regulatoryRole
 * @returns {'Deployer' | 'Provider'}
 */
export function resolveSystemRole(regulatoryRole) {
  const normalized = typeof regulatoryRole === 'string' ? regulatoryRole.trim().toLowerCase() : '';
  if (normalized === 'edtech' || normalized === 'provider') return 'Provider';
  return 'Deployer';
}

/**
 * @param {string | null | undefined} regulatoryRole
 * @param {string | null | undefined} sector
 * @returns {string}
 */
export function buildDeployerId(regulatoryRole, sector) {
  const role = resolveSystemRole(regulatoryRole).toUpperCase();
  const sectorTag =
    typeof sector === 'string' && sector.trim().length > 0
      ? sector.trim().replace(/\s+/g, '-').toUpperCase()
      : 'UNSPECIFIED';
  return `A4I-DEP-${role}-${sectorTag}`;
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function normalizeAnnexClassification(value) {
  if (Array.isArray(value)) {
    return value.filter((id) => ANNEX_III_IDS.includes(id));
  }
  if (value && typeof value === 'object') {
    return ANNEX_III_IDS.filter((id) => Boolean(value[id]));
  }
  return [];
}

function resolveTrackType(assessmentData) {
  return normalizeLedgerTrackType(
    assessmentData?.trackType
      ?? assessmentData?.track_type
      ?? assessmentData?.attestation?.trackType,
  );
}

function isLedgerAnchored(profile) {
  return (
    profile?.ledgerAnchored === true
    || profile?.anchored === true
    || profile?.ledgerStatus === LEDGER_ANCHOR_STATUS.ANCHORED
  );
}

/**
 * @param {unknown} assessmentData
 * @returns {boolean}
 */
export function canMintAuditPassport(assessmentData) {
  return isOiarfReadinessTrack(resolveTrackType(assessmentData));
}

/**
 * Accept a sealed OIARF profile only. Exam attestations must use generateArticle4AttestationReceipt.
 * @param {object} assessmentData
 * @returns {object}
 */
export function normalizeAssessmentData(assessmentData) {
  if (!assessmentData || typeof assessmentData !== 'object') {
    throw new Error('Assessment data is required to generate an Audit Passport.');
  }

  const trackType = resolveTrackType(assessmentData);
  if (!isOiarfReadinessTrack(trackType)) {
    throw new Error(
      'VerifIA Audit Passport™ is minted only for trackType OIARF_INSTITUTIONAL_READINESS.',
    );
  }

  if (!assessmentData.mcda && !assessmentData.fria) {
    throw new Error('Sealed OIARF MCDA/FRIA profile is required to mint an Audit Passport.');
  }

  return {
    ...assessmentData,
    trackType: LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS,
    annexIIISection3: normalizeAnnexClassification(assessmentData.annexIIISection3),
  };
}

function stripEvidenceHashes(document) {
  const clone = JSON.parse(JSON.stringify(document));
  const provenance = clone.cryptographic_provenance;
  if (!provenance || typeof provenance !== 'object') return clone;

  delete provenance.evidence_package_sha256;
  delete provenance.verification_url;
  if (provenance.waqfledger_anchor && typeof provenance.waqfledger_anchor === 'object') {
    delete provenance.waqfledger_anchor.evidence_package_sha256;
  }
  return clone;
}

/**
 * Construct a VerifIA Audit Passport™ JSON-LD document from a sealed OIARF assessment profile.
 *
 * @param {object} assessmentProfile
 * @param {{ passportId?: string }} [options]
 * @returns {Promise<object>}
 */
export async function buildAuditPassport(assessmentProfile, options = {}) {
  const profile = normalizeAssessmentData(assessmentProfile);
  const stateHash =
    typeof profile.stateHash === 'string' ? profile.stateHash.trim().toLowerCase() : '';
  if (!/^[a-f0-9]{64}$/.test(stateHash)) {
    throw new Error('A sealed SHA-256 state hash is required to mint an Audit Passport.');
  }

  const dimensionScores = profile?.mcda?.dimensionScores ?? {};
  const friaScore = profile?.fria?.score ?? null;
  const passportId = options.passportId ?? generatePassportId(stateHash);
  const systemRole = resolveSystemRole(profile.regulatoryRole);
  const anchored = isLedgerAnchored(profile);
  const anchorStatus = anchored
    ? LEDGER_ANCHOR_STATUS.ANCHORED
    : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK;

  const article4Score = dimensionScores.ai_literacy ?? null;
  const article11Score = averageScore([
    dimensionScores.technology,
    dimensionScores.data_readiness,
    dimensionScores.risk_compliance,
  ]);
  const article14Score = averageScore([
    dimensionScores.governance,
    dimensionScores.workforce_culture,
    friaScore,
  ]);
  const article27Score = friaScore;
  const iso42001Score = averageScore([
    dimensionScores.technology,
    dimensionScores.governance,
    dimensionScores.data_readiness,
  ]);

  const systemProfile = {
    system_name: VERIFIA.suiteName ?? 'VerifIA Risk Engine',
    system_version: profile.schemaVersion ?? VERIFIA.suiteId ?? 'verifia_v1',
    deployer_id: buildDeployerId(profile.regulatoryRole, profile.sector),
    role: systemRole,
    regulatory_role: profile.regulatoryRole ?? systemRole,
    sector: profile.sector ?? null,
    annex_iii_classification: normalizeAnnexClassification(profile.annexIIISection3),
  };

  const modelConfigPayload = {
    system_profile: systemProfile,
    regulatory_role: profile.regulatoryRole ?? null,
    annex_iii: systemProfile.annex_iii_classification,
    engine: profile.engine ?? 'VerifIA-Risk-Engine',
    trackType: LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS,
  };

  const modelConfigSha256 = await computeSha256Hex(modelConfigPayload);

  const unsignedPassport = {
    '@context': PASSPORT_JSONLD_CONTEXT,
    '@type': 'VerifIAAuditPassport',
    $schema: PASSPORT_SCHEMA_ID,
    passport_id: passportId,
    issued_at: profile.sealedAt ?? new Date().toISOString(),
    issuer: ISSUER,
    trackType: LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS,
    system_profile: systemProfile,
    compliance_assurance: {
      article_4_literacy: assuranceRecord(article4Score, 'EU AI Act Article 4'),
      article_11_technical_files: assuranceRecord(article11Score, 'EU AI Act Article 11'),
      article_14_human_oversight: assuranceRecord(article14Score, 'EU AI Act Article 14'),
      article_27_fria: assuranceRecord(article27Score, 'EU AI Act Article 27 FRIA'),
      iso_42001_aims: assuranceRecord(iso42001Score, 'ISO/IEC 42001 AIMS'),
    },
    algorithmic_assurance_metrics: { ...ALGORITHMIC_ASSURANCE_SELF_ATTESTED },
    cryptographic_provenance: {
      ledger_engine: LEDGER_ENGINE,
      model_config_sha256: modelConfigSha256,
      state_hash: stateHash,
      waqfledger_anchor: {
        host: LEDGER_ENGINE,
        protocol: INFRA.protocol ?? 'Sovereign Algorithmic Governance Ledger',
        encryption_protocol:
          INFRA.encryptionProtocol ?? 'SHA-256 tamper-evident state hashing',
        log_endpoint: INFRA.waqfLedgerApiEndpoint ?? null,
        verify_endpoint: INFRA.waqfLedgerVerifyEndpoint ?? null,
        anchored,
        status: anchorStatus,
      },
    },
    mcda_summary: {
      overall_index: profile?.mcda?.overallIndex ?? null,
      overall_index_percent: profile?.mcda?.overallIndexPercent ?? null,
      fria_score: friaScore,
      basis: 'OIARF_LIKERT_READINESS_REVIEW',
    },
  };

  const evidencePackageSha256 = await computeSha256Hex(stripEvidenceHashes(unsignedPassport));
  const verificationUrl = `${VERIFY_ORIGIN}?hash=${encodeURIComponent(stateHash)}`;

  return {
    ...unsignedPassport,
    cryptographic_provenance: {
      ...unsignedPassport.cryptographic_provenance,
      evidence_package_sha256: evidencePackageSha256,
      verification_url: verificationUrl,
      waqfledger_anchor: {
        ...unsignedPassport.cryptographic_provenance.waqfledger_anchor,
        evidence_package_sha256: evidencePackageSha256,
      },
    },
  };
}

/**
 * Canonical helper: produce a JSON-LD VerifIA Audit Passport™ from an OIARF profile.
 *
 * @param {object} assessmentData Sealed OIARF profile (trackType OIARF_INSTITUTIONAL_READINESS).
 * @param {{ passportId?: string }} [options]
 * @returns {Promise<object>}
 */
export async function generateAuditPassport(assessmentData, options = {}) {
  return buildAuditPassport(assessmentData, options);
}

/**
 * Article 4 Deployer Attestation Receipt — exam track only. Never includes FRIA / Annex III §3.
 *
 * @param {object} attestation
 * @returns {Promise<object>}
 */
export async function generateArticle4AttestationReceipt(attestation) {
  if (!attestation || typeof attestation !== 'object') {
    throw new Error('A WaqfLedger attestation is required to mint an Article 4 receipt.');
  }

  const trackType = resolveTrackType(attestation) ?? LEDGER_TRACK.ARTICLE_4_LITERACY_EXAM;
  if (isOiarfReadinessTrack(trackType)) {
    throw new Error('OIARF readiness records must use generateAuditPassport, not an Article 4 receipt.');
  }
  if (!isArticle4ExamTrack(trackType) && attestation.verified !== true) {
    throw new Error('Article 4 Deployer Attestation Receipt requires an exam-track ledger record.');
  }

  const stateHash = String(attestation.stateHash ?? attestation.hash ?? '')
    .trim()
    .toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(stateHash)) {
    throw new Error('A SHA-256 WaqfLedger hash is required for an Article 4 attestation receipt.');
  }

  const anchored =
    attestation.verified === true
    || attestation.ledgerAnchored === true
    || attestation.anchored === true;

  const receipt = {
    '@context': {
      '@vocab': 'https://safeai.report/schema/article4#',
      schema: 'https://schema.org/',
    },
    '@type': 'Article4DeployerAttestationReceipt',
    trackType: LEDGER_TRACK.ARTICLE_4_LITERACY_EXAM,
    track: 'Article 4 Deployer Literacy',
    issued_at: attestation.timestamp ?? new Date().toISOString(),
    issuer: ISSUER,
    score: typeof attestation.score === 'number' ? attestation.score : null,
    candidate_name: attestation.candidateName ?? null,
    compliance_level: attestation.complianceLevel ?? null,
    sha256_hash: stateHash,
    waqfledger_seal: {
      host: LEDGER_ENGINE,
      hash: stateHash,
      anchored,
      status: anchored ? LEDGER_ANCHOR_STATUS.ANCHORED : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
      verify_endpoint: INFRA.waqfLedgerVerifyEndpoint ?? null,
      verification_url: `${VERIFY_ORIGIN}?hash=${encodeURIComponent(stateHash)}`,
    },
  };

  const evidencePackageSha256 = await computeSha256Hex(receipt);
  return {
    ...receipt,
    evidence_package_sha256: evidencePackageSha256,
  };
}

/**
 * @param {object} passport
 * @returns {string}
 */
export function serializeAuditPassport(passport) {
  return `${JSON.stringify(passport, null, 2)}\n`;
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {object} document
 * @param {string} [filename]
 */
export function downloadAuditPassportJsonLd(document, filename) {
  const blob = new Blob([serializeAuditPassport(document)], {
    type: 'application/ld+json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  const fallbackId = document?.passport_id ?? document?.sha256_hash ?? Date.now();
  const isExamReceipt = document?.['@type'] === 'Article4DeployerAttestationReceipt';
  anchor.download =
    filename
    ?? (isExamReceipt
      ? `article4-attestation-receipt-${fallbackId}.json`
      : `verifia-audit-passport-${fallbackId}.json`);
  anchor.click();
  URL.revokeObjectURL(url);
}

export const downloadAuditPassportJson = downloadAuditPassportJsonLd;

function openPrintDocument(html) {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

/**
 * @param {object} passport
 * @param {{ title?: string, subtitle?: string }} labels
 */
export function printComplianceSummary(passport, labels = {}) {
  const title = labels.title ?? 'FRIA Compliance Summary';
  const subtitle =
    labels.subtitle ??
    'EU AI Act Article 27 FRIA — Annex III §3 Educational AI Assurance';

  const statusLabel = (status) =>
    String(status ?? 'not_assessed').replace(/_/g, ' ').toUpperCase();

  const fria = passport.compliance_assurance?.article_27_fria;
  const provenance = passport.cryptographic_provenance ?? {};
  const anchor = provenance.waqfledger_anchor ?? {};
  const algo = passport.algorithmic_assurance_metrics ?? {};

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)} — ${escapeHtml(passport.passport_id)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #111; margin: 2rem; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
    h2 { font-size: 1rem; margin: 1.25rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.06em; }
    p { margin: 0.35rem 0; }
    table { width: 100%; border-collapse: collapse; margin: 0.5rem 0 1rem; font-size: 0.875rem; }
    th, td { border: 1px solid #ccc; padding: 0.45rem 0.6rem; text-align: left; }
    th { background: #f5f5f5; }
    .meta { font-size: 0.8125rem; color: #444; }
    .hash { font-family: ui-monospace, monospace; font-size: 0.72rem; word-break: break-all; }
    @media print { body { margin: 1rem; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">${escapeHtml(subtitle)}</p>
  <p><strong>Passport ID:</strong> ${escapeHtml(passport.passport_id)}</p>
  <p><strong>Issued:</strong> ${escapeHtml(passport.issued_at ?? '—')}</p>
  <p><strong>Issuer:</strong> ${escapeHtml(passport.issuer ?? '—')}</p>
  <p><strong>Track:</strong> ${escapeHtml(passport.trackType ?? LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS)}</p>

  <h2>System Profile</h2>
  <p><strong>System:</strong> ${escapeHtml(passport.system_profile?.system_name ?? '—')} (${escapeHtml(passport.system_profile?.system_version ?? '—')})</p>
  <p><strong>Role:</strong> ${escapeHtml(passport.system_profile?.role ?? '—')}</p>
  <p><strong>Deployer ID:</strong> ${escapeHtml(passport.system_profile?.deployer_id ?? '—')}</p>
  <p><strong>Annex III §3:</strong> ${escapeHtml((passport.system_profile?.annex_iii_classification ?? []).join(', ') || '—')}</p>

  <h2>Article 27 FRIA (self-attested OIARF review)</h2>
  <p><strong>Status:</strong> ${escapeHtml(statusLabel(fria?.status))}</p>
  <p><strong>Score:</strong> ${fria?.score != null ? `${(fria.score * 100).toFixed(2)}%` : '—'}</p>
  <p class="meta">Basis: OIARF Likert readiness review — not an empirical FRIA dataset.</p>

  <h2>Compliance Assurance</h2>
  <table>
    <thead><tr><th>Control</th><th>Status</th><th>Score</th></tr></thead>
    <tbody>
      ${Object.entries(passport.compliance_assurance ?? {})
        .map(
          ([key, record]) =>
            `<tr><td>${escapeHtml(key.replace(/_/g, ' '))}</td><td>${escapeHtml(statusLabel(record?.status))}</td><td>${record?.score != null ? `${(record.score * 100).toFixed(2)}%` : '—'}</td></tr>`,
        )
        .join('')}
    </tbody>
  </table>

  <h2>Algorithmic Assurance Metrics</h2>
  <p><strong>Status:</strong> ${escapeHtml(algo.status ?? 'SELF_ATTESTED_POLICY_CONTROLS')}</p>
  <p><strong>Subgroup fairness testing:</strong> ${escapeHtml(algo.subgroup_fairness_testing ?? 'NOT_EMPIRICALLY_ASSESSED')}</p>
  <p><strong>Methodology:</strong> ${escapeHtml(algo.methodology ?? 'OIARF_LIKERT_READINESS_REVIEW')}</p>

  <h2>Cryptographic Provenance</h2>
  <p><strong>Ledger:</strong> ${escapeHtml(provenance.ledger_engine ?? '—')}</p>
  <p><strong>WaqfLedger host:</strong> ${escapeHtml(anchor.host ?? LEDGER_ENGINE)}</p>
  <p><strong>Anchor status:</strong> ${escapeHtml(anchor.status ?? (anchor.anchored ? 'ANCHORED' : 'LOCAL_FALLBACK'))}</p>
  <p class="hash"><strong>State hash:</strong><br />${escapeHtml(provenance.state_hash ?? '—')}</p>
  <p class="hash"><strong>Model config SHA-256:</strong><br />${escapeHtml(provenance.model_config_sha256 ?? '—')}</p>
  <p class="hash"><strong>Evidence package SHA-256:</strong><br />${escapeHtml(provenance.evidence_package_sha256 ?? '—')}</p>
  <p><strong>Verification:</strong> ${escapeHtml(provenance.verification_url ?? '—')}</p>
</body>
</html>`;

  openPrintDocument(html);
}

/**
 * @param {object} receipt
 * @param {{ title?: string, subtitle?: string }} [labels]
 */
export function printArticle4AttestationReceipt(receipt, labels = {}) {
  const title = labels.title ?? 'Article 4 Deployer Attestation Receipt';
  const subtitle =
    labels.subtitle ?? 'EU AI Act Article 4 literacy examination — WaqfLedger seal';
  const seal = receipt.waqfledger_seal ?? {};

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #111; margin: 2rem; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin: 0 0 0.25rem; }
    p { margin: 0.35rem 0; }
    .meta { font-size: 0.8125rem; color: #444; }
    .hash { font-family: ui-monospace, monospace; font-size: 0.72rem; word-break: break-all; }
    @media print { body { margin: 1rem; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p class="meta">${escapeHtml(subtitle)}</p>
  <p><strong>Track:</strong> ${escapeHtml(receipt.track ?? 'Article 4 Deployer Literacy')}</p>
  <p><strong>Track type:</strong> ${escapeHtml(receipt.trackType ?? LEDGER_TRACK.ARTICLE_4_LITERACY_EXAM)}</p>
  <p><strong>Score:</strong> ${receipt.score != null ? escapeHtml(`${receipt.score}`) : '—'}</p>
  <p><strong>Issued:</strong> ${escapeHtml(receipt.issued_at ?? '—')}</p>
  <p><strong>Issuer:</strong> ${escapeHtml(receipt.issuer ?? '—')}</p>
  <p><strong>WaqfLedger seal:</strong> ${escapeHtml(seal.status ?? (seal.anchored ? 'ANCHORED' : 'LOCAL_FALLBACK'))}</p>
  <p class="hash"><strong>SHA-256 hash:</strong><br />${escapeHtml(receipt.sha256_hash ?? '—')}</p>
  <p><strong>Verification:</strong> ${escapeHtml(seal.verification_url ?? '—')}</p>
</body>
</html>`;

  openPrintDocument(html);
}
