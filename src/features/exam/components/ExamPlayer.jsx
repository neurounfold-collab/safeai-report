import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createTranslator, getActiveLanguage } from '../../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import {
  EXAM_SCENARIO_MATRIX,
  EXAM_SCENARIO_COUNT,
} from '../data/scenarios.js';
import {
  COHORT_PROFILE_IDS,
  INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT,
  REGISTRY_FIREWALL_THRESHOLD_PERCENT,
  resolveCompositeScoreBand,
} from '../utils/scoringEngine.js';
import { triggerLinkedInSocialUnlock } from '../../../utils/linkedInSocialUnlock.js';
import { streamComplianceToLedger } from '../../../utils/waqfLedgerClient';
import { getDomainContext, submitIntakeForm } from '../../../utils/emailRouter.js';
import CertificateBadge from './CertificateBadge.jsx';

const GRADE_EXAM_ENDPOINT = '/api/grade-exam';
const COHORT_LEDGER_LABELS = Object.freeze({
  CLL: 'CLL_COMPLIANCE_LEGAL',
  ExL: 'EXL_EXECUTIVE_LEADERSHIP',
  OEL: 'OEL_OPERATIONAL_EXECUTION',
});

const EXAM_PLAYER_STYLES = `
.exam-player {
  --exam-accent: #5eead4;
  --exam-accent-dim: rgba(94, 234, 212, 0.15);
  --exam-glass: rgba(15, 23, 42, 0.72);
  --exam-border: rgba(148, 163, 184, 0.22);
  --exam-text: #f1f5f9;
  --exam-muted: #94a3b8;
  min-height: 100%;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  background:
    radial-gradient(ellipse 80% 60% at 10% 0%, rgba(94, 234, 212, 0.12), transparent 55%),
    radial-gradient(ellipse 70% 50% at 90% 100%, rgba(99, 102, 241, 0.14), transparent 50%),
    linear-gradient(165deg, #0b1120 0%, #111827 45%, #0f172a 100%);
  color: var(--exam-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.exam-player.select-none {
  -webkit-user-select: none;
  user-select: none;
}

.exam-player .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.exam-player--locked {
  overflow: hidden;
}

.exam-player__shell {
  max-width: 52rem;
  margin: 0 auto;
  border-radius: 1.25rem;
  border: 1px solid var(--exam-border);
  background: var(--exam-glass);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  padding: clamp(1.25rem, 3vw, 2rem);
}

.exam-player__status-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-bottom: 1.5rem;
}

.exam-player__status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--exam-accent);
}

.exam-player__status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--exam-accent);
  box-shadow: 0 0 12px var(--exam-accent);
  animation: exam-pulse 2s ease-in-out infinite;
}

@keyframes exam-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.65; transform: scale(0.92); }
}

.exam-player__progress-track {
  flex: 1 1 8rem;
  max-width: 14rem;
  height: 0.25rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.2);
  overflow: hidden;
}

.exam-player__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2dd4bf, #6366f1);
  transition: width 320ms ease;
}

.exam-player__category {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--exam-border);
  background: var(--exam-accent-dim);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--exam-muted);
}

.exam-player__category-label {
  color: var(--exam-accent);
  margin-right: 0.35rem;
}

.exam-player__markdown {
  margin-bottom: 1.75rem;
  padding: 1.25rem 1.35rem;
  border-radius: 0.875rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 6, 23, 0.45);
  line-height: 1.65;
  font-size: 1.0125rem;
}

.exam-player__markdown p {
  margin: 0 0 0.85rem;
}

.exam-player__markdown p:last-child {
  margin-bottom: 0;
}

.exam-player__markdown strong {
  color: #fff;
  font-weight: 600;
}

.exam-player__options {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
}

.exam-player__option {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
  padding: 0.95rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--exam-border);
  background: rgba(15, 23, 42, 0.55);
  color: var(--exam-text);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 120ms ease;
}

.exam-player__option:hover:not(:disabled) {
  border-color: rgba(94, 234, 212, 0.45);
  background: rgba(94, 234, 212, 0.06);
}

.exam-player__option:focus-visible {
  outline: 2px solid var(--exam-accent);
  outline-offset: 2px;
}

.exam-player__option--selected {
  border-color: rgba(94, 234, 212, 0.65);
  background: rgba(94, 234, 212, 0.1);
  box-shadow: 0 0 0 1px rgba(94, 234, 212, 0.2);
}

.exam-player__option:disabled {
  cursor: default;
  opacity: 0.92;
}

.exam-player__option-index {
  flex-shrink: 0;
  width: 1.65rem;
  height: 1.65rem;
  display: grid;
  place-items: center;
  border-radius: 0.4rem;
  background: rgba(148, 163, 184, 0.15);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--exam-accent);
}

.exam-player__option--selected .exam-player__option-index {
  background: var(--exam-accent);
  color: #0f172a;
}

.exam-player__option-text {
  flex: 1;
  font-size: 0.9375rem;
  line-height: 1.5;
}

.exam-player__actions {
  display: flex;
  justify-content: flex-end;
}

.exam-player__submit {
  padding: 0.8rem 1.35rem;
  border: none;
  border-radius: 0.65rem;
  background: linear-gradient(135deg, #2dd4bf, #0891b2);
  color: #042f2e;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 180ms ease, opacity 180ms ease;
}

.exam-player__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(45, 212, 191, 0.35);
}

.exam-player__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.exam-player__credential {
  text-align: center;
}

.exam-player__credential-seal {
  width: 4.5rem;
  height: 4.5rem;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  border: 2px solid var(--exam-accent);
  display: grid;
  place-items: center;
  font-size: 1.75rem;
  background: var(--exam-accent-dim);
  box-shadow: 0 0 32px rgba(94, 234, 212, 0.25);
}

.exam-player__credential-title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.exam-player__credential-subtitle {
  margin: 0 0 1.5rem;
  color: var(--exam-muted);
  font-size: 0.9375rem;
  line-height: 1.55;
}

.exam-player__credential-card {
  margin-bottom: 1.5rem;
  padding: 1.35rem;
  border-radius: 0.875rem;
  border: 1px solid rgba(94, 234, 212, 0.28);
  background: linear-gradient(145deg, rgba(94, 234, 212, 0.08), rgba(99, 102, 241, 0.06));
  text-align: left;
}

.exam-player__credential-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  font-size: 0.875rem;
}

.exam-player__credential-row:last-child {
  border-bottom: none;
}

.exam-player__credential-label {
  color: var(--exam-muted);
}

.exam-player__credential-value {
  font-weight: 600;
  text-align: right;
}

.exam-player__linkedin {
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #0a66c2, #004182);
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.4;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 180ms ease;
}

.exam-player__linkedin:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(10, 102, 194, 0.4);
}

.exam-player__fail-title {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fca5a5;
}

.exam-player__fail-subtitle {
  margin: 0 0 1.25rem;
  color: var(--exam-muted);
  line-height: 1.55;
}

.exam-player__retry {
  padding: 0.75rem 1.25rem;
  border-radius: 0.65rem;
  border: 1px solid var(--exam-border);
  background: transparent;
  color: var(--exam-text);
  font-weight: 600;
  cursor: pointer;
}

.exam-player__lock-banner {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
}

.exam-player__lock-notice {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 41;
  max-width: 28rem;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--exam-border);
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  font-size: 0.8125rem;
  color: var(--exam-muted);
  text-align: center;
}

.exam-player__share-toast {
  position: fixed;
  top: 1.25rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  max-width: min(32rem, calc(100vw - 2rem));
  padding: 0.75rem 1.15rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(94, 234, 212, 0.35);
  background: rgba(15, 23, 42, 0.94);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--exam-accent);
  text-align: center;
  line-height: 1.45;
  animation: exam-player-toast-in 220ms ease-out;
}

.exam-player__share-toast--pending {
  border-color: rgba(251, 191, 36, 0.45);
  color: #fbbf24;
}

.exam-player__share-toast--success {
  border-color: rgba(52, 211, 153, 0.45);
  color: #34d399;
}

.exam-player__share-toast--warning {
  border-color: rgba(248, 113, 113, 0.5);
  color: #fca5a5;
  z-index: 60;
}

@keyframes exam-player-toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.exam-player__credential-stage {
  position: relative;
}

.exam-player__shell--credential-badge {
  max-width: 56rem;
}

.exam-player__badge-stage {
  width: 100%;
}

.exam-player__credential-content--shrouded {
  filter: blur(10px);
  opacity: 0.42;
  pointer-events: none;
  user-select: none;
}

.exam-player__credential-lock {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.15rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 0.875rem;
  border: 1px solid rgba(94, 234, 212, 0.32);
  background:
    linear-gradient(155deg, rgba(15, 23, 42, 0.78) 0%, rgba(15, 23, 42, 0.55) 100%);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 20px 48px rgba(0, 0, 0, 0.35);
}

.exam-player__credential-lock-title {
  margin: 0;
  font-size: clamp(1.05rem, 2.4vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
  color: var(--exam-text);
}

.exam-player__credential-lock-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
  width: 100%;
  max-width: 26rem;
}

.exam-player__achievement-claim {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.95rem 1.15rem;
  border: 1px solid rgba(45, 212, 191, 0.55);
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  color: #042f2e;
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1.45;
  text-align: center;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease, transform 120ms ease;
}

.exam-player__achievement-claim:hover {
  border-color: rgba(94, 234, 212, 0.75);
  background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
  transform: translateY(-1px);
}

.exam-player__waqf-caption {
  margin: 0.75rem 0 0;
  max-width: 26rem;
  font-size: 0.6875rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  text-align: center;
  color: rgba(148, 163, 184, 0.82);
  letter-spacing: 0.01em;
}

.exam-player__identity {
  text-align: center;
}

.exam-player__identity-seal {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  border: 2px solid rgba(94, 234, 212, 0.55);
  display: grid;
  place-items: center;
  font-size: 1.5rem;
  background: rgba(94, 234, 212, 0.08);
  box-shadow: 0 0 28px rgba(94, 234, 212, 0.2);
}

.exam-player__identity-title {
  margin: 0 0 0.65rem;
  font-size: clamp(1.15rem, 2.8vw, 1.45rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.exam-player__identity-note {
  margin: 0 0 1.5rem;
  color: var(--exam-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.exam-player__identity-field {
  text-align: left;
  margin-bottom: 1.35rem;
}

.exam-player__identity-label {
  display: block;
  margin-bottom: 0.55rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--exam-accent);
}

.exam-player__identity-input {
  width: 100%;
  padding: 0.95rem 1.05rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(94, 234, 212, 0.32);
  background: rgba(2, 6, 23, 0.55);
  color: var(--exam-text);
  font-size: 0.9375rem;
  line-height: 1.45;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.exam-player__identity-input:focus {
  outline: none;
  border-color: rgba(94, 234, 212, 0.65);
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.12);
}

.exam-player__identity-input::placeholder {
  color: rgba(148, 163, 184, 0.55);
}

.exam-player__identity-actions {
  display: flex;
  justify-content: center;
}

.exam-player__cohort {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.exam-player__cohort-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
  color: var(--exam-text);
}

.exam-player__cohort-subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  text-align: center;
  color: var(--exam-muted);
}

.exam-player__cohort-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .exam-player__cohort-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.exam-player__cohort-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  padding: 1rem;
  border-radius: 0.875rem;
  border: 1px solid var(--exam-border);
  background: rgba(2, 6, 23, 0.45);
  text-align: start;
  cursor: pointer;
  transition: border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
}

.exam-player__cohort-card:hover {
  border-color: rgba(94, 234, 212, 0.35);
  background: rgba(15, 23, 42, 0.55);
}

.exam-player__cohort-card--selected {
  border-color: rgba(94, 234, 212, 0.55);
  background: rgba(15, 118, 110, 0.12);
  box-shadow: inset 0 1px 0 rgba(94, 234, 212, 0.12), 0 8px 24px rgba(94, 234, 212, 0.08);
}

.exam-player__cohort-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--exam-accent);
}

.exam-player__cohort-name {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--exam-text);
}

.exam-player__composite-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--exam-border);
  background: rgba(2, 6, 23, 0.45);
}

.exam-player__composite-score-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--exam-muted);
}

.exam-player__composite-score-value {
  margin: 0;
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}

.exam-player__composite-score-band {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.exam-player__composite-score--exposure {
  border-color: rgba(248, 113, 113, 0.35);
  box-shadow: inset 0 1px 0 rgba(248, 113, 113, 0.12);
}

.exam-player__composite-score--exposure .exam-player__composite-score-value,
.exam-player__composite-score--exposure .exam-player__composite-score-band {
  color: #f87171;
}

.exam-player__composite-score--developing {
  border-color: rgba(201, 162, 39, 0.35);
  box-shadow: inset 0 1px 0 rgba(201, 162, 39, 0.12);
}

.exam-player__composite-score--developing .exam-player__composite-score-value,
.exam-player__composite-score--developing .exam-player__composite-score-band {
  color: #c9a227;
}

.exam-player__composite-score--certified {
  border-color: rgba(94, 234, 212, 0.35);
  box-shadow: inset 0 1px 0 rgba(94, 234, 212, 0.12);
}

.exam-player__composite-score--certified .exam-player__composite-score-value,
.exam-player__composite-score--certified .exam-player__composite-score-band {
  color: #5eead4;
}

.exam-player__registry-title {
  margin: 0 0 0.65rem;
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.45;
  color: #f87171;
}

.exam-player__registry-subtitle {
  margin: 0 0 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--exam-muted);
}

.exam-player__registry-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.exam-player__registry-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.exam-player__registry-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--exam-muted);
}

.exam-player__registry-input,
.exam-player__registry-textarea {
  width: 100%;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(11, 15, 25, 0.65);
  color: var(--exam-text);
  font-size: 0.875rem;
  line-height: 1.5;
}

.exam-player__registry-textarea {
  min-height: 5.5rem;
  resize: vertical;
}

.exam-player__registry-input:focus,
.exam-player__registry-textarea:focus {
  outline: none;
  border-color: rgba(248, 113, 113, 0.45);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.12);
}

.exam-player__registry-submit {
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #c9a227 0%, #92710f 100%);
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
}

.exam-player__registry-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.exam-player__registry-success {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(120, 90, 10, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #e2c66d;
}

.exam-player__registry-error {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #fca5a5;
}

.exam-player__sealing-title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--exam-accent);
}

.exam-player__sealing-subtitle {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.55;
  color: var(--exam-muted);
}

.exam-player__sealing-error {
  margin: 1rem 0 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #fca5a5;
}
`;

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const EXAM_PERSIST_KEY = 'SAFEAI_EXAM_SESSION_PERSIST';
const EXAM_PERSIST_SCHEMA_VERSION = 2;
const TAB_SWITCH_DEBOUNCE_MS = 800;
const INTEGRITY_WARNING_TOAST =
  'Article 4 Violation Warning: Leaving the active exam environment is recorded in telemetry logs.';
