import{g as I,c as ne,j as a,S as ge,i as he}from"./index-D2vGI_9r.js";import{b as d,g as fe}from"./vendor-BEm5BeKO.js";import{i as _e,S as O}from"./stripeGateway-DcJNSRUn.js";import{DEFAULT_PARTNER_METRICS as M}from"./PartnerOverview-BgUQPzgR.js";import{r as xe}from"./verificationRegistry-DZ4GksFl.js";const ye="safeai.language",U="safeai:language-change";function ve(e){const[r,i]=d.useState(()=>I());return d.useEffect(()=>{const t=()=>i(I()),n=o=>{o.key===ye&&t()};return window.addEventListener("storage",n),window.addEventListener(U,t),()=>{window.removeEventListener("storage",n),window.removeEventListener(U,t)}},[e]),ne(r)}const R="safeai_admin_active_session",we=3600*1e3,Ne="/admin",P=8,je=64,F="0123456789ABCDEF",Se=50,Ie="./admin-config.json",ke=`
.admin-login {
  --al-bg: #0a0e17;
  --al-accent: #c9a227;
  --al-accent-glow: rgba(201, 162, 39, 0.45);
  --al-teal: #5eead4;
  --al-glass: rgba(15, 23, 42, 0.82);
  --al-border: rgba(148, 163, 184, 0.2);
  --al-text: #f8fafc;
  --al-muted: #94a3b8;
  --al-error: #f87171;
  --al-error-bg: rgba(248, 113, 113, 0.12);
  flex: 1 1 auto;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 4vw, 3rem);
  background:
    radial-gradient(ellipse 80% 60% at 12% 0%, rgba(94, 234, 212, 0.1), transparent 58%),
    radial-gradient(ellipse 70% 50% at 88% 100%, rgba(201, 162, 39, 0.1), transparent 52%),
    linear-gradient(165deg, #070b14 0%, var(--al-bg) 42%, #0f172a 100%);
  color: var(--al-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.admin-login__shell {
  width: min(100%, 40rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.admin-login__terminal {
  padding: 1rem 1.15rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.22);
  background: rgba(0, 0, 0, 0.55);
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.6875rem;
  line-height: 1.45;
  overflow: hidden;
}

.admin-login__terminal-label {
  margin: 0 0 0.65rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--al-accent);
}

.admin-login__terminal-line {
  display: block;
  color: rgba(94, 234, 212, 0.72);
  letter-spacing: 0.04em;
}

.admin-login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  border-radius: 1rem;
  border: 1px solid var(--al-border);
  background: var(--al-glass);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.admin-login__title {
  margin: 0;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: center;
  color: var(--al-accent);
}

.admin-login__authority {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.6;
  text-align: center;
  color: var(--al-muted);
}

.admin-login__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: left;
}

.admin-login__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--al-muted);
}

.admin-login__input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--al-border);
  background: rgba(0, 0, 0, 0.35);
  color: var(--al-text);
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.admin-login__input:focus {
  border-color: var(--al-accent);
  box-shadow: 0 0 0 3px var(--al-accent-glow);
}

.admin-login__input[aria-invalid='true'] {
  border-color: rgba(248, 113, 113, 0.65);
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.18);
}

.admin-login__alert {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: var(--al-error-bg);
  color: var(--al-error);
  font-size: clamp(0.75rem, 2.8vw, 0.8125rem);
  line-height: 1.55;
  overflow-wrap: anywhere;
  word-break: break-word;
  animation: admin-login-alert-in 0.35s ease forwards;
}

@keyframes admin-login-alert-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.admin-login__submit {
  align-self: center;
  min-width: min(100%, 14rem);
  padding: 0.75rem 1.75rem;
  border: 1px solid var(--al-accent);
  border-radius: 0.5rem;
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.22), rgba(201, 162, 39, 0.08));
  color: var(--al-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, opacity 0.2s ease;
}

.admin-login__submit:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.32), rgba(201, 162, 39, 0.14));
  transform: translateY(-1px);
}

.admin-login__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
`;function z(e=je){return Array.from({length:e},()=>F[Math.floor(Math.random()*F.length)]).join("")}function Ee(e){return[...new Uint8Array(e)].map(r=>r.toString(16).padStart(2,"0")).join("")}function H(e,r){if(typeof e!="string"||typeof r!="string"||e.length!==r.length)return!1;let i=0;for(let t=0;t<e.length;t+=1)i|=e.charCodeAt(t)^r.charCodeAt(t);return i===0}async function Ae(e){const r=globalThis.crypto?.subtle;if(!r)throw new Error("Web Crypto API unavailable; SHA-256 digest required for admin verification.");const i=new TextEncoder().encode(e),t=await r.digest("SHA-256",i);return[...new Uint8Array(t)].map(n=>n.toString(16).padStart(2,"0")).join("")}async function Ce(){let e;try{e=await fetch(Ie,{cache:"no-store"})}catch{throw new Error("ADMIN_CONFIG_UNAVAILABLE")}if(!e.ok)throw new Error("ADMIN_CONFIG_UNAVAILABLE");let r;try{r=await e.json()}catch{throw new Error("ADMIN_CONFIG_UNAVAILABLE")}const{username:i,passwordHash:t,allowPlainTextFallback:n}=r??{};if(typeof i!="string"||typeof t!="string"||!i.trim()||!t.trim())throw new Error("ADMIN_CONFIG_UNAVAILABLE");const o=n===!0;return{username:i.trim(),passwordHash:o?t.trim():t.trim().toLowerCase(),allowPlainTextFallback:o}}function se(){if(typeof window>"u")return null;try{const e=window.sessionStorage.getItem(R);if(!e)return null;const r=JSON.parse(e);return!r||typeof r!="object"||typeof r.token!="string"||typeof r.lastActivityAt!="number"?null:r}catch{return null}}function oe(e){if(!(typeof window>"u"))try{window.sessionStorage.setItem(R,JSON.stringify(e))}catch{}}function Te(){const e=new Uint8Array(32);return globalThis.crypto.getRandomValues(e),Ee(e.buffer)}function le(){const e=se();return e?Date.now()-e.lastActivityAt>we?(de(),!1):!0:!1}function Le(){const e=Date.now(),r={token:Te(),issuedAt:e,lastActivityAt:e};return oe(r),r}function Re(){const e=se();return e?(e.lastActivityAt=Date.now(),oe(e),!0):!1}function de(){if(!(typeof window>"u"))try{window.sessionStorage.removeItem(R)}catch{}}const G=["mousedown","keydown","touchstart","scroll"];function De(e,r){d.useEffect(()=>{if(!e)return;const i=()=>{Re()};G.forEach(n=>{window.addEventListener(n,i,{passive:!0})});const t=window.setInterval(()=>{le()||r?.()},3e4);return()=>{G.forEach(n=>{window.removeEventListener(n,i)}),window.clearInterval(t)}},[e,r])}function Oe({label:e}){const[r,i]=d.useState(()=>Array.from({length:P},()=>z()));return d.useEffect(()=>{const t=window.setInterval(()=>{i(Array.from({length:P},()=>z()))},Se);return()=>window.clearInterval(t)},[]),a.jsxs("div",{className:"admin-login__terminal",role:"status","aria-live":"polite",children:[a.jsx("p",{className:"admin-login__terminal-label",children:e}),r.map((t,n)=>a.jsx("code",{className:"admin-login__terminal-line",children:t},`hex-${n}`))]})}function Me({onAuthenticated:e}){const{t:r}=ve(),i=fe(),[t,n]=d.useState(""),[o,c]=d.useState(""),[m,l]=d.useState(""),[u,b]=d.useState(!1),g=d.useCallback(async p=>{p.preventDefault(),l("");const v=t.trim(),f=o;if(!v||!f){l(r("admin.board.login.error","Hash-verified credential validation failed. Access denied under Article 4 security governance protocols."));return}b(!0);try{let s;try{s=await Ce()}catch{l(r("admin.board.login.configError","System Configuration Error: Security descriptor vector missing."));return}const _=v===s.username;let x;if(s.allowPlainTextFallback)x=H(f,s.passwordHash);else{const y=await Ae(f);x=H(y,s.passwordHash)}if(_&&x){Le(),n(""),c(""),e?.(),i(Ne,{replace:!0});return}l(r("admin.board.login.error","Hash-verified credential validation failed. Access denied under Article 4 security governance protocols.")),c("")}catch{l(r("admin.board.login.cryptoError","Cryptographic subsystem unavailable. Secure context required for SHA-256 verification."))}finally{b(!1)}},[t,o,i,e,r]);return a.jsxs("div",{className:"admin-login",children:[a.jsx("style",{children:ke}),a.jsxs("div",{className:"admin-login__shell",children:[a.jsx(Oe,{label:r("admin.board.gate.terminalLabel","Cryptographic challenge terminal — awaiting institutional authorization vector")}),a.jsxs("form",{className:"admin-login__form",onSubmit:g,noValidate:!0,children:[a.jsx("h1",{className:"admin-login__title",children:r("admin.board.login.title","Secure Administrative Login")}),a.jsx("p",{className:"admin-login__authority",children:r("admin.board.gate.authorityNote","Access restricted to authorized registrar personnel under L'Institut Article 4 security governance protocols.")}),m&&a.jsx("p",{className:"admin-login__alert",role:"alert","aria-live":"assertive",children:m}),a.jsxs("div",{className:"admin-login__field",children:[a.jsx("label",{className:"admin-login__label",htmlFor:"admin-login-username",children:r("admin.board.login.usernameLabel","Administrator username")}),a.jsx("input",{id:"admin-login-username",className:"admin-login__input",type:"text",name:"username",autoComplete:"username",autoCapitalize:"off",autoCorrect:"off",spellCheck:!1,value:t,disabled:u,"aria-invalid":!!m,onChange:p=>{n(p.target.value),m&&l("")}})]}),a.jsxs("div",{className:"admin-login__field",children:[a.jsx("label",{className:"admin-login__label",htmlFor:"admin-login-password",children:r("admin.board.login.passwordLabel","Secure password")}),a.jsx("input",{id:"admin-login-password",className:"admin-login__input",type:"password",name:"password",autoComplete:"current-password",spellCheck:!1,value:o,disabled:u,"aria-invalid":!!m,onChange:p=>{c(p.target.value),m&&l("")}})]}),a.jsx("button",{type:"submit",className:"admin-login__submit",disabled:u,children:u?r("admin.board.login.verifying","Verifying fingerprint…"):r("admin.board.gate.submit","Authenticate")})]})]})]})}const Ue="safeai.language",V="safeai:language-change";function Pe(e){const[r,i]=d.useState(()=>e??I());return d.useEffect(()=>{if(e){i(e);return}const t=()=>i(I()),n=o=>{o.key===Ue&&t()};return window.addEventListener("storage",n),window.addEventListener(V,t),()=>{window.removeEventListener("storage",n),window.removeEventListener(V,t)}},[e]),ne(r)}const N=85,k=1500,E=3500,Fe=[{evaluationTrack:"level01",pass:412,fail:38},{evaluationTrack:"level02",pass:186,fail:24},{evaluationTrack:"level03",pass:94,fail:11}],B=["A4I-MPL-001","A4I-BCN-002","A4I-TUN-003","A4I-CAS-004","A4I-LYN-005"];function W(e){const r=e%100;return r<52?"en":r<80?"fr":r<90?"es":"ar"}function Y(e){return e%4===0?null:B[e%B.length]}function q(e,r){return r?e%5===0?E:k:0}function K(e,r){return r?N+e%16:42+e%(N-42)}function $(e){const r=new Date("2026-06-01T08:00:00.000Z").getTime();return new Date(r+e*3*60*60*1e3).toISOString()}function Z(e){return`EXM-****-${(e*2654435761>>>0).toString(16).slice(-4).toUpperCase()}`}function J(e,r,i){const t=`${e}:${r}:${i}:a4i-article4`;let n="";for(let o=0;o<64;o+=1){const c=t.charCodeAt(o%t.length);n+=((c*(o+13)+e)%16).toString(16)}return n}function X(e,r,i){return r>=N&&!!i&&e%11!==0}function ze(){const e=[];let r=0;for(const i of Fe){for(let t=0;t<i.pass;t+=1){r+=1;const n=Y(r),o=K(r,!0);e.push({id:`cohort-${String(r).padStart(4,"0")}`,timestamp:$(r),maskedIdentifier:Z(r),evaluationTrack:i.evaluationTrack,language:W(r),score:o,stateHash:J(r,i.evaluationTrack,o),partnerId:n,fundingAmount:q(r,n),waqfLedgerSynced:X(r,o,n)})}for(let t=0;t<i.fail;t+=1){r+=1;const n=Y(r),o=K(r,!1);e.push({id:`cohort-${String(r).padStart(4,"0")}`,timestamp:$(r),maskedIdentifier:Z(r),evaluationTrack:i.evaluationTrack,language:W(r),score:o,stateHash:J(r,i.evaluationTrack,o),partnerId:n,fundingAmount:q(r,n),waqfLedgerSynced:X(r,o,n)})}}return e}function He(e,r){const i=r.partnerId?.trim().toLowerCase()??"";return e.filter(t=>!(r.track!=="all"&&t.evaluationTrack!==r.track||r.language!=="all"&&t.language!==r.language||r.scoreStatus==="pass"&&t.score<N||r.scoreStatus==="fail"&&t.score>=N||i&&!t.partnerId?.toLowerCase().includes(i)))}function Ge(e){const r=e.length,i=r>0?e.reduce((l,u)=>l+u.score,0)/r:0,t={en:0,fr:0,es:0,ar:0};e.forEach(l=>{t[l.language]!==void 0&&(t[l.language]+=1)});const n=Object.entries(t).map(([l,u])=>({locale:l,percentage:r>0?Math.round(u/r*100):0,count:u}));let o=0,c=0,m=0;return e.forEach(l=>{l.fundingAmount===k?(o+=1,m+=k):l.fundingAmount===E&&(c+=1,m+=E)}),{totalCohorts:r,meanScore:i,linguisticDistribution:n,fundingVolume:m,researchContributions:o,infrastructureContributions:c}}function Ve(e){return{schemaVersion:"1.0.0",exportedAt:new Date().toISOString(),authority:"L'INSTITUT ARTICLE 4 (A4I)",ledgerHost:"WaqfLedger.tech",framework:"EU AI Act Article 4 Compliance Metrics",recordCount:e.length,records:e.map(r=>({cohortId:r.id,timestamp:r.timestamp,maskedIdentifier:r.maskedIdentifier,evaluationTrack:r.evaluationTrack,languageStream:r.language,scenarioPerformanceScore:r.score,stateHashSha256:r.stateHash,waqfLedgerSynced:r.waqfLedgerSynced,institutionalPartnerId:r.partnerId,fundingAmountUsd:r.fundingAmount}))}}const Q="all",ce="auto",L="mercury_pending",ee={TIER_A_GRANT:{label:"Tier A Grant — Voluntary Research Support Grant",amount:"€1,500.00 EUR"},TIER_B_SPONSORSHIP:{label:"Tier B Node Sponsorship — Infrastructure Node Sponsorship",amount:"€3,500.00 EUR"}},ae=[{id:"mercury-wire-001",timestamp:"2026-06-24T14:22:00.000Z",maskedIdentifier:"INTAKE-MERCURY-001",evaluationTrack:"institutional_funding",language:"en",score:100,stateHash:"c7e9f1a2b3d4567890abcdef1234567890abcdef1234567890abcdef12345678",waqfLedgerSynced:!1,payment_method:"MERCURY_WIRE",billing_status:"INVOICE_PENDING",target_tier:"TIER_A_GRANT",client_email:"registrar@university.edu",invoice_specifications:"Voluntary Research Support Grant — 120 faculty cohort, Q3 2026 Article 4 deployment."},{id:"mercury-wire-002",timestamp:"2026-06-22T09:15:00.000Z",maskedIdentifier:"INTAKE-MERCURY-002",evaluationTrack:"institutional_funding",language:"fr",score:100,stateHash:"d8f0a2b3c4e5678901bcdef2345678901bcdef2345678901bcdef2345678901",waqfLedgerSynced:!0,payment_method:"MERCURY_WIRE",billing_status:"PAID",target_tier:"TIER_B_SPONSORSHIP",client_email:"finance@institut-a4i.fr",invoice_specifications:"Infrastructure Node Sponsorship — sovereign SWIFT settlement, registrar analytics workspace."},{id:"mercury-wire-003",timestamp:"2026-06-25T11:40:00.000Z",maskedIdentifier:"INTAKE-MERCURY-003",evaluationTrack:"institutional_funding",language:"es",score:100,stateHash:"e9a1b2c3d4f6789012cdef3456789012cdef3456789012cdef3456789012cdef3",waqfLedgerSynced:!1,payment_method:"MERCURY_WIRE",billing_status:"INVOICE_PENDING",target_tier:"TIER_B_SPONSORSHIP",client_email:"tesoreria@centro-academico.es",invoice_specifications:"Node Sponsorship wire — 50 pre-paid Level 01 tokens, WaqfLedger telemetry indexing."}],Be=`
.telemetry-table {
  margin-top: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.telemetry-table__viewport {
  border-radius: 0.625rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.telemetry-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(10, 14, 23, 0.55);
}

.telemetry-table__heading {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.telemetry-table__wire-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(10, 14, 23, 0.38);
}

.telemetry-table__wire-tab {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: rgba(15, 23, 42, 0.55);
  color: #94a3b8;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
  white-space: nowrap;
}

.telemetry-table__wire-tab:hover {
  border-color: rgba(201, 162, 39, 0.45);
  color: #e2e8f0;
}

.telemetry-table__wire-tab--active {
  border-color: rgba(201, 162, 39, 0.65);
  background: rgba(201, 162, 39, 0.14);
  color: #fef08a;
}

.telemetry-table__wire-tab--active.telemetry-table__wire-tab--mercury {
  border-color: rgba(251, 191, 36, 0.75);
  background: rgba(251, 191, 36, 0.16);
  color: #fde68a;
}

.telemetry-table__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-inline-start: auto;
}

[dir="rtl"] .telemetry-table__toolbar {
  flex-direction: row-reverse;
}

[dir="rtl"] .telemetry-table__actions {
  margin-inline-start: 0;
  margin-inline-end: auto;
}

.telemetry-table__export {
  padding: 0.5rem 0.85rem;
  border-radius: 0.45rem;
  border: 1px solid rgba(201, 162, 39, 0.55);
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.2), rgba(201, 162, 39, 0.08));
  color: #c9a227;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  white-space: nowrap;
}

.telemetry-table__export:hover {
  background: linear-gradient(135deg, rgba(201, 162, 39, 0.32), rgba(201, 162, 39, 0.14));
  transform: translateY(-1px);
}

.telemetry-table__export--json {
  border-color: rgba(94, 234, 212, 0.45);
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.16), rgba(94, 234, 212, 0.06));
  color: #5eead4;
}

.telemetry-table__export--json:hover {
  background: linear-gradient(135deg, rgba(94, 234, 212, 0.26), rgba(94, 234, 212, 0.12));
}

.telemetry-table__scroll {
  max-height: min(28rem, 55vh);
  overflow: auto;
}

.telemetry-table__grid {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.6875rem;
}

.telemetry-table__grid th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 0.55rem 0.65rem;
  text-align: start;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
  background: rgba(0, 0, 0, 0.62);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  white-space: nowrap;
}

.telemetry-table__grid td {
  padding: 0.45rem 0.65rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.08);
  vertical-align: top;
  color: #f8fafc;
}

.telemetry-table__grid tbody tr:hover td {
  background: rgba(94, 234, 212, 0.04);
}

.telemetry-table__row--clickable {
  cursor: pointer;
}

.telemetry-table__row--clickable:hover td {
  background: rgba(251, 191, 36, 0.08) !important;
}

.telemetry-table__grid tr:last-child td {
  border-bottom: none;
}

.telemetry-table__mono {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.02em;
}

.telemetry-table__hash {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  letter-spacing: 0.02em;
  color: #5eead4;
  word-break: break-all;
  overflow-wrap: anywhere;
  max-width: 14rem;
  line-height: 1.45;
}

.telemetry-table__score {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: #5eead4;
}

.telemetry-table__score--fail {
  color: #f87171;
}

.telemetry-table__track-lang {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.telemetry-table__sync {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 800;
  line-height: 1;
}

.telemetry-table__sync--yes {
  background: rgba(34, 197, 94, 0.18);
  color: #22c55e;
}

.telemetry-table__sync--no {
  background: rgba(148, 163, 184, 0.12);
  color: #64748b;
}

.telemetry-table__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.28rem 0.55rem;
  border-radius: 0.35rem;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1.35;
  white-space: nowrap;
}

.telemetry-table__badge--wire-pending {
  border: 1px solid rgba(251, 191, 36, 0.75);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.28), rgba(180, 83, 9, 0.22));
  color: #fde68a;
  box-shadow: 0 0 14px rgba(251, 191, 36, 0.22);
}

.telemetry-table__badge--compliant {
  border: 1px solid rgba(34, 197, 94, 0.65);
  background: #15803d;
  color: #ecfdf5;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.18);
}

.telemetry-table__empty {
  margin: 0;
  padding: 2rem 1rem;
  text-align: center;
  font-size: 0.8125rem;
  color: #94a3b8;
}

.telemetry-table__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.telemetry-table__modal-shell {
  width: min(100%, 42rem);
  max-height: calc(100vh - 2rem);
  overflow: auto;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: #f8fafc;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
}

.telemetry-table__modal-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.35);
  background: #0f172a;
}

.telemetry-table__modal-toolbar-title {
  margin: 0;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #5eead4;
}

.telemetry-table__modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.telemetry-table__modal-btn {
  padding: 0.45rem 0.75rem;
  border-radius: 0.4rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: rgba(15, 23, 42, 0.65);
  color: #e2e8f0;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
}

.telemetry-table__modal-btn--print {
  border-color: rgba(201, 162, 39, 0.65);
  background: rgba(201, 162, 39, 0.18);
  color: #fef08a;
}

.mercury-invoice-print {
  padding: clamp(1.25rem, 3vw, 2rem);
  color: #0f172a;
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.75rem;
  line-height: 1.6;
}

.mercury-invoice-print__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #0f172a;
  margin-bottom: 1.25rem;
}

.mercury-invoice-print__logo {
  width: 4.5rem;
  height: 4.5rem;
  border: 2px dashed rgba(15, 23, 42, 0.35);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  text-align: center;
}

.mercury-invoice-print__title-block {
  flex: 1 1 16rem;
  min-width: 0;
}

.mercury-invoice-print__title {
  margin: 0 0 0.35rem;
  font-size: clamp(0.875rem, 2.2vw, 1.0625rem);
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #0f172a;
}

.mercury-invoice-print__meta {
  margin: 0;
  font-size: 0.625rem;
  color: #475569;
}

.mercury-invoice-print__section {
  margin-bottom: 1.15rem;
}

.mercury-invoice-print__section-title {
  margin: 0 0 0.45rem;
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #334155;
}

.mercury-invoice-print__grid {
  display: grid;
  grid-template-columns: minmax(0, 9rem) minmax(0, 1fr);
  gap: 0.35rem 0.75rem;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #ffffff;
}

.mercury-invoice-print__label {
  font-weight: 700;
  color: #64748b;
}

.mercury-invoice-print__value {
  word-break: break-word;
  color: #0f172a;
}

.mercury-invoice-print__ledger {
  padding: 0.85rem;
  border: 2px solid #0f172a;
  border-radius: 0.375rem;
  background: #f1f5f9;
}

.mercury-invoice-print__amount {
  margin: 0.5rem 0 0;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 800;
  color: #0f172a;
}

.mercury-invoice-print__coordinates {
  padding: 0.85rem;
  border: 1px solid #94a3b8;
  border-radius: 0.375rem;
  background: #ffffff;
}

.mercury-invoice-print__coordinates p {
  margin: 0 0 0.35rem;
}

.mercury-invoice-print__coordinates p:last-child {
  margin-bottom: 0;
}

@media print {
  body * {
    visibility: hidden !important;
  }

  .telemetry-table__modal-backdrop,
  .telemetry-table__modal-backdrop * {
    visibility: visible !important;
  }

  .telemetry-table__modal-backdrop {
    position: absolute !important;
    inset: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    backdrop-filter: none !important;
  }

  .telemetry-table__modal-toolbar {
    display: none !important;
  }

  .telemetry-table__modal-shell {
    width: 100% !important;
    max-height: none !important;
    overflow: visible !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }

  .mercury-invoice-print {
    padding: 0.5in !important;
  }
}
`,We={level01:"L01",level02:"L02",level03:"L03",institutional_funding:"FND"},w=ge?.fundingGateways?.mercuryNodeDetails??{};function Ye(e){const r=String(e??"");return/[",\n\r]/.test(r)?`"${r.replace(/"/g,'""')}"`:r}function re(e,r){const i=URL.createObjectURL(e),t=document.createElement("a");t.href=i,t.download=r,t.rel="noopener",document.body.appendChild(t),t.click(),t.remove(),URL.revokeObjectURL(i)}function me(e){return e?new Date(e).toISOString().replace("T"," ").replace(/\.\d{3}Z$/," UTC"):"—"}function qe(){return new Date().toISOString().replace(/[:.]/g,"-")}function D(e){return e?.payment_method==="MERCURY_WIRE"}function ue(e){return D(e)&&e?.billing_status==="INVOICE_PENDING"}function Ke(e,r){return r===ce?e.filter(i=>!D(i)):r===L?e.filter(i=>ue(i)):e}function $e(e,r){return D(e)?e.billing_status==="PAID"?a.jsx("span",{className:"telemetry-table__badge telemetry-table__badge--compliant",children:r("admin.board.research.table.badges.compliant","COMPLIANT")}):a.jsx("span",{className:"telemetry-table__badge telemetry-table__badge--wire-pending",children:r("admin.board.research.table.badges.wirePending","⚠️ WIRE: INVOICE PENDING")}):null}function Ze(e){const i=[["timestamp","masked_identifier","evaluation_track","language_stream","scenario_performance_score","state_hash_sha256","waqf_ledger_synced","payment_method","billing_status","target_tier","client_email"].join(",")];return e.forEach(t=>{i.push([t.timestamp,t.maskedIdentifier,t.evaluationTrack,t.language,t.score,t.stateHash,t.waqfLedgerSynced?"true":"false",t.payment_method??"",t.billing_status??"",t.target_tier??"",t.client_email??""].map(Ye).join(","))}),`${i.join(`
`)}
`}function Je({row:e,t:r,onClose:i}){if(!e)return null;const t=ee[e.target_tier]??ee.TIER_A_GRANT,n=()=>{window.print()};return a.jsx("div",{className:"telemetry-table__modal-backdrop",role:"dialog","aria-modal":"true","aria-labelledby":"mercury-invoice-title",onClick:i,children:a.jsxs("div",{className:"telemetry-table__modal-shell",onClick:o=>o.stopPropagation(),children:[a.jsxs("div",{className:"telemetry-table__modal-toolbar",children:[a.jsx("p",{className:"telemetry-table__modal-toolbar-title",children:r("admin.board.research.table.invoice.modalTitle","Mercury Wire Invoice — Print Preview")}),a.jsxs("div",{className:"telemetry-table__modal-actions",children:[a.jsx("button",{type:"button",className:"telemetry-table__modal-btn telemetry-table__modal-btn--print",onClick:n,children:r("admin.board.research.table.invoice.print","Print PDF Invoice")}),a.jsx("button",{type:"button",className:"telemetry-table__modal-btn",onClick:i,children:r("admin.board.research.table.invoice.close","Close")})]})]}),a.jsxs("article",{className:"mercury-invoice-print",id:"mercury-invoice-print-root",children:[a.jsxs("header",{className:"mercury-invoice-print__header",children:[a.jsx("div",{className:"mercury-invoice-print__logo","aria-hidden":"true",children:r("admin.board.research.table.invoice.logoPlaceholder","Official Logo")}),a.jsxs("div",{className:"mercury-invoice-print__title-block",children:[a.jsx("h2",{className:"mercury-invoice-print__title",id:"mercury-invoice-title",children:r("admin.board.research.table.invoice.documentTitle","L'Institut Article 4 Institutional Invoice")}),a.jsxs("p",{className:"mercury-invoice-print__meta",children:[r("admin.board.research.table.invoice.invoiceId","Invoice ID"),":"," ",e.id," · ",me(e.timestamp)]})]})]}),a.jsxs("section",{className:"mercury-invoice-print__section",children:[a.jsx("h3",{className:"mercury-invoice-print__section-title",children:r("admin.board.research.table.invoice.billTo","Bill To")}),a.jsxs("div",{className:"mercury-invoice-print__grid",children:[a.jsx("span",{className:"mercury-invoice-print__label",children:r("admin.board.research.table.invoice.clientEmail","Client Email")}),a.jsx("span",{className:"mercury-invoice-print__value",children:e.client_email??"—"}),a.jsx("span",{className:"mercury-invoice-print__label",children:r("admin.board.research.table.invoice.specifications","Invoice Specifications")}),a.jsx("span",{className:"mercury-invoice-print__value",children:e.invoice_specifications??"—"})]})]}),a.jsxs("section",{className:"mercury-invoice-print__section",children:[a.jsx("h3",{className:"mercury-invoice-print__section-title",children:r("admin.board.research.table.invoice.ledgerBlock","Core Ledger Block")}),a.jsxs("div",{className:"mercury-invoice-print__ledger",children:[a.jsxs("div",{className:"mercury-invoice-print__grid",children:[a.jsx("span",{className:"mercury-invoice-print__label",children:r("admin.board.research.table.invoice.tier","Selected Tier")}),a.jsx("span",{className:"mercury-invoice-print__value",children:t.label}),a.jsx("span",{className:"mercury-invoice-print__label",children:r("admin.board.research.table.invoice.paymentTerms","Payment Terms")}),a.jsx("span",{className:"mercury-invoice-print__value",children:"Net 30"})]}),a.jsx("p",{className:"mercury-invoice-print__amount",children:t.amount})]})]}),a.jsxs("section",{className:"mercury-invoice-print__section",children:[a.jsx("h3",{className:"mercury-invoice-print__section-title",children:r("admin.board.research.table.invoice.settlementCoordinates","Settlement Account Coordinates")}),a.jsxs("div",{className:"mercury-invoice-print__coordinates",children:[a.jsxs("p",{children:[a.jsxs("strong",{children:[r("admin.board.research.table.invoice.beneficiary","Beneficiary"),":"]})," ",w.beneficiary]}),a.jsxs("p",{children:[a.jsxs("strong",{children:[r("admin.board.research.table.invoice.bank","Bank"),":"]})," ",w.bank]}),a.jsxs("p",{children:[a.jsxs("strong",{children:[r("admin.board.research.table.invoice.routing","Routing"),":"]})," ",w.routing]}),a.jsxs("p",{children:[a.jsxs("strong",{children:[r("admin.board.research.table.invoice.account","Account"),":"]})," ",w.account]}),a.jsxs("p",{children:[a.jsxs("strong",{children:[r("admin.board.research.table.invoice.swift","SWIFT"),":"]})," ",w.swift]}),a.jsxs("p",{children:[a.jsxs("strong",{children:[r("admin.board.research.table.invoice.intermediarySwift","Intermediary SWIFT"),":"]})," ",w.intermediarySwift]})]})]})]})]})})}function Xe({t:e,filteredRows:r,allRows:i}){const[t,n]=d.useState(Q),[o,c]=d.useState(null),m=r??[],l=i??[],u=d.useMemo(()=>[...m,...ae],[m]),b=d.useMemo(()=>[...l,...ae],[l]),g=d.useMemo(()=>Ke(u,t),[u,t]),p=d.useCallback(()=>{const s=Ze(g),_=new Blob([s],{type:"text/csv;charset=utf-8"});re(_,`a4i_telemetry_export_${qe()}.csv`)},[g]),v=d.useCallback(()=>{const s=Ve(b),_=JSON.stringify(s,null,2),x=new Blob([_],{type:"application/json;charset=utf-8"});re(x,"a4i_doctoral_dataset.json")},[b]),f=[{id:Q,label:e("admin.board.research.table.wireFilter.all","All Records")},{id:ce,label:e("admin.board.research.table.wireFilter.auto","Stripe/Wise Auto-Clears")},{id:L,label:e("admin.board.research.table.wireFilter.mercuryPending","Mercury Wire Invoices Pending")}];return a.jsxs("div",{className:"telemetry-table",children:[a.jsx("style",{children:Be}),a.jsxs("div",{className:"telemetry-table__viewport",children:[a.jsxs("div",{className:"telemetry-table__toolbar",children:[a.jsx("h3",{className:"telemetry-table__heading",children:e("admin.board.research.table.title","Research Telemetry Data Grid")}),a.jsxs("div",{className:"telemetry-table__actions",children:[a.jsx("button",{type:"button",className:"telemetry-table__export",onClick:p,children:e("admin.board.research.table.exportCsv","Export Filtered Dataset to CSV")}),a.jsx("button",{type:"button",className:"telemetry-table__export telemetry-table__export--json",onClick:v,children:e("admin.board.research.table.exportJson","Export Complete Schema to JSON")})]})]}),a.jsx("div",{className:"telemetry-table__wire-tabs",role:"tablist","aria-label":e("admin.board.research.table.wireFilter.label","Settlement channel filter"),children:f.map(s=>a.jsx("button",{type:"button",role:"tab","aria-selected":t===s.id,className:t===s.id?s.id===L?"telemetry-table__wire-tab telemetry-table__wire-tab--active telemetry-table__wire-tab--mercury":"telemetry-table__wire-tab telemetry-table__wire-tab--active":"telemetry-table__wire-tab",onClick:()=>n(s.id),children:s.label},s.id))}),g.length===0?a.jsx("p",{className:"telemetry-table__empty",children:e("admin.board.research.table.empty","No telemetry records match the active filter criteria.")}):a.jsx("div",{className:"telemetry-table__scroll",children:a.jsxs("table",{className:"telemetry-table__grid",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.timestamp")}),a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.maskedId")}),a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.trackLanguage")}),a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.score")}),a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.settlement","Settlement Channel")}),a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.stateHash")}),a.jsx("th",{scope:"col",children:e("admin.board.research.table.columns.ledgerSync")})]})}),a.jsx("tbody",{children:g.map(s=>{const _=s.score>=N,x=We[s.evaluationTrack]??s.evaluationTrack,y=ue(s),pe=$e(s,e);return a.jsxs("tr",{className:y?"telemetry-table__row--clickable":void 0,onClick:()=>{y&&c(s)},onKeyDown:A=>{y&&(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),c(s))},tabIndex:y?0:void 0,"aria-label":y?e("admin.board.research.table.invoice.openRow","Open Mercury wire invoice print preview"):void 0,children:[a.jsx("td",{className:"telemetry-table__mono",children:me(s.timestamp)}),a.jsx("td",{className:"telemetry-table__mono",children:s.client_email??s.maskedIdentifier}),a.jsxs("td",{className:"telemetry-table__track-lang",children:[x," · ",s.language.toUpperCase()]}),a.jsxs("td",{className:_?"telemetry-table__score":"telemetry-table__score telemetry-table__score--fail",children:[s.score,"%"]}),a.jsx("td",{children:pe??"—"}),a.jsx("td",{children:a.jsx("span",{className:"telemetry-table__hash",children:s.stateHash})}),a.jsx("td",{children:a.jsx("span",{className:s.waqfLedgerSynced?"telemetry-table__sync telemetry-table__sync--yes":"telemetry-table__sync telemetry-table__sync--no",role:"img","aria-label":s.waqfLedgerSynced?e("admin.board.research.table.ledgerSynced","WaqfLedger synced"):e("admin.board.research.table.ledgerPending","WaqfLedger pending"),title:s.waqfLedgerSynced?e("admin.board.research.table.ledgerSynced","WaqfLedger synced"):e("admin.board.research.table.ledgerPending","WaqfLedger pending"),children:s.waqfLedgerSynced?"✓":"—"})})]},s.id)})})]})})]}),a.jsx(Je,{row:o,t:e,onClose:()=>c(null)})]})}const h={MAINTENANCE_LOCKOUT:"SAFEAI_ADMIN_MAINTENANCE_LOCKOUT",STRIPE_PRODUCTION:"SAFEAI_ADMIN_STRIPE_PRODUCTION",LEDGER_LIVE_STREAM:"SAFEAI_ADMIN_LEDGER_LIVE_STREAM"},be={[h.MAINTENANCE_LOCKOUT]:["SAFEAI_ADMIN_MAINTENANCE"],[h.STRIPE_PRODUCTION]:["SAFEAI_ADMIN_STRIPE_MODE"],[h.LEDGER_LIVE_STREAM]:["SAFEAI_ADMIN_LEDGER_BYPASS"]},Qe=[{timestamp:"2026-06-11T08:31:12.000Z",stateHash:"a3f5c8d2e1b9047f6a0c3d9e2b1a8f7c5d4e3b2a1f0e9d8c7b6a5f4e3d2c1b0a9",tier:"Level 02",passed:!1},{timestamp:"2026-06-10T22:14:55.000Z",stateHash:"b4e6d9c3f2a8158e7b1d4c0f9a8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9",tier:"Level 01",passed:!1}],ea={en:"#c9a227",fr:"#5eead4",es:"#818cf8",ar:"#f472b6"},aa={track:"all",language:"all",scoreStatus:"all",partnerId:""},ra=`
.admin-dashboard {
  --ad-bg: #0a0e17;
  --ad-accent: #c9a227;
  --ad-accent-glow: rgba(201, 162, 39, 0.45);
  --ad-teal: #5eead4;
  --ad-teal-glow: rgba(94, 234, 212, 0.35);
  --ad-glass: rgba(15, 23, 42, 0.82);
  --ad-border: rgba(148, 163, 184, 0.2);
  --ad-text: #f8fafc;
  --ad-muted: #94a3b8;
  --ad-success: #22c55e;
  --ad-error: #f87171;
  flex: 1 1 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--ad-bg);
  color: var(--ad-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.admin-dashboard--authenticated {
  animation: admin-fade-in 0.65s ease forwards;
}

@keyframes admin-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.admin-dashboard__header {
  margin-bottom: 2rem;
}

.admin-dashboard__title {
  margin: 0 0 0.5rem;
  font-size: clamp(1.375rem, 3vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--ad-text);
}

.admin-dashboard__subtitle {
  margin: 0;
  max-width: 52rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ad-muted);
}

.admin-dashboard__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 1024px) {
  .admin-dashboard__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-dashboard__panel--research,
  .admin-dashboard__panel--audit {
    grid-column: span 2;
  }
}

.admin-panel {
  border-radius: 0.875rem;
  border: 1px solid var(--ad-border);
  background: var(--ad-glass);
  backdrop-filter: blur(18px) saturate(145%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  padding: 1.25rem 1.35rem;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.admin-panel__heading {
  margin: 0 0 1.15rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ad-accent);
}

.admin-research__filter-bar {
  position: sticky;
  top: 0;
  z-index: 12;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  margin: -1.25rem -1.35rem 1.25rem;
  border-bottom: 1px solid var(--ad-border);
  background: rgba(10, 14, 23, 0.94);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
}

.admin-research__filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: min(100%, 10.5rem);
  flex: 1 1 10.5rem;
}

.admin-research__filter--partner {
  flex: 2 1 14rem;
  min-width: min(100%, 14rem);
}

.admin-research__filter-label {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ad-muted);
}

.admin-research__select,
.admin-research__input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: 0.45rem;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.38);
  color: var(--ad-text);
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.admin-research__select:focus,
.admin-research__input:focus {
  border-color: var(--ad-accent);
  box-shadow: 0 0 0 2px var(--ad-accent-glow);
}

.admin-research__scope {
  margin: 0 0 1rem;
  font-size: 0.75rem;
  color: var(--ad-teal);
  font-variant-numeric: tabular-nums;
}

.admin-metric-matrix {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

@media (min-width: 640px) {
  .admin-metric-matrix {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1200px) {
  .admin-metric-matrix {
    grid-template-columns: repeat(4, 1fr);
  }
}

.admin-metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 1rem 1.05rem;
  border-radius: 0.75rem;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.28);
  min-width: 0;
}

.admin-metric-card__title {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ad-muted);
  line-height: 1.45;
}

