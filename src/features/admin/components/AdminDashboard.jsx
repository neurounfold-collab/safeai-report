import React, { useCallback, useMemo, useState } from 'react';
import { isRtlLanguage } from '../../../i18n/index.js';
import {
  isStripeProductionMode,
  STRIPE_PRODUCTION_STORAGE_KEY,
} from '../../../utils/stripeGateway.js';
import { DEFAULT_PARTNER_METRICS } from '../../dashboard/components/PartnerOverview.jsx';
import { resolveVerificationRecord } from '../../verify/utils/verificationRegistry.js';
import { useAdminTranslator } from '../hooks/useAdminTranslator.js';
import {
  FUNDING_INFRASTRUCTURE_USD,
  FUNDING_RESEARCH_USD,
  PASS_THRESHOLD,
  buildResearchTelemetryRows,
  computeResearchMetrics,
  filterResearchTelemetryRows,
} from '../utils/researchTelemetrySeed.js';
import TelemetryTable from './TelemetryTable.jsx';

const ADMIN_SWITCH_KEYS = {
  MAINTENANCE_LOCKOUT: 'SAFEAI_ADMIN_MAINTENANCE_LOCKOUT',
  STRIPE_PRODUCTION: 'SAFEAI_ADMIN_STRIPE_PRODUCTION',
  LEDGER_LIVE_STREAM: 'SAFEAI_ADMIN_LEDGER_LIVE_STREAM',
};

const ADMIN_SWITCH_LEGACY_KEYS = {
  [ADMIN_SWITCH_KEYS.MAINTENANCE_LOCKOUT]: ['SAFEAI_ADMIN_MAINTENANCE'],
  [ADMIN_SWITCH_KEYS.STRIPE_PRODUCTION]: ['SAFEAI_ADMIN_STRIPE_MODE'],
  [ADMIN_SWITCH_KEYS.LEDGER_LIVE_STREAM]: ['SAFEAI_ADMIN_LEDGER_BYPASS'],
};

const SYNTHETIC_FAILED_AUDITS = [
  {
    timestamp: '2026-06-11T08:31:12.000Z',
    stateHash: 'a3f5c8d2e1b9047f6a0c3d9e2b1a8f7c5d4e3b2a1f0e9d8c7b6a5f4e3d2c1b0a9',
    tier: 'Level 02',
    passed: false,
  },
  {
    timestamp: '2026-06-10T22:14:55.000Z',
    stateHash: 'b4e6d9c3f2a8158e7b1d4c0f9a8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9',
    tier: 'Level 01',
    passed: false,
  },
];

const LOCALE_COLORS = { en: '#c9a227', fr: '#5eead4', es: '#818cf8', ar: '#f472b6' };

const FILTER_DEFAULTS = {
  track: 'all',
  language: 'all',
  scoreStatus: 'all',
  partnerId: '',
};