const INTEGRITY_BREACH_TOAST =
  'Article 4 Security Breach: Examination invalidated — environment abandonment recorded.';
const PENDING_VERIFICATION_TOAST = 'Pending Verification';
const CREDENTIAL_BROADCASTED_TOAST = 'Official Credential Broadcasted & Sealed';
const TIER_CERT_TITLES = Object.freeze({
  'Level 01': 'Certified AI Literacy Deployer (Foundational) — EU AI Act Article 4',
  'Level 02': 'Certified AI Procurement & Risk Manager — EU AI Act Article 4',
  'Level 03': 'Certified High-Risk System Compliance Auditor — EU AI Act Article 4',
});
const CANDIDATE_NAME_KEY = 'SAFEAI_EXAMINEE_LEGAL_NAME';
const COHORT_PROFILE_KEY = 'SAFEAI_EXAM_COHORT_PROFILE';
const REGISTRY_INTAKE_FLAG = 'EXECUTIVE_BRIEFING';
const MASTER_TEST_AUDIT_CODE = 'A4I_MASTER_TEST_AUDIT';
const MASTER_TEST_AUDITOR_NAME = 'Official Test Auditor';
const MASTER_TEST_AUDIT_KEY = 'SAFEAI_MASTER_TEST_AUDIT';
const EXAM_ENTRY_TIER_KEY = 'SAFEAI_EXAM_ENTRY_TIER';
const VALID_EXAM_TIER_PARAMS = new Set(['level01', 'level02', 'level03']);

