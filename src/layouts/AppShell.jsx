import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  createTranslator,
  getActiveLanguage,
  isRtlLanguage,
  SUPPORTED_LANGUAGES,
  setActiveLanguage,
} from '../i18n/index.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

/** Routes that render their own isolated governance chrome — no public header/footer. */
export function isIsolatedPortalRoute(pathname) {
  return pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
}

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.home', exact: true },
  { path: '/academy', labelKey: 'nav.academy' },
  { path: '/industrial', labelKey: 'nav.industrial' },
  { path: '/verify', labelKey: 'nav.verify' },
];

const FOOTER_NAV_ITEMS = [
  { path: '/help', labelKey: 'nav.help' },
  { path: '/terms', labelKey: 'legal.terms.title' },
  { path: '/privacy', labelKey: 'legal.privacy.title' },
];

const APP_SHELL_STYLES = `
html,
body,
#root {
  margin: 0;
  padding: 0;
  min-height: 100%;
  background-color: #0b0f19;
}

.app-shell {
  --shell-bg: #0b0f19;
  --shell-bg-elevated: #111827;
  --shell-accent: #c9a227;
  --shell-accent-dim: rgba(201, 162, 39, 0.14);
  --shell-accent-teal: #5eead4;
  --shell-glass: rgba(11, 15, 25, 0.78);
  --shell-glass-border: rgba(148, 163, 184, 0.16);
  --shell-text: #f8fafc;
  --shell-muted: #94a3b8;
  --shell-border: rgba(148, 163, 184, 0.14);
  --shell-header-height: 4.25rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 55% at 50% -10%, rgba(94, 234, 212, 0.07), transparent 58%),
    radial-gradient(ellipse 60% 40% at 100% 0%, rgba(201, 162, 39, 0.06), transparent 52%),
    radial-gradient(ellipse 55% 35% at 0% 100%, rgba(94, 234, 212, 0.04), transparent 48%),
    linear-gradient(180deg, #0b0f19 0%, #0d1321 50%, #0b0f19 100%);
  color: var(--shell-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.app-shell--isolated {
  background: var(--shell-bg);
}

.app-shell-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  width: 100%;
  border-bottom: 1px solid var(--shell-glass-border);
  background: var(--shell-glass);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.28);
}

.app-shell-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 clamp(1rem, 3vw, 2rem);
  min-height: var(--shell-header-height);
}

.app-shell-header__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
  transition: opacity 160ms ease;
}

.app-shell-header__brand:hover {
  opacity: 0.88;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  min-height: 2rem;
}

.app-logo__mark {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
}

.app-logo__text {
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
  font-weight: 600;
  letter-spacing: 0.045em;
  line-height: 1.2;
  color: #ffffff;
  white-space: nowrap;
}

.app-shell-header__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-shrink: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
}

.app-shell-header__nav::-webkit-scrollbar {
  display: none;
}

.app-shell-header__link {
  flex-shrink: 0;
  border-radius: 0.45rem;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  color: var(--shell-muted);
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease;
}

.app-shell-header__link:hover {
  color: var(--shell-text);
  background: rgba(148, 163, 184, 0.08);
}

.app-shell-header__link--active {
  color: var(--shell-text);
  border-color: var(--shell-accent-dim);
  background: linear-gradient(180deg, rgba(201, 162, 39, 0.16), rgba(201, 162, 39, 0.04));
  box-shadow: inset 0 -2px 0 var(--shell-accent);
}

.app-shell-header__locale {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.3rem;
  padding: 0.2rem;
  border-radius: 999px;
  border: 1px solid var(--shell-border);
  background: rgba(15, 23, 42, 0.45);
}

.app-shell-header__locale-btn {
  min-width: 2.1rem;
  padding: 0.35rem 0.55rem;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--shell-muted);
  cursor: pointer;
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

[dir="rtl"] .app-shell-header__locale-btn {
  letter-spacing: 0.04em;
}

.app-shell-header__locale-btn:hover {
  color: var(--shell-text);
  background: rgba(148, 163, 184, 0.1);
  border-color: rgba(148, 163, 184, 0.2);
}

.app-shell-header__locale-btn--active {
  color: var(--shell-accent);
  border-color: var(--shell-accent-dim);
  background: var(--shell-accent-dim);
  box-shadow: 0 0 12px rgba(201, 162, 39, 0.18);
}

.app-shell__main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.app-shell-footer {
  flex-shrink: 0;
  margin-top: auto;
  border-top: 1px solid var(--shell-border);
  background:
    linear-gradient(180deg, rgba(11, 15, 25, 0.4) 0%, rgba(11, 15, 25, 0.92) 100%),
    var(--shell-bg-elevated);
}

.app-shell-footer__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 2.5rem);
  max-width: 80rem;
  margin: 0 auto;
  padding: clamp(1.75rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem);
}

.app-shell-footer__heading {
  margin: 0 0 0.75rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--shell-accent);
}

.app-shell-footer__meta {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--shell-muted);
}

.app-shell-footer__meta:last-of-type {
  margin-bottom: 0.85rem;
}

.app-shell-footer__statement {
  margin: 0;
  padding-top: 0.85rem;
  border-top: 1px solid var(--shell-border);
  font-size: 0.6875rem;
  line-height: 1.6;
  color: rgba(148, 163, 184, 0.75);
}

.app-shell-footer__registrar-link {
  display: inline-flex;
  align-items: center;
  margin-top: 0.95rem;
  padding: 0.55rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(94, 234, 212, 0.35);
  background: rgba(94, 234, 212, 0.08);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  color: var(--shell-accent-teal);
  transition:
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.app-shell-footer__registrar-link:hover {
  color: #f8fafc;
  border-color: rgba(94, 234, 212, 0.55);
  background: rgba(94, 234, 212, 0.16);
  box-shadow: 0 0 20px rgba(94, 234, 212, 0.18);
}

.app-shell-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  align-self: start;
}

.app-shell-footer__link {
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--shell-muted);
  transition: color 160ms ease;
}

.app-shell-footer__link:hover {
  color: var(--shell-text);
}

.app-shell-footer__baseline {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.65rem;
  align-self: end;
  text-align: end;
}

.app-shell-footer__email {
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--shell-accent-teal);
  transition: opacity 160ms ease;
}

.app-shell-footer__email:hover {
  opacity: 0.85;
}

.app-shell-footer__copyright {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: rgba(148, 163, 184, 0.65);
}

@media (max-width: 900px) {
  .app-shell-header__inner {
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
    min-height: auto;
  }

  .app-shell {
    --shell-header-height: 7.5rem;
  }

  .app-shell-header__brand {
    width: 100%;
    justify-content: center;
  }

  .app-logo {
    justify-content: center;
  }

  .app-shell-header__nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
  }

  [dir="rtl"] .app-shell-header__nav {
    justify-content: flex-end;
  }

  .app-shell-header__locale {
    order: 2;
  }

  .app-shell-footer__inner {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .app-shell-footer__baseline {
    align-self: start;
    text-align: start;
  }
}

@media (max-width: 520px) {
  .app-shell {
    --shell-header-height: 7.5rem;
  }

  .app-shell-header__locale {
    gap: 0.15rem;
    padding: 0.15rem;
  }

  .app-shell-header__locale-btn {
    min-width: 1.85rem;
    padding: 0.3rem 0.4rem;
    font-size: 0.625rem;
  }

  .app-shell-header__nav {
    gap: 0.15rem;
    padding-inline: 0.15rem;
  }
}

@media (max-width: 320px) {
  .app-shell-header__inner {
    gap: 0.65rem;
    padding-inline: 0.65rem;
  }

  .app-shell-header__locale-btn {
    min-width: 1.65rem;
    padding: 0.28rem 0.32rem;
    font-size: 0.5625rem;
  }

  .app-shell-header__nav {
    justify-content: flex-start;
    scroll-padding-inline: 0.65rem;
  }

  [dir="rtl"] .app-shell-header__nav {
    justify-content: flex-end;
  }
}
`;

