import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createTranslator, getActiveLanguage } from '../../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import {
  EXAM_SCENARIO_MATRIX,
  EXAM_SCENARIO_COUNT,
} from '../data/scenarios.js';
import {
  buildResearchDataPacket,
  calculateExamScore,
  COHORT_PROFILE_IDS,
  createWaqfLedgerPayload,
  INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT,
  REGISTRY_FIREWALL_THRESHOLD_PERCENT,
} from '../utils/scoringEngine.js';
import { triggerLinkedInSocialUnlock } from '../../../utils/linkedInSocialUnlock.js';
import { streamComplianceToLedger } from '../../../utils/waqfLedgerClient';
import { getDomainContext, submitIntakeForm } from '../../../utils/emailRouter.js';
import CertificateBadge from './CertificateBadge.jsx';

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
`;

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const EXAM_PERSIST_KEY = 'SAFEAI_EXAM_SESSION_PERSIST';
const EXAM_PERSIST_SCHEMA_VERSION = 1;
const CANDIDATE_NAME_KEY = 'SAFEAI_EXAMINEE_LEGAL_NAME';
const COHORT_PROFILE_KEY = 'SAFEAI_EXAM_COHORT_PROFILE';
const REGISTRY_INTAKE_FLAG = 'EXECUTIVE_BRIEFING';
const MASTER_TEST_AUDIT_CODE = 'A4I_MASTER_TEST_AUDIT';
const MASTER_TEST_AUDITOR_NAME = 'Official Test Auditor';
const MASTER_TEST_AUDIT_KEY = 'SAFEAI_MASTER_TEST_AUDIT';

/** @type {Map<number, typeof EXAM_SCENARIO_MATRIX[number]>} */
const SCENARIO_BY_ID = new Map(EXAM_SCENARIO_MATRIX.map((scenario) => [scenario.id, scenario]));

/**
 * @param {unknown} data
 * @returns {data is {
 *   version: number;
 *   scenarioIds: number[];
 *   currentScenarioIndex: number;
 *   userChoices: Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>;
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
 * @returns {{
 *   shuffledExamMatrix: typeof EXAM_SCENARIO_MATRIX;
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

    return {
      shuffledExamMatrix: (parsed.scenarioIds ?? [])
        .map((scenarioId) => SCENARIO_BY_ID.get(scenarioId))
        .filter(Boolean),
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
 * @param {typeof EXAM_SCENARIO_MATRIX} shuffledExamMatrix
 * @param {number} currentScenarioIndex
 * @param {Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>} userChoices
 * @param {string} examStartedAt
 */
function persistExamSession(shuffledExamMatrix, currentScenarioIndex, userChoices, examStartedAt) {
  if (typeof window === 'undefined') return;

  const payload = {
    version: EXAM_PERSIST_SCHEMA_VERSION,
    scenarioIds: (shuffledExamMatrix ?? []).map((scenario) => scenario?.id).filter(Boolean),
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

function createInitialExamSessionState() {
  const persisted = loadPersistedExamSession();
  if (persisted) return persisted;

  return {
    shuffledExamMatrix: buildTierShuffledExamMatrix(),
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
 * Resolves the highest certification tier meeting the institutional threshold.
 * @param {import('../utils/scoringEngine.js').ExamScoreResult} scoreResult
 */
function resolveCertificationTier(scoreResult) {
  const qualifying = (scoreResult?.tierBreakdown ?? [])
    .filter((tier) => tier.weightedPercentage >= scoreResult?.certificationThresholdPercent)
    .sort((a, b) => {
      const order = { 'Level 01': 1, 'Level 02': 2, 'Level 03': 3 };
      return (order[b.tier] ?? 0) - (order[a.tier] ?? 0);
    });

  return qualifying[0]?.tier ?? 'Level 03';
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
 * and concatenates into a linear 30-scenario examination sequence.
 * @returns {typeof EXAM_SCENARIO_MATRIX}
 */
function buildTierShuffledExamMatrix() {
  const level01 = EXAM_SCENARIO_MATRIX.filter((scenario) => scenario.id >= 1 && scenario.id <= 10);
  const level02 = EXAM_SCENARIO_MATRIX.filter((scenario) => scenario.id >= 11 && scenario.id <= 20);
  const level03 = EXAM_SCENARIO_MATRIX.filter((scenario) => scenario.id >= 21 && scenario.id <= 30);

  return [
    ...fisherYatesShuffle(level01),
    ...fisherYatesShuffle(level02),
    ...fisherYatesShuffle(level03),
  ];
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
 * Fire-and-forget POST of the anonymous doctoral research telemetry packet.
 * @param {Array<{ scenarioId: number; chosenOptionIndex: number; timeSpentMs: number }>} responses
 * @param {string} examinationStartedAt
 * @param {string | undefined} locale
 */
function transmitDoctoralResearchPacket(responses, examinationStartedAt, locale) {
  const examinationCompletedAt = new Date().toISOString();

  let packet;
  try {
    packet = buildResearchDataPacket(
      {
        anonymousSessionKey: crypto.randomUUID(),
        examinationStartedAt,
        examinationCompletedAt,
        locale,
      },
      responses,
    );
  } catch {
    return;
  }

  const endpoint = SAFEAI_MASTER_CONFIG?.infrastructure?.emailRouterEndpoint;
  if (!endpoint) return;

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
export default function ExamPlayer({ language: languageProp, candidateName: candidateNameProp }) {
  const { t } = useMemo(
    () => createTranslator(languageProp ?? getActiveLanguage()),
    [languageProp],
  );

  const initialSessionRef = useRef(null);
  if (initialSessionRef.current === null) {
    initialSessionRef.current = createInitialExamSessionState();
  }
  const initialSession = initialSessionRef.current;

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

  const screenEnteredAtRef = useRef(Date.now());
  const examStartedAtRef = useRef(initialSession.examStartedAt);
  const credentialIdRef = useRef(null);
  const socialUnlockTriggeredRef = useRef(false);
  const certificationPipelineRef = useRef({ ...EMPTY_CERTIFICATION_PIPELINE });

  const currentScenario = shuffledExamMatrix[currentScenarioIndex];
  const isFinalScenario = currentScenarioIndex === EXAM_SCENARIO_COUNT - 1;
  const progressPercent = ((currentScenarioIndex + 1) / EXAM_SCENARIO_COUNT) * 100;
  const navigationLocked = examPhase === 'passed';

  const certificationTier = scoreResult ? resolveCertificationTier(scoreResult) : null;

  const candidateLegalName = useMemo(
    () => resolveCandidateLegalName(candidateNameProp, storedLegalName, t),
    [candidateNameProp, storedLegalName, t],
  );

  const activeLocale = languageProp ?? getActiveLanguage();

  useEffect(() => {
    if (examPhase !== 'passed' || !scoreResult?.passesCertification || !certificationTier) {
      return undefined;
    }

    if (!credentialIdRef.current) {
      credentialIdRef.current = crypto.randomUUID();
    }

    const credentialId = credentialIdRef.current;
    let cancelled = false;

    const persistHashArtifacts = (hash, examinationCompletedAt) => {
      setStateHash(hash);
      try {
        window.localStorage.setItem('SAFEAI_CREDENTIAL_STATE_HASH', hash);
        window.localStorage.setItem('SAFEAI_CERTIFICATION_TIER', certificationTier);
        window.localStorage.setItem('SAFEAI_CREDENTIAL_TIMESTAMP', examinationCompletedAt);
      } catch {
        // Storage may be unavailable in hardened browser profiles.
      }
    };

    const dispatchLedgerStream = (hash, examinationCompletedAt) => {
      if (certificationPipelineRef.current.ledgerDispatched) return;
      certificationPipelineRef.current.ledgerDispatched = true;

      void streamComplianceToLedger({
        hash,
        candidateName: readStoredLegalName(),
        tierId: certificationTier,
        score: scoreResult?.weighted?.percentage,
        timestamp: examinationCompletedAt,
      }).catch(() => {
        // Best-effort ledger stream — must not block certification flow.
      });
    };

    const attemptSocialUnlock = (hash) => {
      if (
        masterTestOverride ||
        certificationPipelineRef.current.socialUnlockSucceeded ||
        socialUnlockTriggeredRef.current
      ) {
        return;
      }

      void triggerLinkedInSocialUnlock({
        stateHash: hash,
        language: activeLocale,
      })
        .then((sharePayload) => {
          if (cancelled) return;
          certificationPipelineRef.current.socialUnlockSucceeded = true;
          socialUnlockTriggeredRef.current = true;
          setLinkedInToast(sharePayload.copySuccessMessage);
          setCredentialUnlocked(true);
          window.setTimeout(() => {
            window.open(sharePayload.linkedInShareUrl, '_blank', 'noopener,noreferrer');
          }, 350);
          window.setTimeout(() => setLinkedInToast(null), 4200);
        })
        .catch(() => {
          // Clipboard or hash unavailable — credential remains locked until manual retry.
        });
    };

    const resumePipeline = certificationPipelineRef.current;
    if (resumePipeline.credentialId === credentialId && resumePipeline.hash) {
      persistHashArtifacts(resumePipeline.hash, resumePipeline.examinationCompletedAt);
      dispatchLedgerStream(resumePipeline.hash, resumePipeline.examinationCompletedAt);
      attemptSocialUnlock(resumePipeline.hash);
      return () => {
        cancelled = true;
      };
    }

    const examinationCompletedAt = new Date().toISOString();

    createWaqfLedgerPayload(scoreResult, {
      credentialId,
      examinationCompletedAt,
      tier: certificationTier,
    })
      .then((payload) => {
        if (cancelled) return;

        const hash = payload.integrity.stateHash;
        const completedAt = payload.certification.examinationCompletedAt ?? examinationCompletedAt;

        certificationPipelineRef.current = {
          credentialId,
          hash,
          examinationCompletedAt: completedAt,
          ledgerDispatched: certificationPipelineRef.current.ledgerDispatched,
          socialUnlockSucceeded: certificationPipelineRef.current.socialUnlockSucceeded,
        };

        persistHashArtifacts(hash, completedAt);
        dispatchLedgerStream(hash, completedAt);
        attemptSocialUnlock(hash);
      })
      .catch(() => {
        // Hash generation failure — badge renders with pending digest state.
      });

    return () => {
      cancelled = true;
    };
  }, [examPhase, scoreResult, certificationTier, masterTestOverride, activeLocale]);

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

  const recordChoiceAndAdvance = useCallback(() => {
    if (selectedOptionIndex === null || !currentScenario) return;

    const timeSpentMs = Date.now() - screenEnteredAtRef.current;
    const response = {
      scenarioId: currentScenario.id,
      chosenOptionIndex: selectedOptionIndex,
      timeSpentMs,
    };

    const nextChoices = [...userChoices, response];
    setUserChoices(nextChoices);

    if (isFinalScenario) {
      clearExamPersistSession();
      const result = calculateExamScore(
        nextChoices,
        cohortProfile ? { cohortProfileId: cohortProfile } : {},
      );
      setScoreResult(result);

      if (!masterTestOverride && result.composite?.registryFirewallActive) {
        setExamPhase('registryExposure');
      } else if (result.passesCertification) {
        setExamPhase('passed');
      } else {
        setExamPhase('failed');
      }

      transmitDoctoralResearchPacket(nextChoices, examStartedAtRef.current, activeLocale);
      return;
    }

    setCurrentScenarioIndex((index) => index + 1);
  }, [selectedOptionIndex, currentScenario, userChoices, isFinalScenario, activeLocale, cohortProfile, masterTestOverride]);

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
    const freshSession = createInitialExamSessionState();
    setShuffledExamMatrix(freshSession.shuffledExamMatrix);
    setCurrentScenarioIndex(freshSession.currentScenarioIndex);
    setUserChoices(freshSession.userChoices);
    setSelectedOptionIndex(null);
    setScoreResult(null);
    setCredentialUnlocked(masterTestOverride);
    setStateHash(null);
    setRegistryEmail('');
    setRegistryMessage('');
    setRegistrySubmitted(false);
    setRegistrySubmitError('');
    credentialIdRef.current = null;
    socialUnlockTriggeredRef.current = false;
    certificationPipelineRef.current = { ...EMPTY_CERTIFICATION_PIPELINE };
    setExamPhase('active');
    examStartedAtRef.current = freshSession.examStartedAt;
    screenEnteredAtRef.current = Date.now();
  }, [masterTestOverride]);

  const handleLinkedInAchievementClaim = useCallback(async () => {
    try {
      const payload = await triggerLinkedInSocialUnlock({
        stateHash,
        language: activeLocale,
      });
      certificationPipelineRef.current.socialUnlockSucceeded = true;
      socialUnlockTriggeredRef.current = true;
      setLinkedInToast(payload.copySuccessMessage);
      setCredentialUnlocked(true);
      window.setTimeout(() => {
        window.open(payload.linkedInShareUrl, '_blank', 'noopener,noreferrer');
      }, 350);
      window.setTimeout(() => setLinkedInToast(null), 4200);
    } catch {
      // Clipboard or hash unavailable — credential remains locked until retry.
    }
  }, [stateHash, activeLocale]);

  const requiresAchievementClaim = !masterTestOverride;
  const effectiveCredentialUnlocked = masterTestOverride || credentialUnlocked;
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
                    onClick={handleLinkedInAchievementClaim}
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

        {linkedInToast && (
          <p className="exam-player__share-toast" role="status" aria-live="polite">
            {linkedInToast}
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
          <h2 className="exam-player__fail-title">{t('exam.player.failedTitle')}</h2>
          <p className="exam-player__fail-subtitle">
            {t('exam.player.failedSubtitle')} ({INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT}
            %). {t('exam.player.weightedScore')}: {scoreResult?.weighted?.percentage ?? 0}%.
          </p>
          <button type="button" className="exam-player__retry" onClick={handleRetry}>
            {t('exam.player.retryExam')}
          </button>
        </div>
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
    <div className="exam-player">
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
          {(currentScenario?.options ?? []).map((optionText, optionIndex) => {
            const isSelected = selectedOptionIndex === optionIndex;
            return (
              <button
                key={optionIndex}
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
                <span className="exam-player__option-text">{optionText}</span>
              </button>
            );
          })}
        </div>

        <div className="exam-player__actions">
          <button
            type="button"
            className="exam-player__submit"
            disabled={selectedOptionIndex === null}
            onClick={recordChoiceAndAdvance}
          >
            {isFinalScenario ? t('academy.submitExam') : t('exam.player.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
