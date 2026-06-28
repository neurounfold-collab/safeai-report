import{i as v,j as e,S as g,g as d,c as y}from"./index-D2vGI_9r.js";import{b as l}from"./vendor-BEm5BeKO.js";const w="safeai.language",m="safeai:language-change",b=`
.privacy-view {
  --privacy-bg: #0b0f19;
  --privacy-accent: #c9a227;
  --privacy-accent-teal: #5eead4;
  --privacy-border: rgba(148, 163, 184, 0.18);
  --privacy-text: #f8fafc;
  --privacy-muted: #94a3b8;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(ellipse 70% 50% at 10% 15%, rgba(94, 234, 212, 0.07), transparent 55%),
    radial-gradient(ellipse 55% 40% at 90% 85%, rgba(201, 162, 39, 0.06), transparent 50%),
    var(--privacy-bg);
  color: var(--privacy-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.privacy-view__inner {
  flex: 1 1 auto;
  width: min(100%, 44rem);
  margin: 0 auto;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(1.75rem, 3.5vw, 2.5rem);
}

.privacy-view__document {
  display: flex;
  flex-direction: column;
  gap: clamp(1.25rem, 2.5vw, 1.75rem);
  min-width: 0;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 1rem;
  border: 1px solid rgba(94, 234, 212, 0.18);
  background:
    linear-gradient(165deg, rgba(94, 234, 212, 0.05) 0%, rgba(15, 23, 42, 0.82) 38%),
    rgba(11, 15, 25, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 24px 48px rgba(0, 0, 0, 0.32);
}

.privacy-view__ledger {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(94, 234, 212, 0.22);
  background: rgba(15, 118, 110, 0.1);
}

.privacy-view__ledger-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--privacy-accent-teal);
}

.privacy-view__ledger-value {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--privacy-text);
}

.privacy-view__sections {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.35rem);
  min-width: 0;
}

.privacy-view__section {
  min-width: 0;
  padding: clamp(1rem, 2.5vw, 1.25rem);
  border-radius: 0.875rem;
  border: 1px solid var(--privacy-border);
  border-inline-start: 3px solid var(--privacy-accent-teal);
  background: rgba(15, 23, 42, 0.48);
}

.privacy-view__section-title {
  margin: 0 0 0.75rem;
  font-size: clamp(0.6875rem, 1.6vw, 0.8125rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--privacy-accent-teal);
}

.privacy-view__section-body {
  margin: 0;
  font-size: clamp(0.8125rem, 1.8vw, 0.9375rem);
  color: rgba(226, 232, 240, 0.92);
}

.privacy-view__director {
  min-width: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(201, 162, 39, 0.22);
  border-inline-start: 3px solid var(--privacy-accent);
  background: rgba(15, 23, 42, 0.55);
}

.privacy-view__director-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--privacy-muted);
}

.privacy-view__director-name {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--privacy-text);
}

.privacy-view__director-institution {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--privacy-muted);
}

.privacy-view__footer {
  min-width: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(11, 15, 25, 0.55);
}
`,x=[{titleKey:"legal.privacy.section1Title",bodyKey:"legal.privacy.section1Body"},{titleKey:"legal.privacy.section2Title",bodyKey:"legal.privacy.section2Body"},{titleKey:"legal.privacy.section3Title",bodyKey:"legal.privacy.section3Body"},{titleKey:"legal.privacy.section4Title",bodyKey:"legal.privacy.section4Body"}];function _(a){const[r,c]=l.useState(()=>a??d());return l.useEffect(()=>{if(a){c(a);return}const t=()=>c(d()),i=s=>{s.key===w&&t()};return window.addEventListener("storage",i),window.addEventListener(m,t),()=>{window.removeEventListener("storage",i),window.removeEventListener(m,t)}},[a]),y(r)}function h({language:a}){const{t:r,language:c}=_(a),t=v(c),{infrastructure:i,branding:s,legalAnchors:n}=g;return l.useEffect(()=>{document.title=r("page_titles.privacy")},[r]),e.jsxs("div",{className:"privacy-view",dir:t?"rtl":"ltr",children:[e.jsx("style",{children:b}),e.jsxs("div",{className:"privacy-view__inner",children:[e.jsxs("header",{className:"flex min-w-0 flex-col gap-3",children:[e.jsx("p",{className:"m-0 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-teal-400",children:r("legal.privacy.eyebrow")}),e.jsx("h1",{className:"m-0 min-w-0 break-words text-[clamp(1.5rem,3.5vw,2rem)] font-extrabold leading-[1.7] tracking-tight text-slate-50",children:r("legal.privacy.title")}),e.jsx("p",{className:"m-0 min-w-0 break-words text-sm leading-[1.7] text-slate-400 sm:text-base",children:r("legal.privacy.subtitle")})]}),e.jsxs("article",{className:"privacy-view__document","aria-labelledby":"privacy-document-title",children:[e.jsx("h2",{id:"privacy-document-title",className:"sr-only",children:r("legal.privacy.title")}),e.jsxs("div",{className:"privacy-view__ledger",children:[e.jsx("p",{className:"privacy-view__ledger-label break-words leading-[1.7]",children:r("legal.shared.ledgerProtocol")}),e.jsxs("p",{className:"privacy-view__ledger-value break-words leading-[1.7]",children:[i.encryptionProtocol," · ",i.ledgerHost]})]}),e.jsx("div",{className:"privacy-view__sections",children:x.map(({titleKey:o,bodyKey:p})=>e.jsxs("section",{className:"privacy-view__section",children:[e.jsx("h3",{className:"privacy-view__section-title break-words leading-[1.7]",children:r(o)}),e.jsx("p",{className:"privacy-view__section-body break-words leading-[1.7]",children:r(p)})]},o))})]}),e.jsxs("aside",{className:"privacy-view__director",children:[e.jsx("p",{className:"privacy-view__director-label break-words leading-[1.7]",children:r("legal.privacy.directorSignatureLabel")}),e.jsx("p",{className:"privacy-view__director-name break-words leading-[1.7]",children:r("legal.privacy.directorName")}),e.jsxs("p",{className:"privacy-view__director-institution break-words leading-[1.7]",children:[n.academicInstitution," · ",s.standardName]})]}),e.jsxs("footer",{className:"privacy-view__footer",children:[e.jsxs("p",{className:"m-0 min-w-0 break-words text-xs leading-[1.7] text-slate-500",children:[r("legalAnchors.registry.registryLine")," · ",r("legalAnchors.registry.address")]}),e.jsxs("p",{className:"m-0 mt-2 min-w-0 break-words text-xs leading-[1.7] text-slate-500",children:[i.protocol," · ",n.processingEntity]})]})]})]})}export{h as default};
