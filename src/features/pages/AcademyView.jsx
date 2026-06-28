import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTranslator, getActiveLanguage, isRtlLanguage } from '../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../config/constants.js';
import {
  MICRO_QUIZ_CORRECT,
  MICRO_QUIZ_OPTION_KEYS,
} from '../academy/data/microQuizAnswers.js';
import { UPCOMING_COHORTS } from '../academy/data/upcomingCourses.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';
const ACADEMY_ORIGIN = 'https://safeai.report/academy';

const TRACK_IDS = ['level01', 'level02', 'level03'];
const LESSON_KEYS = ['lesson1', 'lesson2', 'lesson3'];
const QUIZ_KEYS = ['q1', 'q2', 'q3'];
const FLOW_STEP_KEYS = ['step1', 'step2', 'step3'];
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'];

const EXAM_TIER_PATHS = {
  level01: '/academy/exam?tier=level01',
  level02: '/academy/exam?tier=level02',
  level03: '/academy/exam?tier=level03',
};

function usePageTranslator(languageProp) {
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

function buildEducationalOrganizationSchema(config) {
  const branding = config?.branding ?? {};
  const legalAnchors = config?.legalAnchors ?? {};
  const infrastructure = config?.infrastructure ?? {};
  const registry = legalAnchors.registry ?? {};
  const authorityProfiles = branding.authorityProfiles ?? {};

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: legalAnchors.academicInstitution,
    alternateName: `${branding.name ?? 'safeAI.report'} Sovereign Academy`,
    url: ACADEMY_ORIGIN,
    description: infrastructure.targetFramework,
    founder: {
      '@type': 'Person',
      name: branding.authority,
      sameAs: [authorityProfiles.linkedIn, authorityProfiles.x].filter(Boolean),
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: registry.address,
      addressCountry: 'FR',
    },
    identifier: [
      { '@type': 'PropertyValue', name: 'RNA', value: registry.rna },
      { '@type': 'PropertyValue', name: 'SIRET', value: registry.siret },
    ].filter((entry) => entry.value),
    knowsAbout: [
      'EU AI Act Article 4',
      'AI Literacy Compliance',
      'Human Oversight Metrics',
      infrastructure.targetFramework,
    ].filter(Boolean),
  };
}