/** @type {Map<number, typeof EXAM_SCENARIO_MATRIX[number]>} */
const SCENARIO_BY_ID = new Map(EXAM_SCENARIO_MATRIX.map((scenario) => [scenario.id, scenario]));

/**
 * Reads a validated tier slug from the current URL query string.
 * @param {URLSearchParams | null | undefined} [searchParams]
 * @returns {'level01' | 'level02' | 'level03' | null}
 */
function readUrlTierParam(searchParams) {
  const source =
    searchParams
    ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null);

  if (!source) return null;

  const tier = source.get('tier')?.trim().toLowerCase() ?? '';
  return VALID_EXAM_TIER_PARAMS.has(tier) ? tier : null;
}

/**
 * @param {typeof EXAM_SCENARIO_MATRIX | null | undefined} matrix
 */
function isExamMatrixComplete(matrix) {
  return Array.isArray(matrix) && matrix.length === EXAM_SCENARIO_COUNT
    && matrix.every((scenario) => scenario && typeof scenario.id === 'number');
}

function persistEntryTier(tierSlug) {
  if (!tierSlug || typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(EXAM_ENTRY_TIER_KEY, tierSlug);
  } catch {
    // Storage may be unavailable in hardened browser profiles.
  }
}

/**
 * @param {unknown} data
 * @returns {data is {
 *   version: number;
 *   scenarioIds: number[];
 *   currentScenarioIndex: number;
 *   userChoices: Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>;
 *   optionOrders?: number[][];
 *   examStartedAt?: string;
 * }}
 */
function isValidPersistedExamSession(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.version !== EXAM_PERSIST_SCHEMA_VERSION) return false;
  if (!Array.isArray(data.scenarioIds) || data.scenarioIds.length !== EXAM_SCENARIO_COUNT) {
    return false;
  }

  const expectedIds = new Set(
    Array.from({ length: EXAM_SCENARIO_COUNT }, (_, index) => index + 1),
  );
  const seenIds = new Set();

  for (const scenarioId of data.scenarioIds) {
    if (typeof scenarioId !== 'number' || !expectedIds.has(scenarioId) || seenIds.has(scenarioId)) {
      return false;
    }
    if (!SCENARIO_BY_ID.has(scenarioId)) return false;
    seenIds.add(scenarioId);
  }

  if (
    typeof data.currentScenarioIndex !== 'number'
    || data.currentScenarioIndex < 0
    || data.currentScenarioIndex >= EXAM_SCENARIO_COUNT
  ) {
    return false;
  }

  if (!Array.isArray(data.userChoices)) return false;
  if (data.userChoices.length !== data.currentScenarioIndex) return false;

  for (let index = 0; index < data.userChoices.length; index += 1) {
    const choice = data.userChoices[index];
    if (
      !choice
      || typeof choice.scenarioId !== 'number'
      || typeof choice.chosenOptionIndex !== 'number'
      || choice.chosenOptionIndex < 0
      || choice.chosenOptionIndex > 3
      || typeof choice.timeSpentMs !== 'number'
    ) {
      return false;
    }
    if (choice.scenarioId !== data.scenarioIds[index]) return false;
  }

  if (!Array.isArray(data.optionOrders) || data.optionOrders.length !== EXAM_SCENARIO_COUNT) {
    return false;
  }

  for (const order of data.optionOrders) {
    if (!Array.isArray(order) || order.length !== 4) return false;
    const seen = new Set();
    for (const originalIndex of order) {
      if (
        typeof originalIndex !== 'number'
        || originalIndex < 0
        || originalIndex > 3
        || seen.has(originalIndex)
      ) {
        return false;
      }
      seen.add(originalIndex);
    }
  }

  if (
    data.examStartedAt !== undefined
    && (typeof data.examStartedAt !== 'string' || data.examStartedAt.length === 0)
  ) {
    return false;
  }

  return true;
}

function clearExamPersistSession() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(EXAM_PERSIST_KEY);
  } catch {
    // Storage may be unavailable in hardened browser profiles.
  }
}

/**
 * Rebuilds a scenario with options ordered by persisted original-index permutation.
 * @param {typeof EXAM_SCENARIO_MATRIX[number]} scenario
 * @param {number[]} optionOrder
 */
function applyOptionOrder(scenario, optionOrder) {
  return {
    ...scenario,
    options: optionOrder.map((originalIndex) => ({
      text: scenario.options[originalIndex],
      originalIndex,
    })),
  };
}

/**
 * @returns {{
 *   shuffledExamMatrix: ReturnType<typeof buildTierShuffledExamMatrix>;
 *   currentScenarioIndex: number;
 *   userChoices: Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>;
 *   examStartedAt: string;
 * } | null}
 */
function loadPersistedExamSession() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(EXAM_PERSIST_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!isValidPersistedExamSession(parsed)) {
      clearExamPersistSession();
      return null;
    }

    const shuffledExamMatrix = (parsed.scenarioIds ?? [])
      .map((scenarioId, index) => {
        const base = SCENARIO_BY_ID.get(scenarioId);
        if (!base) return null;
        return applyOptionOrder(base, parsed.optionOrders[index]);
      })
      .filter(Boolean);

    if (!isExamMatrixComplete(shuffledExamMatrix)) {
      clearExamPersistSession();
      return null;
    }

    return {
      shuffledExamMatrix,
      currentScenarioIndex: parsed.currentScenarioIndex,
      userChoices: parsed.userChoices ?? [],
      examStartedAt: parsed.examStartedAt ?? new Date().toISOString(),
    };
  } catch {
    clearExamPersistSession();
    return null;
  }
}

/**
 * @param {ReturnType<typeof buildTierShuffledExamMatrix>} shuffledExamMatrix
 * @param {number} currentScenarioIndex
 * @param {Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>} userChoices
 * @param {string} examStartedAt
 */
function persistExamSession(shuffledExamMatrix, currentScenarioIndex, userChoices, examStartedAt) {
  if (typeof window === 'undefined') return;

  const payload = {
    version: EXAM_PERSIST_SCHEMA_VERSION,
    scenarioIds: (shuffledExamMatrix ?? []).map((scenario) => scenario?.id).filter(Boolean),
    optionOrders: (shuffledExamMatrix ?? []).map((scenario) =>
      (scenario?.options ?? []).map((option) =>
        typeof option === 'object' && option !== null && 'originalIndex' in option
          ? option.originalIndex
          : 0,
      ),
    ),
    currentScenarioIndex,
    userChoices,
    examStartedAt,
  };

  try {
    window.localStorage.setItem(EXAM_PERSIST_KEY, JSON.stringify(payload));
  } catch {
    // Quota or privacy mode — persistence is best-effort.
  }
}

function createInitialExamSessionState(urlTier) {
  const persisted = loadPersistedExamSession();
  if (persisted && isExamMatrixComplete(persisted.shuffledExamMatrix)) {
    if (urlTier) persistEntryTier(urlTier);
    return persisted;
  }

  if (persisted) clearExamPersistSession();

  const shuffledExamMatrix = buildTierShuffledExamMatrix();
  if (!isExamMatrixComplete(shuffledExamMatrix)) {
    return null;
  }

  if (urlTier) persistEntryTier(urlTier);

  return {
    shuffledExamMatrix,
    currentScenarioIndex: 0,
    userChoices: [],
    examStartedAt: new Date().toISOString(),
  };
}

