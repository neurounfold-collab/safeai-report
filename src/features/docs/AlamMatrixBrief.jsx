import React, { useEffect, useState } from 'react';
import { createTranslator, getActiveLanguage, isRtlLanguage } from '../../i18n/index.js';
import { SAFEAI_MASTER_CONFIG } from '../../config/constants.js';
import {
  EXAM_SCENARIO_COUNT,
  EXAM_TIER_BOUNDARIES,
} from '../exam/data/scenarios.js';
import { INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT } from '../exam/utils/scoringEngine.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

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

const STRUCTURAL_MATRIX_ROWS = [
  {
    role: 'Front-Line Deployer / Operator',
    tier: 'Level 01',
    scenarioBlock: '1–10',
    weightRange: 'wᵢ ∈ [1.0, 1.4]',
    pillar: 'Pillar 1 — FLA',
    focus: EXAM_TIER_BOUNDARIES['Level 01'].focus,
  },
  {
    role: 'Executive / Procurement Officer',
    tier: 'Level 02',
    scenarioBlock: '11–20',
    weightRange: 'wᵢ ∈ [1.6, 2.1]',
    pillar: 'Pillar 2 — RTRA',
    focus: EXAM_TIER_BOUNDARIES['Level 02'].focus,
  },
  {
    role: 'Compliance Auditor / Technical Verifier',
    tier: 'Level 03',
    scenarioBlock: '21–30',
    weightRange: 'wᵢ ∈ [2.5, 3.0]',
    pillar: 'Pillar 3 — GOC',
    focus: EXAM_TIER_BOUNDARIES['Level 03'].focus,
  },
  {
    role: 'Authorized Institutional Partner',
    tier: 'Level 03 + Ledger Seal',
    scenarioBlock: '21–30 (batch reconciliation)',
    weightRange: 'w₃₀ = 3.0 (terminal anchor)',
    pillar: 'Pillar 4 — IVC',
    focus: 'Immutable credential finalization, WaqfLedger.tech SHA-256 state anchoring',
  },
];

const RTRA_SCENARIO_TYPOLOGIES = [
  { code: 'T-PR', label: 'Procurement Risk', scenarios: '11' },
  { code: 'T-VD', label: 'Vendor Due Diligence', scenarios: '12' },
  { code: 'T-MD', label: 'Model Disclosure', scenarios: '13' },
  { code: 'T-RT', label: 'Red-Teaming', scenarios: '14' },
  { code: 'T-IL', label: 'Institutional Liability', scenarios: '15' },
  { code: 'T-CC', label: 'Contractual Compliance', scenarios: '16' },
  { code: 'T-TP', label: 'Third-Party Risk', scenarios: '17' },
  { code: 'T-GF', label: 'Governance Framework', scenarios: '18' },
  { code: 'T-AT', label: 'Audit Trail', scenarios: '19' },
  { code: 'T-EA', label: 'Executive Accountability', scenarios: '20' },
];

/**
 * Authoritative research asset — Global AI Literacy Assessment Matrix (Alam Matrix).
 * Houses the complete technical architecture of the Cisco-grade 30-scenario instrument.
 */
