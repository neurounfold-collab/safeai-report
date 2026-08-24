import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SAFEAI_MASTER_CONFIG } from '../../config/constants.js';
import { LEDGER_ANCHOR_STATUS, LEDGER_TRACK } from '../../config/ledgerTracks.js';
import { streamComplianceToLedger } from '../../utils/waqfLedgerClient.js';
import {
  downloadAuditPassportJsonLd,
  printComplianceSummary,
} from '../../utils/auditPassportGenerator.js';
import { createTranslator, getActiveLanguage, isRtlLanguage } from '../../i18n/index.js';
import {
  ASSESSMENT_DIMENSION_KEYS,
  DEFAULT_ASSESSMENT_DIMENSION_KEY,
  LIKERT_SCALE,
  OIARF_DIMENSIONS,
  SECTOR_OPTIONS,
  getDimensionByKey,
  getNextDimensionKey,
  getPreviousDimensionKey,
  normalizeDimensionParam,
} from './data/oiarfAssessment.js';
import {
  ANNEX_III_USE_CASES,
  FRIA_DIMENSION,
  REGULATORY_ROLES,
  createEmptyAnnexUseCases,
  hasAnnexSelection,
  isSetupComplete,
  isValidRegulatoryRole,
} from './data/verifiaRiskEngine.js';
import { packageAnonymousTelemetry } from './utils/anonymousTelemetry.js';
import { buildAssessmentProfile } from './utils/assessmentProfile.js';
import { computeDimensionScore, computeMcdaComposite } from './utils/mcdaComposite.js';
import {
  clearPersistedSession,
  createEmptyAnswers,
  isAssessmentComplete,
  isDimensionComplete,
  loadPersistedSession,
  peekPersistedSession,
  persistSession,
} from './utils/persistSession.js';
import AuditPassportModal, { useAuditPassport } from './components/AuditPassportModal.jsx';

const LANGUAGE_STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const LEDGER_HOST =
  SAFEAI_MASTER_CONFIG?.infrastructure?.ledgerHost ??
  SAFEAI_MASTER_CONFIG?.branding?.ledgerHost ??
  'WaqfLedger.tech';

/**
 * @param {string} template
 * @param {Record<string, string | number>} vars
 */
function interpolate(template, vars) {
  if (typeof template !== 'string') return '';
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, String(value)),
    template,
  );
}

