import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTranslator, getActiveLanguage } from '../../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../../config/constants.js';
import { resolveStripeGatewayUrl } from '../../../utils/stripeGateway.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

const TIER_I18N_KEYS = ['level01', 'level02', 'level03'];

const EXAM_TIER_PATHS = {
  level01: '/academy/exam?tier=level01',
  level02: '/academy/exam?tier=level02',
  level03: '/academy/exam?tier=level03',
};

const RESEARCH_TIER_ORDER = ['tierA', 'tierB'];
const PILLAR_KEYS = ['security', 'curriculum', 'telemetry'];
const INTAKE_PATH = '/academic-centers#intake-form';

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
  color: #fde68a;
  white-space: nowrap;
}

.pricing-matrix__level {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pm-accent-teal);
}

.pricing-matrix__name {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.35;
}

.pricing-matrix__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.pricing-matrix__price {
  font-size: clamp(1.35rem, 2.8vw, 1.75rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  color: var(--pm-accent);
}

.pricing-matrix__currency {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--pm-muted);
}

.pricing-matrix__description {
  margin: 0;
  flex: 1 1 auto;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--pm-muted);
}

.pricing-matrix__cta--free {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.35);
  background: rgba(94, 234, 212, 0.1);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: center;
  text-decoration: none;
  color: #99f6e4;
  transition: background 180ms ease, border-color 180ms ease;
}

.pricing-matrix__cta--free:hover {
  border-color: rgba(94, 234, 212, 0.55);
  background: rgba(94, 234, 212, 0.18);
}

.pricing-matrix__institutional {
  margin-top: clamp(1.75rem, 3.5vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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

.pricing-matrix__institutional-description {
  margin: 0;
  max-width: 48rem;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--pm-muted);
}

.pricing-matrix__research-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 1.15rem);
}

.pricing-matrix__research-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.1rem 1.15rem;
  border-radius: 0.875rem;
  border: 1px solid var(--pm-border);
  background: rgba(11, 15, 25, 0.45);
}

.pricing-matrix__research-card--featured {
  border-color: rgba(201, 162, 39, 0.4);
  background:
    linear-gradient(165deg, rgba(201, 162, 39, 0.1) 0%, rgba(11, 15, 25, 0.55) 50%),
    rgba(11, 15, 25, 0.45);
}

.pricing-matrix__research-tier {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pm-accent);
}

.pricing-matrix__research-name {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 800;
  line-height: 1.35;
}

.pricing-matrix__research-rate {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--pm-accent);
}

.pricing-matrix__research-desc {
  margin: 0;
  flex: 1 1 auto;
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--pm-muted);
}

.pricing-matrix__research-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pricing-matrix__research-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(201, 162, 39, 0.35);
  background: rgba(201, 162, 39, 0.14);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-align: center;
  text-decoration: none;
  color: #fde68a;
  cursor: pointer;
}

.pricing-matrix__research-cta--secondary {
  border-color: rgba(148, 163, 184, 0.28);
  background: rgba(148, 163, 184, 0.08);
  color: #e2e8f0;
}

.pricing-matrix__pillars {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pricing-matrix__pillars-title {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--pm-accent-teal);
}

.pricing-matrix__pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.pricing-matrix__pillar {
  padding: 0.85rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(11, 15, 25, 0.4);
}

.pricing-matrix__pillar-title {
  margin: 0 0 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.4;
  color: #f8fafc;
}

.pricing-matrix__pillar-desc {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.55;
  color: var(--pm-muted);
}

.pricing-matrix__consortium-footer {
  margin: 0;
  padding-top: 0.35rem;
  border-top: 1px solid rgba(148, 163, 184, 0.14);
  font-size: 0.6875rem;
  line-height: 1.65;
  color: rgba(148, 163, 184, 0.85);
}