export default function AlamMatrixBrief({ language: languageProp }) {
  const { t, language } = usePageTranslator(languageProp);
  const rtl = isRtlLanguage(language);
  const { branding, legalAnchors, infrastructure } = SAFEAI_MASTER_CONFIG;

  useEffect(() => {
    document.title = t(
      'page_titles.alamMatrix',
      'Global AI Literacy Assessment Matrix — Alam Matrix Brief',
    );
  }, [t]);

  return (
    <article
      className="min-h-full bg-slate-950 text-slate-100 selection:bg-teal-500/30"
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex min-w-0 flex-col gap-3 border-b border-slate-800 pb-8">
          <p className="m-0 text-[0.625rem] font-bold uppercase tracking-[0.14em] text-teal-400">
            {t('alamMatrix.eyebrow', 'Technical Research Asset · L\'INSTITUT ARTICLE 4 (A4I)')}
          </p>
          <h1 className="m-0 min-w-0 break-words text-[clamp(1.5rem,3.5vw,2.125rem)] font-extrabold leading-[1.25] tracking-tight text-slate-50">
            Global AI Literacy Assessment Matrix
          </h1>
          <p className="m-0 text-sm font-semibold uppercase tracking-wide text-teal-300/90">
            Alam Matrix Brief — Instrument Architecture v1.0.0
          </p>
          <p className="m-0 min-w-0 break-words text-sm leading-[1.75] text-slate-400">
            {branding.standardName} · {infrastructure.targetFramework} ·{' '}
            {EXAM_SCENARIO_COUNT} scenarios · {INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT}% institutional
            certification threshold · {infrastructure.ledgerHost}
          </p>
        </header>

        {/* Executive Abstract */}
        <section className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.1em] text-teal-400">
            Executive Abstract
          </h2>
          <div className="flex flex-col gap-4 text-sm leading-[1.8] text-slate-300">
            <p className="m-0 break-words">
              The Global AI Literacy Assessment Matrix — codified internally as the{' '}
              <strong className="font-semibold text-slate-100">Alam Matrix</strong> — is the
              authoritative psychometric and governance architecture underpinning the{' '}
              {branding.name} certification platform. Administered under the academic authority of{' '}
              {branding.authority} and {legalAnchors.academicInstitution}, the instrument operationalizes
              deployer literacy verification mandated under {infrastructure.targetFramework} through a
              Cisco-grade, {EXAM_SCENARIO_COUNT}-scenario Case-Based Dilemma Vector (CBDV) runtime.
            </p>
            <p className="m-0 break-words">
              The matrix is structurally invariant across trilingual delivery surfaces (English, French,
              Spanish) and enforces a role-adaptive evaluation topology: front-line operators, executive
              procurement officers, compliance auditors, and authorized institutional partners each encounter
              scenario blocks calibrated to their statutory intervention boundaries. Weighted compliance
              scoring aggregates per-scenario structural weights; certification is granted only when the
              weighted percentage meets or exceeds the institutional threshold τ<sub>inst</sub> ={' '}
              {INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT}%. Successful credentials are immutably
              attested via {infrastructure.encryptionProtocol} on the{' '}
              {infrastructure.protocol} at {infrastructure.ledgerHost}.
            </p>
          </div>
        </section>

        {/* Four Evaluation Pillars */}
        <section className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.1em] text-teal-400">
            Four Evaluation Pillars
          </h2>
          <ol className="m-0 flex list-none flex-col gap-4 p-0">
            <li className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="m-0 mb-2 text-sm font-bold text-slate-100">
                Pillar 1 — Fundamental Literacy Assessment (FLA)
              </h3>
              <p className="m-0 break-words text-sm leading-[1.75] text-slate-400">
                Baseline deployer competency spanning transparency disclosure, human oversight intervention,
                data privacy handling, output verification, and everyday risk recognition. Governs Level 01
                scenarios 1–10 with structural weights wᵢ ∈ [1.0, 1.4].
              </p>
            </li>
            <li className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="m-0 mb-2 text-sm font-bold text-slate-100">
                Pillar 2 — Role-Tier Risk Architecture (RTRA)
              </h3>
              <p className="m-0 break-words text-sm leading-[1.75] text-slate-400">
                Executive-grade procurement oversight, vendor due diligence, red-teaming exposure, and
                institutional liability attribution. Governs Level 02 scenarios 11–20 with structural weights
                wᵢ ∈ [1.6, 2.1]. Evaluated exclusively through the Case-Based Dilemma Vector (CBDV)
                methodology (see §5).
              </p>
            </li>
            <li className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="m-0 mb-2 text-sm font-bold text-slate-100">
                Pillar 3 — Governance Oversight Compliance (GOC)
              </h3>
              <p className="m-0 break-words text-sm leading-[1.75] text-slate-400">
                High-risk system deployment auditing, human-in-the-loop verification workflows, conformity
                assessment, post-market monitoring, and cross-border transfer governance. Governs Level 03
                scenarios 21–29 with structural weights wᵢ ∈ [2.5, 2.9].
              </p>
            </li>
            <li className="min-w-0 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="m-0 mb-2 text-sm font-bold text-slate-100">
                Pillar 4 — Institutional Verification Credentialing (IVC)
              </h3>
              <p className="m-0 break-words text-sm leading-[1.75] text-slate-400">
                Terminal credential finalization, immutable logging, sovereign governance ledger anchoring,
                and authorized institutional partner batch reconciliation. Anchored by Scenario 30 (w₃₀ = 3.0)
                and the WaqfLedger.tech SHA-256 state hash protocol.
              </p>
            </li>
          </ol>
        </section>

        {/* Role-Adaptive Structural Matrix Table */}
        <section className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.1em] text-teal-400">
            Role-Adaptive Structural Matrix
          </h2>
          <p className="m-0 mb-4 break-words text-sm leading-[1.75] text-slate-400">
            The following table defines the role-adaptive topology binding deployer personas to assessment
            tiers, scenario blocks, structural weight ranges, and evaluation pillar assignments.
          </p>
          <div className="overflow-x-auto whitespace-nowrap lg:whitespace-normal">
            <table className="w-full min-w-[640px] border-collapse text-left text-xs leading-[1.6] text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-950/80">
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Deployer Role</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Tier</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Scenarios</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Weight Range</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Pillar</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Focus Domain</th>
                </tr>
              </thead>
              <tbody>
                {STRUCTURAL_MATRIX_ROWS.map((row) => (
                  <tr key={row.role} className="border-b border-slate-800/80 hover:bg-slate-950/40">
                    <td className="px-3 py-3 font-medium text-slate-100">{row.role}</td>
                    <td className="px-3 py-3">{row.tier}</td>
                    <td className="px-3 py-3 font-mono text-teal-300/90">{row.scenarioBlock}</td>
                    <td className="px-3 py-3 font-mono text-amber-200/90">{row.weightRange}</td>
                    <td className="px-3 py-3">{row.pillar}</td>
                    <td className="px-3 py-3 text-slate-400">{row.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mathematical Scoring Formulations */}
        <section className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.1em] text-teal-400">
            Mathematical Scoring Formulations
          </h2>
          <p className="m-0 mb-4 break-words text-sm leading-[1.75] text-slate-400">
            The scoring engine in <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-teal-300">scoringEngine.js</code>{' '}
            implements the following structurally invariant compliance aggregation model.
          </p>

          <div className="flex flex-col gap-4">
            <div className="overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 lg:whitespace-normal">
              <p className="m-0 font-mono text-sm leading-[1.9] text-slate-200">
                {'$$W_{\\text{earned}} = \\sum_{i=1}^{n} w_i \\cdot \\mathbb{1}_{\\text{correct}}(i)$$'}
              </p>
            </div>
            <div className="overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 lg:whitespace-normal">
              <p className="m-0 font-mono text-sm leading-[1.9] text-slate-200">
                {'$$W_{\\text{max}} = \\sum_{j=1}^{n} w_j$$'}
              </p>
            </div>
            <div className="overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 lg:whitespace-normal">
              <p className="m-0 font-mono text-sm leading-[1.9] text-slate-200">
                {'$$S_{\\text{weighted}} = \\frac{W_{\\text{earned}}}{W_{\\text{max}}} \\times 100$$'}
              </p>
            </div>
            <div className="overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 lg:whitespace-normal">
              <p className="m-0 font-mono text-sm leading-[1.9] text-slate-200">
                {`$$\\text{Certified} \\iff S_{\\text{weighted}} \\geq \\tau_{\\text{inst}}, \\quad \\tau_{\\text{inst}} = ${INSTITUTIONAL_CERTIFICATION_THRESHOLD_PERCENT}$$`}
              </p>
            </div>
            <div className="overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 lg:whitespace-normal">
              <p className="m-0 font-mono text-sm leading-[1.9] text-slate-200">
                {'$$S_{\\text{raw}} = \\frac{c}{n} \\times 100, \\quad c = \\sum_{k=1}^{n} \\mathbb{1}_{\\text{correct}}(k)$$'}
              </p>
            </div>
            <div className="overflow-x-auto whitespace-nowrap rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-3 lg:whitespace-normal">
              <p className="m-0 font-mono text-sm leading-[1.9] text-slate-200">
                {'$$\\forall \\, t \\in \\{\\text{Level 01}, \\text{Level 02}, \\text{Level 03}\\}: \\quad S_t = \\frac{\\sum_{i \\in \\mathcal{B}_t} w_i \\cdot \\mathbb{1}_{\\text{correct}}(i)}{\\sum_{i \\in \\mathcal{B}_t} w_i} \\times 100$$'}
              </p>
            </div>
          </div>

          <p className="m-0 mt-4 break-words text-xs leading-[1.7] text-slate-500">
            Where n = {EXAM_SCENARIO_COUNT}, wᵢ is the per-scenario complianceWeight from the authoritative
            matrix, ℬ<sub>t</sub> denotes the scenario block for tier t, and 𝕀<sub>correct</sub> is the
            indicator function returning 1 when the candidate selects the matrix-validated option index.
          </p>
        </section>

        {/* CBDV Methodology & RTRA Scenario Typologies */}
        <section className="min-w-0 rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="m-0 mb-4 text-xs font-bold uppercase tracking-[0.1em] text-teal-400">
            Case-Based Dilemma Vector (CBDV) Methodology
          </h2>
          <div className="mb-6 flex flex-col gap-4 text-sm leading-[1.8] text-slate-300">
            <p className="m-0 break-words">
              The CBDV methodology presents each candidate with a situational compliance dilemma encoded as
              a four-option response vector. Unlike declarative knowledge instruments, CBDV evaluates{' '}
              <em className="text-slate-200">observable intervention behavior</em> under time-constrained
              deployer conditions. Each dilemma maps to a single correct option index validated against the
              authoritative answer key; distractors represent statistically prevalent non-compliant conduct
              patterns observed in institutional audit telemetry.
            </p>
            <p className="m-0 break-words">
              CBDV vectors are shuffled per tier at examination runtime (independent Fisher–Yates permutation
              within Level 01, Level 02, and Level 03 blocks) to preserve psychometric integrity while
              preventing sequence memorization. Anonymous doctoral research packets emit only: scenario id,
              chosen index, correctness boolean, and time-spent milliseconds — no candidate-identifying
              fields.
            </p>
          </div>

          <h3 className="m-0 mb-3 text-sm font-bold text-slate-100">
            Pillar 2 (RTRA) — Scenario Typologies
          </h3>
          <p className="m-0 mb-4 break-words text-sm leading-[1.75] text-slate-400">
            The following typology registry defines the ten RTRA scenario classes governing Level 02
            executive and procurement governance evaluation.
          </p>
          <div className="overflow-x-auto whitespace-nowrap lg:whitespace-normal">
            <table className="w-full min-w-[480px] border-collapse text-left text-xs leading-[1.6] text-slate-300">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-950/80">
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Typology Code</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Class Label</th>
                  <th className="px-3 py-2.5 font-bold uppercase tracking-wide text-teal-400">Matrix IDs</th>
                </tr>
              </thead>
              <tbody>
                {RTRA_SCENARIO_TYPOLOGIES.map((typology) => (
                  <tr key={typology.code} className="border-b border-slate-800/80 hover:bg-slate-950/40">
                    <td className="px-3 py-3 font-mono font-medium text-teal-300">{typology.code}</td>
                    <td className="px-3 py-3 text-slate-100">{typology.label}</td>
                    <td className="px-3 py-3 font-mono text-amber-200/90">{typology.scenarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="min-w-0 border-t border-slate-800 pt-6 text-xs leading-[1.7] text-slate-500">
          <p className="m-0 break-words">
            {legalAnchors.academicInstitution} · {branding.authority} · {legalAnchors.processingEntity}
          </p>
          <p className="m-0 mt-2 break-words">
            {infrastructure.protocol} · {infrastructure.ledgerHost} · Instrument ID: EU-AI-ACT-A4-30-SCENARIO
          </p>
        </footer>
      </div>
    </article>
  );
}
