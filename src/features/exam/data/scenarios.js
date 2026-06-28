/**
 * Authoritative Examination Matrix — safeAI.report
 * 30 situational compliance simulation scenarios aligned with EU AI Act Article 4
 * metrics and the Sovereign Algorithmic Governance Ledger (WaqfLedger.tech).
 *
 * Tier sequencing mirrors evaluationTiers.publicTiers in src/config/constants.js.
 */

export const EXAM_SCENARIO_MATRIX = [
  // ── Level 01: Assurance Certification (Scenarios 1–10) ──────────────────────
  {
    id: 1,
    tier: "Level 01",
    category: "Transparency",
    scenarioText:
      "A municipal employee receives an AI-generated policy brief summarizing proposed zoning regulations. The document bears no attribution indicating machine synthesis, and the employee is scheduled to circulate it to elected officials within the hour. Under Article 4 AI literacy obligations, which course of action satisfies the minimum standard of transparent human oversight before institutional dissemination?",
    options: [
      "Circulate the brief immediately, as AI-assisted drafting is presumed compliant when the underlying source statutes are publicly available.",
      "Disclose the use of generative AI, verify each cited regulatory reference against primary legislative sources, and document human review prior to distribution.",
      "Append a generic disclaimer stating that the document may contain errors, without specifying AI involvement or conducting substantive verification.",
      "Defer dissemination indefinitely until a third-party legal audit of the AI vendor's training corpus is completed."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.0
  },
  {
    id: 2,
    tier: "Level 01",
    category: "Human Oversight",
    scenarioText:
      "An HR coordinator uses a résumé-screening tool that assigns automated rejection scores to applicants. A candidate requests an explanation for their disqualification. The coordinator has received no training on the system's decision logic. Which response aligns with the human oversight principle mandated under EU AI Act literacy requirements?",
    options: [
      "Inform the candidate that algorithmic decisions are proprietary and therefore non-disclosable under vendor confidentiality terms.",
      "Escalate the inquiry to a qualified human reviewer, initiate a documented manual reassessment, and record the oversight intervention in the institutional audit trail.",
      "Re-run the candidate's profile through the system to confirm the rejection score, treating identical output as sufficient explanation.",
      "Advise the candidate to reapply using formatting conventions known to produce favorable scores within the automated pipeline."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.1
  },
  {
    id: 3,
    tier: "Level 01",
    category: "Data Privacy",
    scenarioText:
      "A healthcare administrative assistant is prompted by a commercial chatbot to paste a patient's diagnosis code and date of birth to 'generate a compassionate outreach letter.' The assistant operates within an EU member-state clinic subject to GDPR. What is the compliant handling of this request?",
    options: [
      "Paste the minimum identifiers necessary, as the chatbot's privacy policy states that data is not retained beyond the session.",
      "Decline to input identifiable health data into an unapproved external system; use an institutionally authorized, GDPR-conformant workflow with a documented legal basis for processing.",
      "Anonymize only the patient's surname while retaining the diagnosis code and date of birth, treating partial redaction as sufficient de-identification.",
      "Request the patient's verbal consent by telephone before pasting their data, without assessing the processor agreement or transfer impact."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.2
  },
  {
    id: 4,
    tier: "Level 01",
    category: "Fundamental Literacy",
    scenarioText:
      "During an internal workshop, a colleague asserts that 'large language models possess authoritative knowledge of current law because they are trained on legal corpora.' As a certified AI literacy candidate, which corrective statement most accurately reflects the epistemic limits of generative systems under professional compliance standards?",
    options: [
      "Large language models replicate probabilistic patterns in training data and may produce plausible but incorrect or outdated legal assertions; human verification against authoritative sources is mandatory.",
      "Models trained on legal corpora are legally binding when their confidence score exceeds ninety percent.",
      "Generative systems are unsuitable for any professional use and must be prohibited categorically within regulated institutions.",
      "Legal accuracy is guaranteed when the model provider publishes a SOC 2 Type II attestation."
    ],
    correctOptionIndex: 0,
    complianceWeight: 1.0
  },
  {
    id: 5,
    tier: "Level 01",
    category: "User Responsibility",
    scenarioText:
      "A financial analyst deploys a generative assistant to draft an investment memo containing forward-looking performance projections. The analyst intends to submit the memo under their own professional credentials. Which conduct satisfies the user-responsibility doctrine of Article 4 AI literacy?",
    options: [
      "Submit the memo as authored, provided the AI tool is listed in a footnote as a 'research aid.'",
      "Independently validate all quantitative claims, assume personal accountability for the final content, and retain evidence of human review and any material corrections applied.",
      "Transfer accountability to the AI vendor via the software license agreement, which indemnifies end users for content errors.",
      "Limit review to spell-checking and formatting, as generative systems are exempt from securities disclosure rules."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.1
  },
  {
    id: 6,
    tier: "Level 01",
    category: "Risk Recognition",
    scenarioText:
      "An employee receives a voice call purporting to be from the institution's CFO, instructing an urgent wire transfer. The caller's voice is highly convincing and references internal project names. The employee later learns a generative voice-cloning tool was used. Which preventive measure reflects everyday AI-enabled fraud risk recognition?",
    options: [
      "Rely on voice biometrics alone, as synthetic audio cannot replicate executive speech patterns convincingly.",
      "Implement out-of-band verification protocols for financial directives, train staff on deepfake-enabled social engineering, and treat AI-augmented impersonation as a standing operational threat.",
      "Disable all telephone communications in favor of email, which cannot be forged by AI systems.",
      "Authorize transfers below a threshold without verification to preserve operational velocity."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.2
  },
  {
    id: 7,
    tier: "Level 01",
    category: "Informed Consent",
    scenarioText:
      "A university advising office deploys a conversational agent to triage student mental-health referrals. Students are not informed that their responses are processed by an AI intermediary before human counsellor review. Which remediation satisfies informed-consent and transparency obligations?",
    options: [
      "Post the AI disclosure on the institution's annual privacy notice webpage without modifying the triage interface.",
      "Provide clear, just-in-time disclosure that an AI system participates in triage, describe data use and human review pathways, and obtain affirmative acknowledgment before collecting sensitive responses.",
      "Assume implied consent because students voluntarily accessed the advising portal.",
      "Remove the AI component silently while retaining historical interaction logs without notifying affected students."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.1
  },
  {
    id: 8,
    tier: "Level 01",
    category: "Output Verification",
    scenarioText:
      "A procurement officer asks a generative model to summarize three vendor contract clauses governing liability caps. The model returns confident citations with clause numbering that does not exist in the source PDFs. What verification protocol meets baseline AI literacy standards?",
    options: [
      "Accept the summary if internal stakeholders agree it reflects negotiated intent, regardless of citation accuracy.",
      "Cross-reference every quoted clause against the authoritative contract text, flag hallucinated citations, and prohibit reliance on unverified model output for binding decisions.",
      "Request the model regenerate the summary until clause numbering aligns, treating consistency across iterations as validation.",
      "Outsource verification to the vendor, as counterparty documents are their responsibility to interpret."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.2
  },
  {
    id: 9,
    tier: "Level 01",
    category: "Bias Awareness",
    scenarioText:
      "An AI-powered scheduling tool consistently assigns night shifts to employees whose surnames correlate with particular ethnic origin groups in the training region. Supervisors notice the pattern but attribute it to 'random optimization.' Which action reflects compliant bias recognition under Article 4 literacy expectations?",
    options: [
      "Continue using the tool unless a formal discrimination complaint is filed.",
      "Suspend automated scheduling pending impact assessment, notify governance stakeholders, and initiate corrective measures including bias testing and human reconciliation of assignments.",
      "Adjust display settings so shift patterns are less visible to frontline managers.",
      "Replace the tool with an identical product from a different vendor without examining underlying data or model behavior."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.3
  },
  {
    id: 10,
    tier: "Level 01",
    category: "Everyday Risk Recognition",
    scenarioText:
      "A staff member uploads an internal strategic plan to a free public generative AI website to 'improve the prose.' The document contains unreleased product roadmaps and partner pricing. Which immediate response satisfies everyday data-exfiltration risk protocols?",
    options: [
      "No action is required if the session was deleted after the prose enhancement was copied back locally.",
      "Report the incident through the institutional data-security channel, initiate breach-assessment procedures, revoke further use of unapproved tools, and document remedial steps including WaqfLedger-eligible audit logging where applicable.",
      "Change usernames on the AI platform to prevent attribution of the upload.",
      "Issue a department-wide memo discouraging uploads without notifying information security or assessing contractual confidentiality impact."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.4
  },

  // ── Level 02: Executive Governance (Scenarios 11–20) ───────────────────────
  {
    id: 11,
    tier: "Level 02",
    category: "Procurement Risk",
    scenarioText:
      "An institution's Chief Information Officer proposes adopting an enterprise generative AI suite via a single-source procurement justified by 'market urgency.' The vendor refuses to disclose model update cadence, training-data provenance, or subprocessors. Under executive governance standards aligned with EU AI Act due diligence, which procurement posture is compliant?",
    options: [
      "Proceed with single-source award to avoid competitive delay, conditioning compliance on the vendor's public marketing commitments.",
      "Halt award until contractual AI transparency annexes, subprocessor registers, model-change notification clauses, and conformity documentation are negotiated and legally reviewed.",
      "Delegate procurement sign-off to the vendor's customer success team, who certify best-effort alignment with unspecified regulatory frameworks.",
      "License the tool for a pilot cohort only, thereby eliminating enterprise-level governance obligations."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.6
  },
  {
    id: 12,
    tier: "Level 02",
    category: "Vendor Due Diligence",
    scenarioText:
      "A proposed AI analytics vendor provides a glossy 'Ethics & Safety' brochure but no technical documentation, risk classification, or EU declaration of conformity for modules marketed as supporting 'high-stakes decision support.' Which due-diligence standard must the executive governance board enforce before institutional deployment?",
    options: [
      "Accept the brochure as sufficient evidence of ethical alignment when accompanied by a discounted multi-year contract.",
      "Require verifiable technical documentation, intended-purpose statements, known limitations, applicable risk tier classification, and independent validation of claims material to regulated use cases.",
      "Rely on peer institutions' adoption decisions as implicit certification of vendor suitability.",
      "Limit deployment to non-EU jurisdictions to avoid documentation requirements altogether."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.7
  },
  {
    id: 13,
    tier: "Level 02",
    category: "Model Disclosure",
    scenarioText:
      "A foundation model provider updates its API terms to permit unrestricted use of user prompts for future training unless enterprise customers opt out within thirty days. Your institution processes confidential research data through the API under existing contracts silent on training reuse. What executive action satisfies model-disclosure and data-governance obligations?",
    options: [
      "Continue usage under legacy terms, asserting that silence implies perpetual confidentiality.",
      "Conduct emergency contract review, exercise opt-out or migration rights, notify affected data controllers, and amend institutional AI acceptable-use policy to reflect training-data reuse risks.",
      "Instruct researchers to paraphrase prompts so that verbatim training capture is impossible.",
      "Accept the new terms because industry-wide providers uniformly reserve training rights."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.8
  },
  {
    id: 14,
    tier: "Level 02",
    category: "Red-Teaming",
    scenarioText:
      "Before deploying an institutionally fine-tuned assistant to staff, the governance committee must authorize a red-teaming protocol. Which scope of adversarial testing meets executive-level red-teaming expectations for generative systems handling internal knowledge bases?",
    options: [
      "Run automated spell-check and latency benchmarks only, as generative models are stochastic by nature and adversarial testing is inconclusive.",
      "Commission structured red-teaming covering prompt injection, data exfiltration, privilege escalation, harmful output, and jailbreak attempts, with documented remediation of material findings prior to production release.",
      "Limit testing to the vendor's published safety card without institution-specific attack scenarios.",
      "Defer red-teaming until after full deployment to capture real-world failure modes organically."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.9
  },
  {
    id: 15,
    tier: "Level 02",
    category: "Institutional Liability",
    scenarioText:
      "A university licensing a third-party plagiarism-detection AI assigns failing grades based solely on the tool's similarity index, without human academic review. Students appeal, citing false positives on properly cited collaborative work. Which governance decision correctly addresses institutional liability?",
    options: [
      "Defend the grades on the basis that the vendor's algorithm is industry standard and therefore presumptively reliable.",
      "Mandate human-in-the-loop academic review for all adverse actions, suspend sole reliance on automated scores, and revise policy to allocate institutional accountability for final determinations.",
      "Indemnify the institution via the vendor contract and continue automated grading at scale.",
      "Shift liability to students by requiring them to opt in to AI detection in enrollment agreements."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.0
  },
  {
    id: 16,
    tier: "Level 02",
    category: "Contractual Compliance",
    scenarioText:
      "Legal counsel reviews an AI vendor master agreement containing a broad limitation-of-liability clause capping damages at twelve months of fees, while the system supports creditworthiness recommendations affecting EU consumers. Which contractual posture aligns with executive governance and institutional liability prudence?",
    options: [
      "Accept the cap unconditionally to accelerate digital transformation KPIs.",
      "Negotiate carve-outs for regulatory fines, data-breach indemnities, and conformity failures; require AI-specific warranties on intended purpose, bias mitigation, and incident notification timelines.",
      "Remove all liability caps by deleting the clause without replacement instruments.",
      "Transfer the agreement to a shell subsidiary to isolate institutional exposure."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.8
  },
  {
    id: 17,
    tier: "Level 02",
    category: "Third-Party Risk",
    scenarioText:
      "An AI transcription vendor subprocesses audio to a cloud region outside the EEA without Standard Contractual Clauses or Transfer Impact Assessment documentation. Institutional recordings include disciplinary hearings protected under employment law. What third-party risk remediation is required at the executive level?",
    options: [
      "Continue processing because transcription accuracy superseded transfer formalities in the business case.",
      "Suspend processing, require SCCs and TIAs or equivalent safeguards, map subprocessors, and prohibit transfer until documented compliance with Chapter V GDPR requirements.",
      "Encrypt audio files locally and assume encryption alone satisfies cross-border transfer rules without further assessment.",
      "Anonymize hearing participants by replacing names with initials in filenames only."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.9
  },
  {
    id: 18,
    tier: "Level 02",
    category: "Governance Framework",
    scenarioText:
      "The board requests a unified AI governance framework prior to approving a portfolio of pilot projects spanning HR, finance, and research. Which framework element set satisfies executive governance maturity under Article 4 institutional literacy expectations?",
    options: [
      "A one-page acceptable-use memo referencing vendor terms of service.",
      "A board-ratified AI governance charter defining risk taxonomy, role accountability, lifecycle gates, incident escalation, literacy training mandates, and ledger-backed certification requirements.",
      "An informal Slack channel for AI enthusiasts to share prompts and tools.",
      "Delegation of all governance functions to individual department heads without central standards."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.0
  },
  {
    id: 19,
    tier: "Level 02",
    category: "Audit Trail",
    scenarioText:
      "Regulators inquire whether the institution can reconstruct who authorized deployment of a customer-facing chatbot and which model version was live on a specific date. Current logs are fragmented across vendor dashboards with no institutional retention policy. Which audit-trail capability must executives prioritize?",
    options: [
      "Rely on vendor support tickets as ad hoc evidence of deployment decisions.",
      "Implement immutable, institution-controlled logging of deployment approvals, model version identifiers, configuration changes, and responsible officers, with retention aligned to regulatory inquiry windows.",
      "Capture screenshots of admin panels on a quarterly basis.",
      "Destroy logs after ninety days to minimize storage costs and liability surface."
    ],
    correctOptionIndex: 1,
    complianceWeight: 1.7
  },
  {
    id: 20,
    tier: "Level 02",
    category: "Executive Accountability",
    scenarioText:
      "Following a public incident in which an AI-generated communication misstated accreditation status, media scrutiny focuses on whether senior leadership exercised adequate oversight. The CEO asks counsel which accountability standard applies to executive decision-makers under EU AI Act literacy and governance doctrine.",
    options: [
      "Executives bear no accountability if they relied on certified IT staff and vendor assurances.",
      "Senior leadership must demonstrate provable AI literacy, documented approval of risk acceptability, and good-faith oversight mechanisms; delegation does not extinguish institutional or personal governance duties.",
      "Accountability attaches only to the model provider once the system bears CE marking.",
      "Public relations management satisfies accountability obligations if corrected statements are issued within forty-eight hours."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.1
  },

  // ── Level 03: Institutional Partner (Scenarios 21–30) ──────────────────────
  {
    id: 21,
    tier: "Level 03",
    category: "High-Risk System Deployment",
    scenarioText:
      "An authorized academic medical center plans to deploy an AI diagnostic support system classified as high-risk under Annex III of the EU AI Act. Deployment is scheduled before conformity assessment documentation is complete. As institutional partner governance lead, which deployment gate must be enforced?",
    options: [
      "Proceed under clinical urgency exemptions without documentation, documenting post-hoc rationale only if adverse events occur.",
      "Block production deployment until conformity assessment, CE marking where applicable, quality management integration, and registered EU database obligations are satisfied and archived.",
      "Limit deployment to private beta clinicians who sign informal confidentiality acknowledgments.",
      "Deploy exclusively on-premises to avoid cloud-related high-risk classification triggers."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.5
  },
  {
    id: 22,
    tier: "Level 03",
    category: "Human-in-the-Loop Auditing",
    scenarioText:
      "A high-risk credit-scoring AI operates with human reviewers who override fewer than 0.3% of decisions, predominantly to meet throughput SLAs. Internal audit finds reviewers spend average eleven seconds per case. Which human-in-the-loop auditing standard must the institutional partner enforce?",
    options: [
      "Maintain current throughput targets; override rates are statistically insignificant.",
      "Redesign review workflows to ensure meaningful human assessment, monitor override quality, retrain reviewers, and suspend automation scaling until audit metrics demonstrate substantive oversight rather than pro forma approval.",
      "Replace human reviewers with a secondary AI checker to improve consistency.",
      "Publish override statistics externally without changing operational practices."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.6
  },
  {
    id: 23,
    tier: "Level 03",
    category: "WaqfLedger Verification",
    scenarioText:
      "An institutional partner completes Level 03 certification for fifty faculty members and must immutably register each credential on the Sovereign Algorithmic Governance Ledger at WaqfLedger.tech. A batch export contains candidate identifiers, examination timestamps, tier level, and AES-256 hash digests. Which registration protocol satisfies cryptographic verification requirements?",
    options: [
      "Email CSV attachments to institutional IT for local spreadsheet storage.",
      "Transmit structured certification events to WaqfLedger.tech via the approved hashing pipeline, verify on-ledger confirmation receipts, and reconcile each issued badge against its immutable ledger record before public verification URLs are activated.",
      "Publish hashes on the institution's public website without ledger integration.",
      "Store hashes in a shared cloud folder accessible to partner administrators only."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.8
  },
  {
    id: 24,
    tier: "Level 03",
    category: "Conformity Assessment",
    scenarioText:
      "A deployer institution integrates a third-party biometric categorization module. The provider supplies partial technical documentation but declines to participate in notified-body assessment, asserting the module is a low-risk API component. Institutional counsel classifies the integrated use case as high-risk. What conformity pathway is authoritative?",
    options: [
      "Accept vendor classification to preserve integration timelines.",
      "Apply deployer obligations for high-risk systems: verify provider conformity artifacts, ensure CE marking and instructions for use, implement logging and human oversight, and refuse integration where required assessment evidence is absent.",
      "Rebrand the use case internally as 'research analytics' to lower regulatory classification.",
      "Outsource biometric processing to a non-EU affiliate to circumvent conformity requirements."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.7
  },
  {
    id: 25,
    tier: "Level 03",
    category: "Post-Market Monitoring",
    scenarioText:
      "Six months after deploying a high-risk AI-enabled admissions scoring system, demographic disparity metrics drift beyond validated thresholds, though the provider has not issued a model update notice. Which post-market monitoring response satisfies institutional partner obligations?",
    options: [
      "Await vendor communications before taking action to avoid duplicate remediation costs.",
      "Activate the institutional post-market monitoring plan: incident documentation, provider notification, interim human review of affected decisions, regulator reporting if required, and suspension of automated decisions pending root-cause analysis.",
      "Recalibrate display dashboards to mask disparity metrics from non-technical stakeholders.",
      "Retrain admissions staff to manually adjust scores post-hoc without systemic investigation."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.6
  },
  {
    id: 26,
    tier: "Level 03",
    category: "Cross-Border Transfer",
    scenarioText:
      "A multinational institutional partner centralizes AI model fine-tuning in a U.S. data lake containing EU student records. The partner's DPO flags absent Supplementary Measures following Schrems II jurisprudence. Executive leadership presses to maintain the pipeline for cost reasons. Which cross-border governance decision is compliant?",
    options: [
      "Continue transfers based on vendor assurances of 'enterprise-grade security.'",
      "Halt transfers until lawful mechanisms and documented Transfer Impact Assessments demonstrate enforceable rights for data subjects; implement EU-resident processing or approved contractual safeguards before resuming fine-tuning.",
      "Pseudonymize records by removing given names while retaining national ID numbers in the training set.",
      "Shift liability to students via enrollment consent forms referencing international processing."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.5
  },
  {
    id: 27,
    tier: "Level 03",
    category: "Algorithmic Impact Assessment",
    scenarioText:
      "Before renewing an institutional license for AI proctoring software, civil-society stakeholders allege disproportionate false positives for examinees with documented disabilities. The partner institution must commission an algorithmic impact assessment. Which assessment methodology satisfies institutional partner rigor?",
    options: [
      "Review vendor marketing materials citing fairness benchmarks on undisclosed datasets.",
      "Conduct an independent AIA examining affected rights, disability accommodations, error distribution across protected characteristics, less-intrusive alternatives, and stakeholder consultation, with binding mitigation before renewal.",
      "Survey proctoring administrators on subjective satisfaction scores.",
      "Limit assessment to legal review of the vendor's terms of service updates."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.7
  },
  {
    id: 28,
    tier: "Level 03",
    category: "Immutable Logging",
    scenarioText:
      "An institutional partner's compliance officer discovers that AI system logs stored in a vendor SaaS console can be edited by the vendor's support engineers without institutional notification. High-risk deployment documentation requires tamper-evident records. Which logging architecture must be mandated?",
    options: [
      "Continue relying on vendor console logs with weekly PDF exports.",
      "Require append-only, institutionally controlled log replication with cryptographic integrity proofs, segregated access, and synchronization to WaqfLedger.tech-eligible audit pipelines for certification and incident reconstruction.",
      "Log only aggregate usage metrics to reduce storage and privacy overhead.",
      "Trust verbal confirmations from vendor account managers that logs are 'effectively immutable.'"
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.8
  },
  {
    id: 29,
    tier: "Level 03",
    category: "Sovereign Governance",
    scenarioText:
      "A national ministry designates your institution as an Authorized Academic Center under L'INSTITUT ARTICLE 4 (A4I), granting fifty pre-paid Level 01 examination tokens and requiring sovereign governance alignment. A dean proposes selling surplus tokens to external corporations not covered by the B2B license. Which action upholds sovereign governance integrity?",
    options: [
      "Approve resale at market rates to fund departmental scholarships.",
      "Reject unauthorized token commercialization, enforce license scope per institutional B2B terms in constants registry, and report token allocation through the authorized dashboard with WaqfLedger-backed verification of each certification event.",
      "Transfer tokens to individual faculty as personal property.",
      "Create an unregistered secondary market with discounted bulk pricing for alumni startups."
    ],
    correctOptionIndex: 1,
    complianceWeight: 2.9
  },
  {
    id: 30,
    tier: "Level 03",
    category: "Institutional Partner Certification",
    scenarioText:
      "Upon conferral of the Level 03 Institutional Partner Badge, the partner must enable public verification at https://safeai.report/verification linking candidate credentials to WaqfLedger.tech records. A batch of three credentials fails hash reconciliation due to clock-skew during examination submission. Which certification finalization protocol is authoritative?",
    options: [
      "Issue badges immediately and correct ledger entries opportunistically when convenient.",
      "Withhold public verification activation until hash reconciliation succeeds, re-seal examination artifacts with AES-256 block hashing under the Sovereign Algorithmic Governance Ledger protocol, and document remediation in the institutional partner audit record before credential release.",
      "Publish badges with a disclaimer that ledger verification may be temporarily unavailable.",
      "Manually edit ledger hashes to match issued badges without re-examination or re-sealing."
    ],
    correctOptionIndex: 1,
    complianceWeight: 3.0
  }
];

/** Total scenario count — must remain 30 for Cisco-grade assessment integrity. */
export const EXAM_SCENARIO_COUNT = EXAM_SCENARIO_MATRIX.length;

/** Tier boundary indices for validation engines (inclusive ranges). */
export const EXAM_TIER_BOUNDARIES = {
  "Level 01": { startId: 1, endId: 10, focus: "Baseline AI Literacy, User Responsibilities, Everyday Risk Recognition" },
  "Level 02": { startId: 11, endId: 20, focus: "Procurement Risks, Red-Teaming, Vendor Model Disclosures, Institutional Liability" },
  "Level 03": { startId: 21, endId: 30, focus: "High-risk System Deployments, Human-in-the-loop Auditing, WaqfLedger Hashing Verification" }
};