/**
 * Lightweight inline markdown: paragraphs and **bold** spans.
 * @param {string} text
 */
function renderScenarioMarkdown(text) {
  if (!text) return null;

  return text.split(/\n\n+/).map((paragraph, paragraphIndex) => {
    const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
    const children = parts.map((part, partIndex) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return <p key={paragraphIndex}>{children}</p>;
  });
}

/**
 * Resolves certification tier for badge rendering after server-side grading.
 * Prefers an explicit server/assessment hint; otherwise uses the entry URL tier.
 * @param {{ assessmentId?: string; entryTier?: string | null } | null} scoreResult
 * @param {'level01' | 'level02' | 'level03' | null} urlTier
 */
function resolveCertificationTier(scoreResult, urlTier) {
  const fromResult = scoreResult?.certificationTier;
  if (fromResult) return fromResult;

  const tierMap = {
    level01: 'Level 01',
    level02: 'Level 02',
    level03: 'Level 03',
  };

  return tierMap[urlTier ?? scoreResult?.entryTier] ?? 'Level 03';
}

/**
 * Maps the serverless grade-exam payload into the ExamPlayer results view model.
 * @param {{
 *   passed: boolean;
 *   score: number;
 *   hash: string;
 *   timestamp: string;
 *   assessmentId: string;
 *   sealMode?: string;
 *   ledgerStatus?: 'remote_sealed' | 'local_fallback';
 *   securityBreach?: boolean;
 * }} payload
 * @param {string} roleId
 * @param {'level01' | 'level02' | 'level03' | null} urlTier
 */
function buildServerScoreResult(payload, roleId, urlTier) {
  const score = Number(payload.score);
  const scoreBand = resolveCompositeScoreBand(score);
  const ledgerStatus =
    payload.ledgerStatus
    ?? (payload.sealMode === 'remote' ? 'remote_sealed' : 'local_fallback');

  return {
    passesCertification: Boolean(payload.passed) && !payload.securityBreach,
    certificationThresholdPercent: INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT,
    weighted: {
      percentage: score,
      earned: score,
      maximum: 100,
    },
    raw: {
      correct: null,
      total: EXAM_SCENARIO_COUNT,
      percentage: score,
    },
    tierBreakdown: [],
    assessmentId: payload.assessmentId,
    sealedAt: payload.timestamp,
    sealMode: payload.sealMode ?? null,
    ledgerStatus,
    securityBreach: Boolean(payload.securityBreach),
    certificationTier: resolveCertificationTier(null, urlTier),
    entryTier: urlTier,
    composite: {
      score,
      scoreBand,
      cohortProfileId: roleId,
      registryFirewallActive: score < REGISTRY_FIREWALL_THRESHOLD_PERCENT,
    },
  };
}

/**
 * Attaches Fisher–Yates-shuffled options that retain originalIndex for grading.
 * @param {typeof EXAM_SCENARIO_MATRIX[number]} scenario
 */
function withShuffledOptions(scenario) {
  const optionsWithIds = (scenario.options ?? []).map((text, originalIndex) => ({
    text,
    originalIndex,
  }));

  return {
    ...scenario,
    options: fisherYatesShuffle(optionsWithIds),
  };
}

/**
 * Resolves display option text from either a shuffled option object or a raw string.
 * @param {{ text: string; originalIndex: number } | string} option
 */
function getOptionText(option) {
  if (typeof option === 'string') return option;
  return option?.text ?? '';
}

/**
 * Maps a displayed option selection back to the master-key original index.
 * @param {{ text: string; originalIndex: number } | string | undefined} option
 * @param {number} displayIndex
 */
function resolveOriginalOptionIndex(option, displayIndex) {
  if (typeof option === 'object' && option !== null && typeof option.originalIndex === 'number') {
    return option.originalIndex;
  }
  return displayIndex;
}

const EMPTY_CERTIFICATION_PIPELINE = {
  credentialId: null,
  hash: null,
  examinationCompletedAt: null,
  ledgerDispatched: false,
  socialUnlockSucceeded: false,
};

/**
 * Fisher-Yates (Knuth) shuffle — unbiased in-place permutation on a copy.
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
function fisherYatesShuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Segregates the authoritative matrix by tier, shuffles each tier independently,
 * Fisher–Yates-shuffles each scenario's options (preserving originalIndex), and
 * concatenates into a linear 30-scenario examination sequence.
 */
function buildTierShuffledExamMatrix() {
  const level01 = EXAM_SCENARIO_MATRIX.filter((scenario) => scenario.id >= 1 && scenario.id <= 10);
  const level02 = EXAM_SCENARIO_MATRIX.filter((scenario) => scenario.id >= 11 && scenario.id <= 20);
  const level03 = EXAM_SCENARIO_MATRIX.filter((scenario) => scenario.id >= 21 && scenario.id <= 30);

  return [
    ...fisherYatesShuffle(level01),
    ...fisherYatesShuffle(level02),
    ...fisherYatesShuffle(level03),
  ].map(withShuffledOptions);
}

/**
 * @returns {string}
 */
function readStoredLegalName() {
  if (typeof window === 'undefined') return '';

  try {
    return window.localStorage.getItem(CANDIDATE_NAME_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

function readMasterTestOverride() {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(MASTER_TEST_AUDIT_KEY) === 'true';
  } catch {
    return false;
  }
}

function activateMasterTestOverride() {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(MASTER_TEST_AUDIT_KEY, 'true');
    window.localStorage.setItem(CANDIDATE_NAME_KEY, MASTER_TEST_AUDITOR_NAME);
  } catch {
    // Storage may be unavailable in hardened browser profiles.
  }
}

/**
 * @returns {'active' | 'identity' | 'cohort'}
 */
function resolveInitialExamPhase() {
  if (!readStoredCohortProfile()) return 'cohort';
  if (!readStoredLegalName()) return 'identity';
  return 'active';
}

function readStoredCohortProfile() {
  if (typeof window === 'undefined') return '';

  try {
    const stored = window.localStorage.getItem(COHORT_PROFILE_KEY)?.trim() ?? '';
    return COHORT_PROFILE_IDS.includes(stored) ? stored : '';
  } catch {
    return '';
  }
}

function persistCohortProfile(cohortProfileId) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(COHORT_PROFILE_KEY, cohortProfileId);
  } catch {
    // Storage may be unavailable in hardened browser profiles.
  }
}

function CompositeScorePanel({ composite, t }) {
  if (!composite) return null;

  const bandKey = `exam.player.compositeBand.${composite.scoreBand}`;

  return (
    <div
      className={`exam-player__composite-score exam-player__composite-score--${composite.scoreBand}`}
      role="status"
    >
      <p className="exam-player__composite-score-label">{t('exam.player.compositeScoreLabel')}</p>
      <p className="exam-player__composite-score-value">{composite.score}%</p>
      <p className="exam-player__composite-score-band">{t(bandKey)}</p>
    </div>
  );
}

/**
 * Resolves the candidate's full legal name from props, persisted session, or i18n fallback.
 * @param {string | undefined} explicitName
 * @param {string} storedName
 * @param {(key: string) => string} t
 */
function resolveCandidateLegalName(explicitName, storedName, t) {
  if (explicitName?.trim()) return explicitName.trim();
  if (storedName?.trim()) return storedName.trim();
  return t('academy.badge.certifiedCandidate');
}

/**
 * Fire-and-forget anonymous session telemetry (no client-side answer-key grading).
 * @param {Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>} responses
 * @param {string} examinationStartedAt
 * @param {string | undefined} locale
 * @param {{ score?: number; passed?: boolean; assessmentId?: string } | null} [gradeSummary]
 */
