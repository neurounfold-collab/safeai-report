import React, { useEffect, useState } from 'react';
import { createTranslator, getActiveLanguage } from '../../i18n/index.js';
import { getDomainContext, submitIntakeForm } from '../../utils/emailRouter.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const CONTACT_STYLES = `
.contact-view {
  --cv-accent: #5eead4;
  --cv-border: rgba(148, 163, 184, 0.18);
  --cv-text: #f8fafc;
  --cv-muted: #94a3b8;
  flex: 1 1 auto;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  color: var(--cv-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.contact-view__inner {
  width: min(100%, 40rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-view__title {
  margin: 0;
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.contact-view__subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--cv-muted);
}

.contact-view__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 1rem;
  border: 1px solid var(--cv-border);
  background: rgba(15, 23, 42, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 40px rgba(0, 0, 0, 0.28);
}

.contact-view__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contact-view__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cv-muted);
}

.contact-view__input,
.contact-view__select,
.contact-view__textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid var(--cv-border);
  background: rgba(11, 15, 25, 0.65);
  color: var(--cv-text);
  font-size: 0.875rem;
  line-height: 1.45;
}

.contact-view__input::placeholder,
.contact-view__textarea::placeholder {
  color: rgba(148, 163, 184, 0.72);
}

.contact-view__select option {
  background: #0f172a;
  color: var(--cv-text);
}

.contact-view__textarea {
  min-height: 6rem;
  resize: vertical;
  line-height: 1.5;
}

.contact-view__input:focus,
.contact-view__select:focus,
.contact-view__textarea:focus {
  outline: none;
  border-color: rgba(94, 234, 212, 0.45);
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.12);
}

.contact-view__submit {
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%);
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.contact-view__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(45, 212, 191, 0.22);
}

.contact-view__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.contact-view__success {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.28);
  background: rgba(15, 118, 110, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--cv-accent);
}

.contact-view__error {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #fca5a5;
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

const CATEGORY_KEYS = [
  'institutionalLicensing',
  'corporateProcurement',
  'individualCertification',
  'doctoralResearch',
];

/**
 * Institutional contact dispatch — registrar message intake container.
 */
export default function ContactView({ language: languageProp }) {
  const { t } = usePageTranslator(languageProp);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(CATEGORY_KEYS[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    document.title = t('page_titles.contact');
  }, [t]);

  const formReady =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formReady || submitting) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await submitIntakeForm({
        institutionName: subject.trim(),
        contactPerson: name.trim(),
        selectedTier: t(`contact.page.categories.${category}`),
        domainContext: getDomainContext(),
        additionalFields: {
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          category,
          form_source: 'institutional_contact_dispatch',
        },
      });
      setSubmitted(true);
    } catch {
      setSubmitError(t('contact.page.form.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-view">
      <style>{CONTACT_STYLES}</style>

      <div className="contact-view__inner">
        <header>
          <h1 className="contact-view__title">{t('contact.page.title')}</h1>
          <p className="contact-view__subtitle">{t('contact.page.subtitle')}</p>
        </header>

        <div className="contact-view__card">
          {submitted ? (
            <p className="contact-view__success" role="status">
              {t('contact.page.form.success')}
            </p>
          ) : (
            <form className="contact-view__form" onSubmit={handleSubmit}>
              <div className="contact-view__field">
                <label className="contact-view__label" htmlFor="contact-name">
                  {t('contact.page.form.name')}
                </label>
                <input
                  id="contact-name"
                  className="contact-view__input"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t('forms.fullNamePlaceholder')}
                />
              </div>

              <div className="contact-view__field">
                <label className="contact-view__label" htmlFor="contact-email">
                  {t('contact.page.form.email')}
                </label>
                <input
                  id="contact-email"
                  className="contact-view__input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('forms.emailPlaceholder')}
                />
              </div>

              <div className="contact-view__field">
                <label className="contact-view__label" htmlFor="contact-category">
                  {t('contact.page.form.category')}
                </label>
                <select
                  id="contact-category"
                  className="contact-view__select"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {CATEGORY_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {t(`contact.page.categories.${key}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-view__field">
                <label className="contact-view__label" htmlFor="contact-subject">
                  {t('contact.page.form.subject')}
                </label>
                <input
                  id="contact-subject"
                  className="contact-view__input"
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder={t('contact.page.form.subjectPlaceholder')}
                />
              </div>

              <div className="contact-view__field">
                <label className="contact-view__label" htmlFor="contact-message">
                  {t('contact.page.form.message')}
                </label>
                <textarea
                  id="contact-message"
                  className="contact-view__textarea"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={t('contact.page.form.messagePlaceholder')}
                />
              </div>

              {submitError ? (
                <p className="contact-view__error" role="alert">
                  {submitError}
                </p>
              ) : null}

              <button
                type="submit"
                className="contact-view__submit"
                disabled={!formReady || submitting}
              >
                {submitting ? t('contact.page.form.submitting') : t('contact.page.form.submit')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
