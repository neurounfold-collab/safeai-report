import React, { useCallback, useMemo, useState } from 'react';
import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import { PASS_THRESHOLD, buildDoctoralDatasetPayload } from '../utils/researchTelemetrySeed.js';

const WIRE_FILTER_ALL = 'all';
const WIRE_FILTER_AUTO = 'auto';
const WIRE_FILTER_MERCURY_PENDING = 'mercury_pending';

const TARGET_TIER_INVOICE = {
  TIER_A_GRANT: {
    label: 'Tier A Grant — Voluntary Research Support Grant',
    amount: '€1,500.00 EUR',
  },
  TIER_B_SPONSORSHIP: {
    label: 'Tier B Node Sponsorship — Infrastructure Node Sponsorship',
    amount: '€3,500.00 EUR',
  },
};

/** Synthetic Mercury wire intake records for registrar admin processing. */
const MERCURY_WIRE_INTAKE_ROWS = [
  {
    id: 'mercury-wire-001',
    timestamp: '2026-06-24T14:22:00.000Z',
    maskedIdentifier: 'INTAKE-MERCURY-001',
    evaluationTrack: 'institutional_funding',
    language: 'en',
    score: 100,
    stateHash: 'c7e9f1a2b3d4567890abcdef1234567890abcdef1234567890abcdef12345678',
    waqfLedgerSynced: false,
    payment_method: 'MERCURY_WIRE',
    billing_status: 'INVOICE_PENDING',
    target_tier: 'TIER_A_GRANT',
    client_email: 'registrar@university.edu',
    invoice_specifications:
      'Voluntary Research Support Grant — 120 faculty cohort, Q3 2026 Article 4 deployment.',
  },
  {
    id: 'mercury-wire-002',
    timestamp: '2026-06-22T09:15:00.000Z',
    maskedIdentifier: 'INTAKE-MERCURY-002',
    evaluationTrack: 'institutional_funding',
    language: 'fr',
    score: 100,
    stateHash: 'd8f0a2b3c4e5678901bcdef2345678901bcdef2345678901bcdef2345678901',
    waqfLedgerSynced: true,
    payment_method: 'MERCURY_WIRE',
    billing_status: 'PAID',
    target_tier: 'TIER_B_SPONSORSHIP',
    client_email: 'finance@institut-a4i.fr',
    invoice_specifications:
      'Infrastructure Node Sponsorship — sovereign SWIFT settlement, registrar analytics workspace.',
  },
  {
    id: 'mercury-wire-003',
    timestamp: '2026-06-25T11:40:00.000Z',
    maskedIdentifier: 'INTAKE-MERCURY-003',
    evaluationTrack: 'institutional_funding',
    language: 'es',
    score: 100,
    stateHash: 'e9a1b2c3d4f6789012cdef3456789012cdef3456789012cdef3456789012cdef3',
    waqfLedgerSynced: false,
    payment_method: 'MERCURY_WIRE',
    billing_status: 'INVOICE_PENDING',
    target_tier: 'TIER_B_SPONSORSHIP',
    client_email: 'tesoreria@centro-academico.es',
    invoice_specifications:
      'Node Sponsorship wire — 50 pre-paid Level 01 tokens, WaqfLedger telemetry indexing.',
  },
];