.admin-metric-card__value {
  margin: 0;
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--ad-teal);
  text-shadow: 0 0 18px var(--ad-teal-glow);
  line-height: 1.15;
}

.admin-metric-card__hint {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--ad-muted);
}

.admin-metric-card__locale-stack {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.admin-metric-card__locale-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.admin-metric-card__locale-label {
  flex: 0 0 1.75rem;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--ad-muted);
  text-transform: uppercase;
}

.admin-metric-card__locale-track {
  flex: 1;
  height: 0.45rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.admin-metric-card__locale-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.35s ease;
}

.admin-metric-card__locale-pct {
  flex: 0 0 2rem;
  font-size: 0.625rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--ad-teal);
  text-align: end;
}

.admin-metric-card__funding-breakdown {
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.55;
  color: var(--ad-muted);
}

[dir="rtl"] .admin-metric-card__locale-pct {
  text-align: start;
}

[dir="rtl"] .admin-research__filter-bar {
  flex-direction: row-reverse;
}

[dir="rtl"] .admin-metric-card__locale-row {
  flex-direction: row-reverse;
}

.admin-switchboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-switch {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.22);
}

.admin-switch__copy {
  flex: 1;
  min-width: 0;
}

.admin-switch__label {
  display: block;
  margin: 0 0 0.3rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--ad-text);
}

