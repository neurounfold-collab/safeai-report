import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthTranslator } from '../auth/hooks/useAuthTranslator.js';

export const ADMIN_SESSION_KEY = 'safeai_admin_active_session';
export const ADMIN_DASHBOARD_PATH = '/admin';

const TERMINAL_LINE_COUNT = 8;
const TERMINAL_LINE_LENGTH = 64;
const HEX_CHARS = '0123456789ABCDEF';
const HEX_TICK_MS = 50;

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * CREDENTIAL ROTATION GUIDE (Administrator Reference)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Prefer build-time env vars. When unset, reliable fallbacks keep login
 * functional in both local and production builds.
 *
 * 1. USERNAME — VITE_ADMIN_USERNAME (fallback: admin_a4i_master)
 *
 * 2. PASSWORD — VITE_ADMIN_PASSWORD
 *    (fallback: OIARF#2026!Secured@WaqfLedger$Master)
 *    Override via .env / .env.local (gitignored) and rotate regularly.
 *    Quote values that contain # or $ in dotenv files.
 *
 * 3. DEPLOY — Inject env vars via the host/CI secret store, then rebuild.
 *
 * 4. INVALIDATE — Clear active sessions:
 *    sessionStorage.removeItem('safeai_admin_active_session')
 * ═══════════════════════════════════════════════════════════════════════════
 */

const EXPECTED_USER = import.meta.env.VITE_ADMIN_USERNAME || 'admin_a4i_master';
const EXPECTED_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'OIARF#2026!Secured@WaqfLedger$Master';

const ADMIN_LOGIN_STYLES = `
.admin-login {
  --al-bg: #0a0e17;
  --al-accent: #c9a227;
  --al-accent-glow: rgba(201, 162, 39, 0.45);
  --al-teal: #5eead4;
  --al-glass: rgba(15, 23, 42, 0.82);
  --al-border: rgba(148, 163, 184, 0.2);
  --al-text: #f8fafc;
  --al-muted: #94a3b8;
  --al-error: #f87171;
  --al-error-bg: rgba(248, 113, 113, 0.12);
  flex: 1 1 auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  background:
    radial-gradient(ellipse 80% 60% at 12% 0%, rgba(94, 234, 212, 0.1), transparent 58%),
    radial-gradient(ellipse 70% 50% at 88% 100%, rgba(201, 162, 39, 0.1), transparent 52%),
    linear-gradient(165deg, #070b14 0%, var(--al-bg) 42%, #0f172a 100%);
  color: var(--al-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.admin-login__shell {
  width: min(100%, 40rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-login__terminal {
  padding: 1rem 1.15rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.22);
  background: rgba(0, 0, 0, 0.55);
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.6875rem;
  line-height: 1.45;
  overflow: hidden;
}

.admin-login__terminal-label {
  margin: 0 0 0.65rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--al-accent);
}

.admin-login__terminal-line {
  display: block;
  color: rgba(94, 234, 212, 0.72);
  letter-spacing: 0.04em;
}

.admin-login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: 1rem;
  border: 1px solid var(--al-border);
  background: var(--al-glass);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.admin-login__title {
  margin: 0;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: var(--al-accent);
}

.admin-login__authority {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: center;
  color: var(--al-muted);
}

.admin-login__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.admin-login__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--al-muted);
}

.admin-login__input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--al-border);
  background: rgba(0, 0, 0, 0.35);
  color: var(--al-text);
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.admin-login__input:focus {
  border-color: var(--al-accent);
  box-shadow: 0 0 0 3px var(--al-accent-glow);
}

.admin-login__input[aria-invalid='true'] {
  border-color: rgba(248, 113, 113, 0.65);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.18);
}

.admin-login__alert {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: var(--al-error-bg);
  color: var(--al-error);
  font-size: clamp(0.75rem, 2.8vw, 0.8125rem);
  line-height: 1.55;
  overflow-wrap: anywhere;
  word-break: break-word;
  animation: admin-login-alert-in 0.35s ease forwards;
}

@keyframes admin-login-alert-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-login__submit {
  align-self: center;
  min-width: min(100%, 14rem);
  padding: 0.75rem 1.75rem;
  border: 1px solid var(--al-accent);
  border-radius: 0.5rem;
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.22), rgba(201, 162, 39, 0.08));
  color: var(--al-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

.admin-login__submit:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.32), rgba(201, 162, 39, 0.14));
  transform: translateY(-1px);
}

.admin-login__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
`;

function randomHexLine(length = TERMINAL_LINE_LENGTH) {
  return Array.from({ length }, () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]).join('');
}

