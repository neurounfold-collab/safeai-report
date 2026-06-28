import{i as F,j as e,g as x,c as C}from"./index-D2vGI_9r.js";import{b as r,L as f,e as A}from"./vendor-BEm5BeKO.js";import{s as R,g as T}from"./emailRouter-0OyELqUS.js";const m="EXECUTIVE_BRIEFING",B="safeai.language",k="safeai:language-change",G=`
.home-view {
  --home-bg: #0b0f19;
  --home-accent: #c9a227;
  --home-accent-teal: #5eead4;
  --home-border: rgba(148, 163, 184, 0.18);
  --home-text: #f8fafc;
  --home-muted: #94a3b8;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 70% 50% at 10% 15%, rgba(94, 234, 212, 0.08), transparent 55%),
    radial-gradient(ellipse 55% 40% at 90% 85%, rgba(201, 162, 39, 0.07), transparent 50%),
    var(--home-bg);
  color: var(--home-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.home-view__inner {
  flex: 1 1 auto;
  width: min(100%, 56rem);
  margin: 0 auto;
  padding: clamp(1.75rem, 4vw, 3.5rem) clamp(1rem, 3vw, 2rem);
  min-width: 0;
}

.home-view__hero {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 3vw, 1.75rem);
  min-width: 0;
}

.home-view__hero-content {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.home-view__citation-lead {
  margin: 0;
  font-size: clamp(0.875rem, 1.7vw, 1rem);
  font-weight: 500;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(248, 250, 252, 0.92);
}

.home-view__headline {
  margin: 0;
  font-size: clamp(1.75rem, 4.2vw, 2.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.35;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-text);
}

.home-view__subheadline {
  margin: 0;
  font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-muted);
}

.home-view__open-access {
  margin: 0;
  font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(94, 234, 212, 0.88);
}

.home-view__profile {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
  padding: 1.15rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--home-border);
  background: rgba(15, 23, 42, 0.42);
  border-inline-start: 3px solid var(--home-accent);
}

.home-view__profile-label {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--home-accent);
}

.home-view__profile-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--home-text);
}

.home-view__profile-institution {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-muted);
}

.home-view__cta-row {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.home-view__cta-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.85rem;
  min-width: 0;
}

@media (min-width: 640px) {
  .home-view__cta-split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.home-view__cta-glass {
  display: inline-flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  text-align: center;
  font-size: clamp(0.8125rem, 1.6vw, 0.9375rem);
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: border-color 300ms ease, background-color 300ms ease, color 300ms ease, box-shadow 300ms ease;
  cursor: pointer;
}

.home-view__cta-glass--diagnostic {
  border: 1px solid rgba(94, 234, 212, 0.3);
  background: rgba(2, 6, 23, 0.78);
  color: #5eead4;
  box-shadow:
    inset 0 1px 0 rgba(94, 234, 212, 0.12),
    0 8px 32px rgba(94, 234, 212, 0.1);
}

.home-view__cta-glass--diagnostic:hover {
  border-color: rgba(94, 234, 212, 0.5);
  background: rgba(15, 23, 42, 0.9);
  color: #99f6e4;
}

.home-view__cta-glass--executive {
  border: 1px solid rgba(201, 162, 39, 0.32);
  background: rgba(2, 6, 23, 0.78);
  color: #e2c66d;
  box-shadow:
    inset 0 1px 0 rgba(201, 162, 39, 0.14),
    0 8px 32px rgba(201, 162, 39, 0.08);
}

.home-view__cta-glass--executive:hover {
  border-color: rgba(201, 162, 39, 0.52);
  background: rgba(15, 23, 42, 0.9);
  color: #f0d78c;
}

.home-view__intake {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 0.875rem;
  border: 1px solid var(--home-border);
  background: rgba(15, 23, 42, 0.42);
}

.home-view__intake--highlighted {
  border-color: rgba(201, 162, 39, 0.45);
  box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.18), 0 12px 40px rgba(201, 162, 39, 0.08);
  animation: home-view-intake-pulse 1.6s ease-in-out 2;
}

@keyframes home-view-intake-pulse {
  0%, 100% { box-shadow: 0 0 0 1px rgba(201, 162, 39, 0.18), 0 12px 40px rgba(201, 162, 39, 0.08); }
  50% { box-shadow: 0 0 0 2px rgba(201, 162, 39, 0.32), 0 16px 48px rgba(201, 162, 39, 0.14); }
}

.home-view__intake-title {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 700;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-text);
}

.home-view__intake-hint {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(226, 198, 109, 0.92);
}

.home-view__intake-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.home-view__intake-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.home-view__intake-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--home-muted);
}

.home-view__intake-input,
.home-view__intake-textarea {
  width: 100%;
  min-width: 0;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid var(--home-border);
  background: rgba(11, 15, 25, 0.65);
  color: var(--home-text);
  font-size: 0.875rem;
  line-height: 1.5;
}

.home-view__intake-textarea {
  min-height: 6rem;
  resize: vertical;
}

.home-view__intake-input:focus,
.home-view__intake-textarea:focus {
  outline: none;
  border-color: rgba(201, 162, 39, 0.45);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.12);
}

.home-view__intake-submit {
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #c9a227 0%, #92710f 100%);
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.home-view__intake-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(201, 162, 39, 0.22);
}

.home-view__intake-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.home-view__intake-success {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(201, 162, 39, 0.28);
  background: rgba(120, 90, 10, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #e2c66d;
}

.home-view__intake-error {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #fca5a5;
}

.home-view__ledger-badge {
  margin: 0;
  min-width: 0;
  font-size: clamp(0.6875rem, 1.4vw, 0.75rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.6;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.82);
}

.home-view__framework {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding-top: 0.5rem;
}

.home-view__framework-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--home-accent-teal);
}

.home-view__section-title {
  margin: 0 0 clamp(1rem, 2.5vw, 1.35rem);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  overflow-wrap: break-word;
  word-break: break-word;
  color: var(--home-accent-teal);
}

.home-view__framework-description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  overflow-wrap: break-word;
  word-break: break-word;
  color: rgba(148, 163, 184, 0.92);
}

.home-view__process {
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(1.75rem, 3vw, 2.25rem);
  border-top: 1px solid var(--home-border);
  min-width: 0;
}

.home-view__process-track {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.25rem);
  min-width: 0;
}

.home-view__process-step {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  padding: 1rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--home-border);
  background: rgba(15, 23, 42, 0.38);
  text-align: center;
}

.home-view__process-step-label {
  margin: 0;
  font-size: clamp(0.75rem, 1.5vw, 0.8125rem);
  font-weight: 600;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  letter-spacing: 0.01em;
  color: var(--home-text);
}

.home-view__process-arrow {
  flex-shrink: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--home-accent);
  opacity: 0.75;
  user-select: none;
}

@media (max-width: 960px) {
  .home-view__process-track {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .home-view__process-arrow {
    display: none;
  }
}

.home-view__collaboration {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
  padding-top: clamp(1.75rem, 3vw, 2.25rem);
  border-top: 1px solid var(--home-border);
  min-width: 0;
}
`;function H(o){const[a,s]=r.useState(()=>o??x());r.useEffect(()=>{if(o){s(o);return}const t=()=>s(x()),n=c=>{c.key===B&&t()};return window.addEventListener("storage",n),window.addEventListener(k,t),()=>{window.removeEventListener("storage",n),window.removeEventListener(k,t)}},[o]);const{t:d}=C(a);return{t:d,language:a}}function M({language:o}){const{t:a,language:s}=H(o),d=F(s),t=r.useRef(null),[n,c]=r.useState(null),[w,u]=r.useState(!1),[l,N]=r.useState(""),[h,j]=r.useState(""),[y,E]=r.useState(!1),[g,b]=r.useState(!1),[p,_]=r.useState("");r.useEffect(()=>{document.title=a("page_titles.home")},[a]);const z=r.useCallback(()=>{c(m),u(!0),requestAnimationFrame(()=>{t.current?.scrollIntoView({behavior:"smooth",block:"center"})})},[]),v=l.trim().length>0&&h.trim().length>0,S=async i=>{if(i.preventDefault(),!(!v||g)){b(!0),_("");try{await R({institutionName:"Executive Briefing — Access Registry",contactPerson:l.trim(),selectedTier:n??m,domainContext:T(),additionalFields:{email:l.trim(),message:h.trim(),intake_flag:n??m,form_source:"home_executive_briefing_intake"}}),E(!0)}catch{_(a("landing.intake.error"))}finally{b(!1)}}},I=[a("landing.process.step1"),a("landing.process.step2"),a("landing.process.step3")];return e.jsxs("main",{className:"home-view",dir:d?"rtl":"ltr",children:[e.jsx("style",{children:G}),e.jsxs("div",{className:"home-view__inner",children:[e.jsxs("header",{className:"home-view__hero","aria-label":a("landing.hero.headline"),children:[e.jsxs("div",{className:"home-view__hero-content",children:[e.jsx("p",{className:"home-view__citation-lead break-words leading-[1.7]",children:a("landing.hero.citationLead")}),e.jsx("h1",{className:"home-view__headline break-words leading-[1.7]",children:a("landing.hero.headline")}),e.jsx("p",{className:"home-view__subheadline break-words leading-[1.7]",children:a("landing.hero.subheadline")}),e.jsx("p",{className:"home-view__open-access break-words leading-[1.7]",children:a("landing.hero.universalOpenAccess")})]}),e.jsxs("aside",{className:"home-view__profile","aria-label":a("branding.authority"),children:[e.jsx("p",{className:"home-view__profile-label",children:a("branding.standardName")}),e.jsx("p",{className:"home-view__profile-name break-words leading-[1.7]",children:a("branding.authority")}),e.jsxs("p",{className:"home-view__profile-institution break-words leading-[1.7]",children:[a("legalAnchors.academicInstitution")," · ",a("infrastructure.targetFramework")]})]}),e.jsxs("div",{className:"home-view__cta-row",children:[e.jsxs("div",{className:"home-view__cta-split",children:[e.jsx(f,{to:"/academy",className:"home-view__cta-glass home-view__cta-glass--diagnostic",children:e.jsx("span",{className:"min-w-0 break-words leading-[1.7]",children:a("landing.hero.diagnosticDashboardCta")})}),e.jsx("button",{type:"button",className:"home-view__cta-glass home-view__cta-glass--executive",onClick:z,children:e.jsx("span",{className:"min-w-0 break-words leading-[1.7]",children:a("landing.hero.executiveBriefingCta")})})]}),e.jsx("p",{className:"home-view__ledger-badge break-words leading-[1.7]",children:a("landing.waqfLedgerBadge")})]}),e.jsxs("section",{className:"home-view__framework","aria-labelledby":"home-framework-title",children:[e.jsx("h2",{id:"home-framework-title",className:"home-view__framework-title break-words leading-[1.7]",children:a("landing.framework.title")}),e.jsx("p",{className:"home-view__framework-description break-words leading-[1.7]",children:a("landing.framework.description")})]})]}),e.jsxs("section",{className:"home-view__process","aria-labelledby":"home-process-title",children:[e.jsx("h2",{id:"home-process-title",className:"home-view__section-title break-words leading-[1.7]",children:a("landing.process.sectionTitle")}),e.jsx("div",{className:"home-view__process-track",role:"list",children:(I||[]).map((i,L)=>e.jsxs(A.Fragment,{children:[L>0&&e.jsx("span",{className:"home-view__process-arrow","aria-hidden":"true",children:"➔"}),e.jsx("article",{className:"home-view__process-step",role:"listitem",children:e.jsx("h3",{className:"home-view__process-step-label break-words leading-[1.7]",children:i})})]},i))})]}),e.jsx("section",{className:"home-view__collaboration","aria-labelledby":"home-collaboration-title",children:e.jsxs("article",{className:"flex w-full min-w-0 max-w-2xl flex-col items-center gap-5 rounded-xl border border-slate-800 bg-slate-950/40 p-6 text-center backdrop-blur-md sm:p-8",children:[e.jsx("h2",{id:"home-collaboration-title",className:"m-0 w-full min-w-0 break-words text-lg font-bold leading-[1.7] tracking-tight text-slate-100 sm:text-xl",children:a("landing.collaboration.title")}),e.jsx("p",{className:"m-0 w-full min-w-0 break-words text-sm leading-[1.7] text-slate-400 sm:text-base",children:a("landing.collaboration.body")}),e.jsx(f,{to:"/academic-centers",className:"inline-flex min-w-0 max-w-full items-center justify-center self-center rounded-xl border border-teal-500/20 bg-slate-950/80 px-6 py-3.5 text-center text-sm font-semibold leading-[1.7] text-teal-400 shadow-[0_0_24px_rgba(94,234,212,0.08)] backdrop-blur-md transition-all hover:bg-slate-900/60 sm:text-base",children:e.jsx("span",{className:"min-w-0 break-words leading-[1.7]",children:a("landing.collaboration.cta")})})]})}),e.jsx("section",{ref:t,id:"home-intake-form",className:w?"home-view__intake home-view__intake--highlighted":"home-view__intake","aria-labelledby":"home-intake-title",children:y?e.jsx("p",{className:"home-view__intake-success break-words leading-[1.7]",role:"status",children:a("landing.intake.success")}):e.jsxs("form",{className:"home-view__intake-form",onSubmit:S,children:[e.jsx("h2",{id:"home-intake-title",className:"home-view__intake-title break-words leading-[1.7]",children:a("landing.intake.title")}),n===m&&w?e.jsx("p",{className:"home-view__intake-hint break-words leading-[1.7]",role:"status",children:a("landing.intake.executiveBriefingHint")}):null,e.jsxs("div",{className:"home-view__intake-field",children:[e.jsx("label",{className:"home-view__intake-label break-words leading-[1.7]",htmlFor:"home-intake-email",children:a("landing.intake.email")}),e.jsx("input",{id:"home-intake-email",className:"home-view__intake-input break-words leading-[1.7]",type:"email",value:l,onChange:i=>N(i.target.value),placeholder:a("forms.emailPlaceholder"),autoComplete:"email"})]}),e.jsxs("div",{className:"home-view__intake-field",children:[e.jsx("label",{className:"home-view__intake-label break-words leading-[1.7]",htmlFor:"home-intake-message",children:a("landing.intake.message")}),e.jsx("textarea",{id:"home-intake-message",className:"home-view__intake-textarea break-words leading-[1.7]",value:h,onChange:i=>j(i.target.value),placeholder:a("landing.intake.messagePlaceholder")})]}),p?e.jsx("p",{className:"home-view__intake-error break-words leading-[1.7]",role:"alert",children:p}):null,e.jsx("button",{type:"submit",className:"home-view__intake-submit break-words leading-[1.7]",disabled:!v||g,children:a(g?"landing.intake.submitting":"landing.intake.submit")})]})})]})]})}export{M as default};
