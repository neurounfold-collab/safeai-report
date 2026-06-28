import{j as e,g as f,c as E}from"./index-D2vGI_9r.js";import{b as c}from"./vendor-BEm5BeKO.js";import{s as C,g as L}from"./emailRouter-0OyELqUS.js";const T="safeai.language",b="safeai:language-change",z=`
.contact-view {
  --cv-accent: #5eead4;
  --cv-border: rgba(148, 163, 184, 0.18);
  --cv-text: #f8fafc;
  --cv-muted: #94a3b8;
  flex: 1 1 auto;
  padding: clamp(1.75rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem);
  color: var(--cv-text);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

.contact-view__inner {
  width: min(100%, 40rem);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-view__title {
  margin: 0;
  font-size: clamp(1.375rem, 3vw, 1.875rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.contact-view__subtitle {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: var(--cv-muted);
}

.contact-view__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border-radius: 1rem;
  border: 1px solid var(--cv-border);
  background: rgba(15, 23, 42, 0.72);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 20px 40px rgba(0, 0, 0, 0.28);
}

.contact-view__form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact-view__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.contact-view__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--cv-muted);
}

.contact-view__input,
.contact-view__select,
.contact-view__textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border-radius: 0.625rem;
  border: 1px solid var(--cv-border);
  background: rgba(11, 15, 25, 0.65);
  color: var(--cv-text);
  font-size: 0.875rem;
  line-height: 1.45;
}

.contact-view__input::placeholder,
.contact-view__textarea::placeholder {
  color: rgba(148, 163, 184, 0.72);
}

.contact-view__select option {
  background: #0f172a;
  color: var(--cv-text);
}

.contact-view__textarea {
  min-height: 6rem;
  resize: vertical;
  line-height: 1.5;
}

.contact-view__input:focus,
.contact-view__select:focus,
.contact-view__textarea:focus {
  outline: none;
  border-color: rgba(94, 234, 212, 0.45);
  box-shadow: 0 0 0 3px rgba(94, 234, 212, 0.12);
}

.contact-view__submit {
  margin-top: 0.25rem;
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: linear-gradient(135deg, #2dd4bf 0%, #6366f1 100%);
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.contact-view__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(45, 212, 191, 0.22);
}

.contact-view__submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.contact-view__success {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(94, 234, 212, 0.28);
  background: rgba(15, 118, 110, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--cv-accent);
}

.contact-view__error {
  margin: 0;
  padding: 0.75rem 0.95rem;
  border-radius: 0.625rem;
  border: 1px solid rgba(248, 113, 113, 0.28);
  background: rgba(127, 29, 29, 0.14);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #fca5a5;
}
`;function A(r){const[t,o]=c.useState(()=>r??f());return c.useEffect(()=>{if(r){o(r);return}const i=()=>o(f()),n=l=>{l.key===T&&i()};return window.addEventListener("storage",n),window.addEventListener(b,i),()=>{window.removeEventListener("storage",n),window.removeEventListener(b,i)}},[r]),E(t)}const h=["institutionalLicensing","corporateProcurement","individualCertification","doctoralResearch"];function G({language:r}){const{t}=A(r),[o,i]=c.useState(""),[n,l]=c.useState(""),[m,w]=c.useState(h[0]),[s,x]=c.useState(""),[d,j]=c.useState(""),[N,y]=c.useState(!1),[u,g]=c.useState(!1),[v,_]=c.useState("");c.useEffect(()=>{document.title=t("page_titles.contact")},[t]);const p=o.trim().length>0&&n.trim().length>0&&s.trim().length>0&&d.trim().length>0,S=async a=>{if(a.preventDefault(),!(!p||u)){g(!0),_("");try{await C({institutionName:s.trim(),contactPerson:o.trim(),selectedTier:t(`contact.page.categories.${m}`),domainContext:L(),additionalFields:{email:n.trim(),subject:s.trim(),message:d.trim(),category:m,form_source:"institutional_contact_dispatch"}}),y(!0)}catch{_(t("contact.page.form.error"))}finally{g(!1)}}};return e.jsxs("div",{className:"contact-view",children:[e.jsx("style",{children:z}),e.jsxs("div",{className:"contact-view__inner",children:[e.jsxs("header",{children:[e.jsx("h1",{className:"contact-view__title",children:t("contact.page.title")}),e.jsx("p",{className:"contact-view__subtitle",children:t("contact.page.subtitle")})]}),e.jsx("div",{className:"contact-view__card",children:N?e.jsx("p",{className:"contact-view__success",role:"status",children:t("contact.page.form.success")}):e.jsxs("form",{className:"contact-view__form",onSubmit:S,children:[e.jsxs("div",{className:"contact-view__field",children:[e.jsx("label",{className:"contact-view__label",htmlFor:"contact-name",children:t("contact.page.form.name")}),e.jsx("input",{id:"contact-name",className:"contact-view__input",type:"text",value:o,onChange:a=>i(a.target.value),placeholder:t("forms.fullNamePlaceholder")})]}),e.jsxs("div",{className:"contact-view__field",children:[e.jsx("label",{className:"contact-view__label",htmlFor:"contact-email",children:t("contact.page.form.email")}),e.jsx("input",{id:"contact-email",className:"contact-view__input",type:"email",value:n,onChange:a=>l(a.target.value),placeholder:t("forms.emailPlaceholder")})]}),e.jsxs("div",{className:"contact-view__field",children:[e.jsx("label",{className:"contact-view__label",htmlFor:"contact-category",children:t("contact.page.form.category")}),e.jsx("select",{id:"contact-category",className:"contact-view__select",value:m,onChange:a=>w(a.target.value),children:h.map(a=>e.jsx("option",{value:a,children:t(`contact.page.categories.${a}`)},a))})]}),e.jsxs("div",{className:"contact-view__field",children:[e.jsx("label",{className:"contact-view__label",htmlFor:"contact-subject",children:t("contact.page.form.subject")}),e.jsx("input",{id:"contact-subject",className:"contact-view__input",type:"text",value:s,onChange:a=>x(a.target.value),placeholder:t("contact.page.form.subjectPlaceholder")})]}),e.jsxs("div",{className:"contact-view__field",children:[e.jsx("label",{className:"contact-view__label",htmlFor:"contact-message",children:t("contact.page.form.message")}),e.jsx("textarea",{id:"contact-message",className:"contact-view__textarea",value:d,onChange:a=>j(a.target.value),placeholder:t("contact.page.form.messagePlaceholder")})]}),v?e.jsx("p",{className:"contact-view__error",role:"alert",children:v}):null,e.jsx("button",{type:"submit",className:"contact-view__submit",disabled:!p||u,children:t(u?"contact.page.form.submitting":"contact.page.form.submit")})]})})]})]})}export{G as default};
