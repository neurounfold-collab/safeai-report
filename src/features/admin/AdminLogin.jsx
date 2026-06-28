import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthTranslator } from '../auth/hooks/useAuthTranslator.js';

export const ADMIN_SESSION_KEY = 'safeai_admin_active_session';
export const ADMIN_SESSION_TTL_MS = 60 * 60 * 1000;
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
 * Credentials are loaded at login from ./admin-config.json (public root).
 * Edit that file in Hostinger hPanel — no frontend rebuild required.
 *
 * 1. USERNAME — Set "username" to the new operator identifier.
 *
 * 2. PASSWORD — Choose a new passphrase, then compute its SHA-256 hex digest
 *    (lowercase, 64 characters). In a secure browser console:
 *
 *      async function sha256(text) {
 *        const buf = await crypto.subtle.digest(
 *          'SHA-256',
 *          new TextEncoder().encode(text),
 *        );
 *        return [...new Uint8Array(buf)]
 *          .map((b) => b.toString(16).padStart(2, '0'))
 *          .join('');
 *      }
 *      sha256('YourNewPassphrase').then(console.log);
 *
 *    Paste the resulting digest into "passwordHash" in admin-config.json.
 *
 * 3. DEPLOY — Upload or edit public/admin-config.json on the host only.
 *
 * 4. INVALIDATE — Clear active sessions:
 *    sessionStorage.removeItem('safeai_admin_active_session')
 *    or wait for the 60-minute inactivity window to expire.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const ADMIN_CONFIG_PATH = './admin-config.json';

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

function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return mismatch === 0;
}

/**
 * @param {string} plainText
 * @returns {Promise<string>}
 */
export async function hashPasswordFingerprint(plainText) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API unavailable; SHA-256 digest required for admin verification.');
  }

  const data = new TextEncoder().encode(plainText);
  const digestBuffer = await subtle.digest('SHA-256', data);
  return [...new Uint8Array(digestBuffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * @returns {Promise<{ username: string, passwordHash: string, allowPlainTextFallback: boolean }>}
 */
async function fetchAdminSecurityConfig() {
  let response;
  try {
    response = await fetch(ADMIN_CONFIG_PATH, { cache: 'no-store' });
  } catch {
    throw new Error('ADMIN_CONFIG_UNAVAILABLE');
  }

  if (!response.ok) {
    throw new Error('ADMIN_CONFIG_UNAVAILABLE');
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error('ADMIN_CONFIG_UNAVAILABLE');
  }

  const { username, passwordHash, allowPlainTextFallback } = payload ?? {};
  if (
    typeof username !== 'string' ||
    typeof passwordHash !== 'string' ||
    !username.trim() ||
    !passwordHash.trim()
  ) {
    throw new Error('ADMIN_CONFIG_UNAVAILABLE');
  }

  const usePlainTextFallback = allowPlainTextFallback === true;

  return {
    username: username.trim(),
    passwordHash: usePlainTextFallback
      ? passwordHash.trim()
      : passwordHash.trim().toLowerCase(),
    allowPlainTextFallback: usePlainTextFallback,
  };
}

function readSessionRecord() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.token !== 'string' ||
      typeof parsed.lastActivityAt !== 'number'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSessionRecord(record) {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(record));
  } catch {
    /* sessionStorage unavailable */
  }
}

function generateSessionToken() {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return bufferToHex(bytes.buffer);
}

export function isAdminSessionValid() {
  const record = readSessionRecord();
  if (!record) return false;

  const elapsed = Date.now() - record.lastActivityAt;
  if (elapsed > ADMIN_SESSION_TTL_MS) {
    clearAdminSession();
    return false;
  }

  return true;
}

export function createAdminSession() {
  const now = Date.now();
  const record = {
    token: generateSessionToken(),
    issuedAt: now,
    lastActivityAt: now,
  };
  writeSessionRecord(record);
  return record;
}

