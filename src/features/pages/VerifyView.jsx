import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createTranslator, getActiveLanguage } from '../../i18n/index.js';
import { isValidSha256HexHash } from '../verify/utils/waqfLedgerSimulator.js';
import { resolveVerificationRecord } from '../verify/utils/verificationRegistry.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';
const SCAN_DURATION_MS = 1500;
const HEX_TICK_MS = 50;
const HEX_CHARS = '0123456789ABCDEF';
const TERMINAL_LINE_COUNT = 8;
const TERMINAL_LINE_LENGTH = 64;

/** Canonical un-hashed metadata contract for independent SHA-256 terminal verification. */
const RAW_METADATA_CONTRACT = {
  assessment_id: 'A4-ALAM-2026-X992',
  role_id: 'CLL_COMPLIANCE_LEGAL',
  composite_score: 83.5,
};

const RAW_METADATA_JSON = JSON.stringify(RAW_METADATA_CONTRACT);

const INDEPENDENT_VERIFY_COMMAND =
  `echo -n '${RAW_METADATA_JSON}' | sha256sum`;

const VERIFY_VIEW_STYLES = `
.verify-view {
  --vv-bg: #0f172a;
  --vv-accent: #c9a227;
  --vv-accent-dim: rgba(201, 162, 39, 0.14);
  --vv-glass: rgba(15, 23, 42, 0.78);
  --vv-glass-elevated: rgba(17, 24, 39, 0.92);
  --vv-border: rgba(148, 163, 184, 0.22);
  --vv-text: #f8fafc;
  --vv-muted: #94a3b8;
  --vv-success: #22c55e;
  --vv-error: #f87171;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2.5rem);
  background: var(--vv-bg);
  color: var(--vv-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.verify-view__inner {
  width: min(100%, 72rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.verify-view__header {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.verify-view__title {
  margin: 0;
  font-size: clamp(1.5rem, 3.2vw, 2.125rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: var(--vv-text);
}

.verify-view__subtitle {
  margin: 0;
  max-width: 52rem;
  font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
  line-height: 1.65;
  color: var(--vv-muted);
}

.verify-view__desk {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: clamp(1.35rem, 3vw, 2rem);
  border-radius: 1.125rem;
  border: 1px solid var(--vv-border);
  background: var(--vv-glass);
  backdrop-filter: blur(22px) saturate(155%);
  -webkit-backdrop-filter: blur(22px) saturate(155%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.verify-view__desk-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__lookup {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: stretch;
}

.verify-view__input {
  width: 100%;
  min-width: 0;
  padding: 0.9rem 1.05rem;
  border-radius: 0.625rem;
  border: 1px solid var(--vv-border);
  background: rgba(11, 15, 25, 0.72);
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
  letter-spacing: 0.03em;
  color: var(--vv-text);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.verify-view__input::placeholder {
  color: rgba(148, 163, 184, 0.5);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.01em;
}

.verify-view__input:focus {
  outline: none;
  border-color: rgba(201, 162, 39, 0.55);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.14);
}

.verify-view__input--invalid {
  border-color: rgba(248, 113, 113, 0.5);
}

.verify-view__submit {
  flex-shrink: 0;
  padding: 0.9rem 1.35rem;
  border-radius: 0.625rem;
  border: 1px solid var(--vv-accent-dim);
  background: linear-gradient(180deg, rgba(201, 162, 39, 0.32), rgba(201, 162, 39, 0.12));
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vv-text);
  cursor: pointer;
  white-space: nowrap;
  transition:
    opacity 160ms ease,
    box-shadow 160ms ease;
}

.verify-view__submit:hover:not(:disabled) {
  box-shadow: 0 0 22px rgba(201, 162, 39, 0.28);
}

.verify-view__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.verify-view__waqf-caption {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.82);
  letter-spacing: 0.01em;
}

.verify-view__terminal {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(2, 6, 23, 0.88);
  overflow: hidden;
  min-height: 10.5rem;
}

.verify-view__terminal-label {
  margin: 0 0 0.35rem;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__terminal-line {
  display: block;
  margin: 0;
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(0.5625rem, 1.4vw, 0.6875rem);
  line-height: 1.45;
  letter-spacing: 0.06em;
  color: rgba(201, 162, 39, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: verify-terminal-flash 50ms steps(1) infinite;
}

@keyframes verify-terminal-flash {
  0%, 49% { opacity: 0.92; }
  50%, 100% { opacity: 0.55; }
}

.verify-view__feedback {
  margin: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.verify-view__feedback--error {
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: rgba(127, 29, 29, 0.22);
  color: #fecaca;
}

.verify-view__receipt {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 0.875rem;
  border: 1px solid rgba(34, 197, 94, 0.28);
  background: var(--vv-glass-elevated);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  overflow: hidden;
  animation: verify-receipt-reveal 320ms ease forwards;
}

@keyframes verify-receipt-reveal {
  from {
    opacity: 0;
    transform: translateY(0.35rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.verify-view__status-bar {
  margin: 0;
  padding: 0.85rem 1.15rem;
  font-size: clamp(0.75rem, 1.8vw, 0.875rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(22, 101, 52, 0.35);
  border-bottom: 1px solid rgba(34, 197, 94, 0.35);
  color: #bbf7d0;
}

.verify-view__status-bar--failed {
  background: rgba(127, 29, 29, 0.35);
  border-bottom-color: rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.verify-view__receipt-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: clamp(1.15rem, 2.5vw, 1.5rem);
}

.verify-view__receipt-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.verify-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(11, 15, 25, 0.5);
}

.verify-view__field--full {
  grid-column: 1 / -1;
}

.verify-view__field-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__field-value {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--vv-text);
  word-break: break-word;
}

.verify-view__field-value--mono {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
}

@media (max-width: 720px) {
  .verify-view__lookup {
    grid-template-columns: 1fr;
  }

  .verify-view__grid {
    grid-template-columns: 1fr;
  }
}

.verify-view__vault {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: clamp(1.35rem, 3vw, 2rem);
  border-radius: 1.125rem;
  border: 1px solid var(--vv-border);
  background: var(--vv-glass-elevated);
  backdrop-filter: blur(22px) saturate(155%);
  -webkit-backdrop-filter: blur(22px) saturate(155%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.verify-view__vault-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__payload-console {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(15, 23, 42, 0.95);
  background: #000000;
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.06);
  min-width: 0;
}

.verify-view__payload-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.72);
}

.verify-view__payload-pre {
  margin: 0;
  overflow-x: auto;
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
  line-height: 1.65;
  color: #cbd5e1;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.verify-view__audit-callout {
  margin: 0;
  padding: 1rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(201, 162, 39, 0.08);
  font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
  line-height: 1.7;
  color: #fde68a;
  overflow-wrap: break-word;
  word-break: break-word;
}

.verify-view__command-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.verify-view__command-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.72);
}

.verify-view__copy-button {
  flex-shrink: 0;
  padding: 0.35rem 0.65rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(52, 211, 153, 0.35);
  background: rgba(6, 78, 59, 0.35);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6ee7b7;
  cursor: pointer;
}

.verify-view__copy-button:hover {
  border-color: rgba(52, 211, 153, 0.55);
  background: rgba(6, 78, 59, 0.55);
}

.verify-view__copy-toast {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6ee7b7;
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

function formatRawMetadataContract(payload = RAW_METADATA_CONTRACT) {
  return JSON.stringify(payload, null, 2);
}

function CopyableVerifyCommand({ command, copyLabel, copiedLabel }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="verify-view__command-header">
        <p className="verify-view__command-label">{copyLabel}</p>
        <button type="button" className="verify-view__copy-button" onClick={handleCopy}>
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <code className="break-all rounded border border-slate-800 bg-black p-4 font-mono text-emerald-400">
        {command}
      </code>
      {copied ? (
        <p className="verify-view__copy-toast" role="status">
          {copiedLabel}
        </p>
      ) : null}
    </div>
  );
}

function VerificationVault({ t }) {
  return (
    <section className="verify-view__vault" aria-labelledby="verify-vault-title">
      <h2 id="verify-vault-title" className="verify-view__vault-title">
        {t('verify.portal.vault.title')}
      </h2>

      <div className="verify-view__payload-console">
        <p className="verify-view__payload-label">{t('verify.portal.vault.rawPayloadLabel')}</p>
        <pre className="verify-view__payload-pre">{formatRawMetadataContract()}</pre>
      </div>

      <p className="verify-view__audit-callout">{t('verify.portal.vault.auditCallout')}</p>

      <CopyableVerifyCommand
        command={INDEPENDENT_VERIFY_COMMAND}
        copyLabel={t('verify.portal.vault.copyCommand')}
        copiedLabel={t('verify.portal.vault.copySuccess')}
      />
    </section>
  );
}

function generateHexLine(length = TERMINAL_LINE_LENGTH) {
  return Array.from(
    { length },
    () => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)],
  ).join('');
}

function HexScanTerminal({ label }) {
  const [rows, setRows] = useState(() =>
    Array.from({ length: TERMINAL_LINE_COUNT }, () => generateHexLine()),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRows(Array.from({ length: TERMINAL_LINE_COUNT }, () => generateHexLine()));
    }, HEX_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="verify-view__terminal" role="status" aria-live="polite">
      <p className="verify-view__terminal-label">{label}</p>
      {rows.map((row, index) => (
        <code key={`hex-${index}`} className="verify-view__terminal-line">
          {row}
        </code>
      ))}
    </div>
  );
}

function formatLedgerTimestamp(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

/**
 * Public Cryptographic Verification Portal — sovereign provenance term lookup terminal.
 */
export default function VerifyView({ language: languageProp }) {
  const { t } = usePageTranslator(languageProp);
  const [searchParams] = useSearchParams();
  const urlHydratedRef = useRef(false);

  const [hashInput, setHashInput] = useState('');
  const [lastAuditedHash, setLastAuditedHash] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [validationKey, setValidationKey] = useState(null);

  useEffect(() => {
    document.title = t('page_titles.verify');
  }, [t]);

  const resolveValidationKey = useCallback((value, auditedHash, { onSubmit = false } = {}) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'verify.portal.validationEmpty';
    }

    if (auditedHash && trimmed.toLowerCase() !== auditedHash) {
      return 'verify.portal.validationModified';
    }

    if (onSubmit && !isValidSha256HexHash(trimmed)) {
      return 'verify.portal.validationInvalid';
    }

    return null;
  }, []);

  const runVerification = useCallback(
    async (rawHash) => {
      const trimmed = rawHash.trim();
      const validation = resolveValidationKey(trimmed, null, { onSubmit: true });

      if (validation) {
        setValidationKey(validation);
        setVerificationResult(null);
        setLastAuditedHash(null);
        return;
      }

      setValidationKey(null);
      setVerificationResult(null);
      setIsScanning(true);

      await new Promise((resolve) => {
        window.setTimeout(resolve, SCAN_DURATION_MS);
      });

      const normalizedHash = trimmed.toLowerCase();
      const record = resolveVerificationRecord(normalizedHash);

      setIsScanning(false);
      setLastAuditedHash(normalizedHash);
      setVerificationResult(record ?? { verified: false });
    },
    [resolveValidationKey],
  );

  useEffect(() => {
    if (urlHydratedRef.current) return;

    const urlHash = searchParams.get('hash');
    if (!urlHash) return;

    urlHydratedRef.current = true;
    setHashInput(urlHash);
    runVerification(urlHash);
  }, [searchParams, runVerification]);

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setHashInput(nextValue);

    const trimmed = nextValue.trim();
    const normalizedAudited = lastAuditedHash?.toLowerCase() ?? null;

    if (verificationResult && trimmed.toLowerCase() !== normalizedAudited) {
      setVerificationResult(null);
    }

    setValidationKey(resolveValidationKey(nextValue, lastAuditedHash));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runVerification(hashInput);
  };

  const showValidation = Boolean(validationKey) && !isScanning;
  const showResult = Boolean(verificationResult) && !isScanning && !validationKey;
  const inputInvalid = showValidation && validationKey !== 'verify.portal.validationModified';

  const candidateDisplayName =
    verificationResult?.verified && verificationResult.candidateNameIsCredentialId
      ? t('verify.portal.institutionalHolder').replace(
          '{credentialId}',
          verificationResult.candidateName,
        )
      : verificationResult?.candidateName;

  return (
    <div className="verify-view">
      <style>{VERIFY_VIEW_STYLES}</style>

      <div className="verify-view__inner">
        <header className="verify-view__header">
          <h1 className="verify-view__title">{t('verify.portal.pageTitle')}</h1>
          <p className="verify-view__subtitle">{t('verify.portal.pageSubtitle')}</p>
        </header>

        <section className="verify-view__desk" aria-labelledby="verify-desk-title">
          <h2 id="verify-desk-title" className="verify-view__desk-label">
            {t('verify.portal.deskTitle')}
          </h2>

          <form className="verify-view__lookup" onSubmit={handleSubmit}>
            <input
              type="text"
              className={
                inputInvalid
                  ? 'verify-view__input verify-view__input--invalid'
                  : 'verify-view__input'
              }
              value={hashInput}
              onChange={handleInputChange}
              placeholder={t('verify.portal.searchPlaceholder')}
              aria-label={t('verify.portal.searchPlaceholder')}
              aria-invalid={inputInvalid}
              autoComplete="off"
              spellCheck={false}
              maxLength={64}
            />
            <button type="submit" className="verify-view__submit" disabled={isScanning}>
              {t('verify.portal.searchButton')}
            </button>
          </form>

          <p className="verify-view__waqf-caption">{t('verify.portal.waqfLedgerCaption')}</p>

          {isScanning && (
            <HexScanTerminal label={t('verify.portal.scanningLabel')} />
          )}

          {showValidation && (
            <p className="verify-view__feedback verify-view__feedback--error" role="alert">
              {t(validationKey)}
            </p>
          )}

          {showResult && verificationResult?.verified && (
            <article className="verify-view__receipt" aria-live="polite">
              <p className="verify-view__status-bar">{t('verify.portal.statusValid')}</p>
              <div className="verify-view__receipt-body">
                <h3 className="verify-view__receipt-title">{t('verify.portal.receiptTitle')}</h3>
                <dl className="verify-view__grid">
                  <div className="verify-view__field">
                    <dt className="verify-view__field-label">
                      {t('verify.portal.fields.candidateName')}
                    </dt>
                    <dd className="verify-view__field-value">{candidateDisplayName}</dd>
                  </div>

                  <div className="verify-view__field">
                    <dt className="verify-view__field-label">
                      {t('verify.portal.fields.complianceLevel')}
                    </dt>
                    <dd className="verify-view__field-value">
                      {verificationResult?.complianceLevel}
                    </dd>
                  </div>

                  <div className="verify-view__field">
                    <dt className="verify-view__field-label">
                      {t('verify.portal.fields.timestamp')}
                    </dt>
                    <dd className="verify-view__field-value">
                      {formatLedgerTimestamp(verificationResult?.timestamp)}
                    </dd>
                  </div>

                  <div className="verify-view__field">
                    <dt className="verify-view__field-label">
                      {t('verify.portal.fields.registryAuthority')}
                    </dt>
                    <dd className="verify-view__field-value">
                      {t('verify.portal.registryAuthorityValue')}
                    </dd>
                  </div>

                  <div className="verify-view__field verify-view__field--full">
                    <dt className="verify-view__field-label">
                      {t('verify.portal.fields.stateHash')}
                    </dt>
                    <dd className="verify-view__field-value verify-view__field-value--mono">
                      {verificationResult?.stateHash}
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          )}

          {showResult && verificationResult && !verificationResult.verified && (
            <article className="verify-view__receipt" aria-live="polite">
              <p className="verify-view__status-bar verify-view__status-bar--failed">
                {t('verify.portal.statusFailed')}
              </p>
            </article>
          )}
        </section>

        <VerificationVault t={t} />
      </div>
    </div>
  );
}
