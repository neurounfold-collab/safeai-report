import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTranslator, getActiveLanguage } from '../../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const TIER_I18N_KEYS = ['level01', 'level02', 'level03'];

const EXAM_TIER_PATHS = {
  level01: '/academy/exam?tier=level01',
  level02: '/academy/exam?tier=level02',
  level03: '/academy/exam?tier=level03',
};
const INSTITUTIONAL_FEATURE_KEYS = ['tokens', 'dashboard', 'logging', 'syllabus'];

const PRICING_MATRIX_STYLES = `
.pricing-matrix {
  --pm-accent: #c9a227;
  --pm-accent-teal: #5eead4;
  --pm-border: rgba(148, 163, 184, 0.18);
  --pm-text: #f8fafc;
  --pm-muted: #94a3b8;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(1.75rem, 3vw, 2.25rem);
  border-top: 1px solid var(--pm-border);
  color: var(--pm-text);
}

.pricing-matrix__header {
  text-align: center;
  margin-bottom: clamp(1.75rem, 3.5vw, 2.5rem);
}

.pricing-matrix__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.25rem, 2.8vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.pricing-matrix__subtitle {
  margin: 0 auto;
  max-width: 36rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--pm-muted);
}

.pricing-matrix__columns {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 1.35rem);
  align-items: stretch;
}

.pricing-matrix__column {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 2.5vw, 1.65rem);
  border-radius: 1rem;
  border: 1px solid var(--pm-border);
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 12px 40px rgba(0, 0, 0, 0.22);
  transition: border-color 220ms ease, box-shadow 220ms ease;
}

.pricing-matrix__column:hover {
  border-color: rgba(148, 163, 184, 0.28);
}

.pricing-matrix__column--featured {
  border-color: rgba(201, 162, 39, 0.45);
  background:
    linear-gradient(165deg, rgba(201, 162, 39, 0.1) 0%, rgba(15, 23, 42, 0.5) 42%),
    rgba(15, 23, 42, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(201, 162, 39, 0.12),
    0 16px 48px rgba(201, 162, 39, 0.08);
}

.pricing-matrix__badge {
  position: absolute;
  top: -0.65rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 162, 39, 0.45);
  background: rgba(201, 162, 39, 0.18);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--pm-accent);
  white-space: nowrap;
  max-width: calc(100% - 1.5rem);
  overflow: hidden;
  text-overflow: ellipsis;
}

.pricing-matrix__level {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--pm-accent-teal);
}

.pricing-matrix__name {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.35;
}

.pricing-matrix__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-top: auto;
}

.pricing-matrix__price {
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  color: var(--pm-text);
}

.pricing-matrix__currency {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pm-muted);
}

.pricing-matrix__description {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--pm-muted);
}

.pricing-matrix__cta-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.55rem;
  margin-top: 0.35rem;
}

.pricing-matrix__cta--free {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(45, 212, 191, 0.55);
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  color: #042f2e;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
}

.pricing-matrix__cta--free:hover {
  border-color: rgba(94, 234, 212, 0.75);
  background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
  transform: translateY(-1px);
}

.pricing-matrix__cta-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.35rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--pm-muted);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.45;
  text-align: center;
  text-decoration: underline;
  text-decoration-color: rgba(148, 163, 184, 0.35);
  text-underline-offset: 0.15em;
  transition: color 200ms ease, text-decoration-color 200ms ease;
}

.pricing-matrix__cta-fallback:hover {
  color: rgba(226, 232, 240, 0.88);
  text-decoration-color: rgba(148, 163, 184, 0.6);
}

.pricing-matrix__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.35);
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.22) 0%, rgba(180, 83, 9, 0.18) 100%);
  color: var(--pm-text);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-align: center;
  text-decoration: none;
  transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
}

.pricing-matrix__cta:hover {
  border-color: rgba(201, 162, 39, 0.55);
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.32) 0%, rgba(180, 83, 9, 0.26) 100%);
  transform: translateY(-1px);
}

.pricing-matrix__column--featured .pricing-matrix__cta {
  border-color: rgba(201, 162, 39, 0.55);
  background: linear-gradient(135deg, #c9a227 0%, #b45309 100%);
  color: #0b0f19;
}

.pricing-matrix__column--featured .pricing-matrix__cta:hover {
  background: linear-gradient(135deg, #d4ad2e 0%, #c4620a 100%);
}

.pricing-matrix__institutional {
  margin-top: clamp(1.25rem, 2.5vw, 1.75rem);
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: clamp(1.35rem, 2.5vw, 1.75rem);
  border-radius: 1rem;
  border: 1px solid rgba(94, 234, 212, 0.22);
  background:
    linear-gradient(135deg, rgba(94, 234, 212, 0.06) 0%, rgba(15, 23, 42, 0.55) 55%),
    rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.pricing-matrix__institutional-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.pricing-matrix__institutional-label {
  margin: 0 0 0.35rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pm-accent-teal);
}

.pricing-matrix__institutional-name {
  margin: 0;
  font-size: clamp(1.0625rem, 2.2vw, 1.35rem);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.pricing-matrix__institutional-price-block {
  text-align: right;
}

.pricing-matrix__institutional-price {
  display: block;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  color: var(--pm-accent);
}

.pricing-matrix__institutional-currency {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pm-muted);
}

.pricing-matrix__institutional-description {
  margin: 0;
  max-width: 48rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--pm-muted);
}

.pricing-matrix__feature-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pricing-matrix__feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: rgba(226, 232, 240, 0.92);
}

.pricing-matrix__feature-item::before {
  content: '✓';
  flex-shrink: 0;
  margin-top: 0.05rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pm-accent-teal);
}

@media (max-width: 960px) {
  .pricing-matrix__columns {
    grid-template-columns: 1fr;
  }

  .pricing-matrix__column--featured {
    order: -1;
  }

  .pricing-matrix__feature-list {
    grid-template-columns: 1fr;
  }

  .pricing-matrix__institutional-header {
    flex-direction: column;
  }

  .pricing-matrix__institutional-price-block {
    text-align: left;
  }
}
`;

