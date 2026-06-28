import{j as e,S as m,g as n,c as p}from"./index-D2vGI_9r.js";import{b as s,L as _}from"./vendor-BEm5BeKO.js";const h="safeai.language",i="safeai:language-change",f=`
.corporate-legal {
  --cl-accent: #c9a227;
  --cl-accent-teal: #5eead4;
  --cl-border: rgba(148, 163, 184, 0.18);
  --cl-text: #f8fafc;
  --cl-muted: #94a3b8;
  flex: 1 1 auto;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  color: var(--cl-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.corporate-legal__inner {
  width: min(100%, 52rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.corporate-legal__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.corporate-legal__eyebrow {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--cl-accent-teal);
}

.corporate-legal__title {
  margin: 0;
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.corporate-legal__subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--cl-muted);
}

.corporate-legal__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.6fr);
  gap: clamp(1.25rem, 3vw, 2rem);
  align-items: start;
}

.corporate-legal__anchors {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 1.15rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--cl-border);
  background: rgba(15, 23, 42, 0.55);
}

.corporate-legal__anchor-label {
  margin: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cl-accent);
}

.corporate-legal__anchor-value {
  margin: 0 0 0.5rem;
  font-size: 0.8125rem;
  line-height: 1.55;
  color: rgba(226, 232, 240, 0.92);
}

.corporate-legal__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.corporate-legal__section {
  padding: 1.15rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid var(--cl-border);
  background: rgba(15, 23, 42, 0.42);
}

.corporate-legal__section-title {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cl-accent-teal);
}

.corporate-legal__section-body {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.65;
  color: rgba(226, 232, 240, 0.9);
}

.corporate-legal__faq {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.corporate-legal__faq-item {
  padding: 1rem 1.1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--cl-border);
  background: rgba(11, 15, 25, 0.45);
}

.corporate-legal__faq-q {
  margin: 0 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--cl-text);
}

.corporate-legal__faq-a {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--cl-muted);
}

.corporate-legal__cta {
  display: inline-flex;
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.35);
  background: rgba(94, 234, 212, 0.1);
  font-size: 0.8125rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--cl-accent-teal);
  transition: background 160ms ease;
}

.corporate-legal__cta:hover {
  background: rgba(94, 234, 212, 0.16);
}

@media (max-width: 768px) {
  .corporate-legal__layout {
    grid-template-columns: 1fr;
  }
}
`;function u(r){const[c,a]=s.useState(()=>r??n());return s.useEffect(()=>{if(r){a(r);return}const l=()=>a(n()),t=o=>{o.key===h&&l()};return window.addEventListener("storage",t),window.addEventListener(i,l),()=>{window.removeEventListener("storage",t),window.removeEventListener(i,l)}},[r]),p(c)}const g={help:"page_titles.help",terms:"page_titles.terms",privacy:"page_titles.privacy"},x={help:"help.title",terms:"legal.terms.title",privacy:"legal.privacy.title"},y={help:"help.subtitle",terms:"legal.terms.subtitle",privacy:"legal.privacy.subtitle"};function N({section:r="help",language:c}){const{t:a}=u(c),{infrastructure:l}=m??{};s.useEffect(()=>{document.title=a(g[r]??g.help)},[r,a]);const t=r==="help"?[{titleKey:"legal.shared.dataProtection",bodyKey:"legal.shared.dataProtectionBody"},{titleKey:"legal.shared.registryGovernance",bodyKey:"legal.shared.registryGovernanceBody"},{titleKey:"legal.shared.dataHandling",bodyKey:"legal.shared.dataHandlingBody"},{titleKey:"legal.shared.compliance",bodyKey:"legal.shared.complianceBody"}]:[];return e.jsxs("div",{className:"corporate-legal",children:[e.jsx("style",{children:f}),e.jsxs("div",{className:"corporate-legal__inner",children:[e.jsxs("header",{className:"corporate-legal__header",children:[e.jsx("p",{className:"corporate-legal__eyebrow",children:a("legal.shared.eyebrow")}),e.jsx("h1",{className:"corporate-legal__title",children:a(x[r])}),e.jsx("p",{className:"corporate-legal__subtitle",children:a(y[r])})]}),e.jsxs("div",{className:"corporate-legal__layout",children:[e.jsxs("aside",{className:"corporate-legal__anchors","aria-label":a("legal.shared.registryHeading"),children:[e.jsx("p",{className:"corporate-legal__anchor-label",children:a("legal.shared.processingEntity")}),e.jsx("p",{className:"corporate-legal__anchor-value",children:a("legalAnchors.processingEntity")}),e.jsx("p",{className:"corporate-legal__anchor-label",children:a("legal.shared.academicAuthority")}),e.jsx("p",{className:"corporate-legal__anchor-value",children:a("legalAnchors.academicInstitution")}),e.jsx("p",{className:"corporate-legal__anchor-label",children:a("legal.shared.registryHeading")}),e.jsx("p",{className:"corporate-legal__anchor-value",children:a("legalAnchors.registry.registryLine")}),e.jsx("p",{className:"corporate-legal__anchor-value",children:a("legalAnchors.registry.address")}),e.jsx("p",{className:"corporate-legal__anchor-value",children:a("legalAnchors.registry.iceStatement")}),e.jsx("p",{className:"corporate-legal__anchor-label",children:a("legal.shared.ledgerProtocol")}),e.jsxs("p",{className:"corporate-legal__anchor-value",children:[l?.protocol," · ",a("infrastructure.ledgerHost")]}),e.jsx("p",{className:"corporate-legal__anchor-value",children:a("legalAnchors.ecosystemTransparency")})]}),e.jsxs("div",{className:"corporate-legal__content",children:[r==="help"&&e.jsxs("div",{className:"corporate-legal__faq",children:[e.jsxs("article",{className:"corporate-legal__faq-item",children:[e.jsx("p",{className:"corporate-legal__faq-q",children:a("academy.faq.q1.question")}),e.jsx("p",{className:"corporate-legal__faq-a",children:a("academy.faq.q1.answer")})]}),e.jsxs("article",{className:"corporate-legal__faq-item",children:[e.jsx("p",{className:"corporate-legal__faq-q",children:a("academy.faq.q2.question")}),e.jsx("p",{className:"corporate-legal__faq-a",children:a("academy.faq.q2.answer")})]}),e.jsx(_,{to:"/contact",className:"corporate-legal__cta",children:a("help.contact_button")})]}),(t??[]).map(({titleKey:o,bodyKey:d})=>e.jsxs("section",{className:"corporate-legal__section",children:[e.jsx("h2",{className:"corporate-legal__section-title",children:a(o)}),e.jsx("p",{className:"corporate-legal__section-body",children:a(d)})]},o))]})]})]})]})}export{N as default};
