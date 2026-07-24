import { useEffect, useMemo, useState } from 'react';
import { createTranslator, getActiveLanguage } from '../../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import { DASHBOARD_TABS, useDashboardTab } from '../../../layouts/DashboardLayout.jsx';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

/** Framework seed — replaced by live partner API once institutional auth is wired. */
export const DEFAULT_PARTNER_METRICS = {
  usedTokens: 12,
  activeCertifications: [
    { credentialId: 'SAI-A4I-2026-004821', tierKey: 'monetizationTiers.publicTiers.level01.level' },
    { credentialId: 'SAI-A4I-2026-004799', tierKey: 'monetizationTiers.publicTiers.level01.level' },
    { credentialId: 'SAI-A4I-2026-004755', tierKey: 'monetizationTiers.publicTiers.level02.level' },
    { credentialId: 'SAI-A4I-2026-004701', tierKey: 'monetizationTiers.publicTiers.level01.level' },
    { credentialId: 'SAI-A4I-2026-004688', tierKey: 'monetizationTiers.publicTiers.level03.level' },
  ],
  ledgerFeed: [
    {
      timestamp: '2026-06-10T14:22:31.000Z',
      credentialId: 'SAI-A4I-2026-004821',
      stateHash: '7f3a9c2e1b8d4f6a0e5c3b9d2a1f8e7c6b5d4a3f2e1c0b9a8d7e6f5a4b3c2d1',
    },
    {
      timestamp: '2026-06-09T09:14:02.000Z',
      credentialId: 'SAI-A4I-2026-004799',
      stateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      timestamp: '2026-06-08T16:47:18.000Z',
      credentialId: 'SAI-A4I-2026-004755',
      stateHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    },
    {
      timestamp: '2026-06-07T11:03:44.000Z',
      credentialId: 'SAI-A4I-2026-004701',
      stateHash: '2c26b46b68ffc68ff99b453c1d3041340e568eaef23bb282b543447a41730d60',
    },
    {
      timestamp: '2026-06-06T08:19:55.000Z',
      credentialId: 'SAI-A4I-2026-004688',
      stateHash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    },
    {
      timestamp: '2026-06-05T17:41:12.000Z',
      credentialId: 'SAI-A4I-2026-004642',
      stateHash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    },
    {
      timestamp: '2026-06-04T13:28:07.000Z',
      credentialId: 'SAI-A4I-2026-004601',
      stateHash: 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
    },
    {
      timestamp: '2026-06-03T10:55:33.000Z',
      credentialId: 'SAI-A4I-2026-004578',
      stateHash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    },
  ],
  researchCohorts: [
    { domain: 'Human Oversight Intervention', literacyScore: 91.4, frictionScore: 12.6, cohortSize: 48 },
    { domain: 'Transparency Disclosure', literacyScore: 87.2, frictionScore: 18.9, cohortSize: 48 },
    { domain: 'Procurement Due Diligence', literacyScore: 84.8, frictionScore: 22.1, cohortSize: 36 },
    { domain: 'High-Risk Audit Workflows', literacyScore: 79.5, frictionScore: 31.4, cohortSize: 28 },
    { domain: 'Data Lineage Provenance', literacyScore: 88.1, frictionScore: 15.7, cohortSize: 41 },
  ],
  licenseRenewalIso: '2027-06-15T00:00:00.000Z',
};