const TELEMETRY_TABLE_STYLES = `
.telemetry-table {
  margin-top: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.telemetry-table__viewport {
  border-radius: 0.625rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.telemetry-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(10, 14, 23, 0.55);
}

.telemetry-table__heading {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.telemetry-table__wire-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(10, 14, 23, 0.38);
}

.telemetry-table__wire-tab {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.55);
  color: #94a3b8;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
  white-space: nowrap;
}

.telemetry-table__wire-tab:hover {
  border-color: rgba(201, 162, 39, 0.45);
  color: #e2e8f0;
}

.telemetry-table__wire-tab--active {
  border-color: rgba(201, 162, 39, 0.65);
  background: rgba(201, 162, 39, 0.14);
  color: #fef08a;
}

.telemetry-table__wire-tab--active.telemetry-table__wire-tab--mercury {
  border-color: rgba(251, 191, 36, 0.75);
  background: rgba(251, 191, 36, 0.16);
  color: #fde68a;
}

.telemetry-table__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-inline-start: auto;
}

[dir="rtl"] .telemetry-table__toolbar {
  flex-direction: row-reverse;
}

[dir="rtl"] .telemetry-table__actions {
  margin-inline-start: 0;
  margin-inline-end: auto;
}

.telemetry-table__export {
  padding: 0.5rem 0.85rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(201, 162, 39, 0.55);
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.2), rgba(201, 162, 39, 0.08));
  color: #c9a227;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  white-space: nowrap;
}

.telemetry-table__export:hover {
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.32), rgba(201, 162, 39, 0.14));
  transform: translateY(-1px);
}

.telemetry-table__export--json {
  border-color: rgba(94, 234, 212, 0.45);
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.16), rgba(94, 234, 212, 0.06));
  color: #5eead4;
}

.telemetry-table__export--json:hover {
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.26), rgba(94, 234, 212, 0.12));
}

.telemetry-table__scroll {
  max-height: min(28rem, 55vh);
  overflow: auto;
}

.telemetry-table__grid {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.6875rem;
}

.telemetry-table__grid th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 0.55rem 0.65rem;
  text-align: start;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
  background: rgba(0, 0, 0, 0.62);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  white-space: nowrap;
}

.telemetry-table__grid td {
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  vertical-align: top;
  color: #f8fafc;
}

.telemetry-table__grid tbody tr:hover td {
  background: rgba(94, 234, 212, 0.04);
}

.telemetry-table__row--clickable {
  cursor: pointer;
}

.telemetry-table__row--clickable:hover td {
  background: rgba(251, 191, 36, 0.08) !important;
}

.telemetry-table__grid tr:last-child td {
  border-bottom: none;
}

.telemetry-table__mono {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.02em;
}

.telemetry-table__hash {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.02em;
  color: #5eead4;
  word-break: break-all;
  overflow-wrap: anywhere;
  max-width: 14rem;
  line-height: 1.45;
}

.telemetry-table__score {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: #5eead4;
}

.telemetry-table__score--fail {
  color: #f87171;
}

.telemetry-table__track-lang {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.telemetry-table__sync {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
}

.telemetry-table__sync--yes {
  background: rgba(34, 197, 94, 0.18);
  color: #22c55e;
}

.telemetry-table__sync--no {
  background: rgba(148, 163, 184, 0.12);
  color: #64748b;
}

.telemetry-table__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.28rem 0.55rem;
  border-radius: 0.35rem;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.35;
  white-space: nowrap;
}

.telemetry-table__badge--wire-pending {
  border: 1px solid rgba(251, 191, 36, 0.75);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.28), rgba(180, 83, 9, 0.22));
  color: #fde68a;
  box-shadow: 0 0 14px rgba(251, 191, 36, 0.22);
}

.telemetry-table__badge--compliant {
  border: 1px solid rgba(34, 197, 94, 0.65);
  background: #15803d;
  color: #ecfdf5;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.18);
}

.telemetry-table__empty {
  margin: 0;
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.telemetry-table__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.telemetry-table__modal-shell {
  width: min(100%, 42rem);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: #f8fafc;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
}

.telemetry-table__modal-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  background: #0f172a;
}

.telemetry-table__modal-toolbar-title {
  margin: 0;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5eead4;
}

.telemetry-table__modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.telemetry-table__modal-btn {
  padding: 0.45rem 0.75rem;
  border-radius: 0.4rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(15, 23, 42, 0.65);
  color: #e2e8f0;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
}

.telemetry-table__modal-btn--print {
  border-color: rgba(201, 162, 39, 0.65);
  background: rgba(201, 162, 39, 0.18);
  color: #fef08a;
}

.mercury-invoice-print {
  padding: clamp(1.25rem, 3vw, 2rem);
  color: #0f172a;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
}

.mercury-invoice-print__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #0f172a;
  margin-bottom: 1.25rem;
}

.mercury-invoice-print__logo {
  width: 4.5rem;
  height: 4.5rem;
  border: 2px dashed rgba(15, 23, 42, 0.35);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  text-align: center;
}

.mercury-invoice-print__title-block {
  flex: 1 1 16rem;
  min-width: 0;
}

.mercury-invoice-print__title {
  margin: 0 0 0.35rem;
  font-size: clamp(0.875rem, 2.2vw, 1.0625rem);
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #0f172a;
}

.mercury-invoice-print__meta {
  margin: 0;
  font-size: 0.625rem;
  color: #475569;
}

.mercury-invoice-print__section {
  margin-bottom: 1.15rem;
}

.mercury-invoice-print__section-title {
  margin: 0 0 0.45rem;
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #334155;
}

.mercury-invoice-print__grid {
  display: grid;
  grid-template-columns: minmax(0, 9rem) minmax(0, 1fr);
  gap: 0.35rem 0.75rem;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #ffffff;
}

.mercury-invoice-print__label {
  font-weight: 700;
  color: #64748b;
}

.mercury-invoice-print__value {
  word-break: break-word;
  color: #0f172a;
}

.mercury-invoice-print__ledger {
  padding: 0.85rem;
  border: 2px solid #0f172a;
  border-radius: 0.375rem;
  background: #f1f5f9;
}

.mercury-invoice-print__amount {
  margin: 0.5rem 0 0;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 800;
  color: #0f172a;
}

.mercury-invoice-print__coordinates {
  padding: 0.85rem;
  border: 1px solid #94a3b8;
  border-radius: 0.375rem;
  background: #ffffff;
}

.mercury-invoice-print__coordinates p {
  margin: 0 0 0.35rem;
}

.mercury-invoice-print__coordinates p:last-child {
  margin-bottom: 0;
}

@media print {
  body * {
    visibility: hidden !important;
  }

  .telemetry-table__modal-backdrop,
  .telemetry-table__modal-backdrop * {
    visibility: visible !important;
  }

  .telemetry-table__modal-backdrop {
    position: absolute !important;
    inset: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    backdrop-filter: none !important;
  }

  .telemetry-table__modal-toolbar {
    display: none !important;
  }

  .telemetry-table__modal-shell {
    width: 100% !important;
    max-height: none !important;
    overflow: visible !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .mercury-invoice-print {
    padding: 0.5in !important;
  }
}
`;

