import{j as e,g as j,c as V}from"./index-D2vGI_9r.js";import{f as H,b as a}from"./vendor-BEm5BeKO.js";import{r as D}from"./verificationRegistry-DZ4GksFl.js";import"./PartnerOverview-BgUQPzgR.js";function O(i){return typeof i=="string"&&/^[a-fA-F0-9]{64}$/.test(i.trim())}const U="safeai.language",C="safeai:language-change",G=1500,P=50,E="0123456789ABCDEF",S=8,Y=64,L={assessment_id:"A4-ALAM-2026-X992",role_id:"CLL_COMPLIANCE_LEGAL",composite_score:83.5},F=JSON.stringify(L),K=`echo -n '${F}' | sha256sum`,B=`
.verify-view {
  --vv-bg: #0f172a;
  --vv-accent: #c9a227;
  --vv-accent-dim: rgba(201, 162, 39, 0.14);
  --vv-glass: rgba(15, 23, 42, 0.78);
  --vv-glass-elevated: rgba(17, 24, 39, 0.92);
  --vv-border: rgba(148, 163, 184, 0.22);
  --vv-text: #f8fafc;
  --vv-muted: #94a3b8;
  --vv-success: #22c55e;
  --vv-error: #f87171;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2.5rem);
  background: var(--vv-bg);
  color: var(--vv-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.verify-view__inner {
  width: min(100%, 72rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.verify-view__header {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.verify-view__title {
  margin: 0;
  font-size: clamp(1.5rem, 3.2vw, 2.125rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: var(--vv-text);
}

.verify-view__subtitle {
  margin: 0;
  max-width: 52rem;
  font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
  line-height: 1.65;
  color: var(--vv-muted);
}

.verify-view__desk {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: clamp(1.35rem, 3vw, 2rem);
  border-radius: 1.125rem;
  border: 1px solid var(--vv-border);
  background: var(--vv-glass);
  backdrop-filter: blur(22px) saturate(155%);
  -webkit-backdrop-filter: blur(22px) saturate(155%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.verify-view__desk-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__lookup {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: stretch;
}

.verify-view__input {
  width: 100%;
  min-width: 0;
  padding: 0.9rem 1.05rem;
  border-radius: 0.625rem;
  border: 1px solid var(--vv-border);
  background: rgba(11, 15, 25, 0.72);
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
  letter-spacing: 0.03em;
  color: var(--vv-text);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.verify-view__input::placeholder {
  color: rgba(148, 163, 184, 0.5);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.01em;
}

.verify-view__input:focus {
  outline: none;
  border-color: rgba(201, 162, 39, 0.55);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.14);
}

.verify-view__input--invalid {
  border-color: rgba(248, 113, 113, 0.5);
}

.verify-view__submit {
  flex-shrink: 0;
  padding: 0.9rem 1.35rem;
  border-radius: 0.625rem;
  border: 1px solid var(--vv-accent-dim);
  background: linear-gradient(180deg, rgba(201, 162, 39, 0.32), rgba(201, 162, 39, 0.12));
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vv-text);
  cursor: pointer;
  white-space: nowrap;
  transition:
    opacity 160ms ease,
    box-shadow 160ms ease;
}

.verify-view__submit:hover:not(:disabled) {
  box-shadow: 0 0 22px rgba(201, 162, 39, 0.28);
}

.verify-view__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.verify-view__waqf-caption {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.82);
  letter-spacing: 0.01em;
}

.verify-view__terminal {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(2, 6, 23, 0.88);
  overflow: hidden;
  min-height: 10.5rem;
}

.verify-view__terminal-label {
  margin: 0 0 0.35rem;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__terminal-line {
  display: block;
  margin: 0;
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(0.5625rem, 1.4vw, 0.6875rem);
  line-height: 1.45;
  letter-spacing: 0.06em;
  color: rgba(201, 162, 39, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: verify-terminal-flash 50ms steps(1) infinite;
}

@keyframes verify-terminal-flash {
  0%, 49% { opacity: 0.92; }
  50%, 100% { opacity: 0.55; }
}

.verify-view__feedback {
  margin: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

.verify-view__feedback--error {
  border: 1px solid rgba(248, 113, 113, 0.35);
  background: rgba(127, 29, 29, 0.22);
  color: #fecaca;
}

.verify-view__receipt {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: 0.875rem;
  border: 1px solid rgba(34, 197, 94, 0.28);
  background: var(--vv-glass-elevated);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  overflow: hidden;
  animation: verify-receipt-reveal 320ms ease forwards;
}

@keyframes verify-receipt-reveal {
  from {
    opacity: 0;
    transform: translateY(0.35rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.verify-view__status-bar {
  margin: 0;
  padding: 0.85rem 1.15rem;
  font-size: clamp(0.75rem, 1.8vw, 0.875rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  background: rgba(22, 101, 52, 0.35);
  border-bottom: 1px solid rgba(34, 197, 94, 0.35);
  color: #bbf7d0;
}

.verify-view__status-bar--failed {
  background: rgba(127, 29, 29, 0.35);
  border-bottom-color: rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.verify-view__receipt-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: clamp(1.15rem, 2.5vw, 1.5rem);
}

.verify-view__receipt-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.verify-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.75rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(11, 15, 25, 0.5);
}

.verify-view__field--full {
  grid-column: 1 / -1;
}

.verify-view__field-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__field-value {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--vv-text);
  word-break: break-word;
}

.verify-view__field-value--mono {
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
}

@media (max-width: 720px) {
  .verify-view__lookup {
    grid-template-columns: 1fr;
  }

  .verify-view__grid {
    grid-template-columns: 1fr;
  }
}

.verify-view__vault {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: clamp(1.35rem, 3vw, 2rem);
  border-radius: 1.125rem;
  border: 1px solid var(--vv-border);
  background: var(--vv-glass-elevated);
  backdrop-filter: blur(22px) saturate(155%);
  -webkit-backdrop-filter: blur(22px) saturate(155%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.verify-view__vault-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--vv-accent);
}

.verify-view__payload-console {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(15, 23, 42, 0.95);
  background: #000000;
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.06);
  min-width: 0;
}

.verify-view__payload-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.72);
}

.verify-view__payload-pre {
  margin: 0;
  overflow-x: auto;
  font-family: ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace;
  font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
  line-height: 1.65;
  color: #cbd5e1;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.verify-view__audit-callout {
  margin: 0;
  padding: 1rem 1.1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(201, 162, 39, 0.08);
  font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
  line-height: 1.7;
  color: #fde68a;
  overflow-wrap: break-word;
  word-break: break-word;
}

.verify-view__command-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.verify-view__command-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(148, 163, 184, 0.72);
}

.verify-view__copy-button {
  flex-shrink: 0;
  padding: 0.35rem 0.65rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(52, 211, 153, 0.35);
  background: rgba(6, 78, 59, 0.35);
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #6ee7b7;
  cursor: pointer;
}

.verify-view__copy-button:hover {
  border-color: rgba(52, 211, 153, 0.55);
  background: rgba(6, 78, 59, 0.55);
}

.verify-view__copy-toast {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6ee7b7;
}
`;function $(i){const[r,n]=a.useState(()=>i??j());return a.useEffect(()=>{if(i){n(i);return}const t=()=>n(j()),s=v=>{v.key===U&&t()};return window.addEventListener("storage",s),window.addEventListener(C,t),()=>{window.removeEventListener("storage",s),window.removeEventListener(C,t)}},[i]),V(r)}function q(i=L){return JSON.stringify(i,null,2)}function J({command:i,copyLabel:r,copiedLabel:n}){const[t,s]=a.useState(!1),v=async()=>{try{await navigator.clipboard.writeText(i),s(!0),window.setTimeout(()=>s(!1),2200)}catch{s(!1)}};return e.jsxs("div",{className:"flex min-w-0 flex-col gap-2",children:[e.jsxs("div",{className:"verify-view__command-header",children:[e.jsx("p",{className:"verify-view__command-label",children:r}),e.jsx("button",{type:"button",className:"verify-view__copy-button",onClick:v,children:t?n:r})]}),e.jsx("code",{className:"break-all rounded border border-slate-800 bg-black p-4 font-mono text-emerald-400",children:i}),t?e.jsx("p",{className:"verify-view__copy-toast",role:"status",children:n}):null]})}function W({t:i}){return e.jsxs("section",{className:"verify-view__vault","aria-labelledby":"verify-vault-title",children:[e.jsx("h2",{id:"verify-vault-title",className:"verify-view__vault-title",children:i("verify.portal.vault.title")}),e.jsxs("div",{className:"verify-view__payload-console",children:[e.jsx("p",{className:"verify-view__payload-label",children:i("verify.portal.vault.rawPayloadLabel")}),e.jsx("pre",{className:"verify-view__payload-pre",children:q()})]}),e.jsx("p",{className:"verify-view__audit-callout",children:i("verify.portal.vault.auditCallout")}),e.jsx(J,{command:K,copyLabel:i("verify.portal.vault.copyCommand"),copiedLabel:i("verify.portal.vault.copySuccess")})]})}function A(i=Y){return Array.from({length:i},()=>E[Math.floor(Math.random()*E.length)]).join("")}function X({label:i}){const[r,n]=a.useState(()=>Array.from({length:S},()=>A()));return a.useEffect(()=>{const t=window.setInterval(()=>{n(Array.from({length:S},()=>A()))},P);return()=>window.clearInterval(t)},[]),e.jsxs("div",{className:"verify-view__terminal",role:"status","aria-live":"polite",children:[e.jsx("p",{className:"verify-view__terminal-label",children:i}),r.map((t,s)=>e.jsx("code",{className:"verify-view__terminal-line",children:t},`hex-${s}`))]})}function Z(i){return i?new Date(i).toISOString().replace("T"," ").replace(/\.\d{3}Z$/," UTC"):"—"}function ae({language:i}){const{t:r}=$(i),[n]=H(),t=a.useRef(!1),[s,v]=a.useState(""),[g,b]=a.useState(null),[l,m]=a.useState(null),[p,h]=a.useState(!1),[u,_]=a.useState(null);a.useEffect(()=>{document.title=r("page_titles.verify")},[r]);const y=a.useCallback((o,d,{onSubmit:f=!1}={})=>{const c=o.trim();return c?d&&c.toLowerCase()!==d?"verify.portal.validationModified":f&&!O(c)?"verify.portal.validationInvalid":null:"verify.portal.validationEmpty"},[]),w=a.useCallback(async o=>{const d=o.trim(),f=y(d,null,{onSubmit:!0});if(f){_(f),m(null),b(null);return}_(null),m(null),h(!0),await new Promise(M=>{window.setTimeout(M,G)});const c=d.toLowerCase(),R=D(c);h(!1),b(c),m(R??{verified:!1})},[y]);a.useEffect(()=>{if(t.current)return;const o=n.get("hash");o&&(t.current=!0,v(o),w(o))},[n,w]);const I=o=>{const d=o.target.value;v(d);const f=d.trim(),c=g?.toLowerCase()??null;l&&f.toLowerCase()!==c&&m(null),_(y(d,g))},T=o=>{o.preventDefault(),w(s)},x=!!u&&!p,N=!!l&&!p&&!u,k=x&&u!=="verify.portal.validationModified",z=l?.verified&&l.candidateNameIsCredentialId?r("verify.portal.institutionalHolder").replace("{credentialId}",l.candidateName):l?.candidateName;return e.jsxs("div",{className:"verify-view",children:[e.jsx("style",{children:B}),e.jsxs("div",{className:"verify-view__inner",children:[e.jsxs("header",{className:"verify-view__header",children:[e.jsx("h1",{className:"verify-view__title",children:r("verify.portal.pageTitle")}),e.jsx("p",{className:"verify-view__subtitle",children:r("verify.portal.pageSubtitle")})]}),e.jsxs("section",{className:"verify-view__desk","aria-labelledby":"verify-desk-title",children:[e.jsx("h2",{id:"verify-desk-title",className:"verify-view__desk-label",children:r("verify.portal.deskTitle")}),e.jsxs("form",{className:"verify-view__lookup",onSubmit:T,children:[e.jsx("input",{type:"text",className:k?"verify-view__input verify-view__input--invalid":"verify-view__input",value:s,onChange:I,placeholder:r("verify.portal.searchPlaceholder"),"aria-label":r("verify.portal.searchPlaceholder"),"aria-invalid":k,autoComplete:"off",spellCheck:!1,maxLength:64}),e.jsx("button",{type:"submit",className:"verify-view__submit",disabled:p,children:r("verify.portal.searchButton")})]}),e.jsx("p",{className:"verify-view__waqf-caption",children:r("verify.portal.waqfLedgerCaption")}),p&&e.jsx(X,{label:r("verify.portal.scanningLabel")}),x&&e.jsx("p",{className:"verify-view__feedback verify-view__feedback--error",role:"alert",children:r(u)}),N&&l?.verified&&e.jsxs("article",{className:"verify-view__receipt","aria-live":"polite",children:[e.jsx("p",{className:"verify-view__status-bar",children:r("verify.portal.statusValid")}),e.jsxs("div",{className:"verify-view__receipt-body",children:[e.jsx("h3",{className:"verify-view__receipt-title",children:r("verify.portal.receiptTitle")}),e.jsxs("dl",{className:"verify-view__grid",children:[e.jsxs("div",{className:"verify-view__field",children:[e.jsx("dt",{className:"verify-view__field-label",children:r("verify.portal.fields.candidateName")}),e.jsx("dd",{className:"verify-view__field-value",children:z})]}),e.jsxs("div",{className:"verify-view__field",children:[e.jsx("dt",{className:"verify-view__field-label",children:r("verify.portal.fields.complianceLevel")}),e.jsx("dd",{className:"verify-view__field-value",children:l?.complianceLevel})]}),e.jsxs("div",{className:"verify-view__field",children:[e.jsx("dt",{className:"verify-view__field-label",children:r("verify.portal.fields.timestamp")}),e.jsx("dd",{className:"verify-view__field-value",children:Z(l?.timestamp)})]}),e.jsxs("div",{className:"verify-view__field",children:[e.jsx("dt",{className:"verify-view__field-label",children:r("verify.portal.fields.registryAuthority")}),e.jsx("dd",{className:"verify-view__field-value",children:r("verify.portal.registryAuthorityValue")})]}),e.jsxs("div",{className:"verify-view__field verify-view__field--full",children:[e.jsx("dt",{className:"verify-view__field-label",children:r("verify.portal.fields.stateHash")}),e.jsx("dd",{className:"verify-view__field-value verify-view__field-value--mono",children:l?.stateHash})]})]})]})]}),N&&l&&!l.verified&&e.jsx("article",{className:"verify-view__receipt","aria-live":"polite",children:e.jsx("p",{className:"verify-view__status-bar verify-view__status-bar--failed",children:r("verify.portal.statusFailed")})})]}),e.jsx(W,{t:r})]})]})}export{ae as default};
