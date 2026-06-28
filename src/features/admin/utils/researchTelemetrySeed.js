/** Statutory pass threshold — aligned with EU AI Act Article 4 competency gate. */
export const PASS_THRESHOLD = 85;

export const FUNDING_RESEARCH_USD = 1500;
export const FUNDING_INFRASTRUCTURE_USD = 3500;

const TRACK_DISTRIBUTION = [
  { evaluationTrack: 'level01', pass: 412, fail: 38 },
  { evaluationTrack: 'level02', pass: 186, fail: 24 },
  { evaluationTrack: 'level03', pass: 94, fail: 11 },
];

const PARTNER_IDS = ['A4I-MPL-001', 'A4I-BCN-002', 'A4I-TUN-003', 'A4I-CAS-004', 'A4I-LYN-005'];

function pickLanguage(rowIndex) {
  const slot = rowIndex % 100;
  if (slot < 52) return 'en';
  if (slot < 80) return 'fr';
  if (slot < 90) return 'es';
  return 'ar';
}

function pickPartnerId(rowIndex) {
  if (rowIndex % 4 === 0) return null;
  return PARTNER_IDS[rowIndex % PARTNER_IDS.length];
}

function pickFundingAmount(rowIndex, partnerId) {
  if (!partnerId) return 0;
  return rowIndex % 5 === 0 ? FUNDING_INFRASTRUCTURE_USD : FUNDING_RESEARCH_USD;
}

function pickScore(rowIndex, passed) {
  if (passed) return PASS_THRESHOLD + (rowIndex % 16);
  return 42 + (rowIndex % (PASS_THRESHOLD - 42));
}

function synthesizeTimestamp(rowIndex) {
  const base = new Date('2026-06-01T08:00:00.000Z').getTime();
  return new Date(base + rowIndex * 3 * 60 * 60 * 1000).toISOString();
}

function maskIdentifier(rowIndex) {
  const suffix = ((rowIndex * 2654435761) >>> 0).toString(16).slice(-4).toUpperCase();
  return `EXM-****-${suffix}`;
}

function synthesizeStateHash(rowIndex, evaluationTrack, score) {
  const seed = `${rowIndex}:${evaluationTrack}:${score}:a4i-article4`;
  let hash = '';
  for (let charIndex = 0; charIndex < 64; charIndex += 1) {
    const code = seed.charCodeAt(charIndex % seed.length);
    hash += ((code * (charIndex + 13) + rowIndex) % 16).toString(16);
  }
  return hash;
}

function resolveWaqfLedgerSynced(rowIndex, score, partnerId) {
  return score >= PASS_THRESHOLD && Boolean(partnerId) && rowIndex % 11 !== 0;
}

/**
 * @returns {Array<{
 *   id: string,
 *   timestamp: string,
 *   maskedIdentifier: string,
 *   evaluationTrack: string,
 *   language: string,
 *   score: number,
 *   stateHash: string,
 *   waqfLedgerSynced: boolean,
 *   partnerId: string|null,
 *   fundingAmount: number
 * }>}
 */
export function buildResearchTelemetryRows() {
  const rows = [];
  let rowIndex = 0;

  for (const track of TRACK_DISTRIBUTION) {
    for (let passIndex = 0; passIndex < track.pass; passIndex += 1) {
      rowIndex += 1;
      const partnerId = pickPartnerId(rowIndex);
      const score = pickScore(rowIndex, true);
      rows.push({
        id: `cohort-${String(rowIndex).padStart(4, '0')}`,
        timestamp: synthesizeTimestamp(rowIndex),
        maskedIdentifier: maskIdentifier(rowIndex),
        evaluationTrack: track.evaluationTrack,
        language: pickLanguage(rowIndex),
        score,
        stateHash: synthesizeStateHash(rowIndex, track.evaluationTrack, score),
        partnerId,
        fundingAmount: pickFundingAmount(rowIndex, partnerId),
        waqfLedgerSynced: resolveWaqfLedgerSynced(rowIndex, score, partnerId),
      });
    }

    for (let failIndex = 0; failIndex < track.fail; failIndex += 1) {
      rowIndex += 1;
      const partnerId = pickPartnerId(rowIndex);
      const score = pickScore(rowIndex, false);
      rows.push({
        id: `cohort-${String(rowIndex).padStart(4, '0')}`,
        timestamp: synthesizeTimestamp(rowIndex),
        maskedIdentifier: maskIdentifier(rowIndex),
        evaluationTrack: track.evaluationTrack,
        language: pickLanguage(rowIndex),
        score,
        stateHash: synthesizeStateHash(rowIndex, track.evaluationTrack, score),
        partnerId,
        fundingAmount: pickFundingAmount(rowIndex, partnerId),
        waqfLedgerSynced: resolveWaqfLedgerSynced(rowIndex, score, partnerId),
      });
    }
  }

  return rows;
}

