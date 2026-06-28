import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthTranslator } from '../hooks/useAuthTranslator.js';

/** Mock wireframe routes — replaced once router registry is centralized. */
const AUTH_ROUTES = {
  EXAM_PLAYER: '/academy/exam',
  DASHBOARD: '/dashboard',
};

const AUTH_TABS = {
  EXAMINEE: 'examinee',
  REGISTRAR: 'registrar',
};

const AUTH_PORTAL_STYLES = `
.auth-portal {
  --auth-accent: #5eead4;
  --auth-accent-gold: #c9a227;
  --auth-accent-dim: rgba(94, 234, 212, 0.12);
  --auth-glass: rgba(15, 23, 42, 0.72);
  --auth-border: rgba(148, 163, 184, 0.22);
  --auth-text: #f1f5f9;
  --auth-muted: #94a3b8;
  min-height: 100%;
  padding: clamp(1.5rem, 5vw, 3rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(ellipse 75% 55% at 15% 0%, rgba(94, 234, 212, 0.14), transparent 58%),
    radial-gradient(ellipse 65% 45% at 85% 100%, rgba(201, 162, 39, 0.12), transparent 52%),
    linear-gradient(165deg, #0b1120 0%, #111827 45%, #0f172a 100%);
  color: var(--auth-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.auth-portal__card {
  width: min(100%, 28rem);
  min-width: 0;
  border-radius: 1.25rem;
  border: 1px solid var(--auth-border);
  background: var(--auth-glass);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.auth-portal__header {
  padding: 1.5rem 1.5rem 0;
}

.auth-portal__title {
  margin: 0 0 0.35rem;
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.auth-portal__subtitle {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--auth-muted);
}

.auth-portal__trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

.auth-portal__trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--auth-border);
  background: rgba(15, 23, 42, 0.55);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--auth-muted);
}

.auth-portal__trust-badge--ledger {
  color: var(--auth-accent-gold);
}

.auth-portal__tabs-wrap {
  padding: 0 1.5rem;
  margin-top: 1.25rem;
}

.auth-portal__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem;
  padding: 0.35rem;
  border-radius: 999px;
  border: 1px solid rgba(7, 11, 20, 0.9);
  background: rgba(7, 11, 20, 0.88);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.48),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.auth-portal__tab {
  position: relative;
  padding: 0.75rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(15, 23, 42, 0.62);
  color: var(--auth-muted);
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  letter-spacing: 0.02em;
  text-align: center;
  cursor: pointer;
  transition:
    color 180ms ease,
    background 180ms ease,
    border-color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}

.auth-portal__tab:hover:not(.auth-portal__tab--active) {
  color: var(--auth-text);
  border-color: rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  transform: translateY(-1px);
}

.auth-portal__tab:focus-visible {
  outline: 2px solid var(--auth-accent);
  outline-offset: 2px;
}

.auth-portal__tab--active {
  color: #0f172a;
  font-weight: 700;
  border-color: rgba(94, 234, 212, 0.55);
  background: linear-gradient(135deg, rgba(45, 212, 191, 0.92) 0%, rgba(94, 234, 212, 0.78) 100%);
  box-shadow:
    0 0 22px rgba(94, 234, 212, 0.38),
    0 4px 16px rgba(94, 234, 212, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.auth-portal__tab--registrar.auth-portal__tab--active {
  color: #0f172a;
  border-color: rgba(201, 162, 39, 0.6);
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.95) 0%, rgba(217, 119, 6, 0.82) 100%);
  box-shadow:
    0 0 22px rgba(201, 162, 39, 0.42),
    0 4px 16px rgba(201, 162, 39, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.auth-portal__panel {
  padding: 1.5rem;
}

.auth-portal__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-portal__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.auth-portal__label {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--auth-muted);
}

.auth-portal__label--optional {
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.01em;
  color: rgba(148, 163, 184, 0.82);
}

.auth-portal__input {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid var(--auth-border);
  background: rgba(15, 23, 42, 0.65);
  color: var(--auth-text);
  font-size: 0.9375rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.auth-portal__input--optional {
  border-color: rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.42);
  font-size: 0.875rem;
}

.auth-portal__input::placeholder {
  color: rgba(148, 163, 184, 0.55);
}

.auth-portal__input:focus {
  outline: none;
  border-color: rgba(94, 234, 212, 0.45);
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.12);
}

.auth-portal__submit {
  margin-top: 0.35rem;
  width: 100%;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%);
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.auth-portal__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(45, 212, 191, 0.22);
}

.auth-portal__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.auth-portal__waqf-caption {
  margin: 0.85rem 0 0;
  font-size: 0.6875rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.82);
  letter-spacing: 0.01em;
}

.auth-portal__submit--registrar {
  background: linear-gradient(135deg, #c9a227 0%, #b45309 100%);
  color: #0f172a;
}

.auth-portal__submit--registrar:hover:not(:disabled) {
  box-shadow: 0 10px 24px rgba(201, 162, 39, 0.24);
}
`;

