import React, { useEffect, useRef, useState } from 'react';
import { createTranslator, getActiveLanguage, isRtlLanguage } from '../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../config/constants.js';
import { getDomainContext, submitIntakeForm } from '../../utils/emailRouter.js';
import { resolveStripeGatewayUrl } from '../../utils/stripeGateway.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const CONTRIBUTION_TIER_KEYS = ['contributor', 'sponsor'];
const PILLAR_KEYS = ['security', 'curriculum', 'telemetry'];
const DEFAULT_TIER = 'contributor';
const MERCURY_WIRE_PREFERENCE = 'mercury_usd';
const SUCCESS_TOAST_DURATION_MS = 4200;

/** Maps intake tier keys to Mercury USD Wire registrar tier codes. */
const TARGET_TIER_MAP = {
  contributor: 'TIER_A_GRANT',
  sponsor: 'TIER_B_SPONSORSHIP',
};

/** Maps matrix tiers to SAFEAI_MASTER_CONFIG.infrastructure Stripe Payment Link keys. */
const STRIPE_TIER_GATEWAYS = {
  contributor: 'researchContributor',
  sponsor: 'nodeSponsor',
};

const CENTERS_STYLES = `
.academic-centers {
  --ac-accent: #c9a227;
  --ac-accent-teal: #5eead4;
  --ac-border: rgba(148, 163, 184, 0.18);
  --ac-text: #f8fafc;
  --ac-muted: #94a3b8;
  flex: 1 1 auto;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  color: var(--ac-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.academic-centers__inner {
  width: min(100%, 56rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
  min-width: 0;
}

.academic-centers__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.academic-centers__eyebrow {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ac-accent);
}

.academic-centers__matrix {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 1rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background:
    linear-gradient(165deg, rgba(201, 162, 39, 0.07) 0%, rgba(15, 23, 42, 0.78) 42%),
    rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 40px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.academic-centers__matrix-title {
  margin: 0;
  padding: 0.85rem 1.15rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ac-accent-teal);
  border-bottom: 1px solid var(--ac-border);
  background: rgba(11, 15, 25, 0.35);
}

.academic-centers__matrix-intro {
  margin: 0;
  padding: 1rem 1.15rem;
  border-bottom: 1px solid var(--ac-border);
}

.academic-centers__tiers-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 1.15rem);
  padding: clamp(1rem, 2.5vw, 1.25rem);
}

.academic-centers__tier-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
  padding: clamp(1rem, 2.5vw, 1.25rem);
  border-radius: 0.875rem;
  border: 1px solid var(--ac-border);
  background: rgba(11, 15, 25, 0.48);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.18);
}

.academic-centers__tier-card--featured {
  border-color: rgba(201, 162, 39, 0.45);
  background:
    linear-gradient(145deg, rgba(201, 162, 39, 0.12) 0%, rgba(15, 118, 110, 0.08) 100%),
    rgba(11, 15, 25, 0.52);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 0 28px rgba(201, 162, 39, 0.1);
}

.academic-centers__tier-letter {
  display: inline-flex;
  align-self: flex-start;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(94, 234, 212, 0.28);
  background: rgba(15, 118, 110, 0.14);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ac-accent-teal);
}

.academic-centers__tier-header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.academic-centers__tier-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.55rem;
}

.academic-centers__tier-name {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--ac-accent-teal);
}

.academic-centers__tier-badge {
  display: inline-flex;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 162, 39, 0.35);
  background: rgba(201, 162, 39, 0.12);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fef08a;
}

.academic-centers__tier-support {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--ac-muted);
}

.academic-centers__tier-rate {
  margin: 0;
  font-size: clamp(0.9375rem, 2.2vw, 1.0625rem);
  font-weight: 800;
  color: var(--ac-accent);
}

.academic-centers__tier-desc {
  margin: 0;
}

.academic-centers__tier-ledger {
  margin: 0;
  padding: 0.65rem 0.75rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.18);
  background: rgba(15, 118, 110, 0.08);
  font-size: 0.6875rem;
  color: rgba(226, 232, 240, 0.92);
}

.academic-centers__tier-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 0.7rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.45);
  background: linear-gradient(135deg, #c9a227 0%, #b45309 100%);
  color: #0f172a;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.academic-centers__tier-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(201, 162, 39, 0.24);
}

.academic-centers__tier-alt-actions {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
}

.academic-centers__tier-alt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(94, 234, 212, 0.32);
  background: rgba(15, 118, 110, 0.16);
  color: var(--ac-accent-teal);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.academic-centers__tier-alt-btn:hover {
  transform: translateY(-1px);
  background: rgba(15, 118, 110, 0.28);
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.18);
}

.academic-centers__tier-alt-btn--wire {
  border-color: rgba(201, 162, 39, 0.35);
  background: rgba(201, 162, 39, 0.1);
  color: #fef08a;
}

.academic-centers__tier-alt-btn--wire:hover {
  background: rgba(201, 162, 39, 0.18);
  box-shadow: 0 8px 20px rgba(201, 162, 39, 0.14);
}

.academic-centers__wire-tier-grid {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
}

.academic-centers__wire-invoice-banner {
  margin: 0;
  padding: clamp(0.75rem, 2vw, 0.9rem) clamp(0.85rem, 2vw, 1rem);
  border-radius: 0.625rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background:
    linear-gradient(155deg, rgba(30, 41, 59, 0.72) 0%, rgba(15, 23, 42, 0.88) 100%);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 10px 24px rgba(0, 0, 0, 0.22);
  font-size: clamp(0.6875rem, 1.8vw, 0.75rem);
  line-height: 1.7;
  color: rgba(226, 232, 240, 0.94);
}

.academic-centers__alt-gateway {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: clamp(0.85rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem) clamp(1rem, 2.5vw, 1.25rem);
  border-top: 1px solid var(--ac-border);
  background: rgba(11, 15, 25, 0.28);
}

.academic-centers__alt-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: 100%;
  margin-top: 0;
  padding: 0.55rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(100, 116, 139, 0.55);
  background: rgba(15, 23, 42, 0.35);
  color: rgba(203, 213, 225, 0.92);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.7;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
}

.academic-centers__alt-trigger:hover {
  border-color: rgba(148, 163, 184, 0.75);
  background: rgba(30, 41, 59, 0.55);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.35);
}

.academic-centers__alt-trigger[aria-expanded='true'] {
  border-color: rgba(94, 234, 212, 0.42);
  background: rgba(15, 118, 110, 0.12);
}

.academic-centers__alt-panel {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  margin-top: 0;
  transition:
    grid-template-rows 340ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 280ms ease,
    margin-top 340ms ease;
}

.academic-centers__alt-panel--open {
  grid-template-rows: 1fr;
  opacity: 1;
  margin-top: 0.65rem;
}

.academic-centers__alt-panel-inner {
  overflow: hidden;
  min-height: 0;
}

.academic-centers__alt-glass {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: clamp(0.85rem, 2vw, 1rem);
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background:
    linear-gradient(155deg, rgba(30, 41, 59, 0.72) 0%, rgba(15, 23, 42, 0.88) 100%);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.07),
    0 14px 32px rgba(0, 0, 0, 0.32);
}

.academic-centers__alt-panel-title {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ac-accent-teal);
}

.academic-centers__alt-option {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(100, 116, 139, 0.28);
  background: rgba(11, 15, 25, 0.52);
  min-width: 0;
}

.academic-centers__alt-option-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ac-text);
}

.academic-centers__alt-option-desc {
  margin: 0;
  font-size: 0.6875rem;
  color: var(--ac-muted);
}

.academic-centers__alt-option-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.academic-centers__alt-option-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(94, 234, 212, 0.32);
  background: rgba(15, 118, 110, 0.16);
  color: var(--ac-accent-teal);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.academic-centers__alt-option-btn:hover {
  transform: translateY(-1px);
  background: rgba(15, 118, 110, 0.28);
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.18);
}

.academic-centers__alt-option-btn--wire {
  width: 100%;
  border-color: rgba(201, 162, 39, 0.35);
  background: rgba(201, 162, 39, 0.1);
  color: #fef08a;
}

.academic-centers__alt-option-btn--wire:hover {
  background: rgba(201, 162, 39, 0.18);
  box-shadow: 0 8px 20px rgba(201, 162, 39, 0.14);
}

.academic-centers__card--highlighted {
  border-color: rgba(94, 234, 212, 0.55) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 3px rgba(94, 234, 212, 0.14),
    0 24px 48px rgba(15, 118, 110, 0.18) !important;
  animation: academic-centers-intake-pulse 1.6s ease-in-out 2;
}

@keyframes academic-centers-intake-pulse {
  0%,
  100% {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 0 0 3px rgba(94, 234, 212, 0.14),
      0 24px 48px rgba(15, 118, 110, 0.18);
  }
  50% {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 0 0 5px rgba(94, 234, 212, 0.22),
      0 28px 56px rgba(15, 118, 110, 0.26);
  }
}

.academic-centers__intake-hint {
  margin: 0;
  padding: 0.7rem 0.85rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.28);
  background: rgba(15, 118, 110, 0.12);
  font-size: 0.75rem;
  color: var(--ac-accent-teal);
}

.academic-centers__sr-only {
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

.academic-centers__matrix-ledger {
  margin: 0;
  padding: clamp(1rem, 2.5vw, 1.15rem);
  border-top: 1px solid var(--ac-border);
  background: rgba(11, 15, 25, 0.38);
  font-size: 0.8125rem;
  color: rgba(226, 232, 240, 0.94);
}

.academic-centers__matrix-ledger strong {
  color: var(--ac-accent-teal);
  font-weight: 700;
}

.academic-centers__pitch {
  margin: 0;
  padding: clamp(1.15rem, 2.5vw, 1.5rem) clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 0.875rem;
  border: 1px solid rgba(201, 162, 39, 0.32);
  border-inline-start: 4px solid var(--ac-accent);
  background: rgba(15, 23, 42, 0.55);
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: clamp(0.9375rem, 2.2vw, 1.0625rem);
  font-style: italic;
  color: rgba(248, 250, 252, 0.94);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.academic-centers__pillars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.academic-centers__pillars-title {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ac-accent);
}

.academic-centers__pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 1.15rem);
}

.academic-centers__pillar {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding: clamp(1rem, 2.5vw, 1.25rem);
  border-radius: 0.875rem;
  border: 1px solid var(--ac-border);
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.18);
  min-width: 0;
}

.academic-centers__pillar-title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ac-accent-teal);
}

.academic-centers__card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 1rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background:
    linear-gradient(165deg, rgba(201, 162, 39, 0.08) 0%, rgba(15, 23, 42, 0.72) 45%),
    rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 40px rgba(0, 0, 0, 0.28);
  min-width: 0;
}

.academic-centers__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.academic-centers__form-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ac-muted);
}

.academic-centers__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.academic-centers__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ac-muted);
}

.academic-centers__input,
.academic-centers__textarea,
.academic-centers__select {
  width: 100%;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid var(--ac-border);
  background: rgba(11, 15, 25, 0.65);
  color: var(--ac-text);
  font-size: 0.875rem;
}

.academic-centers__textarea {
  min-height: 5.5rem;
  resize: vertical;
}

.academic-centers__input:focus,
.academic-centers__textarea:focus,
.academic-centers__select:focus {
  outline: none;
  border-color: rgba(201, 162, 39, 0.45);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.12);
}

.academic-centers__submit {
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #c9a227 0%, #b45309 100%);
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.academic-centers__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(201, 162, 39, 0.24);
}

.academic-centers__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.academic-centers__success {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.28);
  background: rgba(15, 118, 110, 0.14);
  font-size: 0.8125rem;
  color: var(--ac-accent-teal);
}

.academic-centers__error {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  color: #fca5a5;
}

.academic-centers__toast {
  position: fixed;
  inset-block-start: 1.25rem;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  z-index: 50;
  max-width: min(32rem, calc(100vw - 2rem));
  padding: 0.75rem 1.15rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(94, 234, 212, 0.35);
  background: rgba(15, 23, 42, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  font-size: clamp(0.8125rem, 2vw, 0.875rem);
  font-weight: 600;
  color: var(--ac-accent-teal);
  text-align: center;
  line-height: 1.7;
  animation: academic-centers-toast-in 220ms ease-out;
}

@keyframes academic-centers-toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-0.35rem);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@media (max-width: 768px) {
  .academic-centers__tiers-grid,
  .academic-centers__pillars-grid {
    grid-template-columns: 1fr;
  }
}
`;

