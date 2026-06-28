import{j as e,S as g,g as b,c as j}from"./index-D2vGI_9r.js";import{b as p}from"./vendor-BEm5BeKO.js";const N="safeai.language",w="safeai:language-change",c={usedTokens:12,activeCertifications:[{credentialId:"SAI-A4I-2026-004821",tierKey:"monetizationTiers.publicTiers.level01.level"},{credentialId:"SAI-A4I-2026-004799",tierKey:"monetizationTiers.publicTiers.level01.level"},{credentialId:"SAI-A4I-2026-004755",tierKey:"monetizationTiers.publicTiers.level02.level"},{credentialId:"SAI-A4I-2026-004701",tierKey:"monetizationTiers.publicTiers.level01.level"},{credentialId:"SAI-A4I-2026-004688",tierKey:"monetizationTiers.publicTiers.level03.level"}],ledgerFeed:[{timestamp:"2026-06-10T14:22:31.000Z",credentialId:"SAI-A4I-2026-004821",stateHash:"7f3a9c2e1b8d4f6a0e5c3b9d2a1f8e7c6b5d4a3f2e1c0b9a8d7e6f5a4b3c2d1"},{timestamp:"2026-06-09T09:14:02.000Z",credentialId:"SAI-A4I-2026-004799",stateHash:"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},{timestamp:"2026-06-08T16:47:18.000Z",credentialId:"SAI-A4I-2026-004755",stateHash:"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"},{timestamp:"2026-06-07T11:03:44.000Z",credentialId:"SAI-A4I-2026-004701",stateHash:"2c26b46b68ffc68ff99b453c1d3041340e568eaef23bb282b543447a41730d60"}]},I=`
.partner-overview {
  --po-accent: #c9a227;
  --po-accent-teal: #5eead4;
  --po-surface: rgba(17, 24, 39, 0.82);
  --po-border: rgba(148, 163, 184, 0.18);
  --po-text: #f8fafc;
  --po-muted: #94a3b8;
  min-height: 100%;
  padding: clamp(1.25rem, 3vw, 2rem);
  color: var(--po-text);
}

.partner-overview__header {
  margin-bottom: 1.5rem;
}

.partner-overview__title {
  margin: 0 0 0.35rem;
  font-size: clamp(1.25rem, 2.5vw, 1.625rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.partner-overview__subtitle {
  margin: 0;
  max-width: 42rem;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--po-muted);
}

.partner-overview__grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.partner-overview__panel {
  border-radius: 0.75rem;
  border: 1px solid var(--po-border);
  background: var(--po-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  padding: 1.15rem 1.25rem;
}

.partner-overview__panel--tokens {
  grid-column: span 5;
}

.partner-overview__panel--certs {
  grid-column: span 7;
}

.partner-overview__panel--ledger {
  grid-column: span 12;
}

.partner-overview__panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.partner-overview__panel-title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--po-muted);
}

.partner-overview__panel-badge {
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 162, 39, 0.35);
  background: rgba(201, 162, 39, 0.12);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--po-accent);
  white-space: nowrap;
}

.partner-overview__token-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.partner-overview__stat {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.55);
}

.partner-overview__stat-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--po-muted);
}

.partner-overview__stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
}

.partner-overview__stat-value--remaining {
  color: var(--po-accent-teal);
}

.partner-overview__stat-value--used {
  color: #fbbf24;
}

.partner-overview__progress-track {
  height: 0.4rem;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
  overflow: hidden;
}

.partner-overview__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--po-accent-teal), var(--po-accent));
  transition: width 320ms ease;
}

.partner-overview__cert-summary {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.partner-overview__cert-count {
  font-size: 2.25rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--po-accent);
}

.partner-overview__cert-caption {
  font-size: 0.8125rem;
  color: var(--po-muted);
}

.partner-overview__badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.partner-overview__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.65rem;
  border-radius: 0.45rem;
  border: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.65);
  font-size: 0.6875rem;
  font-weight: 600;
}

.partner-overview__badge-tier {
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  background: rgba(201, 162, 39, 0.18);
  color: var(--po-accent);
  letter-spacing: 0.04em;
}

.partner-overview__badge-id {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  color: var(--po-muted);
}

.partner-overview__ledger-host {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  color: var(--po-muted);
}

.partner-overview__ledger-host strong {
  color: var(--po-accent-teal);
  font-weight: 700;
}

.partner-overview__table-wrap {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--po-border);
}

.partner-overview__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.partner-overview__table th {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid var(--po-border);
  background: rgba(15, 23, 42, 0.75);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-align: left;
  color: var(--po-muted);
  white-space: nowrap;
}

.partner-overview__table td {
  padding: 0.7rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  vertical-align: top;
}

.partner-overview__table tr:last-child td {
  border-bottom: none;
}

.partner-overview__table tr:hover td {
  background: rgba(148, 163, 184, 0.04);
}

.partner-overview__mono {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 0.6875rem;
  word-break: break-all;
  color: #cbd5e1;
}

.partner-overview__empty {
  margin: 0;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--po-muted);
}