export function touchAdminSession() {
  const record = readSessionRecord();
  if (!record) return false;

  record.lastActivityAt = Date.now();
  writeSessionRecord(record);
  return true;
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* sessionStorage unavailable */
  }
}

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'];

/**
 * Keeps the admin session alive on user activity and expires it after inactivity.
 */
export function useAdminSessionGuard(isActive, onExpired) {
  useEffect(() => {
    if (!isActive) return undefined;

    const handleActivity = () => {
      touchAdminSession();
    };

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true });
    });

    const intervalId = window.setInterval(() => {
      if (!isAdminSessionValid()) {
        onExpired?.();
      }
    }, 30_000);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      window.clearInterval(intervalId);
    };
  }, [isActive, onExpired]);
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
 * Hash-verified administrative login gate with sessionStorage persistence.
 *
 * @param {object} props
 * @param {() => void} [props.onAuthenticated] — callback after successful verification
 */
export default function AdminLogin({ onAuthenticated }) {
  const { t } = useAuthTranslator();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setAuthError('');

      const trimmedUsername = username.trim();
      const trimmedPassword = password;

      if (!trimmedUsername || !trimmedPassword) {
        setAuthError(
          t(
            'admin.board.login.error',
            'Hash-verified credential validation failed. Access denied under Article 4 security governance protocols.',
          ),
        );
        return;
      }

      setIsVerifying(true);

      try {
        let securityConfig;
        try {
          securityConfig = await fetchAdminSecurityConfig();
        } catch {
          setAuthError(
            t(
              'admin.board.login.configError',
              'System Configuration Error: Security descriptor vector missing.',
            ),
          );
          return;
        }

        const usernameMatch = trimmedUsername === securityConfig.username;
        let passwordMatch;

        if (securityConfig.allowPlainTextFallback) {
          passwordMatch = timingSafeEqual(trimmedPassword, securityConfig.passwordHash);
        } else {
          const passwordHash = await hashPasswordFingerprint(trimmedPassword);
          passwordMatch = timingSafeEqual(passwordHash, securityConfig.passwordHash);
        }

        if (usernameMatch && passwordMatch) {
          createAdminSession();
          setUsername('');
          setPassword('');
          onAuthenticated?.();
          navigate(ADMIN_DASHBOARD_PATH, { replace: true });
          return;
        }

        setAuthError(
          t(
            'admin.board.login.error',
            'Hash-verified credential validation failed. Access denied under Article 4 security governance protocols.',
          ),
        );
        setPassword('');
      } catch {
        setAuthError(
          t(
            'admin.board.login.cryptoError',
            'Cryptographic subsystem unavailable. Secure context required for SHA-256 verification.',
          ),
        );
      } finally {
        setIsVerifying(false);
      }
    },
    [username, password, navigate, onAuthenticated, t],
  );

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
        <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
          <h1 className="admin-login__title">
            {t('admin.board.login.title', 'Secure Administrative Login')}
          </h1>
          <p className="admin-login__authority">
            {t(
              'admin.board.gate.authorityNote',
              "Access restricted to authorized registrar personnel under L'Institut Article 4 security governance protocols.",
            )}
          </p>

          {authError && (
            <p className="admin-login__alert" role="alert" aria-live="assertive">
              {authError}
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
              disabled={isVerifying}
              aria-invalid={Boolean(authError)}
              onChange={(event) => {
                setUsername(event.target.value);
                if (authError) setAuthError('');
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
              disabled={isVerifying}
              aria-invalid={Boolean(authError)}
              onChange={(event) => {
                setPassword(event.target.value);
                if (authError) setAuthError('');
              }}
            />
          </div>

          <button type="submit" className="admin-login__submit" disabled={isVerifying}>
            {isVerifying
              ? t('admin.board.login.verifying', 'Verifying fingerprint…')
              : t('admin.board.gate.submit', 'Authenticate')}
          </button>
        </form>
      </div>
    </div>
  );
}
