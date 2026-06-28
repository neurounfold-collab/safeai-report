import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTranslator, getActiveLanguage } from '../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../config/constants.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const LEGAL_STYLES = `
.corporate-legal {
  --cl-accent: #c9a227;
  --cl-accent-teal: #5eead4;
  --cl-border: rgba(148, 163, 184, 0.18);
  --cl-text: #f8fafc;
  --cl-muted: #94a3b8;
  flex: 1 1 auto;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  color: var(--cl-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.corporate-legal__inner {
  width: min(100%, 52rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.corporate-legal__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.corporate-legal__eyebrow {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cl-accent-teal);
}

.corporate-legal__title {
  margin: 0;
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.corporate-legal__subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--cl-muted);
}

.corporate-legal__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: clamp(1.25rem, 3vw, 2rem);
  align-items: start;
}

.corporate-legal__anchors {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.15rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--cl-border);
  background: rgba(15, 23, 42, 0.55);
}

.corporate-legal__anchor-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-accent);
}

.corporate-legal__anchor-value {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: rgba(226, 232, 240, 0.92);
}

.corporate-legal__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.corporate-legal__section {
  padding: 1.15rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--cl-border);
  background: rgba(15, 23, 42, 0.42);
}

.corporate-legal__section-title {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cl-accent-teal);
}

.corporate-legal__section-body {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: rgba(226, 232, 240, 0.9);
}

.corporate-legal__faq {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.corporate-legal__faq-item {
  padding: 1rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--cl-border);
  background: rgba(11, 15, 25, 0.45);
}

.corporate-legal__faq-q {
  margin: 0 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-text);
}

.corporate-legal__faq-a {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--cl-muted);
}

.corporate-legal__cta {
  display: inline-flex;
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.35);
  background: rgba(94, 234, 212, 0.1);
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--cl-accent-teal);
  transition: background 160ms ease;
}

.corporate-legal__cta:hover {
  background: rgba(94, 234, 212, 0.16);
}

@media (max-width: 768px) {
  .corporate-legal__layout {
    grid-template-columns: 1fr;
  }
}
`;

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

const PAGE_TITLE_KEYS = {
  help: 'page_titles.help',
  terms: 'page_titles.terms',
  privacy: 'page_titles.privacy',
};

const SECTION_TITLE_KEYS = {
  help: 'help.title',
  terms: 'legal.terms.title',
  privacy: 'legal.privacy.title',
};

const SECTION_SUBTITLE_KEYS = {
  help: 'help.subtitle',
  terms: 'legal.terms.subtitle',
  privacy: 'legal.privacy.subtitle',
};

/**
 * Shared corporate legal layout — compliance disclosures anchored to legalAnchors registry.
 */
export default function CorporateLegalView({ section = 'help', language: languageProp }) {
  const { t } = usePageTranslator(languageProp);
  const { infrastructure } = SAFEAI_MASTER_CONFIG ?? {};

  useEffect(() => {
    document.title = t(PAGE_TITLE_KEYS[section] ?? PAGE_TITLE_KEYS.help);
  }, [section, t]);

  const contentSections =
    section === 'help'
      ? [
          { titleKey: 'legal.shared.dataProtection', bodyKey: 'legal.shared.dataProtectionBody' },
          { titleKey: 'legal.shared.registryGovernance', bodyKey: 'legal.shared.registryGovernanceBody' },
          { titleKey: 'legal.shared.dataHandling', bodyKey: 'legal.shared.dataHandlingBody' },
          { titleKey: 'legal.shared.compliance', bodyKey: 'legal.shared.complianceBody' },
        ]
      : [];

  return (
    <div className="corporate-legal">
      <style>{LEGAL_STYLES}</style>

      <div className="corporate-legal__inner">
        <header className="corporate-legal__header">
          <p className="corporate-legal__eyebrow">{t('legal.shared.eyebrow')}</p>
          <h1 className="corporate-legal__title">{t(SECTION_TITLE_KEYS[section])}</h1>
          <p className="corporate-legal__subtitle">{t(SECTION_SUBTITLE_KEYS[section])}</p>
        </header>

        <div className="corporate-legal__layout">
          <aside className="corporate-legal__anchors" aria-label={t('legal.shared.registryHeading')}>
            <p className="corporate-legal__anchor-label">{t('legal.shared.processingEntity')}</p>
            <p className="corporate-legal__anchor-value">{t('legalAnchors.processingEntity')}</p>

            <p className="corporate-legal__anchor-label">{t('legal.shared.academicAuthority')}</p>
            <p className="corporate-legal__anchor-value">{t('legalAnchors.academicInstitution')}</p>

            <p className="corporate-legal__anchor-label">{t('legal.shared.registryHeading')}</p>
            <p className="corporate-legal__anchor-value">{t('legalAnchors.registry.registryLine')}</p>
            <p className="corporate-legal__anchor-value">{t('legalAnchors.registry.address')}</p>
            <p className="corporate-legal__anchor-value">{t('legalAnchors.registry.iceStatement')}</p>

            <p className="corporate-legal__anchor-label">{t('legal.shared.ledgerProtocol')}</p>
            <p className="corporate-legal__anchor-value">
              {infrastructure?.protocol} · {t('infrastructure.ledgerHost')}
            </p>

            <p className="corporate-legal__anchor-value">{t('legalAnchors.ecosystemTransparency')}</p>
          </aside>

          <div className="corporate-legal__content">
            {section === 'help' && (
              <div className="corporate-legal__faq">
                <article className="corporate-legal__faq-item">
                  <p className="corporate-legal__faq-q">{t('academy.faq.q1.question')}</p>
                  <p className="corporate-legal__faq-a">{t('academy.faq.q1.answer')}</p>
                </article>
                <article className="corporate-legal__faq-item">
                  <p className="corporate-legal__faq-q">{t('academy.faq.q2.question')}</p>
                  <p className="corporate-legal__faq-a">{t('academy.faq.q2.answer')}</p>
                </article>
                <Link to="/contact" className="corporate-legal__cta">
                  {t('help.contact_button')}
                </Link>
              </div>
            )}

            {(contentSections ?? []).map(({ titleKey, bodyKey }) => (
              <section key={titleKey} className="corporate-legal__section">
                <h2 className="corporate-legal__section-title">{t(titleKey)}</h2>
                <p className="corporate-legal__section-body">{t(bodyKey)}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