const TRACK_LABELS = {
  level01: 'L01',
  level02: 'L02',
  level03: 'L03',
  institutional_funding: 'FND',
};

const mercuryNodeDetails = SAFEAI_MASTER_CONFIG?.fundingGateways?.mercuryNodeDetails ?? {};

function escapeCsvValue(value) {
  const stringValue = String(value ?? '');
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function triggerBrowserDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

function formatTableTimestamp(iso) {
  if (!iso) return '—';
  return new Date(iso).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

function buildExportTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function isMercuryWireRow(row) {
  return row?.payment_method === 'MERCURY_WIRE';
}

function isPendingMercuryWireRow(row) {
  return isMercuryWireRow(row) && row?.billing_status === 'INVOICE_PENDING';
}

function applyWireChannelFilter(rows, wireFilter) {
  if (wireFilter === WIRE_FILTER_AUTO) {
    return rows.filter((row) => !isMercuryWireRow(row));
  }

  if (wireFilter === WIRE_FILTER_MERCURY_PENDING) {
    return rows.filter((row) => isPendingMercuryWireRow(row));
  }

  return rows;
}

function resolveSettlementBadge(row, t) {
  if (!isMercuryWireRow(row)) {
    return null;
  }

  if (row.billing_status === 'PAID') {
    return (
      <span className="telemetry-table__badge telemetry-table__badge--compliant">
        {t('admin.board.research.table.badges.compliant', 'COMPLIANT')}
      </span>
    );
  }

  return (
    <span className="telemetry-table__badge telemetry-table__badge--wire-pending">
      {t(
        'admin.board.research.table.badges.wirePending',
        '⚠️ WIRE: INVOICE PENDING',
      )}
    </span>
  );
}

function buildCsvFromRows(rows) {
  const headers = [
    'timestamp',
    'masked_identifier',
    'evaluation_track',
    'language_stream',
    'scenario_performance_score',
    'state_hash_sha256',
    'waqf_ledger_synced',
    'payment_method',
    'billing_status',
    'target_tier',
    'client_email',
  ];

  const lines = [headers.join(',')];

  rows.forEach((row) => {
    lines.push(
      [
        row.timestamp,
        row.maskedIdentifier,
        row.evaluationTrack,
        row.language,
        row.score,
        row.stateHash,
        row.waqfLedgerSynced ? 'true' : 'false',
        row.payment_method ?? '',
        row.billing_status ?? '',
        row.target_tier ?? '',
        row.client_email ?? '',
      ]
        .map(escapeCsvValue)
        .join(','),
    );
  });

  return `${lines.join('\n')}\n`;
}

function MercuryInvoiceModal({ row, t, onClose }) {
  if (!row) return null;

  const tierMeta =
    TARGET_TIER_INVOICE[row.target_tier] ?? TARGET_TIER_INVOICE.TIER_A_GRANT;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="telemetry-table__modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mercury-invoice-title"
      onClick={onClose}
    >
      <div className="telemetry-table__modal-shell" onClick={(event) => event.stopPropagation()}>
        <div className="telemetry-table__modal-toolbar">
          <p className="telemetry-table__modal-toolbar-title">
            {t(
              'admin.board.research.table.invoice.modalTitle',
              'Mercury Wire Invoice — Print Preview',
            )}
          </p>
          <div className="telemetry-table__modal-actions">
            <button
              type="button"
              className="telemetry-table__modal-btn telemetry-table__modal-btn--print"
              onClick={handlePrint}
            >
              {t('admin.board.research.table.invoice.print', 'Print PDF Invoice')}
            </button>
            <button type="button" className="telemetry-table__modal-btn" onClick={onClose}>
              {t('admin.board.research.table.invoice.close', 'Close')}
            </button>
          </div>
        </div>

        <article className="mercury-invoice-print" id="mercury-invoice-print-root">
          <header className="mercury-invoice-print__header">
            <div className="mercury-invoice-print__logo" aria-hidden="true">
              {t('admin.board.research.table.invoice.logoPlaceholder', 'Official Logo')}
            </div>
            <div className="mercury-invoice-print__title-block">
              <h2 className="mercury-invoice-print__title" id="mercury-invoice-title">
                {t(
                  'admin.board.research.table.invoice.documentTitle',
                  "L'Institut Article 4 Institutional Invoice",
                )}
              </h2>
              <p className="mercury-invoice-print__meta">
                {t('admin.board.research.table.invoice.invoiceId', 'Invoice ID')}:{' '}
                {row.id} · {formatTableTimestamp(row.timestamp)}
              </p>
            </div>
          </header>

          <section className="mercury-invoice-print__section">
            <h3 className="mercury-invoice-print__section-title">
              {t('admin.board.research.table.invoice.billTo', 'Bill To')}
            </h3>
            <div className="mercury-invoice-print__grid">
              <span className="mercury-invoice-print__label">
                {t('admin.board.research.table.invoice.clientEmail', 'Client Email')}
              </span>
              <span className="mercury-invoice-print__value">{row.client_email ?? '—'}</span>
              <span className="mercury-invoice-print__label">
                {t(
                  'admin.board.research.table.invoice.specifications',
                  'Invoice Specifications',
                )}
              </span>
              <span className="mercury-invoice-print__value">
                {row.invoice_specifications ?? '—'}
              </span>
            </div>
          </section>

          <section className="mercury-invoice-print__section">
            <h3 className="mercury-invoice-print__section-title">
              {t('admin.board.research.table.invoice.ledgerBlock', 'Core Ledger Block')}
            </h3>
            <div className="mercury-invoice-print__ledger">
              <div className="mercury-invoice-print__grid">
                <span className="mercury-invoice-print__label">
                  {t('admin.board.research.table.invoice.tier', 'Selected Tier')}
                </span>
                <span className="mercury-invoice-print__value">{tierMeta.label}</span>
                <span className="mercury-invoice-print__label">
                  {t('admin.board.research.table.invoice.paymentTerms', 'Payment Terms')}
                </span>
                <span className="mercury-invoice-print__value">Net 30</span>
              </div>
              <p className="mercury-invoice-print__amount">{tierMeta.amount}</p>
            </div>
          </section>

          <section className="mercury-invoice-print__section">
            <h3 className="mercury-invoice-print__section-title">
              {t(
                'admin.board.research.table.invoice.settlementCoordinates',
                'Settlement Account Coordinates',
              )}
            </h3>
            <div className="mercury-invoice-print__coordinates">
              <p>
                <strong>{t('admin.board.research.table.invoice.beneficiary', 'Beneficiary')}:</strong>{' '}
                {mercuryNodeDetails.beneficiary}
              </p>
              <p>
                <strong>{t('admin.board.research.table.invoice.bank', 'Bank')}:</strong>{' '}
                {mercuryNodeDetails.bank}
              </p>
              <p>
                <strong>{t('admin.board.research.table.invoice.routing', 'Routing')}:</strong>{' '}
                {mercuryNodeDetails.routing}
              </p>
              <p>
                <strong>{t('admin.board.research.table.invoice.account', 'Account')}:</strong>{' '}
                {mercuryNodeDetails.account}
              </p>
              <p>
                <strong>{t('admin.board.research.table.invoice.swift', 'SWIFT')}:</strong>{' '}
                {mercuryNodeDetails.swift}
              </p>
              <p>
                <strong>
                  {t(
                    'admin.board.research.table.invoice.intermediarySwift',
                    'Intermediary SWIFT',
                  )}
                  :
                </strong>{' '}
                {mercuryNodeDetails.intermediarySwift}
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}

/**
 * Academic-grade research telemetry grid with Mercury wire admin processing.
 *
 * @param {object} props
 * @param {(key: string, fallback?: string) => string} props.t
 * @param {Array<object>} props.filteredRows — currently filtered dataset for table + CSV export
 * @param {Array<object>} props.allRows — complete raw research model for JSON schema export
 */
export default function TelemetryTable({ t, filteredRows, allRows }) {
  const [wireFilter, setWireFilter] = useState(WIRE_FILTER_ALL);
  const [invoiceRow, setInvoiceRow] = useState(null);

  const researchFiltered = filteredRows ?? [];
  const researchAll = allRows ?? [];

  const combinedFilteredRows = useMemo(
    () => [...researchFiltered, ...MERCURY_WIRE_INTAKE_ROWS],
    [researchFiltered],
  );

  const combinedAllRows = useMemo(
    () => [...researchAll, ...MERCURY_WIRE_INTAKE_ROWS],
    [researchAll],
  );

  const displayRows = useMemo(
    () => applyWireChannelFilter(combinedFilteredRows, wireFilter),
    [combinedFilteredRows, wireFilter],
  );

  const handleExportCsv = useCallback(() => {
    const csvText = buildCsvFromRows(displayRows);
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8' });
    triggerBrowserDownload(blob, `a4i_telemetry_export_${buildExportTimestamp()}.csv`);
  }, [displayRows]);

  const handleExportJson = useCallback(() => {
    const payload = buildDoctoralDatasetPayload(combinedAllRows);
    const jsonText = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
    triggerBrowserDownload(blob, 'a4i_doctoral_dataset.json');
  }, [combinedAllRows]);

  const wireTabOptions = [
    {
      id: WIRE_FILTER_ALL,
      label: t('admin.board.research.table.wireFilter.all', 'All Records'),
    },
    {
      id: WIRE_FILTER_AUTO,
      label: t(
        'admin.board.research.table.wireFilter.auto',
        'Stripe/Wise Auto-Clears',
      ),
    },
    {
      id: WIRE_FILTER_MERCURY_PENDING,
      label: t(
        'admin.board.research.table.wireFilter.mercuryPending',
        'Mercury Wire Invoices Pending',
      ),
    },
  ];

  return (
    <div className="telemetry-table">
      <style>{TELEMETRY_TABLE_STYLES}</style>
      <div className="telemetry-table__viewport">
        <div className="telemetry-table__toolbar">
          <h3 className="telemetry-table__heading">
            {t('admin.board.research.table.title', 'Research Telemetry Data Grid')}
          </h3>
          <div className="telemetry-table__actions">
            <button type="button" className="telemetry-table__export" onClick={handleExportCsv}>
              {t(
                'admin.board.research.table.exportCsv',
                'Export Filtered Dataset to CSV',
              )}
            </button>
            <button
              type="button"
              className="telemetry-table__export telemetry-table__export--json"
              onClick={handleExportJson}
            >
              {t(
                'admin.board.research.table.exportJson',
                'Export Complete Schema to JSON',
              )}
            </button>
          </div>
        </div>

        <div
          className="telemetry-table__wire-tabs"
          role="tablist"
          aria-label={t(
            'admin.board.research.table.wireFilter.label',
            'Settlement channel filter',
          )}
        >
          {wireTabOptions.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={wireFilter === tab.id}
              className={
                wireFilter === tab.id
                  ? tab.id === WIRE_FILTER_MERCURY_PENDING
                    ? 'telemetry-table__wire-tab telemetry-table__wire-tab--active telemetry-table__wire-tab--mercury'
                    : 'telemetry-table__wire-tab telemetry-table__wire-tab--active'
                  : 'telemetry-table__wire-tab'
              }
              onClick={() => setWireFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {displayRows.length === 0 ? (
          <p className="telemetry-table__empty">
            {t(
              'admin.board.research.table.empty',
              'No telemetry records match the active filter criteria.',
            )}
          </p>
        ) : (
          <div className="telemetry-table__scroll">
            <table className="telemetry-table__grid">
              <thead>
                <tr>
                  <th scope="col">{t('admin.board.research.table.columns.timestamp')}</th>
                  <th scope="col">{t('admin.board.research.table.columns.maskedId')}</th>
                  <th scope="col">{t('admin.board.research.table.columns.trackLanguage')}</th>
                  <th scope="col">{t('admin.board.research.table.columns.score')}</th>
                  <th scope="col">
                    {t(
                      'admin.board.research.table.columns.settlement',
                      'Settlement Channel',
                    )}
                  </th>
                  <th scope="col">{t('admin.board.research.table.columns.stateHash')}</th>
                  <th scope="col">{t('admin.board.research.table.columns.ledgerSync')}</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) => {
                  const passed = row.score >= PASS_THRESHOLD;
                  const trackLabel = TRACK_LABELS[row.evaluationTrack] ?? row.evaluationTrack;
                  const pendingWire = isPendingMercuryWireRow(row);
                  const settlementBadge = resolveSettlementBadge(row, t);

                  return (
                    <tr
                      key={row.id}
                      className={pendingWire ? 'telemetry-table__row--clickable' : undefined}
                      onClick={() => {
                        if (pendingWire) {
                          setInvoiceRow(row);
                        }
                      }}
                      onKeyDown={(event) => {
                        if (pendingWire && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault();
                          setInvoiceRow(row);
                        }
                      }}
                      tabIndex={pendingWire ? 0 : undefined}
                      aria-label={
                        pendingWire
                          ? t(
                              'admin.board.research.table.invoice.openRow',
                              'Open Mercury wire invoice print preview',
                            )
                          : undefined
                      }
                    >
                      <td className="telemetry-table__mono">{formatTableTimestamp(row.timestamp)}</td>
                      <td className="telemetry-table__mono">
                        {row.client_email ?? row.maskedIdentifier}
                      </td>
                      <td className="telemetry-table__track-lang">
                        {trackLabel} · {row.language.toUpperCase()}
                      </td>
                      <td
                        className={
                          passed
                            ? 'telemetry-table__score'
                            : 'telemetry-table__score telemetry-table__score--fail'
                        }
                      >
                        {row.score}%
                      </td>
                      <td>{settlementBadge ?? '—'}</td>
                      <td>
                        <span className="telemetry-table__hash">{row.stateHash}</span>
                      </td>
                      <td>
                        <span
                          className={
                            row.waqfLedgerSynced
                              ? 'telemetry-table__sync telemetry-table__sync--yes'
                              : 'telemetry-table__sync telemetry-table__sync--no'
                          }
                          role="img"
                          aria-label={
                            row.waqfLedgerSynced
                              ? t('admin.board.research.table.ledgerSynced', 'WaqfLedger synced')
                              : t('admin.board.research.table.ledgerPending', 'WaqfLedger pending')
                          }
                          title={
                            row.waqfLedgerSynced
                              ? t('admin.board.research.table.ledgerSynced', 'WaqfLedger synced')
                              : t('admin.board.research.table.ledgerPending', 'WaqfLedger pending')
                          }
                        >
                          {row.waqfLedgerSynced ? '✓' : '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MercuryInvoiceModal row={invoiceRow} t={t} onClose={() => setInvoiceRow(null)} />
    </div>
  );
}