const PARTNER_OVERVIEW_STYLES = `
.partner-overview {
  --po-accent: #c9a227;
  --po-accent-teal: #5eead4;
  --po-surface: rgba(17, 24, 39, 0.82);
  --po-border: rgba(148, 163, 184, 0.18);
  --po-text: #f8fafc;
  --po-muted: #94a3b8;
  min-height: 100%;
  padding: clamp(1.25rem, 3vw, 2rem);
  color: var(--po-text);
}

.partner-overview__header {
  margin-bottom: 1.5rem;
}

.partner-overview__title {
  margin: 0 0 0.35rem;
  font-size: clamp(1.25rem, 2.5vw, 1.625rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.partner-overview__subtitle {
  margin: 0;
  max-width: 42rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--po-muted);
}

.partner-overview__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.partner-overview__panel {
  border-radius: 0.75rem;
  border: 1px solid var(--po-border);
  background: var(--po-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  padding: 1.15rem 1.25rem;
}

.partner-overview__panel--tokens {
  grid-column: span 5;
}

.partner-overview__panel--certs {
  grid-column: span 7;
}

.partner-overview__panel--ledger,
.partner-overview__panel--full {
  grid-column: span 12;
}

.partner-overview__panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.partner-overview__panel-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--po-muted);
}

.partner-overview__panel-badge {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 162, 39, 0.35);
  background: rgba(201, 162, 39, 0.12);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--po-accent);
  white-space: nowrap;
}

.partner-overview__token-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.partner-overview__stat {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.55);
}

.partner-overview__stat-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--po-muted);
}

.partner-overview__stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.partner-overview__stat-value--remaining {
  color: var(--po-accent-teal);
}

.partner-overview__stat-value--used {
  color: #fbbf24;
}

.partner-overview__stat-value--sm {
  font-size: 1.125rem;
}

.partner-overview__progress-track {
  height: 0.4rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
  overflow: hidden;
}

.partner-overview__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--po-accent-teal), var(--po-accent));
  transition: width 320ms ease;
}

.partner-overview__cert-summary {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.partner-overview__cert-count {
  font-size: 2.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--po-accent);
}

.partner-overview__cert-caption {
  font-size: 0.8125rem;
  color: var(--po-muted);
}

.partner-overview__badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.partner-overview__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.65);
  font-size: 0.6875rem;
  font-weight: 600;
}

.partner-overview__badge-tier {
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  background: rgba(201, 162, 39, 0.18);
  color: var(--po-accent);
  letter-spacing: 0.04em;
}

.partner-overview__badge-id {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  color: var(--po-muted);
}

.partner-overview__ledger-host {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  color: var(--po-muted);
}

.partner-overview__ledger-host strong {
  color: var(--po-accent-teal);
  font-weight: 700;
}

.partner-overview__table-wrap {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--po-border);
}

.partner-overview__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.partner-overview__table th {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.75);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: left;
  color: var(--po-muted);
  white-space: nowrap;
}

.partner-overview__table td {
  padding: 0.7rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  vertical-align: top;
}

.partner-overview__table tr:last-child td {
  border-bottom: none;
}

.partner-overview__table tr:hover td {
  background: rgba(148, 163, 184, 0.04);
}

.partner-overview__mono {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 0.6875rem;
  word-break: break-all;
  color: #cbd5e1;
}

.partner-overview__empty {
  margin: 0;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--po-muted);
}

.partner-overview__feature-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}

.partner-overview__feature-list li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--po-muted);
}

.partner-overview__feature-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 0.35rem;
  height: 0.35rem;
  border-radius: 50%;
  background: var(--po-accent);
}

.partner-overview__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.partner-overview__search {
  flex: 1 1 18rem;
  min-width: 0;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.65);
  color: var(--po-text);
  font-size: 0.8125rem;
  font-family: inherit;
}

.partner-overview__search:focus {
  outline: 2px solid rgba(201, 162, 39, 0.45);
  outline-offset: 1px;
}

.partner-overview__search::placeholder {
  color: var(--po-muted);
}

.partner-overview__filter-meta {
  margin: 0;
  font-size: 0.75rem;
  color: var(--po-muted);
  white-space: nowrap;
}

.partner-overview__export-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1rem;
}

.partner-overview__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.95rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(201, 162, 39, 0.4);
  background: rgba(201, 162, 39, 0.14);
  color: var(--po-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: background 160ms ease, border-color 160ms ease;
}

.partner-overview__btn:hover {
  background: rgba(201, 162, 39, 0.24);
  border-color: var(--po-accent);
}

.partner-overview__btn--ghost {
  border-color: var(--po-border);
  background: rgba(15, 23, 42, 0.55);
  color: var(--po-text);
}

.partner-overview__btn--ghost:hover {
  border-color: rgba(148, 163, 184, 0.4);
  background: rgba(148, 163, 184, 0.1);
}

.partner-overview__friction {
  display: inline-block;
  min-width: 3.25rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: #fbbf24;
}

.partner-overview__literacy {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--po-accent-teal);
}

@media (max-width: 960px) {
  .partner-overview__panel--tokens,
  .partner-overview__panel--certs,
  .partner-overview__panel--ledger,
  .partner-overview__panel--full {
    grid-column: span 12;
  }

  .partner-overview__token-stats {
    grid-template-columns: 1fr;
  }
}
`;

