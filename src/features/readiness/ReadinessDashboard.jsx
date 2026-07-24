import { Component, Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SAFEAI_MASTER_CONFIG } from '../../config/constants.js';
import { createTranslator, getActiveLanguage, isRtlLanguage } from '../../i18n/index.js';
import {
  DEFAULT_DIMENSION_KEY,
  DIMENSION_KEYS,
  LIKERT_SCALE,
  OIARF_DIMENSIONS,
  SECTOR_OPTIONS,
  getDimensionByKey,
  getNextDimensionKey,
  getPreviousDimensionKey,
  normalizeDimensionParam,
} from './data/oiarfAssessment.js';
import { packageAnonymousTelemetry } from './utils/anonymousTelemetry.js';
import { computeMcdaComposite } from './utils/mcdaComposite.js';
import {
  clearPersistedSession,
  createEmptyAnswers,
  isAssessmentComplete,
  isDimensionComplete,
  loadPersistedSession,
  persistSession,
} from './utils/persistSession.js';

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
      {OIARF_DIMENSIONS.map((dimension) => {
        const complete = isDimensionComplete(answers, dimension.key);
        const active = dimension.key === activeKey;
        return (
          <li key={dimension.key}>
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
              onClick={() => onSelect(dimension.key)}
            >
              {t(dimension.nameKey)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ResultsPanel({
  t,
  overallIndex,
  dimensionScores,
  stateHash,
  sector,
  hashPending,
  hashError,
}) {
  const percent =
    typeof overallIndex === 'number' && Number.isFinite(overallIndex)
      ? (overallIndex * 100).toFixed(2)
      : null;

  return (
    <section className="readiness-results" aria-labelledby="readiness-results-title">
      <h2 id="readiness-results-title" className="readiness-results__title">
        {t('readiness.resultsTitle')}
      </h2>
      <p className="readiness-results__subtitle">{t('readiness.resultsSubtitle')}</p>

      {percent != null && (
        <p className="readiness-results__overall">
          {t('readiness.overallIndex')}{' '}
          <strong>{percent}%</strong>
        </p>
      )}

      <h3 className="readiness-page__eyebrow">{t('readiness.dimensionScores')}</h3>
      <ul className="readiness-scores">
        {OIARF_DIMENSIONS.map((dimension) => {
          const score = dimensionScores?.[dimension.key];
          const display =
            typeof score === 'number' ? `${(score * 100).toFixed(1)}%` : '—';
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
  const [completed, setCompleted] = useState(false);
  const [stateHash, setStateHash] = useState(null);
  const [overallIndex, setOverallIndex] = useState(null);
  const [dimensionScores, setDimensionScores] = useState(null);
  const [hashPending, setHashPending] = useState(false);
  const [hashError, setHashError] = useState(null);
  const [sealToken, setSealToken] = useState(0);

  useEffect(() => {
    document.title = t('page_titles.readiness');
  }, [t, language]);

  useEffect(() => {
    const persisted = loadPersistedSession();
    if (persisted) {
      setAnswers(persisted.answers);
      setSector(persisted.sector);
      setCompleted(Boolean(persisted.completed));
      setStateHash(persisted.stateHash);
      setOverallIndex(
        typeof persisted.overallIndex === 'number' ? persisted.overallIndex : null,
      );
      if (persisted.completed && persisted.answers) {
        const composite = computeMcdaComposite(persisted.answers);
        setDimensionScores(composite.dimensionScores);
        if (persisted.overallIndex == null) {
          setOverallIndex(composite.overallIndex);
        }
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const raw = searchParams.get('dimension');
    const normalized = normalizeDimensionParam(raw);
    if (normalized) return;

    const persisted = loadPersistedSession();
    const fallback = persisted?.activeDimension ?? DEFAULT_DIMENSION_KEY;
    setSearchParams({ dimension: fallback }, { replace: true });
  }, [hydrated, searchParams, setSearchParams]);

  const activeDimensionKey =
    normalizeDimensionParam(searchParams.get('dimension')) ?? DEFAULT_DIMENSION_KEY;
  const dimension = getDimensionByKey(activeDimensionKey);
  const dimensionIndex = DIMENSION_KEYS.indexOf(activeDimensionKey);
  const previousKey = getPreviousDimensionKey(activeDimensionKey);
  const nextKey = getNextDimensionKey(activeDimensionKey);
  const dimensionComplete = isDimensionComplete(answers, activeDimensionKey);
  const assessmentComplete = isAssessmentComplete(answers);

  const persistSnapshot = useCallback(
    (partial) => {
      persistSession({
        activeDimension: activeDimensionKey,
        answers,
        sector,
        completed,
        stateHash,
        overallIndex,
        ...partial,
      });
    },
    [activeDimensionKey, answers, sector, completed, stateHash, overallIndex],
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
          completed: false,
          stateHash: null,
          overallIndex: null,
        });
        return next;
      });
      setCompleted(false);
      setStateHash(null);
      setOverallIndex(null);
      setDimensionScores(null);
      setHashError(null);
    },
    [activeDimensionKey, sector],
  );

  const handleSectorChange = useCallback(
    (event) => {
      const value = event.target.value;
      const nextSector = value ? value : null;
      setSector(nextSector);
      setCompleted(false);
      setStateHash(null);
      persistSession({
        activeDimension: activeDimensionKey,
        answers,
        sector: nextSector,
        completed: false,
        stateHash: null,
        overallIndex: null,
      });
    },
    [activeDimensionKey, answers],
  );

  useEffect(() => {
    if (!hydrated || !assessmentComplete) return undefined;

    let cancelled = false;
    setHashPending(true);
    setHashError(null);

    (async () => {
      try {
        const composite = computeMcdaComposite(answers);
        const { stateHash: hash } = await packageAnonymousTelemetry(answers, sector);
        if (cancelled) return;

        setDimensionScores(composite.dimensionScores);
        setOverallIndex(composite.overallIndex);
        setStateHash(hash);
        setCompleted(true);
        persistSession({
          activeDimension: activeDimensionKey,
          answers,
          sector,
          completed: true,
          stateHash: hash,
          overallIndex: composite.overallIndex,
        });
      } catch {
        if (!cancelled) {
          setHashError('hash');
          setCompleted(true);
          const composite = computeMcdaComposite(answers);
          setDimensionScores(composite.dimensionScores);
          setOverallIndex(composite.overallIndex);
        }
      } finally {
        if (!cancelled) setHashPending(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, assessmentComplete, answers, sector, activeDimensionKey, sealToken]);

  const handleRestart = () => {
    clearPersistedSession();
    const empty = createEmptyAnswers();
    setAnswers(empty);
    setSector(null);
    setCompleted(false);
    setStateHash(null);
    setOverallIndex(null);
    setDimensionScores(null);
    setHashError(null);
    setHashPending(false);
    setSealToken((token) => token + 1);
    setSearchParams({ dimension: DEFAULT_DIMENSION_KEY }, { replace: true });
    persistSession({
      activeDimension: DEFAULT_DIMENSION_KEY,
      answers: empty,
      sector: null,
      completed: false,
      stateHash: null,
      overallIndex: null,
    });
  };

  if (!hydrated || !dimension) {
    return <ReadinessLoadingFallback t={t} />;
  }

  return (
    <div className="readiness-page" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{READINESS_STYLES}</style>

      <p className="readiness-page__eyebrow">OIARF · 2.0.0</p>
      <h1 className="readiness-page__title">{t('readiness.title')}</h1>
      <p className="readiness-page__subtitle">{t('readiness.subtitle')}</p>

      <p className="readiness-page__progress">
        {interpolate(t('readiness.progress'), {
          current: dimensionIndex + 1,
          total: DIMENSION_KEYS.length,
        })}
        <span aria-hidden="true"> · </span>
        <strong>
          {interpolate(t('readiness.progressPlain'), {
            current: dimensionIndex + 1,
            total: DIMENSION_KEYS.length,
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
          dimensionScores={dimensionScores}
          stateHash={stateHash}
          sector={sector}
          hashPending={hashPending}
          hashError={hashError}
        />
      )}
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