function interpolateTranslation(text, vars = {}) {
  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replace(new RegExp(`\\{${name}\\}`, 'g'), value),
    text,
  );
}

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

/**
 * Voluntary institutional research support — graduated grant matrix for academic centers.
 * Stripe CTAs resolve via SAFEAI_MASTER_CONFIG.fundingGateways payment link anchors.
 */
export default function AcademicCentersView({ language: languageProp }) {
  const { t, language } = usePageTranslator(languageProp);
  const rtl = isRtlLanguage(language);
  const ledgerHost = SAFEAI_MASTER_CONFIG?.infrastructure?.ledgerHost ?? '';
  const fundingGateways = SAFEAI_MASTER_CONFIG?.fundingGateways ?? {};

  const intakeFormRef = useRef(null);
  const successToastTimerRef = useRef(null);

  const [selectedTier, setSelectedTier] = useState(DEFAULT_TIER);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [stripeGatewayRevision, setStripeGatewayRevision] = useState(0);
  const [altPanelOpen, setAltPanelOpen] = useState(false);
  const [requestWireInvoice, setRequestWireInvoice] = useState(false);
  const [wirePreference, setWirePreference] = useState('');
  const [intakeHighlighted, setIntakeHighlighted] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    document.title = t('page_titles.industrial');
  }, [t]);

  useEffect(
    () => () => {
      if (successToastTimerRef.current) {
        window.clearTimeout(successToastTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const refreshStripeGateways = () => setStripeGatewayRevision((value) => value + 1);

    window.addEventListener('storage', refreshStripeGateways);
    window.addEventListener('safeai:stripe-gateway-change', refreshStripeGateways);

    return () => {
      window.removeEventListener('storage', refreshStripeGateways);
      window.removeEventListener('safeai:stripe-gateway-change', refreshStripeGateways);
    };
  }, []);

  const stripeCheckoutUrl = (tierKey) => {
    void stripeGatewayRevision;
    const gateway = STRIPE_TIER_GATEWAYS[tierKey];
    return gateway ? resolveStripeGatewayUrl(gateway) : '';
  };

  const tx = (key, vars = {}) => interpolateTranslation(t(key), vars);

  const tierLabel = (key) => t(`academicCenters.page.contributionMatrix.tiers.${key}.name`);
  const tierRate = (key) => t(`academicCenters.page.contributionMatrix.tiers.${key}.rate`);

  const formReady =
    selectedTier.length > 0 && email.trim().length > 0 && message.trim().length > 0;

  const toggleAltPaymentPanel = () => {
    setAltPanelOpen((current) => !current);
  };

  const openSecureGatewayTab = (url) => {
    if (!url || typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const wiseUrlForTier = (tierKey) =>
    tierKey === 'sponsor'
      ? fundingGateways.wiseTierBUrl ?? ''
      : fundingGateways.wiseTierAUrl ?? '';

  const focusIntakeForWire = (tierKey) => {
    setSelectedTier(tierKey);
    setRequestWireInvoice(true);
    setWirePreference(MERCURY_WIRE_PREFERENCE);
    setIntakeHighlighted(true);
    setAltPanelOpen(false);

    requestAnimationFrame(() => {
      document.getElementById('intake-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const isMercuryWireActive =
    requestWireInvoice && wirePreference === MERCURY_WIRE_PREFERENCE;

  const resetIntakeView = () => {
    setSelectedTier(DEFAULT_TIER);
    setEmail('');
    setMessage('');
    setRequestWireInvoice(false);
    setWirePreference('');
    setIntakeHighlighted(false);
    setAltPanelOpen(false);
    setSubmitted(false);
    setSubmitError('');
  };

  const showSuccessToast = (messageKey) => {
    setSuccessToast(t(messageKey));

    if (successToastTimerRef.current) {
      window.clearTimeout(successToastTimerRef.current);
    }

    successToastTimerRef.current = window.setTimeout(() => {
      setSuccessToast('');
      successToastTimerRef.current = null;
    }, SUCCESS_TOAST_DURATION_MS);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formReady || submitting) return;

    setSubmitting(true);
    setSubmitError('');

    const tierName = tierLabel(selectedTier);
    const clientEmail = email.trim();
    const invoiceSpecifications = message.trim();
    const targetTier = TARGET_TIER_MAP[selectedTier] ?? TARGET_TIER_MAP.contributor;

    const additionalFields = {
      target_tier: targetTier,
      client_email: clientEmail,
      invoice_specifications: invoiceSpecifications,
      email: clientEmail,
      message: invoiceSpecifications,
      support_tier_key: selectedTier,
      support_rate: tierRate(selectedTier),
      form_source: 'academic_centers_contribution_intake',
      request_formal_pdf_invoice: requestWireInvoice,
      wire_transfer_preference: wirePreference,
    };

    if (isMercuryWireActive) {
      additionalFields.payment_method = 'MERCURY_WIRE';
      additionalFields.billing_status = 'INVOICE_PENDING';
    }

    try {
      await submitIntakeForm({
        institutionName: tierName,
        contactPerson: clientEmail,
        selectedTier: tierName,
        domainContext: getDomainContext(),
        additionalFields,
      });

      if (isMercuryWireActive) {
        resetIntakeView();
        showSuccessToast('academicCenters.page.intake.mercuryWireSuccess');
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitError(t('academicCenters.page.intake.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="academic-centers" dir={rtl ? 'rtl' : 'ltr'}>
      <style>{CENTERS_STYLES}</style>

      {successToast ? (
        <p className="academic-centers__toast break-words" role="status" aria-live="polite">
          {successToast}
        </p>
      ) : null}

      <div className="academic-centers__inner">
        <header className="academic-centers__header">
          <p className="academic-centers__eyebrow break-words leading-[1.7]">
            {t('academicCenters.page.eyebrow')}
          </p>
          <h1 className="break-words text-[clamp(1.375rem,3vw,1.875rem)] font-extrabold leading-[1.7] tracking-tight text-slate-50">
            {t('academicCenters.page.title')}
          </h1>
          <p className="break-words text-sm leading-[1.7] text-slate-400">
            {t('academicCenters.page.subtitle')}
          </p>
        </header>

        <section className="academic-centers__matrix" aria-labelledby="ac-matrix-title">
          <h2
            id="ac-matrix-title"
            className="academic-centers__matrix-title break-words leading-[1.7]"
          >
            {t('academicCenters.page.contributionMatrix.title')}
          </h2>

          <p className="academic-centers__matrix-intro break-words text-[0.8125rem] leading-[1.7] text-slate-400">
            {t('academicCenters.page.contributionMatrix.introduction')}
          </p>

          <div className="academic-centers__tiers-grid">
            {CONTRIBUTION_TIER_KEYS.map((key) => {
              const isFeatured = key === 'sponsor';
              const checkoutUrl = stripeCheckoutUrl(key);

              return (
                <article
                  key={key}
                  className={
                    isFeatured
                      ? 'academic-centers__tier-card academic-centers__tier-card--featured'
                      : 'academic-centers__tier-card'
                  }
                >
                  <span className="academic-centers__tier-letter break-words leading-[1.7]">
                    {t(`academicCenters.page.contributionMatrix.tiers.${key}.tierLabel`)}
                  </span>

                  <div className="academic-centers__tier-header">
                    <div className="academic-centers__tier-name-row">
                      <h3 className="academic-centers__tier-name min-w-0 break-words leading-[1.7]">
                        {tierLabel(key)}
                      </h3>
                      {isFeatured ? (
                        <span className="academic-centers__tier-badge break-words leading-[1.7]">
                          {t('academicCenters.page.contributionMatrix.recommendedBadge')}
                        </span>
                      ) : null}
                    </div>
                    <p className="academic-centers__tier-support break-words leading-[1.7]">
                      {t(`academicCenters.page.contributionMatrix.tiers.${key}.supportLabel`)}
                    </p>
                    <p className="academic-centers__tier-rate break-words leading-[1.7]">
                      {tierRate(key)}
                    </p>
                  </div>

                  <p className="academic-centers__tier-desc break-words text-xs leading-[1.7] text-slate-400">
                    {t(`academicCenters.page.contributionMatrix.tiers.${key}.description`)}
                  </p>

                  <p className="academic-centers__tier-ledger break-words leading-[1.7]">
                    {tx('academicCenters.page.contributionMatrix.tiers.ledgerNote', { ledgerHost })}
                  </p>

                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="academic-centers__tier-cta break-words leading-[1.7]"
                  >
                    {t(`academicCenters.page.contributionMatrix.tiers.${key}.checkoutCta`)}
                  </a>

                  <div className="academic-centers__tier-alt-actions">
                    <button
                      type="button"
                      className="academic-centers__tier-alt-btn break-words leading-[1.7]"
                      onClick={() => openSecureGatewayTab(wiseUrlForTier(key))}
                    >
                      {t('academicCenters.page.alternativePayments.option1.wiseCta')}
                    </button>
                    <button
                      type="button"
                      className="academic-centers__tier-alt-btn academic-centers__tier-alt-btn--wire break-words leading-[1.7]"
                      onClick={() => focusIntakeForWire(key)}
                    >
                      {t('academicCenters.page.alternativePayments.option2.action')}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="academic-centers__alt-gateway">
            <button
              type="button"
              className="academic-centers__alt-trigger break-words leading-[1.7]"
              aria-expanded={altPanelOpen}
              aria-controls="ac-alt-panel-shared"
              onClick={toggleAltPaymentPanel}
            >
              {t('academicCenters.page.alternativePayments.trigger')}
            </button>

            <div
              id="ac-alt-panel-shared"
              className={
                altPanelOpen
                  ? 'academic-centers__alt-panel academic-centers__alt-panel--open'
                  : 'academic-centers__alt-panel'
              }
              aria-hidden={!altPanelOpen}
            >
              <div className="academic-centers__alt-panel-inner">
                <div
                  className="academic-centers__alt-glass"
                  role="region"
                  aria-labelledby="ac-alt-panel-title"
                >
                  <h3
                    id="ac-alt-panel-title"
                    className="academic-centers__alt-panel-title break-words leading-[1.7]"
                  >
                    {t('academicCenters.page.alternativePayments.panelTitle')}
                  </h3>

                  <article className="academic-centers__alt-option">
                    <h4 className="academic-centers__alt-option-title break-words leading-[1.7]">
                      {t('academicCenters.page.alternativePayments.option2.title')}
                    </h4>
                    <p className="academic-centers__alt-option-desc break-words leading-[1.7]">
                      {t('academicCenters.page.alternativePayments.option2.description')}
                    </p>
                    <div className="academic-centers__wire-tier-grid">
                      {CONTRIBUTION_TIER_KEYS.map((tierKey) => (
                        <button
                          key={tierKey}
                          type="button"
                          className="academic-centers__alt-option-btn academic-centers__alt-option-btn--wire break-words leading-[1.7]"
                          onClick={() => focusIntakeForWire(tierKey)}
                        >
                          {t(`academicCenters.page.alternativePayments.option2.actionTier.${tierKey}`)}
                        </button>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <p className="academic-centers__matrix-ledger break-words leading-[1.7]">
            {tx('academicCenters.page.contributionMatrix.waqfLedgerFootnote', { ledgerHost })}
          </p>
        </section>

        <blockquote className="academic-centers__pitch break-words leading-[1.7]">
          {tx('academicCenters.page.pitch.quote', { ledgerHost })}
        </blockquote>

        <section className="academic-centers__pillars" aria-labelledby="ac-pillars-title">
          <h2
            id="ac-pillars-title"
            className="academic-centers__pillars-title break-words leading-[1.7]"
          >
            {t('academicCenters.page.pillars.title')}
          </h2>

          <div className="academic-centers__pillars-grid" role="list">
            {PILLAR_KEYS.map((key) => (
              <article key={key} className="academic-centers__pillar" role="listitem">
                <h3 className="academic-centers__pillar-title break-words leading-[1.7]">
                  {t(`academicCenters.page.pillars.${key}.title`)}
                </h3>
                <p className="break-words text-xs leading-[1.7] text-slate-400">
                  {tx(`academicCenters.page.pillars.${key}.description`, { ledgerHost })}
                </p>
              </article>
            ))}
          </div>
        </section>

        <article
          ref={intakeFormRef}
          className={
            intakeHighlighted
              ? 'academic-centers__card academic-centers__card--highlighted'
              : 'academic-centers__card'
          }
        >
          <form id="intake-form" className="academic-centers__form" onSubmit={handleSubmit}>
            <h2 className="academic-centers__form-title break-words leading-[1.7]">
              {t('academicCenters.page.intake.title')}
            </h2>

            {intakeHighlighted ? (
              <p className="academic-centers__intake-hint break-words leading-[1.7]" role="status">
                {t('academicCenters.page.intake.wireRoutingHint')}
              </p>
            ) : null}

            <div className="academic-centers__field">
              <label className="academic-centers__label break-words leading-[1.7]" htmlFor="centers-tier">
                {t('academicCenters.page.intake.tierSelection')}
              </label>
              <select
                id="centers-tier"
                className="academic-centers__select break-words leading-[1.7]"
                value={selectedTier}
                onChange={(event) => setSelectedTier(event.target.value)}
              >
                {CONTRIBUTION_TIER_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {t(`academicCenters.page.intake.tierOptions.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="academic-centers__field">
              <label className="academic-centers__label break-words leading-[1.7]" htmlFor="centers-email">
                {t('academicCenters.page.intake.email')}
              </label>
              <input
                id="centers-email"
                className="academic-centers__input break-words leading-[1.7]"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t('forms.emailPlaceholder')}
                autoComplete="email"
              />
            </div>

            <div className="academic-centers__field">
              <label className="academic-centers__label break-words leading-[1.7]" htmlFor="centers-message">
                {t('academicCenters.page.intake.message')}
              </label>
              <textarea
                id="centers-message"
                className="academic-centers__textarea break-words leading-[1.7]"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('academicCenters.page.intake.messagePlaceholder')}
              />
            </div>

            <input
              id="centers-wire-invoice"
              type="checkbox"
              className="academic-centers__sr-only"
              tabIndex={-1}
              aria-hidden="true"
              checked={requestWireInvoice}
              readOnly
            />

            {submitError ? (
              <p className="academic-centers__error break-words leading-[1.7]" role="alert">
                {submitError}
              </p>
            ) : null}

            {requestWireInvoice ? (
              <p
                className="academic-centers__wire-invoice-banner break-words leading-[1.7]"
                role="status"
              >
                {t('academicCenters.page.intake.wireInvoiceBanner')}
              </p>
            ) : null}

            {submitted ? (
              <p className="academic-centers__success break-words leading-[1.7]" role="status">
                {t('academicCenters.page.intake.success')}
              </p>
            ) : (
              <button
                type="submit"
                className="academic-centers__submit break-words leading-[1.7]"
                disabled={!formReady || submitting}
              >
                {submitting
                  ? t('academicCenters.page.intake.submitting')
                  : t('academicCenters.page.intake.submit')}
              </button>
            )}
          </form>
        </article>
      </div>
    </div>
  );
}