function transmitDoctoralResearchPacket(responses, examinationStartedAt, locale, gradeSummary = null) {
  const examinationCompletedAt = new Date().toISOString();
  const endpoint = SAFEAI_MASTER_CONFIG?.infrastructure?.emailRouterEndpoint;
  if (!endpoint) return;

  const totalDurationMs = (responses ?? []).reduce(
    (sum, response) => sum + (response.timeSpentMs ?? 0),
    0,
  );

  const packet = {
    meta: {
      protocol: 'safeAI.report Research Instrument v1',
      schemaVersion: '1.1.0',
      instrumentId: 'EU-AI-ACT-A4-30-SCENARIO',
      anonymityClass: 'de-identified',
      collectionPurpose: 'doctoral-research-compliance-analytics',
      gradingAuthority: 'api/grade-exam',
      scenarioCount: EXAM_SCENARIO_COUNT,
    },
    session: {
      anonymousSessionKey: crypto.randomUUID(),
      examinationStartedAt,
      examinationCompletedAt,
      totalDurationMs,
      locale: locale ?? null,
      assessmentId: gradeSummary?.assessmentId ?? null,
    },
    observations: (responses ?? []).map((entry) => ({
      questionId: entry.scenarioId,
      chosenIndex: entry.chosenOptionIndex,
      timeSpentMs: entry.timeSpentMs ?? 0,
    })),
    aggregates: {
      serverCompositeScore: gradeSummary?.score ?? null,
      passesCertification: gradeSummary?.passed ?? null,
    },
  };

  void fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(packet),
  }).catch(() => {
    // Best-effort anonymous telemetry — must not block certification flow.
  });
}

/**
 * Cisco-grade 30-scenario EU AI Act Article 4 examination player.
 */
function ExamPlayerRecoveryShell({ message }) {
  return (
    <div className="exam-player" aria-live="polite" aria-busy="true">
      <style>{EXAM_PLAYER_STYLES}</style>
      <div className="exam-player__shell exam-player__credential">
        <h2 className="exam-player__fail-title">{message}</h2>
        <p className="exam-player__fail-subtitle">Restoring examination session…</p>
      </div>
    </div>
  );
}

