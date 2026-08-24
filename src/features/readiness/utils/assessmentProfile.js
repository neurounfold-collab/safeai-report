import { LEDGER_ANCHOR_STATUS, LEDGER_TRACK } from '../../../config/ledgerTracks.js';
import { OIARF_SPEC_VERSION } from '../data/oiarfAssessment.js';
import {
  ANNEX_III_USE_CASES,
  FRIA_DIMENSION,
  REGULATORY_ROLES,
} from '../data/verifiaRiskEngine.js';
import { computeMcdaComposite, computeDimensionScore } from './mcdaComposite.js';

/**
 * Build the complete VerifIA / OIARF assessment profile with unrounded MCDA scores.
 *
 * @param {{
 *   answers: Record<string, number>,
 *   sector: string | null,
 *   regulatoryRole: string | null,
 *   annexUseCases: Record<string, boolean>,
 *   stateHash?: string | null,
 *   ledgerAnchored?: boolean,
 *   ledgerStatus?: string | null,
 *   sealedAt?: string | null,
 * }} input
 */
export function buildAssessmentProfile({
  answers,
  sector,
  regulatoryRole,
  annexUseCases,
  stateHash = null,
  ledgerAnchored = false,
  ledgerStatus = null,
  sealedAt = null,
}) {
  const composite = computeMcdaComposite(answers, { unrounded: true });
  const friaScore = computeDimensionScore(answers, FRIA_DIMENSION);

  const selectedAnnex = ANNEX_III_USE_CASES.filter((item) => annexUseCases?.[item.id])
    .map((item) => item.id);

  return {
    schemaVersion: OIARF_SPEC_VERSION,
    engine: 'VerifIA-Risk-Engine',
    trackType: LEDGER_TRACK.OIARF_INSTITUTIONAL_READINESS,
    regulatoryRole,
    roleFocusKey:
      REGULATORY_ROLES.find((role) => role.id === regulatoryRole)?.focusKey ?? null,
    annexIIISection3: selectedAnnex,
    sector: sector ?? null,
    fria: {
      dimensionKey: FRIA_DIMENSION.key,
      score: friaScore,
    },
    mcda: {
      dimensionScores: composite.dimensionScores,
      weights: composite.weights,
      overallIndex: composite.overallIndex,
      overallIndexPercent: composite.overallIndexPercent,
    },
    answers: { ...answers },
    stateHash: stateHash ?? null,
    sealedAt: stateHash ? (sealedAt ?? new Date().toISOString()) : null,
    ledgerAnchored: Boolean(ledgerAnchored),
    ledgerStatus:
      ledgerStatus
      ?? (ledgerAnchored ? LEDGER_ANCHOR_STATUS.ANCHORED : LEDGER_ANCHOR_STATUS.LOCAL_FALLBACK),
    anchored: Boolean(ledgerAnchored),
  };
}
