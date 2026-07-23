# The Open Institutional AI Readiness Framework (OIARF)

**The Open Institutional AI Readiness Framework (OIARF)** is an open-methodology, evidence-informed framework designed to assess organizational preparedness for responsible AI adoption. **SafeAI.report** serves as the open-access portal for the framework's digital diagnostics.

OIARF operationalizes deployer literacy verification under **EU AI Act Article 4** through a Cisco-grade, 30-scenario diagnostic instrument (A4-ALAM), institutional readiness scoring across eight organizational dimensions, and a privacy-preserving, tamper-evident cryptographic integrity layer powered by the **WaqfLedger Open-Access Consortium Engine**.

| Attribute | Value |
| --- | --- |
| Framework | Open Institutional AI Readiness Framework (OIARF) |
| Spec version | `2.0.0-OIARF` |
| Portal | [safeAI.report](https://safeai.report) |
| Academic authority | L'INSTITUT ARTICLE 4 (A4I) |
| Regulatory track | EU AI Act Article 4 — human competence and oversight |
| Languages | English · French · Spanish |

---

## Mission

OIARF equips institutions to measure, evidence, and continuously improve readiness for responsible AI adoption—without claiming exclusivity as an international standard. The framework is openly documented, empirically refinable, and designed for institutional validation over time.

---

## Eight Institutional Readiness Dimensions

Authoritative schema: [`schemas/institutional-readiness-spec.json`](schemas/institutional-readiness-spec.json)

| # | Dimension | Focus |
| --- | --- | --- |
| 1 | **Leadership** | Executive sponsorship, strategic AI direction, and board-level accountability |
| 2 | **Governance** | Policies, decision rights, and institutional AI control structures |
| 3 | **AI Literacy** | Human competence under EU AI Act Article 4 (A4-ALAM pillars) |
| 4 | **Technology** | Systems architecture, capability maturity, and integration readiness |
| 5 | **Data Readiness** | Provenance, quality, lineage, and lawful processing capacity |
| 6 | **Risk & Compliance** | Statutory alignment, risk classification, and auditability |
| 7 | **Workforce Culture** | Organizational norms, escalation practice, and continuous learning |
| 8 | **Operational Readiness** | Runtime capacity, resource allocation, and delivery efficiency |

### Dimension 8 — Operational Readiness (technical efficiency)

Arabic character tokenization compute-cost overhead (**+300% to +600%** relative to Latin-script baselines) is modeled exclusively under **Dimension 8 (Operational Readiness)** as a **technical resource-allocation efficiency metric**. It is **not** a literacy competency criterion and must not appear under the AI Literacy / A4-ALAM pillar set.

---

## A4-ALAM Literacy Pillars (EU AI Act Article 4)

The Article 4 track evaluates **human competence** only. Four pillars structure the diagnostic:

| Pillar | Title | Competence focus |
| --- | --- | --- |
| **P1** | Structural AI Competency & System Capabilities | Understanding AI system behaviors, limits, and capability boundaries |
| **P2** | Risk Recognition & Transparency Mandates | Identifying deployment risks and fulfilling disclosure obligations |
| **P3** | Human Oversight & Operational Boundaries | Intervention authority, escalation, and safe operating envelopes |
| **P4** | Accountability & Ethical Governance | Role-linked responsibility, ethical decision frames, and duty of care |

> **Scope note:** Compute cost, tokenization overhead, and related infrastructure efficiency indicators belong under Dimension 8—not under P1–P4.

---

## Scoring Engine — Multi-Criteria Decision Analysis (MCDA)

The scoring engine is a **quantitatively structured Multi-Criteria Decision Analysis (MCDA) model using role-specific weight allocations.**

Composite literacy score (role-adaptive form):

```
Sc = (Σ wp × Pp) × 100
```

where `Pp` is the pillar performance ratio and `wp` is the cohort-specific weight for pillar `p`.

**Role-specific weights were initially derived through expert judgment and are intended to be empirically refined using continuous institutional validation datasets.**

Cohort profiles (ExL, CLL, OEL) and weight vectors are declared in [`schemas/scoring-engine.json.txt`](schemas/scoring-engine.json.txt). Institutional certification applies the registry threshold defined in that schema (default **85%**).

---

## Cryptographic Integrity Layer

Certification and B2B institutional license events are attested through a **privacy-preserving, tamper-evident cryptographic integrity layer powered by the WaqfLedger Open-Access Consortium Engine.**

SafeAI.report does not hardcode proprietary ledger vendor semantics into the framework definition. Integrity proofs (state sealing, public verification, and institutional batch reconciliation) are expressed as consortium-engine capabilities, with operational endpoints configured via the platform registry (`SAFEAI_MASTER_CONFIG`).

Public verification surface: [safeAI.report/verify](https://safeai.report/verify)

---

## Repository Map

| Path | Role |
| --- | --- |
| `schemas/institutional-readiness-spec.json` | OIARF eight-dimension readiness specification (`2.0.0-OIARF`) |
| `schemas/scoring-engine.json.txt` | A4-ALAM MCDA cohort weights and pass threshold |
| `src/config/constants.js` | Authoritative branding, pricing, and infrastructure registry |
| `src/utils/scoringEngine.js` | Adaptive MCDA composite literacy calculation |
| `src/features/exam/` | 30-scenario Article 4 diagnostic instrument |
| `public/llms.txt` | Machine-readable open-access research summary |

---

## Academic Authority

- **Director:** Professor Adel El Bouzagaoui
- **Institution:** L'INSTITUT ARTICLE 4 (A4I)
- **Processing entity:** Global Capital Intelligence LLC
- **Enforcement reference:** EU AI Act Article 4 (statutory timeline from August 2026)

---

## License & Open Methodology

OIARF is published as an open methodology for institutional assessment and continuous validation. Diagnostic pathways on SafeAI.report remain open-access; voluntary institutional infrastructure contributions are defined in the constants registry and Academic Centers surface—not as free tiers invented outside that registry.