function usePartnerTranslator(languageProp) {
  const [language, setLanguage] = useState(() => languageProp ?? getActiveLanguage());

  useEffect(() => {
    if (languageProp) {
      setLanguage(languageProp);
      return undefined;
    }

    const syncLanguage = () => setLanguage(getActiveLanguage());

    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) syncLanguage();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage);
    };
  }, [languageProp]);

  return createTranslator(language);
}

function formatLedgerTimestamp(isoTimestamp, locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(isoTimestamp));
}

function formatCalendarDate(isoTimestamp, locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(isoTimestamp));
}

function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function OverviewTab({
  t,
  language,
  allottedTokens,
  usedTokens,
  remainingTokens,
  utilizationPercent,
  certifications,
  visibleCertifications,
  ledgerHost,
  feed,
}) {
  return (
    <>
      <header className="partner-overview__header">
        <h1 id="partner-overview-title" className="partner-overview__title">
          {t('dashboard.overview.title')}
        </h1>
        <p className="partner-overview__subtitle">{t('dashboard.overview.subtitle')}</p>
      </header>

      <div className="partner-overview__grid">
        <article className="partner-overview__panel partner-overview__panel--tokens">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.overview.tokens.title')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('dashboard.overview.tokens.baseline')}
            </span>
          </div>

          <div className="partner-overview__token-stats">
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.overview.tokens.allotted')}
              </span>
              <span className="partner-overview__stat-value">{allottedTokens}</span>
            </div>
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.overview.tokens.remaining')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--remaining">
                {remainingTokens}
              </span>
            </div>
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.overview.tokens.used')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--used">
                {usedTokens}
              </span>
            </div>
          </div>

          <div
            className="partner-overview__progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={allottedTokens}
            aria-valuenow={usedTokens}
            aria-label={t('dashboard.overview.tokens.utilizationAria')}
          >
            <div
              className="partner-overview__progress-fill"
              style={{ width: `${utilizationPercent}%` }}
            />
          </div>
        </article>

        <article className="partner-overview__panel partner-overview__panel--certs">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.overview.certifications.title')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('dashboard.overview.certifications.prestige')}
            </span>
          </div>

          <div className="partner-overview__cert-summary">
            <span className="partner-overview__cert-count">{certifications.length}</span>
            <span className="partner-overview__cert-caption">
              {t('dashboard.overview.certifications.activeLabel')}
            </span>
          </div>

          <div className="partner-overview__badge-grid" role="list">
            {(visibleCertifications || []).map(({ credentialId, tierKey }) => (
              <span key={credentialId} className="partner-overview__badge" role="listitem">
                <span className="partner-overview__badge-tier">{t(tierKey)}</span>
                <span className="partner-overview__badge-id">{credentialId}</span>
              </span>
            ))}
          </div>
        </article>

        <article className="partner-overview__panel partner-overview__panel--ledger">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.overview.ledgerFeed.title')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('infrastructure.encryptionProtocol')}
            </span>
          </div>

          <p className="partner-overview__ledger-host">
            {t('dashboard.overview.ledgerFeed.hostPrefix')}{' '}
            <strong>{ledgerHost}</strong>
          </p>

          {(feed || []).length === 0 ? (
            <p className="partner-overview__empty">{t('dashboard.overview.ledgerFeed.empty')}</p>
          ) : (
            <div className="partner-overview__table-wrap">
              <table className="partner-overview__table">
                <thead>
                  <tr>
                    <th scope="col">{t('dashboard.overview.ledgerFeed.columns.timestamp')}</th>
                    <th scope="col">{t('dashboard.overview.ledgerFeed.columns.credentialId')}</th>
                    <th scope="col">{t('dashboard.overview.ledgerFeed.columns.stateHash')}</th>
                  </tr>
                </thead>
                <tbody>
                  {(feed || []).slice(0, 4).map(({ timestamp, credentialId, stateHash }) => (
                    <tr key={`${credentialId}-${stateHash}`}>
                      <td>{formatLedgerTimestamp(timestamp, language)} UTC</td>
                      <td className="partner-overview__mono">{credentialId}</td>
                      <td className="partner-overview__mono">{stateHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

function LicensesTab({
  t,
  language,
  institutionalB2B,
  tierB,
  allottedTokens,
  usedTokens,
  remainingTokens,
  renewalIso,
}) {
  const priceLabel = `${institutionalB2B.price.toLocaleString()} ${institutionalB2B.currency}`;
  const annualLabel = `${tierB.price.toLocaleString()} ${tierB.currency} / ${tierB.period}`;

  return (
    <>
      <header className="partner-overview__header">
        <h1 id="partner-licenses-title" className="partner-overview__title">
          {t('dashboard.licenses.title')}
        </h1>
        <p className="partner-overview__subtitle">{t('dashboard.licenses.subtitle')}</p>
      </header>

      <div className="partner-overview__grid">
        <article className="partner-overview__panel partner-overview__panel--tokens">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.licenses.tokenAllocation')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('dashboard.licenses.activeStatus')}
            </span>
          </div>

          <div className="partner-overview__token-stats">
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.overview.tokens.allotted')}
              </span>
              <span className="partner-overview__stat-value">{allottedTokens}</span>
            </div>
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.overview.tokens.remaining')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--remaining">
                {remainingTokens}
              </span>
            </div>
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.overview.tokens.used')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--used">
                {usedTokens}
              </span>
            </div>
          </div>
        </article>

        <article className="partner-overview__panel partner-overview__panel--certs">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.licenses.renewalSchedule')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('dashboard.licenses.annualCycle')}
            </span>
          </div>

          <div className="partner-overview__token-stats">
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.licenses.nextRenewal')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--sm">
                {formatCalendarDate(renewalIso, language)}
              </span>
            </div>
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.licenses.billingAmount')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--sm">
                {annualLabel}
              </span>
            </div>
            <div className="partner-overview__stat">
              <span className="partner-overview__stat-label">
                {t('dashboard.licenses.licenseStatus')}
              </span>
              <span className="partner-overview__stat-value partner-overview__stat-value--sm partner-overview__stat-value--remaining">
                {t('dashboard.licenses.activeStatus')}
              </span>
            </div>
          </div>
        </article>

        <article className="partner-overview__panel partner-overview__panel--full">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.licenses.grantTier')}
            </h2>
            <span className="partner-overview__panel-badge">
              {tierB.tierLabel} · {priceLabel}/{tierB.period}
            </span>
          </div>

          <p className="partner-overview__ledger-host">
            <strong>{institutionalB2B.name}</strong>
            {' — '}
            {t('dashboard.licenses.grantTierCaption')
              .replace('{price}', annualLabel)
              .replace('{tokens}', String(allottedTokens))}
          </p>

          <ul className="partner-overview__feature-list">
            {(institutionalB2B.features || []).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );
}

function ResearchTab({ t, researchCohorts }) {
  const handleExportJson = () => {
    downloadBlob(
      'a4-alam-cohort-analytics.json',
      `${JSON.stringify({ generatedAt: new Date().toISOString(), cohorts: researchCohorts }, null, 2)}\n`,
      'application/json',
    );
  };

  const handleExportCsv = () => {
    const header = 'domain,literacyScore,frictionScore,cohortSize';
    const rows = researchCohorts.map(
      ({ domain, literacyScore, frictionScore, cohortSize }) =>
        `"${domain.replaceAll('"', '""')}",${literacyScore},${frictionScore},${cohortSize}`,
    );
    downloadBlob(
      'a4-alam-cohort-analytics.csv',
      `${[header, ...rows].join('\n')}\n`,
      'text/csv;charset=utf-8',
    );
  };

  return (
    <>
      <header className="partner-overview__header">
        <h1 id="partner-research-title" className="partner-overview__title">
          {t('dashboard.research.title')}
        </h1>
        <p className="partner-overview__subtitle">{t('dashboard.research.subtitle')}</p>
      </header>

      <div className="partner-overview__grid">
        <article className="partner-overview__panel partner-overview__panel--full">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.research.metricsTitle')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('dashboard.research.anonymizedBadge')}
            </span>
          </div>

          <div className="partner-overview__table-wrap">
            <table className="partner-overview__table">
              <thead>
                <tr>
                  <th scope="col">{t('dashboard.research.columns.domain')}</th>
                  <th scope="col">{t('dashboard.research.columns.literacy')}</th>
                  <th scope="col">{t('dashboard.research.columns.friction')}</th>
                  <th scope="col">{t('dashboard.research.columns.cohort')}</th>
                </tr>
              </thead>
              <tbody>
                {researchCohorts.map(({ domain, literacyScore, frictionScore, cohortSize }) => (
                  <tr key={domain}>
                    <td>{domain}</td>
                    <td>
                      <span className="partner-overview__literacy">{literacyScore.toFixed(1)}%</span>
                    </td>
                    <td>
                      <span className="partner-overview__friction">{frictionScore.toFixed(1)}</span>
                    </td>
                    <td>{cohortSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="partner-overview__export-row">
            <button type="button" className="partner-overview__btn" onClick={handleExportCsv}>
              {t('dashboard.research.exportCsv')}
            </button>
            <button
              type="button"
              className="partner-overview__btn partner-overview__btn--ghost"
              onClick={handleExportJson}
            >
              {t('dashboard.research.exportJson')}
            </button>
          </div>
        </article>
      </div>
    </>
  );
}

function LedgerAuditTab({ t, language, ledgerHost, feed }) {
  const [query, setQuery] = useState('');

  const filteredFeed = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return feed;
    return feed.filter(
      ({ credentialId, stateHash }) =>
        credentialId.toLowerCase().includes(needle)
        || stateHash.toLowerCase().includes(needle),
    );
  }, [feed, query]);

  return (
    <>
      <header className="partner-overview__header">
        <h1 id="partner-ledger-title" className="partner-overview__title">
          {t('dashboard.ledger.title')}
        </h1>
        <p className="partner-overview__subtitle">{t('dashboard.ledger.subtitle')}</p>
      </header>

      <div className="partner-overview__grid">
        <article className="partner-overview__panel partner-overview__panel--full">
          <div className="partner-overview__panel-heading">
            <h2 className="partner-overview__panel-title">
              {t('dashboard.ledger.feedTitle')}
            </h2>
            <span className="partner-overview__panel-badge">
              {t('infrastructure.encryptionProtocol')}
            </span>
          </div>

          <p className="partner-overview__ledger-host">
            {t('dashboard.overview.ledgerFeed.hostPrefix')}{' '}
            <strong>{ledgerHost}</strong>
          </p>

          <div className="partner-overview__toolbar">
            <label className="visually-hidden" htmlFor="ledger-audit-search">
              {t('dashboard.ledger.searchLabel')}
            </label>
            <input
              id="ledger-audit-search"
              type="search"
              className="partner-overview__search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('dashboard.ledger.searchPlaceholder')}
              autoComplete="off"
            />
            <p className="partner-overview__filter-meta">
              {t('dashboard.ledger.resultsCount').replace('{count}', String(filteredFeed.length))}
            </p>
          </div>

          {filteredFeed.length === 0 ? (
            <p className="partner-overview__empty">{t('dashboard.ledger.filterEmpty')}</p>
          ) : (
            <div className="partner-overview__table-wrap">
              <table className="partner-overview__table">
                <thead>
                  <tr>
                    <th scope="col">{t('dashboard.overview.ledgerFeed.columns.timestamp')}</th>
                    <th scope="col">{t('dashboard.overview.ledgerFeed.columns.credentialId')}</th>
                    <th scope="col">{t('dashboard.overview.ledgerFeed.columns.stateHash')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeed.map(({ timestamp, credentialId, stateHash }) => (
                    <tr key={`${credentialId}-${stateHash}`}>
                      <td>{formatLedgerTimestamp(timestamp, language)} UTC</td>
                      <td className="partner-overview__mono">{credentialId}</td>
                      <td className="partner-overview__mono">{stateHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

/**
 * High-density B2B institutional control desk — token allocation, certifications, ledger feed.
 * Sidebar tabs switch in-page views via DashboardLayout activeTab context (no route navigation).
 */
export default function PartnerOverview({
  language: languageProp,
  usedTokens = DEFAULT_PARTNER_METRICS.usedTokens,
  activeCertifications = DEFAULT_PARTNER_METRICS.activeCertifications,
  ledgerFeed = DEFAULT_PARTNER_METRICS.ledgerFeed,
  researchCohorts = DEFAULT_PARTNER_METRICS.researchCohorts,
  licenseRenewalIso = DEFAULT_PARTNER_METRICS.licenseRenewalIso,
}) {
  const { activeTab } = useDashboardTab();
  const { t, language } = usePartnerTranslator(languageProp);
  const certifications = activeCertifications ?? [];
  const feed = ledgerFeed ?? [];
  const cohorts = researchCohorts ?? [];
  const allottedTokens = SAFEAI_MASTER_CONFIG?.evaluationTiers?.institutionalB2B?.allottedTokens ?? 0;
  const institutionalB2B = SAFEAI_MASTER_CONFIG?.evaluationTiers?.institutionalB2B;
  const tierB = SAFEAI_MASTER_CONFIG?.evaluationTiers?.institutionalResearchSupport?.tierB;
  const ledgerHost = SAFEAI_MASTER_CONFIG?.infrastructure?.ledgerHost ?? '';

  const remainingTokens = Math.max(allottedTokens - usedTokens, 0);
  const utilizationPercent = allottedTokens > 0 ? Math.round((usedTokens / allottedTokens) * 100) : 0;

  const visibleCertifications = useMemo(
    () => certifications.slice(0, 8),
    [certifications],
  );

  const labelledById = {
    [DASHBOARD_TABS.OVERVIEW]: 'partner-overview-title',
    [DASHBOARD_TABS.LICENSES]: 'partner-licenses-title',
    [DASHBOARD_TABS.RESEARCH]: 'partner-research-title',
    [DASHBOARD_TABS.LEDGER]: 'partner-ledger-title',
  }[activeTab] ?? 'partner-overview-title';

  return (
    <section className="partner-overview" aria-labelledby={labelledById}>
      <style>{PARTNER_OVERVIEW_STYLES}</style>
      <style>{`
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      {activeTab === DASHBOARD_TABS.OVERVIEW && (
        <OverviewTab
          t={t}
          language={language}
          allottedTokens={allottedTokens}
          usedTokens={usedTokens}
          remainingTokens={remainingTokens}
          utilizationPercent={utilizationPercent}
          certifications={certifications}
          visibleCertifications={visibleCertifications}
          ledgerHost={ledgerHost}
          feed={feed}
        />
      )}

      {activeTab === DASHBOARD_TABS.LICENSES && institutionalB2B && tierB && (
        <LicensesTab
          t={t}
          language={language}
          institutionalB2B={institutionalB2B}
          tierB={tierB}
          allottedTokens={allottedTokens}
          usedTokens={usedTokens}
          remainingTokens={remainingTokens}
          renewalIso={licenseRenewalIso}
        />
      )}

      {activeTab === DASHBOARD_TABS.RESEARCH && (
        <ResearchTab t={t} researchCohorts={cohorts} />
      )}

      {activeTab === DASHBOARD_TABS.LEDGER && (
        <LedgerAuditTab
          t={t}
          language={language}
          ledgerHost={ledgerHost}
          feed={feed}
        />
      )}
    </section>
  );
}