.admin-switch__description {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--ad-muted);
}

.admin-switch__control {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  flex-shrink: 0;
}

[dir="rtl"] .admin-switch {
  flex-direction: row-reverse;
}

[dir="rtl"] .admin-switch__control {
  align-items: flex-start;
}

.admin-switch__toggle {
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  border-radius: 999px;
  border: 1px solid var(--ad-border);
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.admin-switch__toggle--on {
  background: rgba(201, 162, 39, 0.35);
  border-color: var(--ad-accent);
  box-shadow: 0 0 14px var(--ad-accent-glow);
}

.admin-switch__toggle-knob {
  position: absolute;
  top: 0.15rem;
  inset-inline-start: 0.15rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: var(--ad-muted);
  transition: transform 0.25s ease, background 0.25s ease;
}

.admin-switch__toggle--on .admin-switch__toggle-knob {
  transform: translateX(1.25rem);
}

[dir="rtl"] .admin-switch__toggle--on .admin-switch__toggle-knob {
  transform: translateX(-1.25rem);
}

.admin-switch__state {
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ad-muted);
}

.admin-switch__toggle--on + .admin-switch__state,
.admin-switch__control:has(.admin-switch__toggle--on) .admin-switch__state {
  color: var(--ad-accent);
}

.admin-audit__table-wrap {
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--ad-border);
}

