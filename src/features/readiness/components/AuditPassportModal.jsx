import { useCallback, useEffect, useState } from 'react';
import {
  generateAuditPassport,
  downloadAuditPassportJsonLd,
  printComplianceSummary,
  serializeAuditPassport,
  canMintAuditPassport,
} from '../../../utils/auditPassportGenerator.js';

const MODAL_STYLES = `
.audit-passport-modal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(2, 6, 23, 0.82);
}

.audit-passport-modal {
  width: min(100%, 42rem);
  max-height: min(90vh, 36rem);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 0.5rem;
  background: #111827;
  color: #f8fafc;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
}

.audit-passport-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.1rem 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.14);
}

.audit-passport-modal__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
}

.audit-passport-modal__subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #94a3b8;
}

.audit-passport-modal__close {
  appearance: none;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 0.35rem;
  background: transparent;
  color: #94a3b8;
  padding: 0.35rem 0.55rem;
  cursor: pointer;
}

.audit-passport-modal__body {
  flex: 1 1 auto;
  overflow: auto;
  padding: 0.85rem 1.1rem;
}

.audit-passport-modal__preview {
  margin: 0;
  padding: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 0.35rem;
  background: rgba(11, 15, 25, 0.85);
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  color: #5eead4;
}

.audit-passport-modal__status {
  margin: 0;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.audit-passport-modal__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding: 0.85rem 1.1rem 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
}
`;

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   assessmentProfile: object | null,
 *   t: (key: string) => string,
 * }} props
 */
export default function AuditPassportModal({ open, onClose, assessmentProfile, t }) {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !canMintAuditPassport(assessmentProfile) || !assessmentProfile?.stateHash) {
      setPassport(null);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    generateAuditPassport(assessmentProfile)
      .then((doc) => {
        if (!cancelled) setPassport(doc);
      })
      .catch(() => {
        if (!cancelled) setError('generate');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, assessmentProfile]);

  const handleDownload = useCallback(() => {
    if (!passport) return;
    downloadAuditPassportJsonLd(passport);
  }, [passport]);

  const handlePrint = useCallback(() => {
    if (!passport) return;
    printComplianceSummary(passport, {
      title: t('readiness.verifia.passport.printTitle'),
      subtitle: t('readiness.verifia.passport.printSubtitle'),
    });
  }, [passport, t]);

  if (!open) return null;

  return (
    <div
      className="audit-passport-modal__backdrop"
      role="presentation"
      onClick={onClose}
    >
      <style>{MODAL_STYLES}</style>
      <div
        className="audit-passport-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-passport-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="audit-passport-modal__header">
          <div>
            <h2 id="audit-passport-modal-title" className="audit-passport-modal__title">
              {t('readiness.verifia.passport.previewTitle')}
            </h2>
            <p className="audit-passport-modal__subtitle">
              {t('readiness.verifia.passport.previewSubtitle')}
            </p>
          </div>
          <button type="button" className="audit-passport-modal__close" onClick={onClose}>
            {t('readiness.verifia.passport.close')}
          </button>
        </header>

        <div className="audit-passport-modal__body">
          {loading && (
            <p className="audit-passport-modal__status">{t('readiness.verifia.passport.loading')}</p>
          )}
          {error && (
            <p className="audit-passport-modal__status">{t('readiness.verifia.passport.error')}</p>
          )}
          {!loading && !error && passport && (
            <pre className="audit-passport-modal__preview">{serializeAuditPassport(passport)}</pre>
          )}
        </div>

        <div className="audit-passport-modal__actions">
          <button
            type="button"
            className="readiness-btn readiness-btn--primary"
            disabled={!passport}
            onClick={handleDownload}
          >
            {t('readiness.verifia.passport.downloadJsonLd')}
          </button>
          <button
            type="button"
            className="readiness-btn readiness-btn--ghost"
            disabled={!passport}
            onClick={handlePrint}
          >
            {t('readiness.verifia.passport.printSummary')}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {object | null} assessmentProfile
 */
export function useAuditPassport(assessmentProfile) {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!canMintAuditPassport(assessmentProfile) || !assessmentProfile?.stateHash) {
      setPassport(null);
      setError(null);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    generateAuditPassport(assessmentProfile)
      .then((doc) => {
        if (!cancelled) setPassport(doc);
      })
      .catch(() => {
        if (!cancelled) setError('generate');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [assessmentProfile]);

  return { passport, loading, error };
}