function useAppTranslator(languageProp) {
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

function isNavActive(pathname, path, exact = false) {
  if (exact) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

function A4ScalesMark() {
  return (
    <svg
      className="app-logo__mark"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18 5.5L14.5 10.5H21.5L18 5.5Z" fill="#c9a227" />
      <path
        d="M18 10.5V27.5"
        stroke="#c9a227"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M5.5 12.5H30.5"
        stroke="#c9a227"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5 12.5V16.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M27.5 12.5V16.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M13 27.5H23"
        stroke="#c9a227"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6.5 18.5L10.5 16.5L10.5 24.5L6.5 22.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M29.5 18.5L25.5 16.5L25.5 24.5L29.5 22.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <text
        x="8.5"
        y="23.5"
        textAnchor="middle"
        fill="#c9a227"
        fontSize="10"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        A
      </text>
      <text
        x="27.5"
        y="23.5"
        textAnchor="middle"
        fill="#c9a227"
        fontSize="10"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        4
      </text>
    </svg>
  );
}

function AppLogo({ t }) {
  return (
    <span className="app-logo">
      <A4ScalesMark />
      <span className="app-logo__text">{t('legalAnchors.academicInstitution')}</span>
    </span>
  );
}

function GlobalHeader({ t, language, onLanguageChange }) {
  const { pathname } = useLocation();

  return (
    <header className="app-shell-header">
      <div className="app-shell-header__inner">
        <Link to="/" className="app-shell-header__brand" aria-label={t('legalAnchors.academicInstitution')}>
          <AppLogo t={t} />
        </Link>

        <nav
          className="app-shell-header__nav flex min-w-0 w-full max-w-full flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-none items-center justify-center max-[899px]:justify-start rtl:max-[899px]:justify-end gap-x-1 sm:gap-x-4"
          aria-label={t('nav.home')}
        >
          {NAV_ITEMS.map(({ path, labelKey, exact }) => {
            const active = isNavActive(pathname, path, exact);
            return (
              <Link
                key={path}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={[
                  'app-shell-header__link shrink-0',
                  active && 'app-shell-header__link--active',
                  'text-[11px] xs:text-xs sm:text-sm tracking-tighter whitespace-nowrap px-2 py-1 sm:px-4 sm:py-2',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="app-shell-header__locale" role="group" aria-label="Language">
          {SUPPORTED_LANGUAGES.map((code) => (
            <button
              key={code}
              type="button"
              className={
                language === code
                  ? 'app-shell-header__locale-btn app-shell-header__locale-btn--active'
                  : 'app-shell-header__locale-btn'
              }
              aria-pressed={language === code}
              onClick={() => onLanguageChange(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function InstitutionalFooter({ t }) {
  return (
    <footer className="app-shell-footer">
      <div className="app-shell-footer__inner">
        <section className="app-shell-footer__authority" aria-labelledby="footer-authority">
          <h2 id="footer-authority" className="app-shell-footer__heading">
            {t('legalAnchors.academicInstitution')}
          </h2>
          <p className="app-shell-footer__meta">{t('legalAnchors.registry.registryLine')}</p>
          <p className="app-shell-footer__meta">{t('legalAnchors.registry.address')}</p>
          <p className="app-shell-footer__meta">{t('legalAnchors.registry.iceStatement')}</p>
          <p className="app-shell-footer__statement">{t('footer.compliance_statement')}</p>
          <Link to="/contact" className="app-shell-footer__registrar-link">
            {t('footer.registrarContact')}
          </Link>
        </section>

        <nav className="app-shell-footer__nav" aria-label={t('footer.support')}>
          {FOOTER_NAV_ITEMS.map(({ path, labelKey }) => (
            <Link key={path} to={path} className="app-shell-footer__link">
              {t(labelKey)}
            </Link>
          ))}
        </nav>

        <div className="app-shell-footer__baseline">
          <a href={`mailto:${t('footer.email')}`} className="app-shell-footer__email">
            {t('footer.email')}
          </a>
          <p className="app-shell-footer__copyright">{t('legalAnchors.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

/**
 * Single global layout shell — one header, one footer, one main outlet.
 * Governance portals under /admin and /dashboard are excluded to prevent double chrome.
 */
export default function AppShell({ children, language: languageProp }) {
  const { pathname } = useLocation();
  const isolated = isIsolatedPortalRoute(pathname);
  const { t, language } = useAppTranslator(languageProp);

  const handleLanguageChange = (code) => {
    setActiveLanguage(code);
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT));
  };

  useEffect(() => {
    const rtl = isRtlLanguage(language);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className={isolated ? 'app-shell app-shell--isolated' : 'app-shell'}>
      <style>{APP_SHELL_STYLES}</style>
      {!isolated && (
        <GlobalHeader t={t} language={language} onLanguageChange={handleLanguageChange} />
      )}
      <main
        className={[
          'app-shell__main',
          !isolated && 'pt-44 xs:pt-48 min-[900px]:pt-36 lg:pt-40',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </main>
      {!isolated && <InstitutionalFooter t={t} />}
    </div>
  );
}