const ADMIN_DASHBOARD_STYLES = `
.admin-dashboard {
  --ad-bg: #0a0e17;
  --ad-accent: #c9a227;
  --ad-accent-glow: rgba(201, 162, 39, 0.45);
  --ad-teal: #5eead4;
  --ad-teal-glow: rgba(94, 234, 212, 0.35);
  --ad-glass: rgba(15, 23, 42, 0.82);
  --ad-border: rgba(148, 163, 184, 0.2);
  --ad-text: #f8fafc;
  --ad-muted: #94a3b8;
  --ad-success: #22c55e;
  --ad-error: #f87171;
  flex: 1 1 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--ad-bg);
  color: var(--ad-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.admin-dashboard--authenticated {
  animation: admin-fade-in 0.65s ease forwards;
}

@keyframes admin-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.admin-dashboard__header {
  margin-bottom: 2rem;
}

.admin-dashboard__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.375rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ad-text);
}

.admin-dashboard__subtitle {
  margin: 0;
  max-width: 52rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ad-muted);
}

.admin-dashboard__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .admin-dashboard__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-dashboard__panel--research,
  .admin-dashboard__panel--audit {
    grid-column: span 2;
  }
}

.admin-panel {
  border-radius: 0.875rem;
  border: 1px solid var(--ad-border);
  background: var(--ad-glass);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  padding: 1.25rem 1.35rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.admin-panel__heading {
  margin: 0 0 1.15rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ad-accent);
}

.admin-research__filter-bar {
  position: sticky;
  top: 0;
  z-index: 12;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  margin: -1.25rem -1.35rem 1.25rem;
  border-bottom: 1px solid var(--ad-border);
  background: rgba(10, 14, 23, 0.94);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

.admin-research__filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: min(100%, 10.5rem);
  flex: 1 1 10.5rem;
}

.admin-research__filter--partner {
  flex: 2 1 14rem;
  min-width: min(100%, 14rem);
}

.admin-research__filter-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ad-muted);
}

.admin-research__select,
.admin-research__input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 0.45rem;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.38);
  color: var(--ad-text);
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.admin-research__select:focus,
.admin-research__input:focus {
  border-color: var(--ad-accent);
  box-shadow: 0 0 0 2px var(--ad-accent-glow);
}

.admin-research__scope {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  color: var(--ad-teal);
  font-variant-numeric: tabular-nums;
}

.admin-metric-matrix {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .admin-metric-matrix {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .admin-metric-matrix {
    grid-template-columns: repeat(4, 1fr);
  }
}

.admin-metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem 1.05rem;
  border-radius: 0.75rem;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.28);
  min-width: 0;
}

.admin-metric-card__title {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ad-muted);
  line-height: 1.45;
}

.admin-metric-card__value {
  margin: 0;
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--ad-teal);
  text-shadow: 0 0 18px var(--ad-teal-glow);
  line-height: 1.15;
}

.admin-metric-card__hint {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--ad-muted);
}

.admin-metric-card__locale-stack {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.admin-metric-card__locale-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-metric-card__locale-label {
  flex: 0 0 1.75rem;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--ad-muted);
  text-transform: uppercase;
}

.admin-metric-card__locale-track {
  flex: 1;
  height: 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.admin-metric-card__locale-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.35s ease;
}

.admin-metric-card__locale-pct {
  flex: 0 0 2rem;
  font-size: 0.625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ad-teal);
  text-align: end;
}

.admin-metric-card__funding-breakdown {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.55;
  color: var(--ad-muted);
}

[dir="rtl"] .admin-metric-card__locale-pct {
  text-align: start;
}

[dir="rtl"] .admin-research__filter-bar {
  flex-direction: row-reverse;
}

[dir="rtl"] .admin-metric-card__locale-row {
  flex-direction: row-reverse;
}

.admin-switchboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-switch {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.22);
}

.admin-switch__copy {
  flex: 1;
  min-width: 0;
}

.admin-switch__label {
  display: block;
  margin: 0 0 0.3rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ad-text);
}

.admin-switch__description {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--ad-muted);
}

.admin-switch__control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
}

[dir="rtl"] .admin-switch {
  flex-direction: row-reverse;
}

[dir="rtl"] .admin-switch__control {
  align-items: flex-start;
}

.admin-switch__toggle {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  border-radius: 999px;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.admin-switch__toggle--on {
  background: rgba(201, 162, 39, 0.35);
  border-color: var(--ad-accent);
  box-shadow: 0 0 14px var(--ad-accent-glow);
}

.admin-switch__toggle-knob {
  position: absolute;
  top: 0.15rem;
  inset-inline-start: 0.15rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: var(--ad-muted);
  transition: transform 0.25s ease, background 0.25s ease;
}

.admin-switch__toggle--on .admin-switch__toggle-knob {
  transform: translateX(1.25rem);
}

[dir="rtl"] .admin-switch__toggle--on .admin-switch__toggle-knob {
  transform: translateX(-1.25rem);
}

.admin-switch__state {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ad-muted);
}

.admin-switch__toggle--on + .admin-switch__state,
.admin-switch__control:has(.admin-switch__toggle--on) .admin-switch__state {
  color: var(--ad-accent);
}

.admin-audit__table-wrap {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--ad-border);
}

.admin-audit__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.admin-audit__table th {
  padding: 0.7rem 0.85rem;
  text-align: start;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ad-muted);
  background: rgba(0, 0, 0, 0.32);
  border-bottom: 1px solid var(--ad-border);
  white-space: nowrap;
}

.admin-audit__table td {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  vertical-align: middle;
}

.admin-audit__table tr:last-child td {
  border-bottom: none;
}

.admin-audit__hash {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  color: var(--ad-teal);
  word-break: break-all;
}

.admin-audit__status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.admin-audit__status--passed {
  background: rgba(34, 197, 94, 0.18);
  color: var(--ad-success);
}

.admin-audit__status--failed {
  background: rgba(248, 113, 113, 0.18);
  color: var(--ad-error);
}

.admin-audit__empty {
  margin: 0;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--ad-muted);
}
`;