function CryptographicTerminal({ label }) {
  const [lines, setLines] = useState(() =>
    Array.from({ length: TERMINAL_LINE_COUNT }, () => randomHexLine()),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLines(Array.from({ length: TERMINAL_LINE_COUNT }, () => randomHexLine()));
    }, HEX_TICK_MS);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="admin-login__terminal" role="status" aria-live="polite">
      <p className="admin-login__terminal-label">{label}</p>
      {lines.map((line, index) => (
        <code key={`hex-${index}`} className="admin-login__terminal-line">
          {line}
        </code>
      ))}
    </div>
  );
}

/**
 * Administrative login gate with sessionStorage persistence.
 * Credentials resolve from VITE_ADMIN_USERNAME / VITE_ADMIN_PASSWORD with
 * hardened fallback defaults. On success, writes the active session flag to
 * sessionStorage and navigates to /admin. Error banners are set only from
 * submit mismatch — never on mount.
 *
 * @param {object} props
 * @param {() => void} [props.onAuthenticated] — callback after successful verification
 */
export default function AdminLogin({ onAuthenticated }) {
  const { t } = useAuthTranslator();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedUsername = username.trim();

    if (trimmedUsername === EXPECTED_USER && password === EXPECTED_PASS) {
      sessionStorage.setItem('safeai_admin_active_session', 'true');
      setError(null);
      onAuthenticated?.();
      navigate('/admin');
    } else {
      setError('Invalid administrator credentials.');
    }
  };

  return (
    <div className="admin-login">
      <style>{ADMIN_LOGIN_STYLES}</style>
      <div className="admin-login__shell">
        <CryptographicTerminal
          label={t(
            'admin.board.gate.terminalLabel',
            'Cryptographic challenge terminal — awaiting institutional authorization vector',
          )}
        />
        <form className="admin-login__form" onSubmit={handleLogin} noValidate>
          <h1 className="admin-login__title">
            {t('admin.board.login.title', 'Secure Administrative Login')}
          </h1>
          <p className="admin-login__authority">
            {t(
              'admin.board.gate.authorityNote',
              "Access restricted to authorized registrar personnel under L'Institut Article 4 security governance protocols.",
            )}
          </p>

          {error && (
            <p className="admin-login__alert" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="admin-login__field">
            <label className="admin-login__label" htmlFor="admin-login-username">
              {t('admin.board.login.usernameLabel', 'Administrator username')}
            </label>
            <input
              id="admin-login-username"
              className="admin-login__input"
              type="text"
              name="username"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={username}
              aria-invalid={Boolean(error)}
              onChange={(event) => {
                setUsername(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <div className="admin-login__field">
            <label className="admin-login__label" htmlFor="admin-login-password">
              {t('admin.board.login.passwordLabel', 'Secure password')}
            </label>
            <input
              id="admin-login-password"
              className="admin-login__input"
              type="password"
              name="password"
              autoComplete="current-password"
              spellCheck={false}
              value={password}
              aria-invalid={Boolean(error)}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(null);
              }}
            />
          </div>

          <button type="submit" className="admin-login__submit">
            {t('admin.board.gate.submit', 'Authenticate')}
          </button>
        </form>
      </div>
    </div>
  );
}
