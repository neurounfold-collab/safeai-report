import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTranslator, getActiveLanguage, isRtlLanguage } from '../../i18n/index.js';
import { getDomainContext, submitIntakeForm } from '../../utils/emailRouter.js';

const INTAKE_FLAG_EXECUTIVE_BRIEFING = 'EXECUTIVE_BRIEFING';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const HOME_STYLES = `
.home-view {
  --home-bg: #0b0f19;
  --home-accent: #c9a227;
  --home-accent-teal: #5eead4;
  --home-border: rgba(148, 163, 184, 0.18);
  --home-text: #f8fafc;
  --home-muted: #94a3b8;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 70% 50% at 10% 15%, rgba(94, 234, 212, 0.08), transparent 55%),
    radial-gradient(ellipse 55% 40% at 90% 85%, rgba(201, 162, 39, 0.07), transparent 50%),
    var(--home-bg);
  color: var(--home-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.home-view__inner {
  flex: 1 1 auto;
  width: min(100%, 56rem);
  margin: 0 auto;
  padding: clamp(1.75rem, 4vw, 3.5rem) clamp(1rem, 3vw, 2rem);
  min-width: 0;
}

.home-view__hero {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  min-width: 0;
}

.home-view__hero-content {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.home-view__citation-lead {
  margin: 0;
  font-size: clamp(0.875rem, 1.7vw, 1rem);
  font-weight: 500;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(248, 250, 252, 0.92);
}

.home-view__headline {
  margin: 0;
  font-size: clamp(1.75rem, 4.2vw, 2.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.35;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-text);
}

.home-view__subheadline {
  margin: 0;
  font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-muted);
}

.home-view__open-access {
  margin: 0;
  font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(94, 234, 212, 0.88);
}

.home-view__profile {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
  padding: 1.15rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--home-border);
  background: rgba(15, 23, 42, 0.42);
  border-inline-start: 3px solid var(--home-accent);
}

.home-view__profile-label {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--home-accent);
}

.home-view__profile-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--home-text);
}

.home-view__profile-institution {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-muted);
}

.home-view__cta-row {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.home-view__cta-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.85rem;
  min-width: 0;
}

@media (min-width: 640px) {
  .home-view__cta-split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.home-view__cta-glass {
  display: inline-flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  text-align: center;
  font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 300ms ease, background-color 300ms ease, color 300ms ease, box-shadow 300ms ease;
  cursor: pointer;
}

.home-view__cta-glass--diagnostic {
  border: 1px solid rgba(94, 234, 212, 0.3);
  background: rgba(2, 6, 23, 0.78);
  color: #5eead4;
  box-shadow:
    inset 0 1px 0 rgba(94, 234, 212, 0.12),
    0 8px 32px rgba(94, 234, 212, 0.1);
}

.home-view__cta-glass--diagnostic:hover {
  border-color: rgba(94, 234, 212, 0.5);
  background: rgba(15, 23, 42, 0.9);
  color: #99f6e4;
}

.home-view__cta-glass--executive {
  border: 1px solid rgba(201, 162, 39, 0.32);
  background: rgba(2, 6, 23, 0.78);
  color: #e2c66d;
  box-shadow:
    inset 0 1px 0 rgba(201, 162, 39, 0.14),
    0 8px 32px rgba(201, 162, 39, 0.08);
}

.home-view__cta-glass--executive:hover {
  border-color: rgba(201, 162, 39, 0.52);
  background: rgba(15, 23, 42, 0.9);
  color: #f0d78c;
}

.home-view__intake {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 0.875rem;
  border: 1px solid var(--home-border);
  background: rgba(15, 23, 42, 0.42);
}

.home-view__intake--highlighted {
  border-color: rgba(201, 162, 39, 0.45);
  box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.18), 0 12px 40px rgba(201, 162, 39, 0.08);
  animation: home-view-intake-pulse 1.6s ease-in-out 2;
}

@keyframes home-view-intake-pulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.18), 0 12px 40px rgba(201, 162, 39, 0.08); }
  50% { box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.32), 0 16px 48px rgba(201, 162, 39, 0.14); }
}

.home-view__intake-title {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 700;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-text);
}

.home-view__intake-hint {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(226, 198, 109, 0.92);
}

.home-view__intake-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.home-view__intake-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.home-view__intake-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--home-muted);
}

.home-view__intake-input,
.home-view__intake-textarea {
  width: 100%;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid var(--home-border);
  background: rgba(11, 15, 25, 0.65);
  color: var(--home-text);
  font-size: 0.875rem;
  line-height: 1.5;
}

.home-view__intake-textarea {
  min-height: 6rem;
  resize: vertical;
}

.home-view__intake-input:focus,
.home-view__intake-textarea:focus {
  outline: none;
  border-color: rgba(201, 162, 39, 0.45);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.12);
}

.home-view__intake-submit {
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #c9a227 0%, #92710f 100%);
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.home-view__intake-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(201, 162, 39, 0.22);
}

.home-view__intake-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.home-view__intake-success {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(120, 90, 10, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #e2c66d;
}

.home-view__intake-error {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #fca5a5;
}

.home-view__ledger-badge {
  margin: 0;
  min-width: 0;
  font-size: clamp(0.6875rem, 1.4vw, 0.75rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.6;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.82);
}

.home-view__framework {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding-top: 0.5rem;
}

.home-view__framework-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--home-accent-teal);
}

.home-view__section-title {
  margin: 0 0 clamp(1rem, 2.5vw, 1.35rem);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-accent-teal);
}

.home-view__framework-description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.92);
}

.home-view__process {
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(1.75rem, 3vw, 2.25rem);
  border-top: 1px solid var(--home-border);
  min-width: 0;
}

.home-view__process-track {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.25rem);
  min-width: 0;
}

.home-view__process-step {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  padding: 1rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--home-border);
  background: rgba(15, 23, 42, 0.38);
  text-align: center;
}

.home-view__process-step-label {
  margin: 0;
  font-size: clamp(0.75rem, 1.5vw, 0.8125rem);
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  letter-spacing: 0.01em;
  color: var(--home-text);
}

.home-view__process-arrow {
  flex-shrink: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--home-accent);
  opacity: 0.75;
  user-select: none;
}

@media (max-width: 960px) {
  .home-view__process-track {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .home-view__process-arrow {
    display: none;
  }
}

.home-view__collaboration {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(1.75rem, 3vw, 2.25rem);
  border-top: 1px solid var(--home-border);
  min-width: 0;
}
`;