function usePricingTranslator(languageProp) {
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

function formatPrice(amount, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Strategic pricing matrix — public certification tiers and institutional B2B license banner.
 */
export default function PricingMatrix({ language: languageProp }) {
  const { t, language } = usePricingTranslator(languageProp);
  const publicTiers = SAFEAI_MASTER_CONFIG?.evaluationTiers?.publicTiers ?? [];
  const institutionalB2B = SAFEAI_MASTER_CONFIG?.evaluationTiers?.institutionalB2B ?? {};

  return (
    <section className="pricing-matrix" aria-labelledby="pricing-matrix-title">
      <style>{PRICING_MATRIX_STYLES}</style>

      <header className="pricing-matrix__header">
        <h2 id="pricing-matrix-title" className="pricing-matrix__title">
          {t('monetizationTiers.title')}
        </h2>
        <p className="pricing-matrix__subtitle">{t('monetization.openAccessSubtitle')}</p>
      </header>

      <div className="pricing-matrix__columns" role="list">
        {(publicTiers || []).map((tier, index) => {
          const tierKey = TIER_I18N_KEYS[index];
          if (!tierKey) return null;

          return (
            <article
              key={tier?.level ?? tierKey}
              className="pricing-matrix__column pricing-matrix__column--featured"
              role="listitem"
            >
              <span className="pricing-matrix__badge">{t('landing.pricing.mostPopularBadge')}</span>

              <p className="pricing-matrix__level">
                {t(`monetizationTiers.publicTiers.${tierKey}.level`)}
              </p>
              <h3 className="pricing-matrix__name">
                {t(`monetizationTiers.publicTiers.${tierKey}.name`)}
              </h3>

              {tier?.price != null && tier?.currency && (
                <div className="pricing-matrix__price-row">
                  <span className="pricing-matrix__price">
                    {formatPrice(tier.price, tier.currency, language)}
                  </span>
                  <span className="pricing-matrix__currency">{tier.currency}</span>
                </div>
              )}

              <p className="pricing-matrix__description">
                {tier?.description ?? t(`landing.pricing.descriptions.${tierKey}`)}
              </p>

              <Link
                to={EXAM_TIER_PATHS[tierKey]}
                className="pricing-matrix__cta--free"
                aria-label={t(`monetizationTiers.publicTiers.${tierKey}.cta`)}
              >
                {t(`monetizationTiers.publicTiers.${tierKey}.cta`)}
              </Link>
            </article>
          );
        })}
      </div>

      <aside className="pricing-matrix__institutional" aria-labelledby="pricing-matrix-institutional-name">
        <div className="pricing-matrix__institutional-header">
          <div>
            <p className="pricing-matrix__institutional-label">
              {t('landing.pricing.institutionalLabel')}
            </p>
            <h3 id="pricing-matrix-institutional-name" className="pricing-matrix__institutional-name">
              {t('monetizationTiers.institutionalB2B.name')}
            </h3>
          </div>
          <div className="pricing-matrix__institutional-price-block">
            <span className="pricing-matrix__institutional-price">
              {formatPrice(institutionalB2B?.price ?? 0, institutionalB2B?.currency ?? 'USD', language)}
            </span>
            <span className="pricing-matrix__institutional-currency">
              {institutionalB2B?.currency ?? 'USD'}
            </span>
          </div>
        </div>

        <p className="pricing-matrix__institutional-description">
          {t('monetizationTiers.institutionalB2B.description')}
        </p>

        <ul className="pricing-matrix__feature-list">
          {INSTITUTIONAL_FEATURE_KEYS.map((featureKey) => (
            <li key={featureKey} className="pricing-matrix__feature-item">
              {t(`monetizationTiers.institutionalB2B.features.${featureKey}`)}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
