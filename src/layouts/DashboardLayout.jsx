import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  createTranslator,
  getActiveLanguage,
  isRtlLanguage,
  SUPPORTED_LANGUAGES,
  setActiveLanguage,
} from '../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../config/constants.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const SIDEBAR_NAV = [
  { path: '/dashboard', labelKey: 'dashboard.nav.overview', end: true },
  { path: '/dashboard/licenses', labelKey: 'dashboard.nav.licenses' },
  { path: '/dashboard/research', labelKey: 'dashboard.nav.research' },
  { path: '/dashboard/ledger', labelKey: 'dashboard.nav.ledger' },
];

const DASHBOARD_LAYOUT_STYLES = `
.dashboard-layout {
  --dash-sidebar: #0a0f1a;
  --dash-sidebar-border: rgba(148, 163, 184, 0.14);
  --dash-accent: #c9a227;
  --dash-accent-dim: rgba(201, 162, 39, 0.14);
  --dash-surface: #111827;
  --dash-surface-elevated: rgba(17, 24, 39, 0.92);
  --dash-text: #f8fafc;
  --dash-muted: #94a3b8;
  --dash-border: rgba(148, 163, 184, 0.18);
  display: grid;
  grid-template-columns: minmax(15rem, 17.5rem) 1fr;
  min-height: 100vh;
  background:
    radial-gradient(ellipse 70% 50% at 0% 0%, rgba(201, 162, 39, 0.08), transparent 55%),
    linear-gradient(180deg, #0b1120 0%, #0f172a 100%);
  color: var(--dash-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.dashboard-layout__sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--dash-sidebar-border);
  background: var(--dash-sidebar);
  padding: 1.5rem 1rem;
}

.dashboard-layout__brand {
  display: block;
  padding: 0 0.75rem 1.25rem;
  border-bottom: 1px solid var(--dash-sidebar-border);
  margin-bottom: 1.25rem;
  text-decoration: none;
  color: inherit;
}

.dashboard-layout__brand-name {
  display: block;
  font-size: 0.9375rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--dash-text);
}

.dashboard-layout__brand-tier {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dash-accent);
}

.dashboard-layout__license-meta {
  margin: 0.75rem 0 0;
  padding: 0.65rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--dash-accent-dim);
  background: var(--dash-accent-dim);
  font-size: 0.6875rem;
  line-height: 1.45;
  color: var(--dash-muted);
}

.dashboard-layout__license-meta strong {
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.75rem;
  color: var(--dash-accent);
}

.dashboard-layout__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.dashboard-layout__nav-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  color: var(--dash-muted);
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
}

.dashboard-layout__nav-link:hover {
  color: var(--dash-text);
  background: rgba(148, 163, 184, 0.08);
}

.dashboard-layout__nav-link--active {
  color: var(--dash-text);
  border-color: var(--dash-accent-dim);
  background: linear-gradient(90deg, rgba(201, 162, 39, 0.18), rgba(201, 162, 39, 0.04));
  box-shadow: inset 3px 0 0 var(--dash-accent);
}

.dashboard-layout__nav-icon {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.45;
  flex-shrink: 0;
}

.dashboard-layout__nav-link--active .dashboard-layout__nav-icon {
  background: var(--dash-accent);
  opacity: 1;
  box-shadow: 0 0 8px rgba(201, 162, 39, 0.6);
}

.dashboard-layout__sidebar-footer {
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 1px solid var(--dash-sidebar-border);
}

.dashboard-layout__ledger-badge {
  display: block;
  margin-bottom: 0.85rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.45rem;
  border: 1px solid var(--dash-border);
  background: rgba(15, 23, 42, 0.65);
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--dash-muted);
}

.dashboard-layout__ledger-badge span {
  display: block;
  margin-top: 0.15rem;
  font-weight: 700;
  color: #5eead4;
  letter-spacing: 0.04em;
}

.dashboard-layout__locale {
  display: flex;
  gap: 0.35rem;
}

.dashboard-layout__locale-btn {
  flex: 1;
  padding: 0.4rem 0.35rem;
  border-radius: 0.35rem;
  border: 1px solid var(--dash-border);
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--dash-muted);
  cursor: pointer;
}

.dashboard-layout__locale-btn--active {
  border-color: var(--dash-accent);
  color: var(--dash-accent);
  background: var(--dash-accent-dim);
}

.dashboard-layout__main {
  min-width: 0;
  overflow: auto;
}

@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .dashboard-layout__sidebar {
    border-right: none;
    border-bottom: 1px solid var(--dash-sidebar-border);
  }

  .dashboard-layout__nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
`;

function useDashboardTranslator(languageProp) {
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

/**
 * Isolated B2B institutional workspace shell — premium sidebar, no public header/footer.
 * AppShell suppresses global chrome for /dashboard routes; this layout owns partner navigation.
 */
export default function DashboardLayout({ children, language: languageProp }) {
  const { pathname } = useLocation();
  const { t, language } = useDashboardTranslator(languageProp);
  const { institutionalB2B } = SAFEAI_MASTER_CONFIG.evaluationTiers;
  const { ledgerHost } = SAFEAI_MASTER_CONFIG.infrastructure;

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
    <div className="dashboard-layout">
      <style>{DASHBOARD_LAYOUT_STYLES}</style>

      <aside className="dashboard-layout__sidebar" aria-label={t('dashboard.layout.sidebarAria')}>
        <Link to="/dashboard" className="dashboard-layout__brand">
          <span className="dashboard-layout__brand-name">{t('branding.name')}</span>
          <span className="dashboard-layout__brand-tier">{t('dashboard.layout.portalTitle')}</span>
          <p className="dashboard-layout__license-meta">
            <strong>{t('monetizationTiers.institutionalB2B.name')}</strong>
            {t('dashboard.layout.licenseMetaPrefix')}{' '}
            {institutionalB2B.allottedTokens} {t('dashboard.layout.licenseMetaTokensSuffix')}{' '}
            · {institutionalB2B.price.toLocaleString()} {institutionalB2B.currency}
          </p>
        </Link>

        <nav className="dashboard-layout__nav" aria-label={t('dashboard.layout.sidebarAria')}>
          {SIDEBAR_NAV.map(({ path, labelKey, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'dashboard-layout__nav-link dashboard-layout__nav-link--active'
                  : 'dashboard-layout__nav-link'
              }
              aria-current={pathname === path || (!end && pathname.startsWith(`${path}/`)) ? 'page' : undefined}
            >
              <span className="dashboard-layout__nav-icon" aria-hidden="true" />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="dashboard-layout__sidebar-footer">
          <p className="dashboard-layout__ledger-badge">
            {t('dashboard.layout.ledgerProtocol')}
            <span>{ledgerHost}</span>
          </p>
          <div className="dashboard-layout__locale" role="group" aria-label="Language">
            {SUPPORTED_LANGUAGES.map((code) => (
              <button
                key={code}
                type="button"
                className={
                  language === code
                    ? 'dashboard-layout__locale-btn dashboard-layout__locale-btn--active'
                    : 'dashboard-layout__locale-btn'
                }
                aria-pressed={language === code}
                onClick={() => handleLanguageChange(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="dashboard-layout__main">{children}</div>
    </div>
  );
}