/**
 * Secure authentication and verification entry gateway — examinee and institutional registrar tabs.
 */
export default function AuthPortal({ language: languageProp, embedded = false }) {
  const navigate = useNavigate();
  const { t } = useAuthTranslator(languageProp);

  const [activeTab, setActiveTab] = useState(AUTH_TABS.EXAMINEE);
  const [examineeEmail, setExamineeEmail] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [registrarEmail, setRegistrarEmail] = useState('');
  const [registrarPasscode, setRegistrarPasscode] = useState('');

  const handleExamineeSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const email = examineeEmail.trim();
      if (!email) return;

      navigate(AUTH_ROUTES.EXAM_PLAYER);
    },
    [examineeEmail, navigate],
  );

  const handleRegistrarSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const email = registrarEmail.trim();
      const passcode = registrarPasscode.trim();

      if (!email || !passcode) return;

      navigate(AUTH_ROUTES.DASHBOARD);
    },
    [navigate, registrarEmail, registrarPasscode],
  );

  const examineeReady = examineeEmail.trim().length > 0;
  const registrarReady = registrarEmail.trim().length > 0 && registrarPasscode.trim().length > 0;

  const portalCard = (
      <div className="auth-portal__card">
        <header className="auth-portal__header">
          <h1 id="auth-portal-title" className="auth-portal__title">
            {t('auth.portal.title')}
          </h1>
          <p className="auth-portal__subtitle">{t('auth.portal.subtitle')}</p>

          <div className="auth-portal__trust-row">
            <span className="auth-portal__trust-badge">
              {t('infrastructure.encryptionProtocol')}
            </span>
            <span className="auth-portal__trust-badge auth-portal__trust-badge--ledger">
              {t('infrastructure.ledgerHost')}
            </span>
          </div>
        </header>

        <div className="auth-portal__tabs-wrap">
          <div
            className="auth-portal__tabs"
            role="tablist"
            aria-label={t('auth.portal.tabsAria')}
          >
            <button
              type="button"
              role="tab"
              id="auth-tab-examinee"
              aria-selected={activeTab === AUTH_TABS.EXAMINEE}
              aria-controls="auth-panel-examinee"
              className={
                activeTab === AUTH_TABS.EXAMINEE
                  ? 'auth-portal__tab auth-portal__tab--active'
                  : 'auth-portal__tab'
              }
              onClick={() => setActiveTab(AUTH_TABS.EXAMINEE)}
            >
              {t('auth.tabs.examinee')}
            </button>
            <button
              type="button"
              role="tab"
              id="auth-tab-registrar"
              aria-selected={activeTab === AUTH_TABS.REGISTRAR}
              aria-controls="auth-panel-registrar"
              className={
                activeTab === AUTH_TABS.REGISTRAR
                  ? 'auth-portal__tab auth-portal__tab--active auth-portal__tab--registrar'
                  : 'auth-portal__tab auth-portal__tab--registrar'
              }
              onClick={() => setActiveTab(AUTH_TABS.REGISTRAR)}
            >
              {t('auth.tabs.registrar')}
            </button>
          </div>
        </div>

        <div className="auth-portal__panel">
          {activeTab === AUTH_TABS.EXAMINEE ? (
            <form
              id="auth-panel-examinee"
              role="tabpanel"
              aria-labelledby="auth-tab-examinee"
              className="auth-portal__form"
              onSubmit={handleExamineeSubmit}
            >
              <div className="auth-portal__field">
                <label className="auth-portal__label" htmlFor="auth-examinee-email">
                  {t('auth.examinee.emailLabel')}
                </label>
                <input
                  id="auth-examinee-email"
                  className="auth-portal__input"
                  type="email"
                  name="registeredEmail"
                  autoComplete="email"
                  value={examineeEmail}
                  placeholder={t('auth.examinee.emailPlaceholder')}
                  onChange={(event) => setExamineeEmail(event.target.value)}
                />
              </div>

              <div className="auth-portal__field">
                <label
                  className="auth-portal__label auth-portal__label--optional"
                  htmlFor="auth-examinee-partner-id"
                >
                  {t('auth.examinee.partnerIdLabel')}
                </label>
                <input
                  id="auth-examinee-partner-id"
                  className="auth-portal__input auth-portal__input--optional"
                  type="text"
                  name="institutionalPartnerId"
                  autoComplete="off"
                  value={partnerId}
                  placeholder={t('auth.examinee.partnerIdPlaceholder')}
                  onChange={(event) => setPartnerId(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="auth-portal__submit"
                disabled={!examineeReady}
              >
                {t('auth.examinee.submit')}
              </button>
              <p className="auth-portal__waqf-caption">{t('auth.portal.waqfLedgerCaption')}</p>
            </form>
          ) : (
            <form
              id="auth-panel-registrar"
              role="tabpanel"
              aria-labelledby="auth-tab-registrar"
              className="auth-portal__form"
              onSubmit={handleRegistrarSubmit}
            >
              <div className="auth-portal__field">
                <label className="auth-portal__label" htmlFor="auth-registrar-email">
                  {t('auth.registrar.emailLabel')}
                </label>
                <input
                  id="auth-registrar-email"
                  className="auth-portal__input"
                  type="email"
                  name="institutionalEmail"
                  autoComplete="username"
                  value={registrarEmail}
                  placeholder={t('auth.registrar.emailPlaceholder')}
                  onChange={(event) => setRegistrarEmail(event.target.value)}
                />
              </div>

              <div className="auth-portal__field">
                <label className="auth-portal__label" htmlFor="auth-registrar-passcode">
                  {t('auth.registrar.passcodeLabel')}
                </label>
                <input
                  id="auth-registrar-passcode"
                  className="auth-portal__input"
                  type="password"
                  name="securityPasscode"
                  autoComplete="current-password"
                  value={registrarPasscode}
                  placeholder={t('auth.registrar.passcodePlaceholder')}
                  onChange={(event) => setRegistrarPasscode(event.target.value)}
                />
              </div>

              <button
                type="submit"
                className="auth-portal__submit auth-portal__submit--registrar"
                disabled={!registrarReady}
              >
                {t('auth.registrar.submit')}
              </button>
              <p className="auth-portal__waqf-caption">{t('auth.portal.waqfLedgerCaption')}</p>
            </form>
          )}
        </div>
      </div>
  );

  if (embedded) {
    return (
      <>
        <style>{AUTH_PORTAL_STYLES}</style>
        {portalCard}
      </>
    );
  }

  return (
    <section className="auth-portal" aria-labelledby="auth-portal-title">
      <style>{AUTH_PORTAL_STYLES}</style>
      {portalCard}
    </section>
  );
}