function buildFaqPageSchema(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: t(`academy.hub.faq.${key}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`academy.hub.faq.${key}.answer`),
      },
    })),
  };
}

function ComplianceFlowchart({ t, trackId, lessonKey }) {
  const base = `academy.hub.curriculum.${trackId}.${lessonKey}.flow`;
  const titleId = `flow-title-${trackId}-${lessonKey}`;

  return (
    <section
      className="mt-5 min-w-0 overflow-x-hidden rounded-xl border border-teal-400/20 bg-slate-900/50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      aria-labelledby={titleId}
    >
      <h4
        id={titleId}
        className="mb-4 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-teal-300/90"
      >
        {t(`${base}.title`)}
      </h4>
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
        {FLOW_STEP_KEYS.map((stepKey, index) => (
          <React.Fragment key={stepKey}>
            <article className="flex min-w-0 flex-1 flex-col rounded-lg border border-[#c9a227]/25 bg-slate-950/60 p-3 shadow-[0_0_18px_rgba(201,162,39,0.08)]">
              <h5 className="mb-1 text-[0.625rem] font-bold uppercase tracking-wider text-[#c9a227]">
                {t(`${base}.${stepKey}.label`)}
              </h5>
              <p className="break-words text-sm leading-[1.7] text-slate-200">
                {t(`${base}.${stepKey}.body`)}
              </p>
              <ul className="mt-2 space-y-1 border-t border-slate-700/50 pt-2">
                {[1, 2].map((item) => (
                  <li key={item} className="flex min-w-0 gap-2 text-xs leading-[1.7] text-slate-400">
                    <span className="shrink-0 text-teal-400/80" aria-hidden="true">
                      ▸
                    </span>
                    <span className="min-w-0 break-words">{t(`${base}.${stepKey}.item${item}`)}</span>
                  </li>
                ))}
              </ul>
            </article>
            {index < FLOW_STEP_KEYS.length - 1 && (
              <div
                className="hidden shrink-0 items-center justify-center text-[#c9a227]/60 md:flex"
                aria-hidden="true"
              >
                →
              </div>
            )}
            {index < FLOW_STEP_KEYS.length - 1 && (
              <div className="flex justify-center text-[#c9a227]/60 md:hidden" aria-hidden="true">
                ↓
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

function MicroQuiz({ t, trackId }) {
  const base = `academy.hub.curriculum.${trackId}.microCheck`;
  const [selections, setSelections] = useState({});

  const handleSelect = useCallback((qKey, optionIndex) => {
    setSelections((prev) => ({ ...prev, [qKey]: optionIndex }));
  }, []);

  const getOptionClassName = (qKey, optionIndex) => {
    const selected = selections[qKey];
    if (selected === undefined) {
      return 'border-slate-700/60 bg-slate-950/50 text-slate-300 hover:border-slate-500/70 hover:bg-slate-900/60';
    }

    const correctIndex = MICRO_QUIZ_CORRECT[trackId]?.[qKey];
    if (correctIndex === undefined) {
      return 'border-slate-700/60 bg-slate-950/50 text-slate-300 hover:border-slate-500/70 hover:bg-slate-900/60';
    }

    if (optionIndex === correctIndex) {
      return 'border-[#5eead4]/70 bg-[#5eead4]/10 text-teal-50 shadow-[0_0_18px_rgba(94,234,212,0.35),inset_0_0_12px_rgba(94,234,212,0.08)]';
    }

    if (optionIndex === selected) {
      return 'border-[#5c3d3d]/70 bg-[#3d2c2c]/80 text-slate-400';
    }

    return 'border-slate-800/50 bg-slate-950/30 text-slate-500 opacity-60';
  };

  return (
    <section
      className="mt-6 rounded-xl border-2 border-[#c9a227]/35 bg-gradient-to-br from-[#c9a227]/10 via-slate-900/80 to-slate-950/90 p-5 shadow-[0_0_32px_rgba(201,162,39,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
      aria-labelledby={`micro-quiz-title-${trackId}`}
    >
      <h3
        id={`micro-quiz-title-${trackId}`}
        className="mb-4 break-words text-sm font-bold uppercase leading-[1.7] tracking-widest text-[#c9a227]"
      >
        {t(`${base}.title`)}
      </h3>
      <ol className="space-y-5">
        {QUIZ_KEYS.map((qKey, index) => {
          const answered = selections[qKey] !== undefined;

          return (
            <li
              key={qKey}
              className="rounded-lg border border-slate-700/60 bg-slate-950/50 p-4"
            >
              <p className="text-sm font-semibold leading-[1.7] text-white">
                <span className="mr-2 text-[#c9a227]">{index + 1}.</span>
                {t(`${base}.${qKey}.prompt`)}
              </p>
              <p className="mt-2 text-xs leading-[1.7] text-slate-400">
                {t(`${base}.${qKey}.context`)}
              </p>
              <div
                className="mt-4 grid gap-2 sm:grid-cols-1"
                role="group"
                aria-label={t(`${base}.${qKey}.prompt`)}
              >
                {MICRO_QUIZ_OPTION_KEYS.map((optKey, optionIndex) => {
                  const isSelected = selections[qKey] === optionIndex;

                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => !answered && handleSelect(qKey, optionIndex)}
                      aria-pressed={isSelected}
                      className={`rounded-lg border px-4 py-3 text-left text-sm leading-[1.7] transition-all duration-200 ${getOptionClassName(qKey, optionIndex)} ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="mr-2 font-bold uppercase text-[#c9a227]/80">{optKey}.</span>
                      {t(`${base}.${qKey}.options.${optKey}`)}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function LessonAccordion({ t, trackId, lessonKey, defaultOpen = false }) {
  const base = `academy.hub.curriculum.${trackId}.${lessonKey}`;
  const panelId = `lesson-panel-${trackId}-${lessonKey}`;

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm transition-colors duration-300 hover:border-slate-600/60">
      <details open={defaultOpen} className="group min-w-0">
        <summary className="flex w-full min-w-0 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:content-none [&::-webkit-details-marker]:hidden">
          <h3 className="m-0 min-w-0 flex-1 break-words text-base font-semibold leading-[1.7] text-white">
            {t(`${base}.title`)}
          </h3>
          <span
            className="shrink-0 rounded-lg border border-slate-700/60 bg-slate-950/50 p-2 text-[#c9a227] transition-transform duration-300 group-open:rotate-180"
            aria-hidden="true"
          >
            ▾
          </span>
        </summary>
        <div
          id={panelId}
          className="min-w-0 space-y-4 border-t border-slate-700/40 px-5 pb-5 pt-4"
        >
          <p className="break-words text-sm leading-[1.7] text-slate-300">{t(`${base}.intro`)}</p>
          <p className="break-words text-sm leading-[1.7] text-slate-400">{t(`${base}.paragraph1`)}</p>
          <p className="break-words text-sm leading-[1.7] text-slate-400">{t(`${base}.paragraph2`)}</p>
          <ComplianceFlowchart t={t} trackId={trackId} lessonKey={lessonKey} />
        </div>
      </details>
    </article>
  );
}

function ConversionCallout({ t, trackId }) {
  const examPath = EXAM_TIER_PATHS[trackId];
  const ctaKey = `academy.hub.conversion.${trackId}Cta`;

  return (
    <section
      className="mt-8 min-w-0 overflow-hidden rounded-xl border border-teal-400/25 bg-gradient-to-br from-slate-950/95 via-[#0b0f19] to-slate-900/90 p-6 shadow-[inset_0_1px_0_rgba(94,234,212,0.12),0_24px_48px_rgba(0,0,0,0.45)]"
      aria-label={t('academy.hub.conversion.readiness')}
    >
      <p className="max-w-3xl break-words text-sm leading-[1.7] text-slate-200 md:text-base">
        {t('academy.hub.conversion.readiness')}
      </p>
      <p className="mt-3 max-w-3xl break-words text-sm leading-[1.7] text-teal-300/90 md:text-base">
        {t('academy.hub.conversion.openAccessNotice')}
      </p>
      <p className="mt-3 max-w-3xl break-words text-sm leading-[1.7] text-slate-400 md:text-base">
        {t('academy.hub.conversion.cohortMatrixNotice')}
      </p>
      <Link
        to={examPath}
        aria-label={t(ctaKey)}
        className="mt-5 inline-flex w-full min-w-0 items-center justify-center rounded-lg border border-teal-400/40 bg-slate-950/80 px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-teal-50 shadow-[inset_0_1px_0_rgba(94,234,212,0.15),0_8px_32px_rgba(94,234,212,0.12)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400/60 hover:bg-teal-950/40 hover:shadow-[inset_0_1px_0_rgba(94,234,212,0.22),0_12px_40px_rgba(94,234,212,0.18)] sm:w-auto"
      >
        <span className="break-words leading-[1.7]">{t(ctaKey)}</span>
      </Link>
    </section>
  );
}

function FaqReferenceIndex({ t }) {
  return (
    <section
      className="mt-14 min-w-0 rounded-xl border border-slate-700/50 bg-slate-900/40 p-6"
      aria-labelledby="academy-faq-title"
    >
      <h2
        id="academy-faq-title"
        className="mb-6 min-w-0 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-teal-300/90"
      >
        {t('academy.hub.faqSectionTitle')}
      </h2>
      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        {FAQ_KEYS.map((key) => (
          <article
            key={key}
            className="min-w-0 rounded-lg border border-slate-700/50 bg-slate-950/50 p-4"
          >
            <h3 className="m-0 min-w-0 break-words text-sm font-semibold leading-[1.7] text-white">
              {t(`academy.hub.faq.${key}.question`)}
            </h3>
            <p className="mt-2 min-w-0 break-words text-sm leading-[1.7] text-slate-400">
              {t(`academy.hub.faq.${key}.answer`)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrackCurriculumPanel({ t, trackId, isActive, panelRef }) {
  return (
    <section
      ref={isActive ? panelRef : undefined}
      id={`curriculum-${trackId}`}
      hidden={!isActive}
      className="mt-14 scroll-mt-8"
      aria-labelledby={`academy-curriculum-title-${trackId}`}
    >
      <h2
        id={`academy-curriculum-title-${trackId}`}
        className="mb-2 min-w-0 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-teal-300/90"
      >
        {t('academy.hub.curriculumLabel')} — {t(`academy.hub.tracks.${trackId}.title`)}
      </h2>
      <p className="mb-6 max-w-3xl break-words text-sm leading-[1.7] text-slate-400">
        {t(`academy.hub.tracks.${trackId}.overview`)}
      </p>

      <div className="space-y-3">
        {LESSON_KEYS.map((lessonKey) => (
          <LessonAccordion
            key={`${trackId}-${lessonKey}`}
            t={t}
            trackId={trackId}
            lessonKey={lessonKey}
            defaultOpen={lessonKey === 'lesson1'}
          />
        ))}
      </div>

      <MicroQuiz t={t} trackId={trackId} />
      <ConversionCallout t={t} trackId={trackId} />
    </section>
  );
}

function UpcomingMasterclasses({ t }) {
  return (
    <section
      className="mt-14 min-w-0 overflow-hidden rounded-2xl border border-[#c9a227]/20 bg-slate-900/45 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:p-8"
      aria-labelledby="academy-upcoming-title"
    >
      <h2
        id="academy-upcoming-title"
        className="mb-6 min-w-0 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-[#c9a227]"
      >
        {t('academy.upcoming.sectionTitle')}
      </h2>
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        {(UPCOMING_COHORTS ?? []).map((cohort) => (
          <article
            key={cohort?.id ?? cohort?.i18nKeyScope}
            className="flex min-w-0 max-w-full flex-col rounded-xl border border-[#c9a227]/20 bg-slate-950/55 p-5 shadow-[inset_0_1px_0_rgba(201,162,39,0.08),0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md"
          >
            <h3 className="min-w-0 break-words text-lg font-bold leading-[1.7] text-white">
              {t(`${cohort?.i18nKeyScope}.title`)}
            </h3>
            <p className="mt-2 min-w-0 break-words text-xs font-semibold uppercase leading-[1.7] tracking-wider text-[#c9a227]">
              {t(`${cohort?.i18nKeyScope}.timeline`)}
            </p>
            <p className="mt-3 min-w-0 flex-1 break-words text-sm leading-[1.7] text-slate-300">
              {t(`${cohort?.i18nKeyScope}.description`)}
            </p>
            <a
              href={cohort?.systemeIoUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full min-w-0 max-w-full items-center justify-center rounded-lg border border-[#c9a227]/50 bg-gradient-to-r from-[#c9a227] to-amber-700 px-5 py-3 text-center text-sm font-bold uppercase leading-[1.7] tracking-wide text-slate-950 shadow-[0_8px_24px_rgba(201,162,39,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(201,162,39,0.38)]"
            >
              <span className="min-w-0 break-words leading-[1.7]">{t('academy.upcoming.ctaButton')}</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Sovereign Academy preparation hub — interactive course matrix funneling to formal examinations.
 */
export default function AcademyView({ language: languageProp }) {
  const { t, language } = usePageTranslator(languageProp);
  const rtl = isRtlLanguage(language);
  const { branding, legalAnchors } = SAFEAI_MASTER_CONFIG ?? {};
  const registry = legalAnchors?.registry ?? {};
  const authorityProfiles = branding?.authorityProfiles ?? {};

  const [activeTrack, setActiveTrack] = useState('level01');

  const curriculumRef = useRef(null);

  const orgSchema = useMemo(
    () => buildEducationalOrganizationSchema(SAFEAI_MASTER_CONFIG),
    [],
  );
  const faqSchema = useMemo(() => buildFaqPageSchema(t), [t]);

  useEffect(() => {
    document.title = t('page_titles.academy');

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('academy.hub.metaDescription'));
    }

    const schemaPayloads = [
      { id: 'academy-view-schema-org', data: orgSchema },
      { id: 'academy-view-schema-faq', data: faqSchema },
    ];

    schemaPayloads.forEach(({ id, data }) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    return () => {
      schemaPayloads.forEach(({ id }) => {
        document.getElementById(id)?.remove();
      });
    };
  }, [t, orgSchema, faqSchema]);

  const handleTrackSelect = useCallback((trackId) => {
    setActiveTrack(trackId);

    requestAnimationFrame(() => {
      curriculumRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  return (
    <main className="flex-1 bg-[#0b0f19] text-slate-100" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="min-h-full bg-[radial-gradient(ellipse_70%_50%_at_10%_15%,rgba(94,234,212,0.08),transparent_55%),radial-gradient(ellipse_55%_40%_at_90%_85%,rgba(201,162,39,0.07),transparent_50%)]">
        <div className="mx-auto min-w-0 max-w-6xl px-4 py-12">
          <header className="mb-12 max-w-4xl">
            <p className="m-0 min-w-0 break-words text-base font-medium leading-[1.7] text-slate-200 md:text-lg">
              {t('academy.hub.citationLead')}
            </p>
            <h1 className="mt-4 break-words text-3xl font-extrabold leading-[1.7] tracking-tight text-white md:text-4xl lg:text-[2.625rem]">
              {t('academy.hub.headline')}
            </h1>
            <p className="mt-4 break-words text-base leading-[1.7] text-slate-400 md:text-lg">
              {t('academy.hub.subtitle')}
            </p>
          </header>

          <section aria-labelledby="academy-track-picker-title">
            <h2
              id="academy-track-picker-title"
              className="mb-5 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-[#c9a227]"
            >
              {t('academy.hub.trackPickerLabel')}
            </h2>
            <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-3">
              {TRACK_IDS.map((trackId) => {
                const isActive = activeTrack === trackId;
                const trackTitle = t(`academy.hub.tracks.${trackId}.title`);
                const trackTarget = t(`academy.hub.tracks.${trackId}.target`);

                return (
                  <li key={trackId}>
                    <article
                      className={`h-full rounded-xl border bg-slate-900/50 backdrop-blur-md transition-all duration-300 ${
                        isActive
                          ? 'border-[#c9a227]/60 shadow-[0_0_32px_rgba(201,162,39,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]'
                          : 'border-slate-700/50 shadow-lg'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleTrackSelect(trackId)}
                        aria-pressed={isActive}
                        aria-controls={`curriculum-${trackId}`}
                        aria-label={`${trackTitle}. ${trackTarget}`}
                        className="group flex h-full w-full flex-col gap-3 rounded-xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227]/50"
                      >
                        <span className="inline-flex w-fit rounded-full border border-[#c9a227]/35 bg-[#c9a227]/10 px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider text-[#c9a227]">
                          {t(`academy.hub.tracks.${trackId}.tierBadge`)}
                        </span>
                        <span className="break-words text-lg font-bold leading-[1.7] text-white">
                          {trackTitle}
                        </span>
                        <span className="break-words text-sm leading-[1.7] text-slate-400">
                          {trackTarget}
                        </span>
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>

          {TRACK_IDS.map((trackId) => (
            <TrackCurriculumPanel
              key={trackId}
              t={t}
              trackId={trackId}
              isActive={activeTrack === trackId}
              panelRef={curriculumRef}
            />
          ))}

          <FaqReferenceIndex t={t} />

          <UpcomingMasterclasses t={t} />

          <section
            className="mt-14 grid gap-6 rounded-xl border border-slate-700/50 bg-slate-900/40 p-6 md:grid-cols-[1.4fr_1fr]"
            aria-labelledby="academy-authority"
          >
            <article className="min-w-0">
              <h2
                id="academy-authority"
                className="mb-2 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-[#c9a227]"
              >
                {t('academy.hub.authority.label')}
              </h2>
              <p className="break-words text-lg font-bold leading-[1.7] text-white">
                {branding?.authority}
              </p>
              <p className="mt-1 break-words text-sm leading-[1.7] text-slate-400">
                {legalAnchors?.academicInstitution} · {SAFEAI_MASTER_CONFIG?.infrastructure?.targetFramework}
              </p>
              <p className="mt-3 break-words text-xs leading-[1.7] text-slate-500">
                {registry.address} · {t('legalAnchors.registry.registryLine')}
              </p>
            </article>
            <article className="flex min-w-0 flex-col justify-center gap-3">
              <h3 className="m-0 break-words text-xs font-bold uppercase leading-[1.7] tracking-widest text-teal-300/90">
                {t('academy.hub.authority.socialLabel')}
              </h3>
              <div className="flex flex-wrap gap-3">
                <a
                  href={authorityProfiles.linkedIn ?? '#'}
                  className="inline-flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm font-semibold leading-[1.7] text-slate-200 transition-colors duration-200 hover:border-[#c9a227]/45 hover:bg-[#c9a227]/10 hover:text-[#c9a227]"
                  target="_blank"
                  rel="noopener noreferrer author"
                >
                  {t('academy.hub.authority.linkedIn')}
                </a>
                <a
                  href={authorityProfiles.x ?? '#'}
                  className="inline-flex items-center rounded-lg border border-slate-700/60 bg-slate-950/60 px-4 py-2.5 text-sm font-semibold leading-[1.7] text-slate-200 transition-colors duration-200 hover:border-slate-500/45 hover:bg-slate-800/60"
                  target="_blank"
                  rel="noopener noreferrer author"
                >
                  {t('academy.hub.authority.x')}
                </a>
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
