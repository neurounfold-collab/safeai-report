import React, { useMemo } from 'react';

/** Maps certification tier IDs to academy.badge.tier.* translation keys. */
const TIER_COMPETENCY_KEYS = {
  'Level 01': 'academy.badge.tier.level01',
  'Level 02': 'academy.badge.tier.level02',
  'Level 03': 'academy.badge.tier.level03',
};

function A4ScalesMark({ className = 'h-14 w-14' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M18 5.5L14.5 10.5H21.5L18 5.5Z" fill="#c9a227" />
      <path
        d="M18 10.5V27.5"
        stroke="#c9a227"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M5.5 12.5H30.5"
        stroke="#c9a227"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8.5 12.5V16.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M27.5 12.5V16.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M13 27.5H23"
        stroke="#c9a227"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6.5 18.5L10.5 16.5L10.5 24.5L6.5 22.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M29.5 18.5L25.5 16.5L25.5 24.5L29.5 22.5"
        stroke="#c9a227"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <text
        x="8.5"
        y="23.5"
        textAnchor="middle"
        fill="#c9a227"
        fontSize="10"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        A
      </text>
      <text
        x="27.5"
        y="23.5"
        textAnchor="middle"
        fill="#c9a227"
        fontSize="10"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
      >
        4
      </text>
    </svg>
  );
}

/**
 * Builds a repeating hash watermark grid for the certificate background layer.
 * @param {string} hash
 * @param {number} rows
 * @param {number} cols
 */
function buildHashWatermark(hash, rows = 14, cols = 6) {
  const segment = hash || '0'.repeat(64);
  const lines = [];
  for (let row = 0; row < rows; row += 1) {
    const offset = (row * 7) % segment.length;
    const rowText = Array.from({ length: cols }, (_, col) => {
      const start = (offset + col * 11) % segment.length;
      return segment.slice(start, start + 16).toUpperCase();
    }).join('   ');
    lines.push(rowText);
  }
  return lines.join('\n');
}

/**
 * Authoritative digital credential canvas with WaqfLedger provenance sealing.
 *
 * @param {object} props
 * @param {string} props.candidateName — Candidate full legal name.
 * @param {string} props.tierId — Certification tier (e.g. "Level 01").
 * @param {string | null} props.stateHash — 64-character SHA-256 verification state hash.
 * @param {(key: string) => string} props.t — i18n translator.
 */
export default function CertificateBadge({ candidateName, tierId, stateHash, t }) {
  const competencyKey = TIER_COMPETENCY_KEYS[tierId] ?? TIER_COMPETENCY_KEYS['Level 01'];
  const displayHash = stateHash ?? '0'.repeat(64);
  const watermarkText = useMemo(() => buildHashWatermark(displayHash), [displayHash]);

  return (
    <article
      className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-xl border border-[#c9a227]/30 bg-[#0b0f19] p-8 shadow-2xl sm:p-10 md:p-12"
      aria-label={t('academy.badge.subtitle')}
    >
      {/* SHA-256 verification state hash watermark wall */}
      <div
        className="pointer-events-none absolute inset-0 rotate-[-12deg] scale-125 select-none font-mono text-[10px] uppercase tracking-widest text-white opacity-[0.03]"
        aria-hidden="true"
      >
        <pre className="whitespace-pre-wrap break-all leading-relaxed">{watermarkText}</pre>
      </div>

      {/* Dual-nested gold inlay frame */}
      <div
        className="pointer-events-none absolute inset-4 rounded-lg border border-[#c9a227]/25 sm:inset-5 md:inset-6"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-6 rounded-md border border-[#c9a227]/15 sm:inset-7 md:inset-8"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        {/* Institutional header */}
        <header className="text-center">
          <div className="mb-4 flex justify-center">
            <A4ScalesMark className="h-12 w-12 sm:h-14 sm:w-14" />
          </div>
          <h2 className="font-serif text-sm font-semibold uppercase tracking-widest text-white sm:text-base">
            {t('academy.badge.institutionTitle')}
          </h2>
          <p className="mt-2 font-serif text-[0.65rem] uppercase tracking-[0.22em] text-slate-300 sm:text-xs">
            {t('academy.badge.subtitle')}
          </p>
        </header>

        {/* Candidate name & tier competency */}
        <div className="my-4 flex flex-1 flex-col items-center justify-center px-2 text-center sm:px-6">
          <p className="max-w-full break-words font-serif text-2xl font-semibold leading-[1.7] tracking-wide text-white sm:text-3xl md:text-4xl">
            {candidateName}
          </p>
          <p className="mt-4 max-w-2xl break-words font-serif text-xs leading-[1.7] text-slate-300 sm:text-sm md:text-[0.9375rem]">
            {t(competencyKey)}
          </p>
        </div>

        {/* Ledger verification node & executive signature */}
        <footer className="grid grid-cols-1 gap-6 border-t border-[#c9a227]/20 pt-5 sm:grid-cols-2 sm:gap-8 sm:pt-6">
          <div className="font-mono text-[0.625rem] leading-relaxed text-slate-400 sm:text-xs">
            <p className="text-slate-300">{t('academy.badge.registryNetwork')}</p>
            <p className="mt-1 break-all">
              {t('academy.badge.auditHashLabel')}{' '}
              <span className="text-emerald-400/90">{displayHash}</span>
            </p>
            <p className="mt-1 text-emerald-400/80">{t('academy.badge.status')}</p>
          </div>

          <div className="flex flex-col items-center justify-end text-center sm:items-end sm:text-right">
            <p
              className="max-w-full break-words font-serif text-xl italic leading-[1.7] tracking-wide text-amber-100/90 sm:text-2xl"
              style={{ fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif" }}
            >
              {t('academy.badge.signatureName')}
            </p>
            <p className="mt-1 max-w-full break-words text-[0.65rem] font-medium uppercase leading-[1.7] tracking-widest text-slate-400 sm:text-xs">
              {t('academy.badge.signatureTitle')}
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}