function useHomeTranslator(languageProp) {
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

  const { t } = createTranslator(language);
  return { t, language };
}

/**
 * Institutional homepage — centered prestige hero with open-access academy routing.
 */
export default function HomeView({ language: languageProp }) {
  const { t, language } = useHomeTranslator(languageProp);
  const rtl = isRtlLanguage(language);

  const intakeFormRef = useRef(null);
  const [intakeFlag, setIntakeFlag] = useState(null);
  const [intakeHighlighted, setIntakeHighlighted] = useState(false);
  const [intakeEmail, setIntakeEmail] = useState('');
  const [intakeMessage, setIntakeMessage] = useState('');
  const [intakeSubmitted, setIntakeSubmitted] = useState(false);
  const [intakeSubmitting, setIntakeSubmitting] = useState(false);
  const [intakeSubmitError, setIntakeSubmitError] = useState('');

  useEffect(() => {
    document.title = t('page_titles.home');
  }, [t]);

  const focusExecutiveBriefing = useCallback(() => {
    setIntakeFlag(INTAKE_FLAG_EXECUTIVE_BRIEFING);
    setIntakeHighlighted(true);

    requestAnimationFrame(() => {
      intakeFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, []);

  const intakeFormReady =
    intakeEmail.trim().length > 0 && intakeMessage.trim().length > 0;

  const handleIntakeSubmit = async (event) => {
    event.preventDefault();
    if (!intakeFormReady || intakeSubmitting) return;

    setIntakeSubmitting(true);
    setIntakeSubmitError('');

    try {
      await submitIntakeForm({
        institutionName: 'Executive Briefing — Access Registry',
        contactPerson: intakeEmail.trim(),
        selectedTier: intakeFlag ?? INTAKE_FLAG_EXECUTIVE_BRIEFING,
        domainContext: getDomainContext(),
        additionalFields: {
          email: intakeEmail.trim(),
          message: intakeMessage.trim(),
          intake_flag: intakeFlag ?? INTAKE_FLAG_EXECUTIVE_BRIEFING,
          form_source: 'home_executive_briefing_intake',
        },
      });
      setIntakeSubmitted(true);
    } catch {
      setIntakeSubmitError(t('landing.intake.error'));
    } finally {
      setIntakeSubmitting(false);
    }
  };

  const processSteps = [
    t('landing.process.step1'),
    t('landing.process.step2'),
    t('landing.process.step3'),
  ];

  return (
    <main className="home-view" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{HOME_STYLES}</style>

      <div className="home-view__inner">
        <header className="home-view__hero" aria-label={t('landing.hero.headline')}>
          <div className="home-view__hero-content">
            <p className="home-view__citation-lead break-words leading-[1.7]">
              {t('landing.hero.citationLead')}
            </p>
            <h1 className="home-view__headline break-words leading-[1.7]">
              {t('landing.hero.headline')}
            </h1>
            <p className="home-view__subheadline break-words leading-[1.7]">
              {t('landing.hero.subheadline')}
            </p>
            <p className="home-view__open-access break-words leading-[1.7]">
              {t('landing.hero.universalOpenAccess')}
            </p>
          </div>

          <aside className="home-view__profile" aria-label={t('branding.authority')}>
            <p className="home-view__profile-label">{t('branding.standardName')}</p>
            <p className="home-view__profile-name break-words leading-[1.7]">
              {t('branding.authority')}
            </p>
            <p className="home-view__profile-institution break-words leading-[1.7]">
              {t('legalAnchors.academicInstitution')} · {t('infrastructure.targetFramework')}
            </p>
          </aside>

          <div className="home-view__cta-row">
            <div className="home-view__cta-split">
              <Link
                to="/academy"
                className="home-view__cta-glass home-view__cta-glass--diagnostic"
              >
                <span className="min-w-0 break-words leading-[1.7]">
                  {t('landing.hero.diagnosticDashboardCta')}
                </span>
              </Link>

              <button
                type="button"
                className="home-view__cta-glass home-view__cta-glass--executive"
                onClick={focusExecutiveBriefing}
              >
                <span className="min-w-0 break-words leading-[1.7]">
                  {t('landing.hero.executiveBriefingCta')}
                </span>
              </button>
            </div>

            <p className="home-view__ledger-badge break-words leading-[1.7]">
              {t('landing.waqfLedgerBadge')}
            </p>
          </div>

          <section
            className="home-view__framework"
            aria-labelledby="home-framework-title"
          >
            <h2 id="home-framework-title" className="home-view__framework-title break-words leading-[1.7]">
              {t('landing.framework.title')}
            </h2>
            <p className="home-view__framework-description break-words leading-[1.7]">
              {t('landing.framework.description')}
            </p>
          </section>
        </header>

        <section
          className="home-view__process"
          aria-labelledby="home-process-title"
        >
          <h2 id="home-process-title" className="home-view__section-title break-words leading-[1.7]">
            {t('landing.process.sectionTitle')}
          </h2>
          <div className="home-view__process-track" role="list">
            {(processSteps || []).map((label, index) => (
              <React.Fragment key={label}>
                {index > 0 && (
                  <span className="home-view__process-arrow" aria-hidden="true">
                    ➔
                  </span>
                )}
                <article className="home-view__process-step" role="listitem">
                  <h3 className="home-view__process-step-label break-words leading-[1.7]">
                    {label}
                  </h3>
                </article>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section
          className="home-view__collaboration"
          aria-labelledby="home-collaboration-title"
        >
          <article className="flex w-full min-w-0 max-w-2xl flex-col items-center gap-5 rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center backdrop-blur-md sm:p-8">
            <h2
              id="home-collaboration-title"
              className="m-0 w-full min-w-0 break-words text-lg font-bold leading-[1.7] tracking-tight text-slate-100 sm:text-xl"
            >
              {t('landing.collaboration.title')}
            </h2>
            <p className="m-0 w-full min-w-0 break-words text-sm leading-[1.7] text-slate-400 sm:text-base">
              {t('landing.collaboration.body')}
            </p>
            <Link
              to="/academic-centers"
              className="inline-flex min-w-0 max-w-full items-center justify-center self-center rounded-xl border border-teal-500/20 bg-slate-950/80 px-6 py-3.5 text-center text-sm font-semibold leading-[1.7] text-teal-400 shadow-[0_0_24px_rgba(94,234,212,0.08)] backdrop-blur-md transition-all hover:bg-slate-900/60 sm:text-base"
            >
              <span className="min-w-0 break-words leading-[1.7]">{t('landing.collaboration.cta')}</span>
            </Link>
          </article>
        </section>

        <section
          ref={intakeFormRef}
          id="home-intake-form"
          className={
            intakeHighlighted
              ? 'home-view__intake home-view__intake--highlighted'
              : 'home-view__intake'
          }
          aria-labelledby="home-intake-title"
        >
          {intakeSubmitted ? (
            <p className="home-view__intake-success break-words leading-[1.7]" role="status">
              {t('landing.intake.success')}
            </p>
          ) : (
            <form className="home-view__intake-form" onSubmit={handleIntakeSubmit}>
              <h2 id="home-intake-title" className="home-view__intake-title break-words leading-[1.7]">
                {t('landing.intake.title')}
              </h2>

              {intakeFlag === INTAKE_FLAG_EXECUTIVE_BRIEFING && intakeHighlighted ? (
                <p className="home-view__intake-hint break-words leading-[1.7]" role="status">
                  {t('landing.intake.executiveBriefingHint')}
                </p>
              ) : null}

              <div className="home-view__intake-field">
                <label className="home-view__intake-label break-words leading-[1.7]" htmlFor="home-intake-email">
                  {t('landing.intake.email')}
                </label>
                <input
                  id="home-intake-email"
                  className="home-view__intake-input break-words leading-[1.7]"
                  type="email"
                  value={intakeEmail}
                  onChange={(event) => setIntakeEmail(event.target.value)}
                  placeholder={t('forms.emailPlaceholder')}
                  autoComplete="email"
                />
              </div>

              <div className="home-view__intake-field">
                <label className="home-view__intake-label break-words leading-[1.7]" htmlFor="home-intake-message">
                  {t('landing.intake.message')}
                </label>
                <textarea
                  id="home-intake-message"
                  className="home-view__intake-textarea break-words leading-[1.7]"
                  value={intakeMessage}
                  onChange={(event) => setIntakeMessage(event.target.value)}
                  placeholder={t('landing.intake.messagePlaceholder')}
                />
              </div>

              {intakeSubmitError ? (
                <p className="home-view__intake-error break-words leading-[1.7]" role="alert">
                  {intakeSubmitError}
                </p>
              ) : null}

              <button
                type="submit"
                className="home-view__intake-submit break-words leading-[1.7]"
                disabled={!intakeFormReady || intakeSubmitting}
              >
                {intakeSubmitting
                  ? t('landing.intake.submitting')
                  : t('landing.intake.submit')}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