@media (max-width: 960px) {
  .pricing-matrix__columns {
    grid-template-columns: 1fr;
  }

  .pricing-matrix__column--featured {
    order: -1;
  }

  .pricing-matrix__research-grid,
  .pricing-matrix__pillars-grid {
    grid-template-columns: 1fr;
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

function openSecureGatewayTab(url) {
  if (!url || typeof window === 'undefined') return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Strategic pricing matrix — public certification tiers and Institutional Research Support Matrix.
 */
export default function PricingMatrix({ language: languageProp }) {
  const { t, language } = usePricingTranslator(languageProp);
  const publicTiers = SAFEAI_MASTER_CONFIG?.evaluationTiers?.publicTiers ?? [];
  const researchSupport =
    SAFEAI_MASTER_CONFIG?.evaluationTiers?.institutionalResearchSupport ?? {};
  const fundingGateways = SAFEAI_MASTER_CONFIG?.fundingGateways ?? {};
  const consortiumFooter =
    researchSupport.consortiumFooter
    ?? t('landing.waqfLedgerBadge');

  const [stripeGatewayRevision, setStripeGatewayRevision] = useState(0);

  useEffect(() => {
    const refreshStripeGateways = () => setStripeGatewayRevision((value) => value + 1);
    window.addEventListener('storage', refreshStripeGateways);
    window.addEventListener('safeai:stripe-gateway-change', refreshStripeGateways);
    return () => {
      window.removeEventListener('storage', refreshStripeGateways);
      window.removeEventListener('safeai:stripe-gateway-change', refreshStripeGateways);
    };
  }, []);

  const wiseUrlForKey = (tierKey) =>
    tierKey === 'sponsor'
      ? fundingGateways.wiseTierBUrl ?? ''
      : fundingGateways.wiseTierAUrl ?? '';

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

      <aside
        className="pricing-matrix__institutional"
        aria-labelledby="pricing-matrix-institutional-name"
      >
        <div>
          <p className="pricing-matrix__institutional-label">
            {t('landing.pricing.institutionalLabel')}
          </p>
          <h3 id="pricing-matrix-institutional-name" className="pricing-matrix__institutional-name">
            {t('academicCenters.page.contributionMatrix.title')}
          </h3>
        </div>

        <p className="pricing-matrix__institutional-description">
          {t('academicCenters.page.contributionMatrix.introduction')}
        </p>

        <div className="pricing-matrix__research-grid" role="list">
          {RESEARCH_TIER_ORDER.map((registryKey) => {
            const tierConfig = researchSupport[registryKey];
            if (!tierConfig) return null;

            void stripeGatewayRevision;
            const matrixKey = tierConfig.key;
            const isFeatured = registryKey === 'tierB';
            const stripeUrl = resolveStripeGatewayUrl(tierConfig.stripeGateway);
            const wiseUrl = wiseUrlForKey(matrixKey);
            const rateLabel = formatPrice(
              tierConfig.price,
              tierConfig.currency ?? 'USD',
              language,
            );

            return (
              <article
                key={registryKey}
                className={
                  isFeatured
                    ? 'pricing-matrix__research-card pricing-matrix__research-card--featured'
                    : 'pricing-matrix__research-card'
                }
                role="listitem"
              >
                <p className="pricing-matrix__research-tier">
                  {t(`academicCenters.page.contributionMatrix.tiers.${matrixKey}.tierLabel`)}
                </p>
                <h4 className="pricing-matrix__research-name">
                  {t(`academicCenters.page.contributionMatrix.tiers.${matrixKey}.supportLabel`)}
                </h4>
                <p className="pricing-matrix__research-rate">
                  {rateLabel} / {tierConfig.period ?? 'Year'}
                </p>
                <p className="pricing-matrix__research-desc">
                  {t(`academicCenters.page.contributionMatrix.tiers.${matrixKey}.description`)}
                </p>

                <div className="pricing-matrix__research-actions">
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pricing-matrix__research-cta"
                  >
                    {t(`academicCenters.page.contributionMatrix.tiers.${matrixKey}.checkoutCta`)}
                  </a>
                  <button
                    type="button"
                    className="pricing-matrix__research-cta pricing-matrix__research-cta--secondary"
                    onClick={() => openSecureGatewayTab(wiseUrl)}
                  >
                    {t('academicCenters.page.alternativePayments.option1.wiseCta')}
                  </button>
                  <Link
                    to={INTAKE_PATH}
                    className="pricing-matrix__research-cta pricing-matrix__research-cta--secondary"
                  >
                    {t('academicCenters.page.alternativePayments.option2.action')}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <section className="pricing-matrix__pillars" aria-labelledby="pricing-matrix-pillars-title">
          <h4 id="pricing-matrix-pillars-title" className="pricing-matrix__pillars-title">
            {t('academicCenters.page.pillars.title')}
          </h4>
          <div className="pricing-matrix__pillars-grid" role="list">
            {PILLAR_KEYS.map((key) => (
              <article key={key} className="pricing-matrix__pillar" role="listitem">
                <h5 className="pricing-matrix__pillar-title">
                  {t(`academicCenters.page.pillars.${key}.title`)}
                </h5>
                <p className="pricing-matrix__pillar-desc">
                  {t(`academicCenters.page.pillars.${key}.description`)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <p className="pricing-matrix__consortium-footer">{consortiumFooter}</p>
      </aside>
    </section>
  );
}