.admin-audit__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

.admin-audit__table th {
  padding: 0.7rem 0.85rem;
  text-align: start;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ad-muted);
  background: rgba(0, 0, 0, 0.32);
  border-bottom: 1px solid var(--ad-border);
  white-space: nowrap;
}

.admin-audit__table td {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  vertical-align: middle;
}

.admin-audit__table tr:last-child td {
  border-bottom: none;
}

.admin-audit__hash {
  font-family: ui-monospace, 'Cascadia Code', 'Consolas', monospace;
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
  color: var(--ad-teal);
  word-break: break-all;
}

.admin-audit__status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.admin-audit__status--passed {
  background: rgba(34, 197, 94, 0.18);
  color: var(--ad-success);
}

.admin-audit__status--failed {
  background: rgba(248, 113, 113, 0.18);
  color: var(--ad-error);
}

.admin-audit__empty {
  margin: 0;
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8125rem;
  color: var(--ad-muted);
}
`;function te(e){if(typeof window>"u"||typeof e!="string"||!e.trim())return!1;try{return[e,...be[e]??[]].some(i=>{const t=window.localStorage.getItem(i);return typeof t=="string"&&t.trim()==="true"})}catch{return!1}}function ie(e,r){if(!(typeof window>"u"||typeof e!="string"||!e.trim()))try{window.localStorage.setItem(e,r?"true":"false")}catch{}}function ta(e){if(!(typeof window>"u"))try{e?window.localStorage.removeItem(O):window.localStorage.setItem(O,"false");for(const r of be[h.STRIPE_PRODUCTION]??[])window.localStorage.removeItem(r)}catch{}}function ia(e){return e?new Date(e).toISOString().replace("T"," ").replace(/\.\d{3}Z$/," UTC"):"—"}function C(e){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(e)}function na(){const e={level01:"Level 01",level02:"Level 02",level03:"Level 03"},r=M?.ledgerFeed??[],i=M?.activeCertifications??[];return[...r.map(n=>{const c=i.find(u=>u?.credentialId===n?.credentialId)?.tierKey?.match(/level0[1-3]/)?.[0],m=c?e[c]:"Level 01",l=xe(n?.stateHash?.toLowerCase?.()??"");return{timestamp:n?.timestamp,stateHash:n?.stateHash,tier:m,passed:!!l?.verified}}),...Qe??[]].sort((n,o)=>new Date(o.timestamp)-new Date(n.timestamp))}function j({id:e,label:r,children:i,className:t=""}){return a.jsxs("div",{className:`admin-research__filter ${t}`.trim(),children:[a.jsx("label",{className:"admin-research__filter-label",htmlFor:e,children:r}),i]})}function S({title:e,value:r,hint:i,children:t,hideValue:n=!1}){return a.jsxs("article",{className:"admin-metric-card",children:[a.jsx("h3",{className:"admin-metric-card__title",children:e}),!n&&a.jsx("p",{className:"admin-metric-card__value",children:r}),t,i&&a.jsx("p",{className:"admin-metric-card__hint",children:i})]})}function sa({t:e,rows:r}){const[i,t]=d.useState(aa),n=d.useMemo(()=>He(r,i),[r,i]),o=d.useMemo(()=>Ge(n),[n]),c=d.useCallback((l,u)=>{t(b=>({...b,[l]:u}))},[]),m=e("admin.board.research.filters.activeCount","{count} cohort records in scope").replace("{count}",String(o.totalCohorts));return a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"admin-research__filter-bar",role:"toolbar","aria-label":e("admin.board.research.filters.toolbar"),children:[a.jsx(j,{id:"admin-filter-track",label:e("admin.board.research.filters.track.label"),children:a.jsxs("select",{id:"admin-filter-track",className:"admin-research__select",value:i.track,onChange:l=>c("track",l.target.value),children:[a.jsx("option",{value:"all",children:e("admin.board.research.filters.track.all")}),a.jsx("option",{value:"level01",children:e("admin.board.research.filters.track.level01")}),a.jsx("option",{value:"level02",children:e("admin.board.research.filters.track.level02")}),a.jsx("option",{value:"level03",children:e("admin.board.research.filters.track.level03")})]})}),a.jsx(j,{id:"admin-filter-language",label:e("admin.board.research.filters.language.label"),children:a.jsxs("select",{id:"admin-filter-language",className:"admin-research__select",value:i.language,onChange:l=>c("language",l.target.value),children:[a.jsx("option",{value:"all",children:e("admin.board.research.filters.language.all")}),a.jsx("option",{value:"en",children:e("admin.board.telemetry.sessions.en")}),a.jsx("option",{value:"fr",children:e("admin.board.telemetry.sessions.fr")}),a.jsx("option",{value:"es",children:e("admin.board.telemetry.sessions.es")}),a.jsx("option",{value:"ar",children:e("admin.board.telemetry.sessions.ar")})]})}),a.jsx(j,{id:"admin-filter-score",label:e("admin.board.research.filters.score.label"),children:a.jsxs("select",{id:"admin-filter-score",className:"admin-research__select",value:i.scoreStatus,onChange:l=>c("scoreStatus",l.target.value),children:[a.jsx("option",{value:"all",children:e("admin.board.research.filters.score.all")}),a.jsx("option",{value:"pass",children:e("admin.board.research.filters.score.pass")}),a.jsx("option",{value:"fail",children:e("admin.board.research.filters.score.fail")})]})}),a.jsx(j,{id:"admin-filter-partner",className:"admin-research__filter--partner",label:e("admin.board.research.filters.partner.label"),children:a.jsx("input",{id:"admin-filter-partner",type:"text",className:"admin-research__input",value:i.partnerId,placeholder:e("admin.board.research.filters.partner.placeholder"),onChange:l=>c("partnerId",l.target.value),spellCheck:!1,autoCapitalize:"off",autoCorrect:"off"})})]}),a.jsx("p",{className:"admin-research__scope","aria-live":"polite",children:m}),a.jsxs("div",{className:"admin-metric-matrix",children:[a.jsx(S,{title:e("admin.board.research.metrics.cohorts.title"),value:o.totalCohorts.toLocaleString(),hint:e("admin.board.research.metrics.cohorts.subtitle")}),a.jsx(S,{title:e("admin.board.research.metrics.compliance.title"),value:`${o.meanScore.toFixed(1)}%`,hint:e("admin.board.research.metrics.compliance.subtitle")}),a.jsx(S,{title:e("admin.board.research.metrics.linguistic.title"),hideValue:!0,hint:e("admin.board.research.metrics.linguistic.subtitle"),children:a.jsx("div",{className:"admin-metric-card__locale-stack",children:o.linguisticDistribution.map(l=>a.jsxs("div",{className:"admin-metric-card__locale-row",children:[a.jsx("span",{className:"admin-metric-card__locale-label",children:l.locale.toUpperCase()}),a.jsx("div",{className:"admin-metric-card__locale-track","aria-hidden":"true",children:a.jsx("div",{className:"admin-metric-card__locale-fill",style:{width:`${l.percentage}%`,backgroundColor:ea[l.locale]??"#64748b"}})}),a.jsxs("span",{className:"admin-metric-card__locale-pct",children:[l.percentage,"%"]})]},l.locale))})}),a.jsx(S,{title:e("admin.board.research.metrics.funding.title"),value:C(o.fundingVolume),hint:e("admin.board.research.metrics.funding.subtitle"),children:a.jsx("p",{className:"admin-metric-card__funding-breakdown",children:e("admin.board.research.metrics.funding.breakdown","{researchCount} × {researchAmount} research · {infraCount} × {infraAmount} infrastructure").replace("{researchCount}",String(o.researchContributions)).replace("{researchAmount}",C(k)).replace("{infraCount}",String(o.infrastructureContributions)).replace("{infraAmount}",C(E))})})]}),a.jsx(Xe,{t:e,filteredRows:n,allRows:r})]})}function T({id:e,label:r,description:i,checked:t,onChange:n,stateOnLabel:o,stateOffLabel:c}){return a.jsxs("div",{className:"admin-switch",children:[a.jsxs("div",{className:"admin-switch__copy",children:[a.jsx("span",{className:"admin-switch__label",children:r}),a.jsx("p",{className:"admin-switch__description",children:i})]}),a.jsxs("div",{className:"admin-switch__control",children:[a.jsx("button",{type:"button",id:e,role:"switch","aria-checked":t,className:t?"admin-switch__toggle admin-switch__toggle--on":"admin-switch__toggle",onClick:()=>n(!t),children:a.jsx("span",{className:"admin-switch__toggle-knob"})}),a.jsx("span",{className:"admin-switch__state",children:t?o:c})]})]})}function oa({language:e}){const{t:r,language:i}=Pe(e),t=he(i),n=d.useMemo(()=>ze(),[]),o=d.useMemo(()=>na(),[]),[c,m]=d.useState(()=>te(h.MAINTENANCE_LOCKOUT)),[l,u]=d.useState(()=>_e()),[b,g]=d.useState(()=>te(h.LEDGER_LIVE_STREAM)),p=d.useCallback(s=>{m(s),ie(h.MAINTENANCE_LOCKOUT,s)},[]),v=d.useCallback(s=>{u(s),ta(s),window.dispatchEvent(new Event("safeai:stripe-gateway-change"))},[]),f=d.useCallback(s=>{g(s),ie(h.LEDGER_LIVE_STREAM,s)},[]);return a.jsxs("div",{className:"admin-dashboard admin-dashboard--authenticated",dir:t?"rtl":"ltr",children:[a.jsx("style",{children:ra}),a.jsxs("div",{className:"max-w-7xl mx-auto px-4 py-8 w-full",children:[a.jsxs("header",{className:"admin-dashboard__header",children:[a.jsx("h1",{className:"admin-dashboard__title",children:r("admin.board.header.title")}),a.jsx("p",{className:"admin-dashboard__subtitle",children:r("admin.board.header.subtitle")})]}),a.jsxs("div",{className:"admin-dashboard__grid",children:[a.jsxs("section",{className:"admin-panel admin-dashboard__panel--research","aria-labelledby":"admin-panel-research",children:[a.jsx("h2",{id:"admin-panel-research",className:"admin-panel__heading",children:r("admin.board.research.title")}),a.jsx(sa,{t:r,rows:n})]}),a.jsxs("section",{className:"admin-panel","aria-labelledby":"admin-panel-switchboard",children:[a.jsx("h2",{id:"admin-panel-switchboard",className:"admin-panel__heading",children:r("admin.board.panels.switchboard")}),a.jsxs("div",{className:"admin-switchboard",children:[a.jsx(T,{id:"admin-switch-maintenance",label:r("admin.board.switchboard.maintenance.label"),description:r("admin.board.switchboard.maintenance.description"),checked:c,onChange:p,stateOnLabel:r("admin.board.switchboard.stateOn"),stateOffLabel:r("admin.board.switchboard.stateOff")}),a.jsx(T,{id:"admin-switch-stripe",label:r("admin.board.switchboard.stripe.label"),description:r("admin.board.switchboard.stripe.description"),checked:l,onChange:v,stateOnLabel:r("admin.board.switchboard.stateOn"),stateOffLabel:r("admin.board.switchboard.stateOff")}),a.jsx(T,{id:"admin-switch-ledger",label:r("admin.board.switchboard.ledger.label"),description:r("admin.board.switchboard.ledger.description"),checked:b,onChange:f,stateOnLabel:r("admin.board.switchboard.stateOn"),stateOffLabel:r("admin.board.switchboard.stateOff")})]})]}),a.jsxs("section",{className:"admin-panel admin-dashboard__panel--audit","aria-labelledby":"admin-panel-audit",children:[a.jsx("h2",{id:"admin-panel-audit",className:"admin-panel__heading",children:r("admin.board.panels.audit")}),(o??[]).length===0?a.jsx("p",{className:"admin-audit__empty",children:r("admin.board.audit.empty")}):a.jsx("div",{className:"admin-audit__table-wrap",children:a.jsxs("table",{className:"admin-audit__table",children:[a.jsx("thead",{children:a.jsxs("tr",{children:[a.jsx("th",{scope:"col",children:r("admin.board.audit.columns.timestamp")}),a.jsx("th",{scope:"col",children:r("admin.board.audit.columns.hash")}),a.jsx("th",{scope:"col",children:r("admin.board.audit.columns.level")}),a.jsx("th",{scope:"col",children:r("admin.board.audit.columns.status")})]})}),a.jsx("tbody",{children:(o??[]).map(s=>a.jsxs("tr",{children:[a.jsx("td",{children:ia(s?.timestamp)}),a.jsx("td",{children:a.jsx("span",{className:"admin-audit__hash",children:s?.stateHash})}),a.jsx("td",{children:s?.tier}),a.jsx("td",{children:a.jsx("span",{className:s?.passed?"admin-audit__status admin-audit__status--passed":"admin-audit__status admin-audit__status--failed",children:s?.passed?r("admin.board.audit.statusPassed"):r("admin.board.audit.statusFailed")})})]},`${s?.timestamp}-${s?.stateHash}`))})]})})]})]})]})]})}function ba({language:e}){const[r,i]=d.useState(()=>le()),t=d.useCallback(()=>{i(!0)},[]),n=d.useCallback(()=>{de(),i(!1)},[]);return De(r,n),r?a.jsx(oa,{language:e}):a.jsx(Me,{onAuthenticated:t})}export{ba as default};