function readSwitchState(key) {
  if (typeof window === 'undefined' || typeof key !== 'string' || !key.trim()) {
    return false;
  }

  try {
    const keysToInspect = [key, ...(ADMIN_SWITCH_LEGACY_KEYS[key] ?? [])];
    return keysToInspect.some((storageKey) => {
      const raw = window.localStorage.getItem(storageKey);
      return typeof raw === 'string' && raw.trim() === 'true';
    });
  } catch {
    return false;
  }
}

function writeSwitchState(key, value) {
  if (typeof window === 'undefined' || typeof key !== 'string' || !key.trim()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    /* storage unavailable */
  }
}

function writeStripeProductionMode(production) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (production) {
      window.localStorage.removeItem(STRIPE_PRODUCTION_STORAGE_KEY);
    } else {
      window.localStorage.setItem(STRIPE_PRODUCTION_STORAGE_KEY, 'false');
    }

    for (const legacyKey of ADMIN_SWITCH_LEGACY_KEYS[ADMIN_SWITCH_KEYS.STRIPE_PRODUCTION] ?? []) {
      window.localStorage.removeItem(legacyKey);
    }
  } catch {
    /* storage unavailable */
  }
}

function formatAuditTimestamp(iso) {
  if (!iso) return '—';
  return new Date(iso).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

function formatUsd(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function buildAuditRegistryRows() {
  const tierSlugToLevel = {
    level01: 'Level 01',
    level02: 'Level 02',
    level03: 'Level 03',
  };

  const ledgerFeed = DEFAULT_PARTNER_METRICS?.ledgerFeed ?? [];
  const activeCertifications = DEFAULT_PARTNER_METRICS?.activeCertifications ?? [];

  const ledgerRows = ledgerFeed.map((entry) => {
    const certification = activeCertifications.find(
      (item) => item?.credentialId === entry?.credentialId,
    );
    const tierSlug = certification?.tierKey?.match(/level0[1-3]/)?.[0];
    const tier = tierSlug ? tierSlugToLevel[tierSlug] : 'Level 01';
    const record = resolveVerificationRecord(entry?.stateHash?.toLowerCase?.() ?? '');

    return {
      timestamp: entry?.timestamp,
      stateHash: entry?.stateHash,
      tier,
      passed: Boolean(record?.verified),
    };
  });

  return [...ledgerRows, ...(SYNTHETIC_FAILED_AUDITS ?? [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );
}

function FilterControl({ id, label, children, className = '' }) {
  return (
    <div className={`admin-research__filter ${className}`.trim()}>
      <label className="admin-research__filter-label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

function MetricCard({ title, value, hint, children, hideValue = false }) {
  return (
    <article className="admin-metric-card">
      <h3 className="admin-metric-card__title">{title}</h3>
      {!hideValue && <p className="admin-metric-card__value">{value}</p>}
      {children}
      {hint && <p className="admin-metric-card__hint">{hint}</p>}
    </article>
  );
}

function ResearchTelemetryCenter({ t, rows }) {
  const [filters, setFilters] = useState(FILTER_DEFAULTS);

  const filteredRows = useMemo(
    () => filterResearchTelemetryRows(rows, filters),
    [rows, filters],
  );

  const metrics = useMemo(() => computeResearchMetrics(filteredRows), [filteredRows]);

  const updateFilter = useCallback((key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const scopeLabel = t('admin.board.research.filters.activeCount', '{count} cohort records in scope').replace(
    '{count}',
    String(metrics.totalCohorts),
  );

  return (
    <>
      <div className="admin-research__filter-bar" role="toolbar" aria-label={t('admin.board.research.filters.toolbar')}>
        <FilterControl id="admin-filter-track" label={t('admin.board.research.filters.track.label')}>
          <select
            id="admin-filter-track"
            className="admin-research__select"
            value={filters.track}
            onChange={(event) => updateFilter('track', event.target.value)}
          >
            <option value="all">{t('admin.board.research.filters.track.all')}</option>
            <option value="level01">{t('admin.board.research.filters.track.level01')}</option>
            <option value="level02">{t('admin.board.research.filters.track.level02')}</option>
            <option value="level03">{t('admin.board.research.filters.track.level03')}</option>
          </select>
        </FilterControl>

        <FilterControl id="admin-filter-language" label={t('admin.board.research.filters.language.label')}>
          <select
            id="admin-filter-language"
            className="admin-research__select"
            value={filters.language}
            onChange={(event) => updateFilter('language', event.target.value)}
          >
            <option value="all">{t('admin.board.research.filters.language.all')}</option>
            <option value="en">{t('admin.board.telemetry.sessions.en')}</option>
            <option value="fr">{t('admin.board.telemetry.sessions.fr')}</option>
            <option value="es">{t('admin.board.telemetry.sessions.es')}</option>
            <option value="ar">{t('admin.board.telemetry.sessions.ar')}</option>
          </select>
        </FilterControl>

        <FilterControl id="admin-filter-score" label={t('admin.board.research.filters.score.label')}>
          <select
            id="admin-filter-score"
            className="admin-research__select"
            value={filters.scoreStatus}
            onChange={(event) => updateFilter('scoreStatus', event.target.value)}
          >
            <option value="all">{t('admin.board.research.filters.score.all')}</option>
            <option value="pass">{t('admin.board.research.filters.score.pass')}</option>
            <option value="fail">{t('admin.board.research.filters.score.fail')}</option>
          </select>
        </FilterControl>

        <FilterControl
          id="admin-filter-partner"
          className="admin-research__filter--partner"
          label={t('admin.board.research.filters.partner.label')}
        >
          <input
            id="admin-filter-partner"
            type="text"
            className="admin-research__input"
            value={filters.partnerId}
            placeholder={t('admin.board.research.filters.partner.placeholder')}
            onChange={(event) => updateFilter('partnerId', event.target.value)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </FilterControl>
      </div>

      <p className="admin-research__scope" aria-live="polite">
        {scopeLabel}
      </p>

      <div className="admin-metric-matrix">
        <MetricCard
          title={t('admin.board.research.metrics.cohorts.title')}
          value={metrics.totalCohorts.toLocaleString()}
          hint={t('admin.board.research.metrics.cohorts.subtitle')}
        />

        <MetricCard
          title={t('admin.board.research.metrics.compliance.title')}
          value={`${metrics.meanScore.toFixed(1)}%`}
          hint={t('admin.board.research.metrics.compliance.subtitle')}
        />

        <MetricCard
          title={t('admin.board.research.metrics.linguistic.title')}
          hideValue
          hint={t('admin.board.research.metrics.linguistic.subtitle')}
        >
          <div className="admin-metric-card__locale-stack">
            {metrics.linguisticDistribution.map((entry) => (
              <div key={entry.locale} className="admin-metric-card__locale-row">
                <span className="admin-metric-card__locale-label">{entry.locale.toUpperCase()}</span>
                <div className="admin-metric-card__locale-track" aria-hidden="true">
                  <div
                    className="admin-metric-card__locale-fill"
                    style={{
                      width: `${entry.percentage}%`,
                      backgroundColor: LOCALE_COLORS[entry.locale] ?? '#64748b',
                    }}
                  />
                </div>
                <span className="admin-metric-card__locale-pct">{entry.percentage}%</span>
              </div>
            ))}
          </div>
        </MetricCard>

        <MetricCard
          title={t('admin.board.research.metrics.funding.title')}
          value={formatUsd(metrics.fundingVolume)}
          hint={t('admin.board.research.metrics.funding.subtitle')}
        >
          <p className="admin-metric-card__funding-breakdown">
            {t(
              'admin.board.research.metrics.funding.breakdown',
              '{researchCount} × {researchAmount} research · {infraCount} × {infraAmount} infrastructure',
            )
              .replace('{researchCount}', String(metrics.researchContributions))
              .replace('{researchAmount}', formatUsd(FUNDING_RESEARCH_USD))
              .replace('{infraCount}', String(metrics.infrastructureContributions))
              .replace('{infraAmount}', formatUsd(FUNDING_INFRASTRUCTURE_USD))}
          </p>
        </MetricCard>
      </div>

      <TelemetryTable t={t} filteredRows={filteredRows} allRows={rows} />
    </>
  );
}

function SystemToggle({ id, label, description, checked, onChange, stateOnLabel, stateOffLabel }) {
  return (
    <div className="admin-switch">
      <div className="admin-switch__copy">
        <span className="admin-switch__label">{label}</span>
        <p className="admin-switch__description">{description}</p>
      </div>
      <div className="admin-switch__control">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          className={checked ? 'admin-switch__toggle admin-switch__toggle--on' : 'admin-switch__toggle'}
          onClick={() => onChange(!checked)}
        >
          <span className="admin-switch__toggle-knob" />
        </button>
        <span className="admin-switch__state">{checked ? stateOnLabel : stateOffLabel}</span>
      </div>
    </div>
  );
}

/**
 * Sovereign administrative layout — research telemetry, switchboard, and audit registry.
 */
export default function AdminDashboard({ language: languageProp }) {
  const { t, language } = useAdminTranslator(languageProp);
  const rtl = isRtlLanguage(language);

  const telemetryRows = useMemo(() => buildResearchTelemetryRows(), []);
  const auditRows = useMemo(() => buildAuditRegistryRows(), []);

  const [maintenanceLockout, setMaintenanceLockout] = useState(() =>
    readSwitchState(ADMIN_SWITCH_KEYS.MAINTENANCE_LOCKOUT),
  );
  const [stripeProduction, setStripeProduction] = useState(() => isStripeProductionMode());
  const [ledgerLiveStream, setLedgerLiveStream] = useState(() =>
    readSwitchState(ADMIN_SWITCH_KEYS.LEDGER_LIVE_STREAM),
  );

  const handleMaintenanceChange = useCallback((value) => {
    setMaintenanceLockout(value);
    writeSwitchState(ADMIN_SWITCH_KEYS.MAINTENANCE_LOCKOUT, value);
  }, []);

  const handleStripeChange = useCallback((value) => {
    setStripeProduction(value);
    writeStripeProductionMode(value);
    window.dispatchEvent(new Event('safeai:stripe-gateway-change'));
  }, []);

  const handleLedgerChange = useCallback((value) => {
    setLedgerLiveStream(value);
    writeSwitchState(ADMIN_SWITCH_KEYS.LEDGER_LIVE_STREAM, value);
  }, []);

  return (
    <div
      className="admin-dashboard admin-dashboard--authenticated"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <style>{ADMIN_DASHBOARD_STYLES}</style>
      <div className="max-w-7xl mx-auto px-4 py-8 w-full">
        <header className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">{t('admin.board.header.title')}</h1>
          <p className="admin-dashboard__subtitle">{t('admin.board.header.subtitle')}</p>
        </header>

        <div className="admin-dashboard__grid">
          <section
            className="admin-panel admin-dashboard__panel--research"
            aria-labelledby="admin-panel-research"
          >
            <h2 id="admin-panel-research" className="admin-panel__heading">
              {t('admin.board.research.title')}
            </h2>
            <ResearchTelemetryCenter t={t} rows={telemetryRows} />
          </section>

          <section className="admin-panel" aria-labelledby="admin-panel-switchboard">
            <h2 id="admin-panel-switchboard" className="admin-panel__heading">
              {t('admin.board.panels.switchboard')}
            </h2>
            <div className="admin-switchboard">
              <SystemToggle
                id="admin-switch-maintenance"
                label={t('admin.board.switchboard.maintenance.label')}
                description={t('admin.board.switchboard.maintenance.description')}
                checked={maintenanceLockout}
                onChange={handleMaintenanceChange}
                stateOnLabel={t('admin.board.switchboard.stateOn')}
                stateOffLabel={t('admin.board.switchboard.stateOff')}
              />
              <SystemToggle
                id="admin-switch-stripe"
                label={t('admin.board.switchboard.stripe.label')}
                description={t('admin.board.switchboard.stripe.description')}
                checked={stripeProduction}
                onChange={handleStripeChange}
                stateOnLabel={t('admin.board.switchboard.stateOn')}
                stateOffLabel={t('admin.board.switchboard.stateOff')}
              />
              <SystemToggle
                id="admin-switch-ledger"
                label={t('admin.board.switchboard.ledger.label')}
                description={t('admin.board.switchboard.ledger.description')}
                checked={ledgerLiveStream}
                onChange={handleLedgerChange}
                stateOnLabel={t('admin.board.switchboard.stateOn')}
                stateOffLabel={t('admin.board.switchboard.stateOff')}
              />
            </div>
          </section>

          <section
            className="admin-panel admin-dashboard__panel--audit"
            aria-labelledby="admin-panel-audit"
          >
            <h2 id="admin-panel-audit" className="admin-panel__heading">
              {t('admin.board.panels.audit')}
            </h2>
            {(auditRows ?? []).length === 0 ? (
              <p className="admin-audit__empty">{t('admin.board.audit.empty')}</p>
            ) : (
              <div className="admin-audit__table-wrap">
                <table className="admin-audit__table">
                  <thead>
                    <tr>
                      <th scope="col">{t('admin.board.audit.columns.timestamp')}</th>
                      <th scope="col">{t('admin.board.audit.columns.hash')}</th>
                      <th scope="col">{t('admin.board.audit.columns.level')}</th>
                      <th scope="col">{t('admin.board.audit.columns.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(auditRows ?? []).map((row) => (
                      <tr key={`${row?.timestamp}-${row?.stateHash}`}>
                        <td>{formatAuditTimestamp(row?.timestamp)}</td>
                        <td>
                          <span className="admin-audit__hash">{row?.stateHash}</span>
                        </td>
                        <td>{row?.tier}</td>
                        <td>
                          <span
                            className={
                              row?.passed
                                ? 'admin-audit__status admin-audit__status--passed'
                                : 'admin-audit__status admin-audit__status--failed'
                            }
                          >
                            {row?.passed
                              ? t('admin.board.audit.statusPassed')
                              : t('admin.board.audit.statusFailed')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