/**
 * @param {ReturnType<typeof buildResearchTelemetryRows>} rows
 * @param {{ track: string, language: string, scoreStatus: string, partnerId: string }} filters
 */
export function filterResearchTelemetryRows(rows, filters) {
  const partnerQuery = filters.partnerId?.trim().toLowerCase() ?? '';

  return rows.filter((row) => {
    if (filters.track !== 'all' && row.evaluationTrack !== filters.track) return false;
    if (filters.language !== 'all' && row.language !== filters.language) return false;
    if (filters.scoreStatus === 'pass' && row.score < PASS_THRESHOLD) return false;
    if (filters.scoreStatus === 'fail' && row.score >= PASS_THRESHOLD) return false;
    if (partnerQuery && !row.partnerId?.toLowerCase().includes(partnerQuery)) return false;
    return true;
  });
}

/**
 * @param {ReturnType<typeof buildResearchTelemetryRows>} rows
 */
export function computeResearchMetrics(rows) {
  const totalCohorts = rows.length;
  const meanScore =
    totalCohorts > 0
      ? rows.reduce((sum, row) => sum + row.score, 0) / totalCohorts
      : 0;

  const languageCounts = { en: 0, fr: 0, es: 0, ar: 0 };
  rows.forEach((row) => {
    if (languageCounts[row.language] !== undefined) {
      languageCounts[row.language] += 1;
    }
  });

  const linguisticDistribution = Object.entries(languageCounts).map(([locale, count]) => ({
    locale,
    percentage: totalCohorts > 0 ? Math.round((count / totalCohorts) * 100) : 0,
    count,
  }));

  let researchContributions = 0;
  let infrastructureContributions = 0;
  let fundingVolume = 0;

  rows.forEach((row) => {
    if (row.fundingAmount === FUNDING_RESEARCH_USD) {
      researchContributions += 1;
      fundingVolume += FUNDING_RESEARCH_USD;
    } else if (row.fundingAmount === FUNDING_INFRASTRUCTURE_USD) {
      infrastructureContributions += 1;
      fundingVolume += FUNDING_INFRASTRUCTURE_USD;
    }
  });

  return {
    totalCohorts,
    meanScore,
    linguisticDistribution,
    fundingVolume,
    researchContributions,
    infrastructureContributions,
  };
}

/**
 * Nested doctoral research schema for statistical software import.
 * @param {ReturnType<typeof buildResearchTelemetryRows>} rows
 */
export function buildDoctoralDatasetPayload(rows) {
  return {
    schemaVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    authority: "L'INSTITUT ARTICLE 4 (A4I)",
    ledgerHost: 'WaqfLedger.tech',
    framework: 'EU AI Act Article 4 Compliance Metrics',
    recordCount: rows.length,
    records: rows.map((row) => ({
      cohortId: row.id,
      timestamp: row.timestamp,
      maskedIdentifier: row.maskedIdentifier,
      evaluationTrack: row.evaluationTrack,
      languageStream: row.language,
      scenarioPerformanceScore: row.score,
      stateHashSha256: row.stateHash,
      waqfLedgerSynced: row.waqfLedgerSynced,
      institutionalPartnerId: row.partnerId,
      fundingAmountUsd: row.fundingAmount,
    })),
  };
}
