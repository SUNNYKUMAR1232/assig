# जनसेवा सहायक

जनसेवा सहायक बिहार RTPS आय प्रमाण-पत्र प्रक्रिया के लिए Next.js + TypeScript modular-monolith demo है। यह केवल fictional records का उपयोग करता है और किसी सरकारी production system से जुड़ा नहीं है।

## चलाना

```bash
npm install
npm run dev
```

फिर terminal में दिखाया गया local URL खोलें। JavaScript syntax check के लिए:

```bash
npm run check
npm test
```

## Demo में क्या शामिल है

- आवेदन queue और priority/status संकेत
- fictional applicant का review drawer
- documents और deterministic verification findings
- Hindi AI-assistance summary, जो केवल उपलब्ध facts समझाती है
- decision buttons, जिनमें missing reason/validation को स्पष्ट किया गया है
- audit history और responsive mobile layout
- server-side route handlers for applications, verification, AI review, decisions, stats, and audit history
- explicit decision validation and audit event creation
- deterministic rules separated from AI explanations

यह prototype final certificate signing या issuance नहीं करता। Missing evidence को ineligibility नहीं माना गया है। AI module demo rule-grounded output देता है; production में server-side authentication, officer authorization, persistent audit storage, configured official rules और AI credentials को environment variables में रखना आवश्यक होगा।

## Project structure

```text
app/                  Next.js pages and API route handlers
components/           Dashboard, application, and review UI
lib/                  Application, validation, AI, rules, decisions, and audit modules
data/                 Fictional demo records
tests/                Verification and decision workflow tests
```

प्रक्रिया संदर्भ: [Bihar RTPS portal](https://serviceonline.bihar.gov.in/) और [published action-process diagram](https://serviceonline.bihar.gov.in/resources/homePage/10/Document/GAD_action_diagram.pdf)।