@media (max-width: 960px) {
  .partner-overview__panel--tokens,
  .partner-overview__panel--certs,
  .partner-overview__panel--ledger {
    grid-column: span 12;
  }

  .partner-overview__token-stats {
    grid-template-columns: 1fr;
  }
}
`;function k(a){const[t,n]=p.useState(()=>a??b());return p.useEffect(()=>{if(a){n(a);return}const i=()=>n(b()),r=d=>{d.key===N&&i()};return window.addEventListener("storage",r),window.addEventListener(w,i),()=>{window.removeEventListener("storage",r),window.removeEventListener(w,i)}},[a]),j(t)}function T(a,t){return new Intl.DateTimeFormat(t,{dateStyle:"medium",timeStyle:"medium",timeZone:"UTC"}).format(new Date(a))}function E({language:a,usedTokens:t=c.usedTokens,activeCertifications:n=c.activeCertifications,ledgerFeed:i=c.ledgerFeed}){const{t:r,language:d}=k(a),v=n??[],m=i??[],o=g?.evaluationTiers?.institutionalB2B?.allottedTokens,h=g?.infrastructure?.ledgerHost,u=Math.max(o-t,0),f=Math.round(t/o*100),x=p.useMemo(()=>v.slice(0,8),[v]);return e.jsxs("section",{className:"partner-overview","aria-labelledby":"partner-overview-title",children:[e.jsx("style",{children:I}),e.jsxs("header",{className:"partner-overview__header",children:[e.jsx("h1",{id:"partner-overview-title",className:"partner-overview__title",children:r("dashboard.overview.title")}),e.jsx("p",{className:"partner-overview__subtitle",children:r("dashboard.overview.subtitle")})]}),e.jsxs("div",{className:"partner-overview__grid",children:[e.jsxs("article",{className:"partner-overview__panel partner-overview__panel--tokens",children:[e.jsxs("div",{className:"partner-overview__panel-heading",children:[e.jsx("h2",{className:"partner-overview__panel-title",children:r("dashboard.overview.tokens.title")}),e.jsx("span",{className:"partner-overview__panel-badge",children:r("dashboard.overview.tokens.baseline")})]}),e.jsxs("div",{className:"partner-overview__token-stats",children:[e.jsxs("div",{className:"partner-overview__stat",children:[e.jsx("span",{className:"partner-overview__stat-label",children:r("dashboard.overview.tokens.allotted")}),e.jsx("span",{className:"partner-overview__stat-value",children:o})]}),e.jsxs("div",{className:"partner-overview__stat",children:[e.jsx("span",{className:"partner-overview__stat-label",children:r("dashboard.overview.tokens.remaining")}),e.jsx("span",{className:"partner-overview__stat-value partner-overview__stat-value--remaining",children:u})]}),e.jsxs("div",{className:"partner-overview__stat",children:[e.jsx("span",{className:"partner-overview__stat-label",children:r("dashboard.overview.tokens.used")}),e.jsx("span",{className:"partner-overview__stat-value partner-overview__stat-value--used",children:t})]})]}),e.jsx("div",{className:"partner-overview__progress-track",role:"progressbar","aria-valuemin":0,"aria-valuemax":o,"aria-valuenow":t,"aria-label":r("dashboard.overview.tokens.utilizationAria"),children:e.jsx("div",{className:"partner-overview__progress-fill",style:{width:`${f}%`}})})]}),e.jsxs("article",{className:"partner-overview__panel partner-overview__panel--certs",children:[e.jsxs("div",{className:"partner-overview__panel-heading",children:[e.jsx("h2",{className:"partner-overview__panel-title",children:r("dashboard.overview.certifications.title")}),e.jsx("span",{className:"partner-overview__panel-badge",children:r("dashboard.overview.certifications.prestige")})]}),e.jsxs("div",{className:"partner-overview__cert-summary",children:[e.jsx("span",{className:"partner-overview__cert-count",children:v.length}),e.jsx("span",{className:"partner-overview__cert-caption",children:r("dashboard.overview.certifications.activeLabel")})]}),e.jsx("div",{className:"partner-overview__badge-grid",role:"list",children:(x||[]).map(({credentialId:s,tierKey:l})=>e.jsxs("span",{className:"partner-overview__badge",role:"listitem",children:[e.jsx("span",{className:"partner-overview__badge-tier",children:r(l)}),e.jsx("span",{className:"partner-overview__badge-id",children:s})]},s))})]}),e.jsxs("article",{className:"partner-overview__panel partner-overview__panel--ledger",children:[e.jsxs("div",{className:"partner-overview__panel-heading",children:[e.jsx("h2",{className:"partner-overview__panel-title",children:r("dashboard.overview.ledgerFeed.title")}),e.jsx("span",{className:"partner-overview__panel-badge",children:r("infrastructure.encryptionProtocol")})]}),e.jsxs("p",{className:"partner-overview__ledger-host",children:[r("dashboard.overview.ledgerFeed.hostPrefix")," ",e.jsx("strong",{children:h})]}),(m||[]).length===0?e.jsx("p",{className:"partner-overview__empty",children:r("dashboard.overview.ledgerFeed.empty")}):e.jsx("div",{className:"partner-overview__table-wrap",children:e.jsxs("table",{className:"partner-overview__table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:r("dashboard.overview.ledgerFeed.columns.timestamp")}),e.jsx("th",{scope:"col",children:r("dashboard.overview.ledgerFeed.columns.credentialId")}),e.jsx("th",{scope:"col",children:r("dashboard.overview.ledgerFeed.columns.stateHash")})]})}),e.jsx("tbody",{children:(m||[]).map(({timestamp:s,credentialId:l,stateHash:_})=>e.jsxs("tr",{children:[e.jsxs("td",{children:[T(s,d)," UTC"]}),e.jsx("td",{className:"partner-overview__mono",children:l}),e.jsx("td",{className:"partner-overview__mono",children:_})]},`${l}-${_}`))})]})})]})]})]})}export{c as DEFAULT_PARTNER_METRICS,E as default};