export default function ExamPlayer({ language: languageProp, candidateName: candidateNameProp }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { t } = useMemo(
    () => createTranslator(languageProp ?? getActiveLanguage()),
    [languageProp],
  );

  const urlTier = useMemo(() => readUrlTierParam(searchParams), [searchParams]);
  const rawTierParam = searchParams.get('tier');
  const tierParamInvalid = Boolean(
    rawTierParam?.trim() && !VALID_EXAM_TIER_PARAMS.has(rawTierParam.trim().toLowerCase()),
  );

  const initialSessionRef = useRef(null);
  if (initialSessionRef.current === null) {
    initialSessionRef.current = createInitialExamSessionState(urlTier);
  }
  const initialSession = initialSessionRef.current ?? {
    shuffledExamMatrix: [],
    currentScenarioIndex: 0,
    userChoices: [],
    examStartedAt: new Date().toISOString(),
  };

  const sessionInitFailed = initialSessionRef.current === null;

  const [shuffledExamMatrix, setShuffledExamMatrix] = useState(initialSession.shuffledExamMatrix);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(initialSession.currentScenarioIndex);
  const [userChoices, setUserChoices] = useState(initialSession.userChoices);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [storedLegalName, setStoredLegalName] = useState(readStoredLegalName);
  const [legalNameInput, setLegalNameInput] = useState('');
  const [cohortProfile, setCohortProfile] = useState(() => readStoredCohortProfile());
  const [selectedCohortProfile, setSelectedCohortProfile] = useState(() => readStoredCohortProfile());
  const [examPhase, setExamPhase] = useState(resolveInitialExamPhase);
  const [scoreResult, setScoreResult] = useState(null);
  const [masterTestOverride, setMasterTestOverride] = useState(readMasterTestOverride);
  const [credentialUnlocked, setCredentialUnlocked] = useState(() => readMasterTestOverride());
  const [stateHash, setStateHash] = useState(null);
  const [linkedInToast, setLinkedInToast] = useState(null);
  const [registryEmail, setRegistryEmail] = useState('');
  const [registryMessage, setRegistryMessage] = useState('');
  const [registrySubmitted, setRegistrySubmitted] = useState(false);
  const [registrySubmitting, setRegistrySubmitting] = useState(false);
  const [registrySubmitError, setRegistrySubmitError] = useState('');
  const [ledgerStatus, setLedgerStatus] = useState(null);
  const [sealingError, setSealingError] = useState('');
  const [isSealing, setIsSealing] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [integrityToast, setIntegrityToast] = useState(null);
  const [isShared, setIsShared] = useState(false);
  const [shareToast, setShareToast] = useState(null);

  const screenEnteredAtRef = useRef(Date.now());
  const examStartedAtRef = useRef(initialSession.examStartedAt);
  const credentialIdRef = useRef(null);
  const socialUnlockTriggeredRef = useRef(false);
  const certificationPipelineRef = useRef({ ...EMPTY_CERTIFICATION_PIPELINE });
  const lastTabSwitchAtRef = useRef(0);
  const userChoicesRef = useRef(userChoices);
  const submitInFlightRef = useRef(false);
  const examPhaseRef = useRef(examPhase);

  userChoicesRef.current = userChoices;
  examPhaseRef.current = examPhase;

  useEffect(() => {
    if (tierParamInvalid || sessionInitFailed) {
      navigate('/academy', { replace: true });
    }
  }, [tierParamInvalid, sessionInitFailed, navigate]);

  useEffect(() => {
    if (tierParamInvalid || sessionInitFailed) return;

    if (urlTier) persistEntryTier(urlTier);

    if (isExamMatrixComplete(shuffledExamMatrix)) return;

    clearExamPersistSession();
    const recovered = createInitialExamSessionState(urlTier);
    if (!recovered) {
      navigate('/academy', { replace: true });
      return;
    }

    initialSessionRef.current = recovered;
    setShuffledExamMatrix(recovered.shuffledExamMatrix);
    setCurrentScenarioIndex(recovered.currentScenarioIndex);
    setUserChoices(recovered.userChoices);
    examStartedAtRef.current = recovered.examStartedAt;
  }, [tierParamInvalid, sessionInitFailed, urlTier, navigate, shuffledExamMatrix]);

  const currentScenario = shuffledExamMatrix[currentScenarioIndex];
  const isFinalScenario = currentScenarioIndex === EXAM_SCENARIO_COUNT - 1;
  const progressPercent = ((currentScenarioIndex + 1) / EXAM_SCENARIO_COUNT) * 100;
  const navigationLocked = examPhase === 'passed';

  const certificationTier = scoreResult
    ? resolveCertificationTier(scoreResult, urlTier)
    : null;

  const candidateLegalName = useMemo(
    () => resolveCandidateLegalName(candidateNameProp, storedLegalName, t),
    [candidateNameProp, storedLegalName, t],
  );

  const activeLocale = languageProp ?? getActiveLanguage();

  useEffect(() => {
    screenEnteredAtRef.current = Date.now();
    setSelectedOptionIndex(null);
  }, [currentScenarioIndex]);

  useEffect(() => {
    if (examPhase !== 'active') return;
    if ((userChoices ?? []).length >= EXAM_SCENARIO_COUNT) return;

    persistExamSession(
      shuffledExamMatrix,
      currentScenarioIndex,
      userChoices,
      examStartedAtRef.current,
    );
  }, [userChoices, currentScenarioIndex, shuffledExamMatrix, examPhase]);

  useEffect(() => {
    if (!navigationLocked) return undefined;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = t('exam.player.navigationBlocked');
    };

    const trapHistory = () => {
      window.history.pushState({ examCredentialLock: true }, '', window.location.href);
    };

    trapHistory();
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', trapHistory);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', trapHistory);
    };
  }, [navigationLocked, t]);

  const sealExamination = useCallback(async (scenarioAnswers, { securityBreach = false } = {}) => {
    if (submitInFlightRef.current) return;
    submitInFlightRef.current = true;

    const roleId = cohortProfile || readStoredCohortProfile();
    if (!roleId || !COHORT_PROFILE_IDS.includes(roleId)) {
      submitInFlightRef.current = false;
      setSealingError(t('exam.player.cohort.title'));
      setExamPhase('cohort');
      return;
    }

    clearExamPersistSession();
    setIsSealing(true);
    setSealingError('');
    setExamPhase('sealing');

    try {
      const gradeResponse = await fetch(GRADE_EXAM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioAnswers,
          roleId,
          language: activeLocale,
          examineeName: resolveCandidateLegalName(candidateNameProp, storedLegalName, t),
          cohort: COHORT_LEDGER_LABELS[roleId] ?? 'CLL_COMPLIANCE_LEGAL',
          securityBreach,
        }),
      });

      const payload = await gradeResponse.json().catch(() => null);
      if (!gradeResponse.ok || !payload?.success) {
        throw new Error(payload?.error || `Grading request failed (${gradeResponse.status})`);
      }

      if (
        typeof payload.hash !== 'string'
        || !/^[a-fA-F0-9]{64}$/.test(payload.hash)
        || typeof payload.score !== 'number'
      ) {
        throw new Error('Invalid grading response from attestation service.');
      }

      const result = buildServerScoreResult(payload, roleId, urlTier);
      setScoreResult(result);

      const credentialId = crypto.randomUUID();
      credentialIdRef.current = credentialId;
      certificationPipelineRef.current = {
        credentialId,
        hash: payload.hash,
        examinationCompletedAt: payload.timestamp,
        ledgerDispatched: false,
        socialUnlockSucceeded: false,
      };

      setStateHash(payload.hash);
      setLedgerStatus(
        payload.ledgerStatus
        ?? (payload.sealMode === 'remote' ? 'remote_sealed' : 'local_fallback'),
      );

      try {
        window.localStorage.setItem('SAFEAI_CREDENTIAL_STATE_HASH', payload.hash);
        window.localStorage.setItem('SAFEAI_CERTIFICATION_TIER', result.certificationTier);
        window.localStorage.setItem('SAFEAI_CREDENTIAL_TIMESTAMP', payload.timestamp);
      } catch {
        // Storage may be unavailable in hardened browser profiles.
      }

      transmitDoctoralResearchPacket(scenarioAnswers, examStartedAtRef.current, activeLocale, {
        score: payload.score,
        passed: payload.passed,
        assessmentId: payload.assessmentId,
      });

      if (securityBreach || result.securityBreach) {
        setIntegrityToast(INTEGRITY_BREACH_TOAST);
        setExamPhase('failed');
      } else if (!masterTestOverride && result.composite?.registryFirewallActive) {
        setExamPhase('registryExposure');
      } else if (result.passesCertification) {
        setIsShared(Boolean(masterTestOverride));
        setShareToast(masterTestOverride ? null : PENDING_VERIFICATION_TOAST);
        setExamPhase('passed');
      } else {
        setExamPhase('failed');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to seal attestation on WaqfLedger.';
      setSealingError(message);
      setExamPhase('sealing');
    } finally {
      setIsSealing(false);
      submitInFlightRef.current = false;
    }
  }, [
    activeLocale,
    cohortProfile,
    masterTestOverride,
    candidateNameProp,
    storedLegalName,
    t,
    urlTier,
  ]);

  useEffect(() => {
    if (examPhase !== 'active') return undefined;

    const recordEnvironmentAbandonment = () => {
      const now = Date.now();
      if (now - lastTabSwitchAtRef.current < TAB_SWITCH_DEBOUNCE_MS) return;
      lastTabSwitchAtRef.current = now;

      setTabSwitchCount((previous) => {
        const next = previous + 1;
        if (next <= 2) {
          setIntegrityToast(INTEGRITY_WARNING_TOAST);
          window.setTimeout(() => {
            setIntegrityToast((current) =>
              (current === INTEGRITY_WARNING_TOAST ? null : current),
            );
          }, 4200);
        } else if (examPhaseRef.current === 'active') {
          void sealExamination(userChoicesRef.current, { securityBreach: true });
        }
        return next;
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordEnvironmentAbandonment();
      }
    };

    const handleWindowBlur = () => {
      recordEnvironmentAbandonment();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [examPhase, sealExamination]);

  const recordChoiceAndAdvance = useCallback(async () => {
    if (selectedOptionIndex === null || !currentScenario || isSealing) return;

    const timeSpentMs = Date.now() - screenEnteredAtRef.current;
    const selectedOption = currentScenario.options?.[selectedOptionIndex];
    const response = {
      scenarioId: currentScenario.id,
      chosenOptionIndex: resolveOriginalOptionIndex(selectedOption, selectedOptionIndex),
      timeSpentMs,
    };

    const nextChoices = [...userChoices, response];
    setUserChoices(nextChoices);
    userChoicesRef.current = nextChoices;

    if (!isFinalScenario) {
      setCurrentScenarioIndex((index) => index + 1);
      return;
    }

    await sealExamination(nextChoices, { securityBreach: false });
  }, [
    selectedOptionIndex,
    currentScenario,
    userChoices,
    isFinalScenario,
    isSealing,
    sealExamination,
  ]);

  const handleInitializeIdentity = useCallback(() => {
    const trimmed = legalNameInput.trim();
    if (!trimmed) return;

    if (trimmed === MASTER_TEST_AUDIT_CODE) {
      activateMasterTestOverride();
      setMasterTestOverride(true);
      setCredentialUnlocked(true);
      setStoredLegalName(MASTER_TEST_AUDITOR_NAME);
      setExamPhase('active');
      return;
    }

    try {
      window.localStorage.setItem(CANDIDATE_NAME_KEY, trimmed);
    } catch {
      // Storage may be unavailable in hardened browser profiles.
    }

    setStoredLegalName(trimmed);
    setExamPhase('active');
  }, [legalNameInput]);

  const handleRetry = useCallback(() => {
    clearExamPersistSession();
    const freshSession = createInitialExamSessionState(urlTier);
    if (!freshSession) {
      navigate('/academy', { replace: true });
      return;
    }
    setShuffledExamMatrix(freshSession.shuffledExamMatrix);
    setCurrentScenarioIndex(freshSession.currentScenarioIndex);
    setUserChoices(freshSession.userChoices);
    userChoicesRef.current = freshSession.userChoices;
    setSelectedOptionIndex(null);
    setScoreResult(null);
    setCredentialUnlocked(masterTestOverride);
    setStateHash(null);
    setLedgerStatus(null);
    setSealingError('');
    setIsSealing(false);
    setRegistryEmail('');
    setRegistryMessage('');
    setRegistrySubmitted(false);
    setRegistrySubmitError('');
    setTabSwitchCount(0);
    setIntegrityToast(null);
    setIsShared(false);
    setShareToast(null);
    setLinkedInToast(null);
    credentialIdRef.current = null;
    socialUnlockTriggeredRef.current = false;
    submitInFlightRef.current = false;
    lastTabSwitchAtRef.current = 0;
    certificationPipelineRef.current = { ...EMPTY_CERTIFICATION_PIPELINE };
    setExamPhase('active');
    examStartedAtRef.current = freshSession.examStartedAt;
    screenEnteredAtRef.current = Date.now();
  }, [masterTestOverride, urlTier, navigate]);

  const handleLinkedInAchievementClaim = useCallback(async () => {
    try {
      const certTitle =
        TIER_CERT_TITLES[certificationTier] ?? TIER_CERT_TITLES['Level 01'];
      const assessmentId = scoreResult?.assessmentId ?? '';
      const payload = await triggerLinkedInSocialUnlock({
        stateHash,
        language: activeLocale,
        certTitle,
        assessmentId,
      });

      window.open(payload.linkedInAddUrl, '_blank', 'noopener,noreferrer');

      certificationPipelineRef.current.socialUnlockSucceeded = true;
      socialUnlockTriggeredRef.current = true;
      setIsShared(true);
      setCredentialUnlocked(true);
      setShareToast(CREDENTIAL_BROADCASTED_TOAST);
      setLinkedInToast(null);
      window.setTimeout(() => {
        setShareToast((current) =>
          (current === CREDENTIAL_BROADCASTED_TOAST ? null : current),
        );
      }, 4200);

      const hashForLedger =
        stateHash
        ?? certificationPipelineRef.current.hash
        ?? payload.hash;
      const completedAt =
        certificationPipelineRef.current.examinationCompletedAt
        ?? new Date().toISOString();

      if (
        hashForLedger
        && !certificationPipelineRef.current.ledgerDispatched
      ) {
        certificationPipelineRef.current.ledgerDispatched = true;
        const ledgerResult = await streamComplianceToLedger({
          hash: hashForLedger,
          candidateName: readStoredLegalName(),
          tierId: certificationTier,
          score: scoreResult?.composite?.score ?? scoreResult?.weighted?.percentage,
          timestamp: completedAt,
        });
        if (ledgerStatus !== 'remote_sealed') {
          setLedgerStatus(ledgerResult?.success ? 'remote_sealed' : 'local_fallback');
        }
      } else if (!hashForLedger && ledgerStatus !== 'remote_sealed') {
        setLedgerStatus('local_fallback');
      }
    } catch {
      // Hash unavailable — credential remains locked until retry.
    }
  }, [stateHash, activeLocale, certificationTier, scoreResult, ledgerStatus]);

  const requiresAchievementClaim = !masterTestOverride;
  const effectiveCredentialUnlocked = masterTestOverride || credentialUnlocked || isShared;
  const credentialShrouded = requiresAchievementClaim && !effectiveCredentialUnlocked;
  const registryFirewallActive =
    !masterTestOverride && Boolean(scoreResult?.composite?.registryFirewallActive);
  const showCertificateBadge =
    scoreResult?.passesCertification && certificationTier && !credentialShrouded && !registryFirewallActive;

  const registryFormReady =
    registryEmail.trim().length > 0 && registryMessage.trim().length > 0;

  const handleConfirmCohort = useCallback(() => {
    if (!selectedCohortProfile) return;

    persistCohortProfile(selectedCohortProfile);
    setCohortProfile(selectedCohortProfile);
    setExamPhase(readStoredLegalName() ? 'active' : 'identity');
  }, [selectedCohortProfile]);

  const handleRegistrySubmit = async (event) => {
    event.preventDefault();
    if (!registryFormReady || registrySubmitting) return;

    setRegistrySubmitting(true);
    setRegistrySubmitError('');

    try {
      await submitIntakeForm({
        institutionName: 'Executive Registry — Post-Diagnostic Remediation',
        contactPerson: registryEmail.trim(),
        selectedTier: REGISTRY_INTAKE_FLAG,
        domainContext: getDomainContext(),
        additionalFields: {
          email: registryEmail.trim(),
          message: registryMessage.trim(),
          intake_flag: REGISTRY_INTAKE_FLAG,
          form_source: 'exam_registry_firewall_intake',
          composite_score: scoreResult?.composite?.score ?? null,
          cohort_profile: cohortProfile || null,
        },
      });
      setRegistrySubmitted(true);
    } catch {
      setRegistrySubmitError(t('exam.player.registryForm.error'));
    } finally {
      setRegistrySubmitting(false);
    }
  };

  if (tierParamInvalid || sessionInitFailed) {
    return <ExamPlayerRecoveryShell message={t('exam.player.navigationBlocked')} />;
  }

  if (examPhase === 'sealing') {
    return (
      <div className="exam-player" aria-live="polite" aria-busy={isSealing}>
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__credential">
          <div className="exam-player__status-indicator" style={{ marginBottom: '1.25rem' }}>
            <span className="exam-player__status-dot" aria-hidden="true" />
            WaqfLedger
          </div>
          <h2 className="exam-player__sealing-title">
            Sealing Attestation on WaqfLedger...
          </h2>
          <p className="exam-player__sealing-subtitle">
            Computing MCDA composite score and anchoring the SHA-256 state hash to the
            sovereign compliance ledger.
          </p>
          {sealingError ? (
            <>
              <p className="exam-player__sealing-error" role="alert">
                {sealingError}
              </p>
              <button
                type="button"
                className="exam-player__retry"
                onClick={handleRetry}
                style={{ marginTop: '1rem' }}
              >
                {t('exam.player.retryExam')}
              </button>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  if (examPhase === 'registryExposure' && scoreResult) {
    return (
      <div className="exam-player" aria-live="polite">
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__credential">
          <CompositeScorePanel composite={scoreResult.composite} t={t} />
          <h2 className="exam-player__registry-title">{t('exam.player.registryFirewall.title')}</h2>
          <p className="exam-player__registry-subtitle">{t('exam.player.registryFirewall.subtitle')}</p>
          <p className="exam-player__fail-subtitle">
            {t('exam.player.compositeThresholdNotice').replace(
              '{threshold}',
              String(REGISTRY_FIREWALL_THRESHOLD_PERCENT),
            )}
          </p>

          {registrySubmitted ? (
            <p className="exam-player__registry-success" role="status">
              {t('exam.player.registryForm.success')}
            </p>
          ) : (
            <form className="exam-player__registry-form" onSubmit={handleRegistrySubmit}>
              <div className="exam-player__registry-field">
                <label className="exam-player__registry-label" htmlFor="exam-registry-email">
                  {t('exam.player.registryForm.email')}
                </label>
                <input
                  id="exam-registry-email"
                  className="exam-player__registry-input"
                  type="email"
                  value={registryEmail}
                  onChange={(event) => setRegistryEmail(event.target.value)}
                  placeholder={t('forms.emailPlaceholder')}
                  autoComplete="email"
                />
              </div>

              <div className="exam-player__registry-field">
                <label className="exam-player__registry-label" htmlFor="exam-registry-message">
                  {t('exam.player.registryForm.message')}
                </label>
                <textarea
                  id="exam-registry-message"
                  className="exam-player__registry-textarea"
                  value={registryMessage}
                  onChange={(event) => setRegistryMessage(event.target.value)}
                  placeholder={t('exam.player.registryForm.messagePlaceholder')}
                />
              </div>

              {registrySubmitError ? (
                <p className="exam-player__registry-error" role="alert">
                  {registrySubmitError}
                </p>
              ) : null}

              <button
                type="submit"
                className="exam-player__registry-submit"
                disabled={!registryFormReady || registrySubmitting}
              >
                {registrySubmitting
                  ? t('exam.player.registryForm.submitting')
                  : t('exam.player.registryForm.submit')}
              </button>
            </form>
          )}

          <button type="button" className="exam-player__retry" onClick={handleRetry} style={{ marginTop: '1rem' }}>
            {t('exam.player.retryExam')}
          </button>
        </div>
      </div>
    );
  }

  if (examPhase === 'cohort') {
    return (
      <div className="exam-player" aria-live="polite">
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__cohort">
          <h2 className="exam-player__cohort-title">{t('exam.player.cohort.title')}</h2>
          <p className="exam-player__cohort-subtitle">{t('exam.player.cohort.subtitle')}</p>

          <div className="exam-player__cohort-grid" role="listbox" aria-label={t('exam.player.cohort.title')}>
            {COHORT_PROFILE_IDS.map((profileId) => {
              const isSelected = selectedCohortProfile === profileId;
              return (
                <button
                  key={profileId}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={
                    isSelected
                      ? 'exam-player__cohort-card exam-player__cohort-card--selected'
                      : 'exam-player__cohort-card'
                  }
                  onClick={() => setSelectedCohortProfile(profileId)}
                >
                  <p className="exam-player__cohort-label">{t(`exam.player.cohort.${profileId}.label`)}</p>
                  <p className="exam-player__cohort-name">{t(`exam.player.cohort.${profileId}.name`)}</p>
                </button>
              );
            })}
          </div>

          <div className="exam-player__identity-actions">
            <button
              type="button"
              className="exam-player__submit"
              disabled={!selectedCohortProfile}
              onClick={handleConfirmCohort}
            >
              {t('exam.player.cohort.confirm')}
            </button>
          </div>
          <p className="exam-player__waqf-caption">{t('exam.player.waqfLedgerCaption')}</p>
        </div>
      </div>
    );
  }

  if (examPhase === 'passed' && scoreResult) {
    return (
      <div className="exam-player exam-player--locked" aria-live="polite">
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__shell--credential-badge exam-player__credential">
          <CompositeScorePanel composite={scoreResult.composite} t={t} />
          <div className="exam-player__credential-stage exam-player__badge-stage">
            <div
              className={
                credentialShrouded
                  ? 'exam-player__credential-content exam-player__credential-content--shrouded'
                  : 'exam-player__credential-content'
              }
              aria-hidden={credentialShrouded}
            >
              {showCertificateBadge ? (
                <CertificateBadge
                  candidateName={candidateLegalName}
                  tierId={certificationTier}
                  stateHash={stateHash}
                  ledgerStatus={ledgerStatus}
                  t={t}
                />
              ) : (
                <>
                  <div className="exam-player__credential-seal" aria-hidden="true">
                    ✓
                  </div>
                  <h2 className="exam-player__credential-title">{t('exam.player.certificationTitle')}</h2>
                  <p className="exam-player__credential-subtitle">{t('exam.player.certificationSubtitle')}</p>
                </>
              )}
            </div>

            {credentialShrouded && (
              <div
                className="exam-player__credential-lock"
                role="dialog"
                aria-labelledby="exam-credential-lock-title"
                aria-modal="true"
              >
                <h3 id="exam-credential-lock-title" className="exam-player__credential-lock-title">
                  {t('exam.player.credentialLockTitle')}
                </h3>
                <div className="exam-player__credential-lock-actions">
                  <button
                    type="button"
                    className="exam-player__achievement-claim"
                    onClick={() => {
                      void handleLinkedInAchievementClaim();
                    }}
                  >
                    {t('exam.player.linkedinAchievementClaim')}
                  </button>
                </div>
                <p className="exam-player__waqf-caption">{t('exam.player.waqfLedgerCaption')}</p>
              </div>
            )}
          </div>
        </div>

        <p className="exam-player__lock-notice" role="status">
          {t('exam.player.navigationBlocked')}
        </p>

        {(shareToast || linkedInToast) && (
          <p
            className={
              isShared
                ? 'exam-player__share-toast exam-player__share-toast--success'
                : 'exam-player__share-toast exam-player__share-toast--pending'
            }
            role="status"
            aria-live="polite"
          >
            {shareToast || linkedInToast}
          </p>
        )}
      </div>
    );
  }

  if (examPhase === 'identity') {
    return (
      <div className="exam-player" aria-live="polite">
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__identity">
          <div className="exam-player__identity-seal" aria-hidden="true">
            ◈
          </div>
          <div className="exam-player__identity-field">
            <label className="exam-player__identity-label" htmlFor="exam-legal-identity">
              {t('exam.player.identityTitle')}
            </label>
            <input
              id="exam-legal-identity"
              type="text"
              className="exam-player__identity-input"
              value={legalNameInput}
              onChange={(event) => setLegalNameInput(event.target.value)}
              autoComplete="name"
              spellCheck={false}
            />
          </div>
          <p className="exam-player__identity-note">{t('exam.player.identityNote')}</p>
          <div className="exam-player__identity-actions">
            <button
              type="button"
              className="exam-player__submit"
              disabled={!legalNameInput.trim()}
              onClick={handleInitializeIdentity}
            >
              {t('exam.player.initializeExam')}
            </button>
          </div>
          <p className="exam-player__waqf-caption">{t('exam.player.waqfLedgerCaption')}</p>
        </div>
      </div>
    );
  }

  if (examPhase === 'failed' && scoreResult) {
    return (
      <div className="exam-player" aria-live="polite">
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__credential">
          <CompositeScorePanel composite={scoreResult.composite} t={t} />
          <h2 className="exam-player__fail-title">
            {scoreResult.securityBreach
              ? t('exam.player.securityBreachTitle')
              : t('exam.player.failedTitle')}
          </h2>
          <p className="exam-player__fail-subtitle">
            {scoreResult.securityBreach
              ? t('exam.player.securityBreachSubtitle')
              : (
                <>
                  {t('exam.player.failedSubtitle')} ({INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT}
                  %). {t('exam.player.weightedScore')}: {scoreResult?.weighted?.percentage ?? 0}%.
                </>
              )}
          </p>
          <button type="button" className="exam-player__retry" onClick={handleRetry}>
            {t('exam.player.retryExam')}
          </button>
        </div>
        {integrityToast && (
          <p className="exam-player__share-toast exam-player__share-toast--warning" role="alert">
            {integrityToast}
          </p>
        )}
      </div>
    );
  }

  if (examPhase === 'active' && !currentScenario) {
    return (
      <div className="exam-player" aria-live="polite">
        <style>{EXAM_PLAYER_STYLES}</style>
        <div className="exam-player__shell exam-player__credential">
          <h2 className="exam-player__fail-title">{t('exam.player.failedTitle')}</h2>
          <p className="exam-player__fail-subtitle">{t('exam.player.navigationBlocked')}</p>
          <button type="button" className="exam-player__retry" onClick={handleRetry}>
            {t('exam.player.retryExam')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="exam-player select-none"
      onCopy={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <style>{EXAM_PLAYER_STYLES}</style>
      <div className="exam-player__shell">
        <div className="exam-player__status-row">
          <div className="exam-player__status-indicator">
            <span className="exam-player__status-dot" aria-hidden="true" />
            {t('exam.player.scenarioPrefix')} {currentScenarioIndex + 1}{' '}
            {t('exam.player.scenarioOf')} {EXAM_SCENARIO_COUNT}
          </div>
          <div
            className="exam-player__progress-track"
            role="progressbar"
            aria-valuenow={currentScenarioIndex + 1}
            aria-valuemin={1}
            aria-valuemax={EXAM_SCENARIO_COUNT}
            aria-label={t('exam.player.scenarioPrefix')}
          >
            <div
              className="exam-player__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="exam-player__category">
          <span className="exam-player__category-label">{t('exam.player.regulatoryCategory')}</span>
          {currentScenario?.category}
        </div>

        <div className="exam-player__markdown">{renderScenarioMarkdown(currentScenario?.scenarioText)}</div>

        <p className="exam-player__category" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
          {t('exam.player.selectOption')}
        </p>

        <div className="exam-player__options" role="listbox" aria-label={t('exam.player.selectOption')}>
          {(currentScenario?.options ?? []).map((option, optionIndex) => {
            const isSelected = selectedOptionIndex === optionIndex;
            const optionKey =
              typeof option === 'object' && option !== null
                ? `${currentScenario.id}-${option.originalIndex}`
                : `${currentScenario.id}-${optionIndex}`;
            return (
              <button
                key={optionKey}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={
                  isSelected
                    ? 'exam-player__option exam-player__option--selected'
                    : 'exam-player__option'
                }
                onClick={() => setSelectedOptionIndex(optionIndex)}
              >
                <span className="exam-player__option-index">{OPTION_LETTERS[optionIndex]}</span>
                <span className="exam-player__option-text">{getOptionText(option)}</span>
              </button>
            );
          })}
        </div>

        <div className="exam-player__actions">
          <button
            type="button"
            className="exam-player__submit"
            disabled={selectedOptionIndex === null || isSealing}
            onClick={() => {
              void recordChoiceAndAdvance();
            }}
          >
            {isFinalScenario ? t('academy.submitExam') : t('exam.player.continue')}
          </button>
        </div>
      </div>

      {integrityToast && (
        <p className="exam-player__share-toast exam-player__share-toast--warning" role="alert">
          {integrityToast}
        </p>
      )}
      <span className="sr-only" aria-live="polite">
        Tab switches recorded: {tabSwitchCount}
      </span>
    </div>
  );
}