function usePageTranslator(languageProp) {
  const [language, setLanguage] = useState(() => languageProp ?? getActiveLanguage());

  useEffect(() => {
    if (languageProp) {
      setLanguage(languageProp);
      return undefined;
    }

    const syncLanguage = () => setLanguage(getActiveLanguage());
    const onStorage = (event) => {
      if (event.key === LANGUAGE_STORAGE_KEY) syncLanguage();
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

const READINESS_STYLES = `
.readiness-page {
  --rd-bg: #0b0f19;
  --rd-elevated: #111827;
  --rd-accent: #c9a227;
  --rd-teal: #5eead4;
  --rd-text: #f8fafc;
  --rd-muted: #94a3b8;
  --rd-border: rgba(148, 163, 184, 0.16);
  --rd-danger: #f87171;
  max-width: 56rem;
  margin: 0 auto;
  padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 3vw, 1.75rem) 4rem;
  color: var(--rd-text);
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.readiness-page__eyebrow {
  margin: 0 0 0.65rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--rd-teal);
}

.readiness-page__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.65rem, 4vw, 2.35rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: #fff;
}

.readiness-page__subtitle {
  margin: 0 0 1.75rem;
  max-width: 40rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--rd-muted);
}

.readiness-page__progress {
  margin: 0 0 1.25rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  color: var(--rd-muted);
}

.readiness-page__progress strong {
  color: var(--rd-accent);
  font-weight: 600;
}

.readiness-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0 0 1.75rem;
  padding: 0;
  list-style: none;
}

.readiness-nav__btn {
  appearance: none;
  border: 1px solid var(--rd-border);
  background: rgba(17, 24, 39, 0.72);
  color: var(--rd-muted);
  border-radius: 0.35rem;
  padding: 0.4rem 0.65rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease, background 160ms ease;
}

.readiness-nav__btn:hover {
  border-color: rgba(201, 162, 39, 0.45);
  color: var(--rd-text);
}

.readiness-nav__btn--active {
  border-color: rgba(201, 162, 39, 0.7);
  color: var(--rd-accent);
  background: rgba(201, 162, 39, 0.12);
}

.readiness-nav__btn--complete {
  border-color: rgba(94, 234, 212, 0.35);
  color: var(--rd-teal);
}

.readiness-panel {
  border: 1px solid var(--rd-border);
  background:
    linear-gradient(180deg, rgba(17, 24, 39, 0.92) 0%, rgba(11, 15, 25, 0.88) 100%);
  border-radius: 0.5rem;
  padding: clamp(1.1rem, 2.5vw, 1.6rem);
  margin-bottom: 1.5rem;
}

.readiness-panel__heading {
  margin: 0 0 0.4rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: #fff;
}

.readiness-panel__focus {
  margin: 0 0 1.35rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--rd-muted);
}

.readiness-question {
  margin: 0 0 1.35rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.readiness-question:last-of-type {
  border-bottom: none;
  margin-bottom: 0.5rem;
  padding-bottom: 0;
}

.readiness-question__prompt {
  margin: 0 0 0.85rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--rd-text);
}

.readiness-likert {
  display: grid;
  gap: 0.45rem;
}

@media (min-width: 640px) {
  .readiness-likert {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.readiness-likert__option {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  margin: 0;
  padding: 0.55rem 0.6rem;
  border: 1px solid var(--rd-border);
  border-radius: 0.35rem;
  background: rgba(11, 15, 25, 0.55);
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}

.readiness-likert__option:hover {
  border-color: rgba(94, 234, 212, 0.35);
}

.readiness-likert__option--selected {
  border-color: rgba(201, 162, 39, 0.65);
  background: rgba(201, 162, 39, 0.1);
}

.readiness-likert__option input {
  margin-top: 0.15rem;
  accent-color: var(--rd-accent);
}

.readiness-likert__label {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  line-height: 1.35;
  color: var(--rd-muted);
}

.readiness-likert__option--selected .readiness-likert__label {
  color: var(--rd-text);
}

.readiness-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
  margin-top: 1.25rem;
}

.readiness-btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 0.35rem;
  padding: 0.65rem 1.1rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: opacity 160ms ease, transform 120ms ease;
}

.readiness-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.readiness-btn--primary {
  background: linear-gradient(135deg, #c9a227 0%, #92710f 100%);
  color: #0b0f19;
}

.readiness-btn--ghost {
  background: transparent;
  border-color: var(--rd-border);
  color: var(--rd-text);
}

.readiness-btn--danger {
  background: transparent;
  border-color: rgba(248, 113, 113, 0.35);
  color: var(--rd-danger);
}

.readiness-hint {
  margin: 0.75rem 0 0;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  color: var(--rd-accent);
}

.readiness-sector {
  margin: 0 0 1.5rem;
}

.readiness-sector label {
  display: block;
  margin-bottom: 0.4rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rd-muted);
}

.readiness-sector select {
  width: 100%;
  max-width: 24rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.35rem;
  border: 1px solid var(--rd-border);
  background: rgba(17, 24, 39, 0.9);
  color: var(--rd-text);
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.875rem;
}

.readiness-results {
  border: 1px solid rgba(94, 234, 212, 0.28);
  background:
    radial-gradient(ellipse 70% 60% at 0% 0%, rgba(94, 234, 212, 0.08), transparent 55%),
    rgba(17, 24, 39, 0.92);
  border-radius: 0.5rem;
  padding: clamp(1.15rem, 2.5vw, 1.75rem);
}

.readiness-results__title {
  margin: 0 0 0.45rem;
  font-size: 1.35rem;
  color: #fff;
}

.readiness-results__subtitle {
  margin: 0 0 1.25rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--rd-muted);
}

.readiness-results__overall {
  margin: 0 0 1.25rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 1.05rem;
  color: var(--rd-text);
}

.readiness-results__overall strong {
  color: var(--rd-accent);
  font-size: 1.35rem;
}

.readiness-scores {
  display: grid;
  gap: 0.55rem;
  margin: 0 0 1.25rem;
  padding: 0;
  list-style: none;
}

.readiness-scores li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--rd-border);
  border-radius: 0.3rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
}

.readiness-scores span:last-child {
  color: var(--rd-teal);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.readiness-hash,
.readiness-sector-tag {
  margin: 0 0 0.65rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.72rem;
  line-height: 1.45;
  word-break: break-all;
  color: var(--rd-muted);
}

.readiness-hash strong,
.readiness-sector-tag strong {
  display: block;
  margin-bottom: 0.25rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rd-accent);
}

.readiness-ledger {
  margin: 1rem 0 0;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  color: var(--rd-teal);
}

.readiness-status {
  margin: 0.5rem 0 0;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  color: var(--rd-muted);
}

.readiness-status--error {
  color: var(--rd-danger);
}

.readiness-fallback,
.readiness-error {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 36rem;
  min-height: calc(100vh - 4.25rem);
  min-height: calc(100dvh - 4.25rem);
  margin: 0 auto;
  padding: 1.5rem;
  text-align: center;
  color: var(--rd-muted);
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.readiness-error h2 {
  margin: 0 0 0.65rem;
  color: #fff;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.readiness-error p {
  margin: 0 0 1rem;
  line-height: 1.5;
}

.readiness-segmented {
  display: grid;
  gap: 0.65rem;
  margin: 0 0 1.35rem;
}

@media (min-width: 720px) {
  .readiness-segmented {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.readiness-segmented__option {
  appearance: none;
  text-align: start;
  border: 1px solid var(--rd-border);
  border-radius: 0.4rem;
  padding: 0.85rem 0.95rem;
  background: rgba(11, 15, 25, 0.55);
  color: var(--rd-text);
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}

.readiness-segmented__option:hover {
  border-color: rgba(94, 234, 212, 0.35);
}

.readiness-segmented__option--selected {
  border-color: rgba(201, 162, 39, 0.7);
  background: rgba(201, 162, 39, 0.1);
}

.readiness-segmented__label {
  display: block;
  margin: 0 0 0.35rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--rd-text);
}

.readiness-segmented__focus {
  display: block;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--rd-muted);
}

.readiness-annex {
  margin: 0 0 1.25rem;
}

.readiness-annex__title {
  margin: 0 0 0.45rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--rd-muted);
}

.readiness-annex__hint {
  margin: 0 0 0.75rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--rd-muted);
}

.readiness-annex__list {
  display: grid;
  gap: 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.readiness-annex__item label {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--rd-border);
  border-radius: 0.35rem;
  background: rgba(11, 15, 25, 0.45);
  cursor: pointer;
  transition: border-color 160ms ease;
}

.readiness-annex__item label:hover {
  border-color: rgba(94, 234, 212, 0.35);
}

.readiness-annex__item input {
  margin-top: 0.15rem;
  accent-color: var(--rd-accent);
}

.readiness-annex__item span {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--rd-text);
}

.readiness-meta {
  margin: 0 0 0.65rem;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--rd-muted);
}

.readiness-meta strong {
  color: var(--rd-text);
  font-weight: 600;
}

.readiness-raw-score {
  margin: 0 0 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.75rem;
  color: var(--rd-teal);
  word-break: break-all;
}
`;

class ReadinessErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { t, children } = this.props;
    if (this.state.hasError) {
      return (
        <div className="readiness-error" role="alert">
          <style>{READINESS_STYLES}</style>
          <h2>{t('readiness.errorTitle')}</h2>
          <p>{t('readiness.errorBody')}</p>
          <button type="button" className="readiness-btn readiness-btn--primary" onClick={this.handleRetry}>
            {t('readiness.errorRetry')}
          </button>
        </div>
      );
    }
    return children;
  }
}

function ReadinessLoadingFallback({ t }) {
  return (
    <div className="readiness-fallback" role="status" aria-live="polite" aria-busy="true">
      <style>{READINESS_STYLES}</style>
      <p>{t('readiness.loading')}</p>
    </div>
  );
}

function DimensionNav({ t, answers, activeKey, onSelect }) {
  return (
    <ul className="readiness-nav" aria-label={t('readiness.title')}>
      {ASSESSMENT_DIMENSION_KEYS.map((dimensionKey) => {
        const dimension = getDimensionByKey(dimensionKey);
        if (!dimension) return null;
        const complete = isDimensionComplete(answers, dimensionKey);
        const active = dimensionKey === activeKey;
        return (
          <li key={dimensionKey}>
            <button
              type="button"
              className={[
                'readiness-nav__btn',
                active && 'readiness-nav__btn--active',
                complete && 'readiness-nav__btn--complete',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={active ? 'step' : undefined}
              onClick={() => onSelect(dimensionKey)}
            >
              {t(dimension.nameKey)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function SetupPanel({
  t,
  regulatoryRole,
  annexUseCases,
  onRoleChange,
  onAnnexToggle,
  onContinue,
  canContinue,
}) {
  return (
    <section className="readiness-panel" aria-labelledby="verifia-setup-title">
      <h2 id="verifia-setup-title" className="readiness-panel__heading">
        {t('readiness.verifia.setup.title')}
      </h2>
      <p className="readiness-panel__focus">{t('readiness.verifia.setup.subtitle')}</p>

      <p className="readiness-annex__title">{t('readiness.verifia.setup.roleLabel')}</p>
      <div className="readiness-segmented" role="radiogroup" aria-label={t('readiness.verifia.setup.roleLabel')}>
        {REGULATORY_ROLES.map((role) => {
          const selected = regulatoryRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={[
                'readiness-segmented__option',
                selected && 'readiness-segmented__option--selected',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onRoleChange(role.id)}
            >
              <span className="readiness-segmented__label">{t(role.labelKey)}</span>
              <span className="readiness-segmented__focus">{t(role.focusKey)}</span>
            </button>
          );
        })}
      </div>

      <div className="readiness-annex">
        <p className="readiness-annex__title">{t('readiness.verifia.annexIII.title')}</p>
        <p className="readiness-annex__hint">{t('readiness.verifia.annexIII.hint')}</p>
        <ul className="readiness-annex__list">
          {ANNEX_III_USE_CASES.map((useCase) => (
            <li key={useCase.id} className="readiness-annex__item">
              <label htmlFor={`annex-${useCase.id}`}>
                <input
                  id={`annex-${useCase.id}`}
                  type="checkbox"
                  checked={Boolean(annexUseCases[useCase.id])}
                  onChange={() => onAnnexToggle(useCase.id)}
                />
                <span>{t(useCase.labelKey)}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {!isValidRegulatoryRole(regulatoryRole) && (
        <p className="readiness-hint">{t('readiness.verifia.setup.roleRequired')}</p>
      )}
      {isValidRegulatoryRole(regulatoryRole) && !hasAnnexSelection(annexUseCases) && (
        <p className="readiness-hint">{t('readiness.verifia.setup.annexRequired')}</p>
      )}

      <div className="readiness-actions">
        <button
          type="button"
          className="readiness-btn readiness-btn--primary"
          disabled={!canContinue}
          onClick={onContinue}
        >
          {t('readiness.verifia.setup.continue')}
        </button>
      </div>
    </section>
  );
}

function exportAssessmentProfileFile(profile) {
  const blob = new Blob([JSON.stringify(profile, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `verifia-assessment-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ResultsPanel({
  t,
  overallIndex,
  overallIndexRaw,
  dimensionScores,
  dimensionScoresRaw,
  friaScore,
  stateHash,
  sector,
  regulatoryRole,
  annexUseCases,
  assessmentProfile,
  hashPending,
  hashError,
  onExportProfile,
  onPreviewPassport,
  onDownloadPassport,
  onPrintSummary,
  passportLoading,
  passportReady,
}) {
  const percent =
    typeof overallIndex === 'number' && Number.isFinite(overallIndex)
      ? (overallIndex * 100).toFixed(2)
      : null;

  const rawDisplay =
    typeof overallIndexRaw === 'number' && Number.isFinite(overallIndexRaw)
      ? overallIndexRaw
      : null;

  const roleLabel = REGULATORY_ROLES.find((role) => role.id === regulatoryRole);
  const selectedAnnex = ANNEX_III_USE_CASES.filter((item) => annexUseCases?.[item.id]);

  return (
    <section className="readiness-results" aria-labelledby="readiness-results-title">
      <h2 id="readiness-results-title" className="readiness-results__title">
        {t('readiness.resultsTitle')}
      </h2>
      <p className="readiness-results__subtitle">{t('readiness.resultsSubtitle')}</p>

      {roleLabel && (
        <p className="readiness-meta">
          <strong>{t('readiness.verifia.results.regulatoryRole')}:</strong>{' '}
          {t(roleLabel.labelKey)}
        </p>
      )}

      {selectedAnnex.length > 0 && (
        <p className="readiness-meta">
          <strong>{t('readiness.verifia.results.annexUseCases')}:</strong>{' '}
          {selectedAnnex.map((item) => t(item.labelKey)).join(' · ')}
        </p>
      )}

      {typeof friaScore === 'number' && (
        <p className="readiness-meta">
          <strong>{t('readiness.verifia.results.friaScore')}:</strong>{' '}
          {(friaScore * 100).toFixed(2)}%
        </p>
      )}

      {percent != null && (
        <p className="readiness-results__overall">
          {t('readiness.overallIndex')}{' '}
          <strong>{percent}%</strong>
        </p>
      )}

      {rawDisplay != null && (
        <p className="readiness-raw-score">
          {t('readiness.verifia.results.overallIndexRaw')}: {rawDisplay}
        </p>
      )}

      <h3 className="readiness-page__eyebrow">{t('readiness.dimensionScores')}</h3>
      <ul className="readiness-scores">
        <li>
          <span>{t(FRIA_DIMENSION.nameKey)}</span>
          <span>
            {typeof friaScore === 'number' ? `${(friaScore * 100).toFixed(2)}%` : '—'}
          </span>
        </li>
        {OIARF_DIMENSIONS.map((dimension) => {
          const score =
            dimensionScoresRaw?.[dimension.key] ?? dimensionScores?.[dimension.key];
          const display =
            typeof score === 'number'
              ? `${(score * 100).toFixed(typeof dimensionScoresRaw?.[dimension.key] === 'number' ? 4 : 1)}%`
              : '—';
          return (
            <li key={dimension.key}>
              <span>{t(dimension.nameKey)}</span>
              <span>{display}</span>
            </li>
          );
        })}
      </ul>

      <p className="readiness-hash">
        <strong>{t('readiness.stateHash')}</strong>
        {hashPending && !stateHash ? t('readiness.hashPending') : null}
        {hashError ? <span className="readiness-status readiness-status--error">{t('readiness.hashError')}</span> : null}
        {stateHash || null}
      </p>

      <p className="readiness-sector-tag">
        <strong>{t('readiness.sectorTag')}</strong>
        {sector
          ? t(
              SECTOR_OPTIONS.find((option) => option.id === sector)?.labelKey ??
                'readiness.sectors.other',
            )
          : t('readiness.sectorNone')}
      </p>

      {assessmentProfile && (
        <div className="readiness-actions">
          <button
            type="button"
            className="readiness-btn readiness-btn--primary"
            disabled={passportLoading || !passportReady}
            onClick={onDownloadPassport}
          >
            {t('readiness.verifia.passport.downloadJsonLd')}
          </button>
          <button
            type="button"
            className="readiness-btn readiness-btn--ghost"
            disabled={passportLoading || !passportReady}
            onClick={onPreviewPassport}
          >
            {t('readiness.verifia.passport.preview')}
          </button>
          <button
            type="button"
            className="readiness-btn readiness-btn--ghost"
            disabled={passportLoading || !passportReady}
            onClick={onPrintSummary}
          >
            {t('readiness.verifia.passport.printSummary')}
          </button>
          <button
            type="button"
            className="readiness-btn readiness-btn--ghost"
            onClick={() => onExportProfile(assessmentProfile)}
          >
            {t('readiness.verifia.results.exportProfile')}
          </button>
        </div>
      )}

      <p className="readiness-ledger">
        {interpolate(t('readiness.ledgerCaption'), { host: LEDGER_HOST })}
      </p>
    </section>
  );
}

function ReadinessDashboardInner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = usePageTranslator();
  const rtl = isRtlLanguage(language);

  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState(() => createEmptyAnswers());
  const [sector, setSector] = useState(null);
  const [regulatoryRole, setRegulatoryRole] = useState(null);
  const [annexUseCases, setAnnexUseCases] = useState(() => createEmptyAnnexUseCases());
  const [setupComplete, setSetupComplete] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stateHash, setStateHash] = useState(null);
  const [overallIndex, setOverallIndex] = useState(null);
  const [overallIndexRaw, setOverallIndexRaw] = useState(null);
  const [dimensionScores, setDimensionScores] = useState(null);
  const [dimensionScoresRaw, setDimensionScoresRaw] = useState(null);
  const [friaScore, setFriaScore] = useState(null);
  const [assessmentProfile, setAssessmentProfile] = useState(null);
  const [hashPending, setHashPending] = useState(false);
  const [hashError, setHashError] = useState(null);
  const [sealToken, setSealToken] = useState(0);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [ledgerAnchored, setLedgerAnchored] = useState(false);
  const postedHashRef = useRef(null);

  const { passport: auditPassport, loading: passportLoading } = useAuditPassport(
    assessmentProfile?.stateHash ? assessmentProfile : null,
  );

  useEffect(() => {
    document.title = t('page_titles.readiness');
  }, [t, language]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const persisted = await loadPersistedSession();
      if (cancelled) return;

      if (persisted) {
        setAnswers(persisted.answers);
        setSector(persisted.sector);
        setRegulatoryRole(persisted.regulatoryRole ?? null);
        setAnnexUseCases(persisted.annexUseCases ?? createEmptyAnnexUseCases());
        setSetupComplete(Boolean(persisted.setupComplete));
        setCompleted(Boolean(persisted.completed));
        setStateHash(persisted.stateHash);
        setLedgerAnchored(Boolean(persisted.ledgerAnchored));
        setOverallIndex(
          typeof persisted.overallIndex === 'number' ? persisted.overallIndex : null,
        );
        setOverallIndexRaw(
          typeof persisted.overallIndexRaw === 'number'
            ? persisted.overallIndexRaw
            : persisted.overallIndex,
        );
        setDimensionScoresRaw(persisted.dimensionScoresRaw ?? null);
        setAssessmentProfile(persisted.assessmentProfile ?? null);
        if (persisted.stateHash && persisted.ledgerAnchored) {
          postedHashRef.current = persisted.stateHash;
        }
        if (persisted.completed && persisted.answers) {
          const composite = computeMcdaComposite(persisted.answers);
          const compositeRaw = computeMcdaComposite(persisted.answers, { unrounded: true });
          setDimensionScores(composite.dimensionScores);
          setDimensionScoresRaw(
            persisted.dimensionScoresRaw ?? compositeRaw.dimensionScores,
          );
          setFriaScore(computeDimensionScore(persisted.answers, FRIA_DIMENSION));
          if (persisted.overallIndex == null) {
            setOverallIndex(composite.overallIndex);
          }
          if (persisted.overallIndexRaw == null) {
            setOverallIndexRaw(compositeRaw.overallIndex);
          }
        }
      }
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !setupComplete) return;

    const raw = searchParams.get('dimension');
    const normalized = normalizeDimensionParam(raw);
    if (normalized) return;

    const persisted = peekPersistedSession();
    const fallback = persisted?.activeDimension ?? DEFAULT_ASSESSMENT_DIMENSION_KEY;
    setSearchParams({ dimension: fallback }, { replace: true });
  }, [hydrated, setupComplete, searchParams, setSearchParams]);

  const activeDimensionKey = setupComplete
    ? normalizeDimensionParam(searchParams.get('dimension')) ??
      DEFAULT_ASSESSMENT_DIMENSION_KEY
    : DEFAULT_ASSESSMENT_DIMENSION_KEY;
  const dimension = setupComplete ? getDimensionByKey(activeDimensionKey) : null;
  const dimensionIndex = ASSESSMENT_DIMENSION_KEYS.indexOf(activeDimensionKey);
  const previousKey = setupComplete ? getPreviousDimensionKey(activeDimensionKey) : null;
  const nextKey = setupComplete ? getNextDimensionKey(activeDimensionKey) : null;
  const dimensionComplete =
    setupComplete && dimension
      ? isDimensionComplete(answers, activeDimensionKey)
      : false;
  const assessmentComplete = setupComplete && isAssessmentComplete(answers);
  const setupReady = isSetupComplete(regulatoryRole, annexUseCases);

  const persistSnapshot = useCallback(
    (partial) => {
      persistSession({
        activeDimension: activeDimensionKey,
        answers,
        sector,
        regulatoryRole,
        annexUseCases,
        setupComplete,
        completed,
        stateHash,
        overallIndex,
        overallIndexRaw,
        dimensionScoresRaw,
        assessmentProfile,
        ledgerAnchored,
        sealedAt: assessmentProfile?.sealedAt ?? null,
        ...partial,
      });
    },
    [
      activeDimensionKey,
      answers,
      sector,
      regulatoryRole,
      annexUseCases,
      setupComplete,
      completed,
      stateHash,
      overallIndex,
      overallIndexRaw,
      dimensionScoresRaw,
      assessmentProfile,
      ledgerAnchored,
    ],
  );

  const goToDimension = useCallback(
    (key) => {
      const normalized = normalizeDimensionParam(key) ?? key;
      if (!getDimensionByKey(normalized)) return;
      setSearchParams({ dimension: normalized });
      persistSnapshot({ activeDimension: normalized });
    },
    [persistSnapshot, setSearchParams],
  );

  const handleAnswer = useCallback(
    (questionId, value) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionId]: value };
        persistSession({
          activeDimension: activeDimensionKey,
          answers: next,
          sector,
          regulatoryRole,
          annexUseCases,
          setupComplete,
          completed: false,
          stateHash: null,
          overallIndex: null,
          overallIndexRaw: null,
          dimensionScoresRaw: null,
          assessmentProfile: null,
          ledgerAnchored: false,
        });
        return next;
      });
      setCompleted(false);
      setStateHash(null);
      setLedgerAnchored(false);
      postedHashRef.current = null;
      setOverallIndex(null);
      setOverallIndexRaw(null);
      setDimensionScores(null);
      setDimensionScoresRaw(null);
      setFriaScore(null);
      setAssessmentProfile(null);
      setHashError(null);
    },
    [activeDimensionKey, sector, regulatoryRole, annexUseCases, setupComplete],
  );

  const handleSectorChange = useCallback(
    (event) => {
      const value = event.target.value;
      const nextSector = value ? value : null;
      setSector(nextSector);
      setCompleted(false);
      setStateHash(null);
      setLedgerAnchored(false);
      postedHashRef.current = null;
      setAssessmentProfile(null);
      persistSession({
        activeDimension: activeDimensionKey,
        answers,
        sector: nextSector,
        regulatoryRole,
        annexUseCases,
        setupComplete,
        completed: false,
        stateHash: null,
        overallIndex: null,
        overallIndexRaw: null,
        dimensionScoresRaw: null,
        assessmentProfile: null,
        ledgerAnchored: false,
      });
    },
    [activeDimensionKey, answers, regulatoryRole, annexUseCases, setupComplete],
  );

  const handleRoleChange = useCallback(
    (roleId) => {
      setRegulatoryRole(roleId);
      setCompleted(false);
      setStateHash(null);
      setLedgerAnchored(false);
      postedHashRef.current = null;
      setAssessmentProfile(null);
      persistSnapshot({
        regulatoryRole: roleId,
        completed: false,
        stateHash: null,
        overallIndex: null,
        overallIndexRaw: null,
        dimensionScoresRaw: null,
        assessmentProfile: null,
        ledgerAnchored: false,
      });
    },
    [persistSnapshot],
  );

  const handleAnnexToggle = useCallback(
    (useCaseId) => {
      setAnnexUseCases((prev) => {
        const next = { ...prev, [useCaseId]: !prev[useCaseId] };
        persistSnapshot({
          annexUseCases: next,
          completed: false,
          stateHash: null,
          overallIndex: null,
          overallIndexRaw: null,
          dimensionScoresRaw: null,
          assessmentProfile: null,
          ledgerAnchored: false,
        });
        return next;
      });
      setCompleted(false);
      setStateHash(null);
      setLedgerAnchored(false);
      postedHashRef.current = null;
      setAssessmentProfile(null);
    },
    [persistSnapshot],
  );

  const handleSetupContinue = useCallback(() => {
    if (!setupReady) return;
    setSetupComplete(true);
    setSearchParams({ dimension: DEFAULT_ASSESSMENT_DIMENSION_KEY }, { replace: true });
    persistSnapshot({
      setupComplete: true,
      activeDimension: DEFAULT_ASSESSMENT_DIMENSION_KEY,
    });
  }, [setupReady, persistSnapshot, setSearchParams]);

  useEffect(() => {
    if (!hydrated || !setupComplete || !assessmentComplete) return undefined;

    let cancelled = false;
    setHashPending(true);
    setHashError(null);

    (async () => {
      try {
        const composite = computeMcdaComposite(answers);
        const compositeRaw = computeMcdaComposite(answers, { unrounded: true });
        const fria = computeDimensionScore(answers, FRIA_DIMENSION);
        const { stateHash: hash } = await packageAnonymousTelemetry(answers, {
          sector,
          regulatoryRole,
          annexUseCases,
        });

        if (cancelled) return;

        if (postedHashRef.current === hash) {
          setHashPending(false);
          return;
        }

        const annexIIISection3 = Object.keys(annexUseCases ?? {})
          .filter((id) => annexUseCases[id] === true)
          .sort();

        const ledgerResult = await streamComplianceToLedger({
          hash,
          trackType: LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS,
          score: Math.round(compositeRaw.overallIndexPercent),
          timestamp: new Date().toISOString(),
          regulatoryRole,
          annexIIISection3,
          tierId: 'oiarf_readiness',
        });

        if (cancelled) return;

        const anchored = ledgerResult?.anchored === true;
        if (anchored) {
          postedHashRef.current = hash;
        }

        const profile = buildAssessmentProfile({
          answers,
          sector,
          regulatoryRole,
          annexUseCases,
          stateHash: hash,
          ledgerAnchored: anchored,
          ledgerStatus: anchored
            ? LEDGER_ANCHOR_STATUS.ANCHORED
            : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
        });

        setDimensionScores(composite.dimensionScores);
        setDimensionScoresRaw(compositeRaw.dimensionScores);
        setFriaScore(fria);
        setOverallIndex(composite.overallIndex);
        setOverallIndexRaw(compositeRaw.overallIndex);
        setStateHash(hash);
        setLedgerAnchored(anchored);
        setAssessmentProfile(profile);
        setCompleted(true);
        persistSession({
          activeDimension: activeDimensionKey,
          answers,
          sector,
          regulatoryRole,
          annexUseCases,
          setupComplete: true,
          completed: true,
          stateHash: hash,
          overallIndex: composite.overallIndex,
          overallIndexRaw: compositeRaw.overallIndex,
          dimensionScoresRaw: compositeRaw.dimensionScores,
          assessmentProfile: profile,
          ledgerAnchored: anchored,
          ledgerStatus: profile.ledgerStatus,
          sealedAt: profile.sealedAt,
        });
      } catch {
        if (!cancelled) {
          setHashError('hash');
          setCompleted(true);
          const composite = computeMcdaComposite(answers);
          const compositeRaw = computeMcdaComposite(answers, { unrounded: true });
          setDimensionScores(composite.dimensionScores);
          setDimensionScoresRaw(compositeRaw.dimensionScores);
          setFriaScore(computeDimensionScore(answers, FRIA_DIMENSION));
          setOverallIndex(composite.overallIndex);
          setOverallIndexRaw(compositeRaw.overallIndex);
          setLedgerAnchored(false);
          setAssessmentProfile(
            buildAssessmentProfile({
              answers,
              sector,
              regulatoryRole,
              annexUseCases,
              ledgerAnchored: false,
              ledgerStatus: LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK,
            }),
          );
        }
      } finally {
        if (!cancelled) setHashPending(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    hydrated,
    setupComplete,
    assessmentComplete,
    answers,
    sector,
    regulatoryRole,
    annexUseCases,
    activeDimensionKey,
    sealToken,
  ]);

  const handleDownloadPassport = useCallback(() => {
    if (!auditPassport) return;
    downloadAuditPassportJsonLd(auditPassport);
  }, [auditPassport]);

  const handlePrintSummary = useCallback(() => {
    if (!auditPassport) return;
    printComplianceSummary(auditPassport, {
      title: t('readiness.verifia.passport.printTitle'),
      subtitle: t('readiness.verifia.passport.printSubtitle'),
    });
  }, [auditPassport, t]);

  const handleRestart = () => {
    clearPersistedSession();
    const empty = createEmptyAnswers();
    setAnswers(empty);
    setSector(null);
    setRegulatoryRole(null);
    setAnnexUseCases(createEmptyAnnexUseCases());
    setSetupComplete(false);
    setCompleted(false);
    setStateHash(null);
    setOverallIndex(null);
    setOverallIndexRaw(null);
    setDimensionScores(null);
    setDimensionScoresRaw(null);
    setFriaScore(null);
    setAssessmentProfile(null);
    setPassportModalOpen(false);
    setHashError(null);
    setHashPending(false);
    setLedgerAnchored(false);
    postedHashRef.current = null;
    setSealToken((token) => token + 1);
    setSearchParams({}, { replace: true });
    persistSession({
      activeDimension: DEFAULT_ASSESSMENT_DIMENSION_KEY,
      answers: empty,
      sector: null,
      regulatoryRole: null,
      annexUseCases: createEmptyAnnexUseCases(),
      setupComplete: false,
      completed: false,
      stateHash: null,
      overallIndex: null,
      overallIndexRaw: null,
      dimensionScoresRaw: null,
      assessmentProfile: null,
      ledgerAnchored: false,
    });
  };

  if (!hydrated) {
    return <ReadinessLoadingFallback t={t} />;
  }

  if (!setupComplete) {
    return (
      <div className="readiness-page" dir={rtl ? 'rtl' : 'ltr'}>
        <style>{READINESS_STYLES}</style>

        <p className="readiness-page__eyebrow">VerifIA · Risk Engine</p>
        <h1 className="readiness-page__title">{t('readiness.title')}</h1>
        <p className="readiness-page__subtitle">{t('readiness.subtitle')}</p>

        <SetupPanel
          t={t}
          regulatoryRole={regulatoryRole}
          annexUseCases={annexUseCases}
          onRoleChange={handleRoleChange}
          onAnnexToggle={handleAnnexToggle}
          onContinue={handleSetupContinue}
          canContinue={setupReady}
        />

        <div className="readiness-actions">
          <button
            type="button"
            className="readiness-btn readiness-btn--danger"
            onClick={handleRestart}
          >
            {t('readiness.restart')}
          </button>
        </div>
      </div>
    );
  }

  if (!dimension) {
    return <ReadinessLoadingFallback t={t} />;
  }

  return (
    <div className="readiness-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{READINESS_STYLES}</style>

      <p className="readiness-page__eyebrow">VerifIA · Risk Engine</p>
      <h1 className="readiness-page__title">{t('readiness.title')}</h1>
      <p className="readiness-page__subtitle">{t('readiness.subtitle')}</p>

      <p className="readiness-page__progress">
        {interpolate(t('readiness.progress'), {
          current: dimensionIndex + 1,
          total: ASSESSMENT_DIMENSION_KEYS.length,
        })}
        <span aria-hidden="true"> · </span>
        <strong>
          {interpolate(t('readiness.progressPlain'), {
            current: dimensionIndex + 1,
            total: ASSESSMENT_DIMENSION_KEYS.length,
          })}
        </strong>
      </p>

      <div className="readiness-sector">
        <label htmlFor="readiness-sector">{t('readiness.sectorLabel')}</label>
        <select
          id="readiness-sector"
          value={sector ?? ''}
          onChange={handleSectorChange}
        >
          <option value="">{t('readiness.sectorPlaceholder')}</option>
          {SECTOR_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {t(option.labelKey)}
            </option>
          ))}
        </select>
      </div>

      <DimensionNav
        t={t}
        answers={answers}
        activeKey={activeDimensionKey}
        onSelect={goToDimension}
      />

      <section className="readiness-panel" aria-labelledby={`dim-${dimension.key}`}>
        <h2 id={`dim-${dimension.key}`} className="readiness-panel__heading">
          {t(dimension.nameKey)}
        </h2>
        <p className="readiness-panel__focus">{t(dimension.focusKey)}</p>

        {dimension.questions.map((question) => {
          const selected = answers[question.id];
          const prompt = t(question.promptKey);
          return (
            <fieldset key={question.id} className="readiness-question">
              <legend className="readiness-question__prompt">{prompt}</legend>
              <div className="readiness-likert" role="radiogroup" aria-label={prompt}>
                {LIKERT_SCALE.map((item) => {
                  const isSelected = selected === item.value;
                  return (
                    <label
                      key={item.value}
                      className={[
                        'readiness-likert__option',
                        isSelected && 'readiness-likert__option--selected',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={item.value}
                        checked={isSelected}
                        onChange={() => handleAnswer(question.id, item.value)}
                      />
                      <span className="readiness-likert__label">
                        {item.value}. {t(item.labelKey)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {!dimensionComplete && (
          <p className="readiness-hint">{t('readiness.incompleteHint')}</p>
        )}

        <div className="readiness-actions">
          <button
            type="button"
            className="readiness-btn readiness-btn--ghost"
            disabled={!previousKey}
            onClick={() => previousKey && goToDimension(previousKey)}
          >
            {t('readiness.previous')}
          </button>

          {nextKey ? (
            <button
              type="button"
              className="readiness-btn readiness-btn--primary"
              disabled={!dimensionComplete}
              onClick={() => goToDimension(nextKey)}
            >
              {dimensionComplete ? t('readiness.next') : t('readiness.completeDimension')}
            </button>
          ) : (
            <button
              type="button"
              className="readiness-btn readiness-btn--primary"
              disabled={!assessmentComplete}
              onClick={() => setSealToken((token) => token + 1)}
            >
              {t('readiness.finish')}
            </button>
          )}

          <button
            type="button"
            className="readiness-btn readiness-btn--danger"
            onClick={handleRestart}
          >
            {t('readiness.restart')}
          </button>
        </div>
      </section>

      {(assessmentComplete || completed) && (
        <ResultsPanel
          t={t}
          overallIndex={overallIndex}
          overallIndexRaw={overallIndexRaw}
          dimensionScores={dimensionScores}
          dimensionScoresRaw={dimensionScoresRaw}
          friaScore={friaScore}
          stateHash={stateHash}
          sector={sector}
          regulatoryRole={regulatoryRole}
          annexUseCases={annexUseCases}
          assessmentProfile={assessmentProfile}
          hashPending={hashPending}
          hashError={hashError}
          onExportProfile={exportAssessmentProfileFile}
          onPreviewPassport={() => setPassportModalOpen(true)}
          onDownloadPassport={handleDownloadPassport}
          onPrintSummary={handlePrintSummary}
          passportLoading={passportLoading}
          passportReady={Boolean(auditPassport)}
        />
      )}

      <AuditPassportModal
        open={passportModalOpen}
        onClose={() => setPassportModalOpen(false)}
        assessmentProfile={assessmentProfile}
        t={t}
      />
    </div>
  );
}

function ReadinessSuspenseBridge() {
  const { t } = usePageTranslator();
  return (
    <Suspense fallback={<ReadinessLoadingFallback t={t} />}>
      <ReadinessDashboardInner />
    </Suspense>
  );
}

export default function ReadinessDashboard() {
  const { t } = usePageTranslator();
  return (
    <ReadinessErrorBoundary t={t}>
      <ReadinessSuspenseBridge />
    </ReadinessErrorBoundary>
  );
}