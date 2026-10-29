# JanSeva Sahayak (जनसेवा सहायक)

JanSeva Sahayak is a bilingual prototype for reviewing Bihar RTPS income-certificate applications. It gives an officer a prioritized queue, document checks, review assistance, and a place to record a decision. It uses fictional sample records only and is not connected to a government production system.

**Live demo:** [assig-nine.vercel.app](https://assig-nine.vercel.app/)

## The problem

Revenue officers review applications and supporting documents before an income certificate can be issued. When a required document is missing or a declared detail needs another check, the officer must identify the issue and decide what should happen next. This prototype brings the queue, document findings, and decision controls together so an officer can see which applications need attention first.

## Who it is for

- **Revenue and circle officers** who review income-certificate applications.
- **Applicants** who may face delays or repeat visits when an application needs correction or additional evidence.

The records shown in this demo are fictional and must not be interpreted as real citizen information.

## What the app does

- Shows pending applications with priority and status indicators.
- Opens an application review with its declared details and supplied documents.
- Runs deterministic document and consistency checks, then presents a Hindi and English summary, missing evidence, findings, and a suggested next step.
- Lets the officer approve, reject, or return an application with a reason. Returning an application requires correction items; approval is blocked when required documents are missing.
- Records a decision audit event and displays application history.
- Adapts to mobile screens and includes a Hindi/English language toggle.

The AI assistance is advisory. The officer makes the final decision. Missing evidence is flagged for review or correction; it is not treated as proof that an applicant is ineligible.

## Main technical decisions

- **Next.js App Router and TypeScript:** pages and server-side API route handlers live in `app/`; domain logic is kept in focused modules under `lib/`.
- **Deterministic checks and validated decisions:** document checks and decision rules are explicit. Zod validates decision requests, and the AI suggestion does not perform the decision.
- **Optional AI provider:** when `GROQ_API_KEY` is configured, the server can request a Groq review. Without a key, the app uses a deterministic, rule-grounded summary so the demo works without external AI credentials.
- **Optional Neon PostgreSQL:** set `DATABASE_URL` to enable database-backed reads, decisions, and audit history. Without it, the app uses the built-in fictional sample data; changes are not durably stored.
- **No real authentication:** the sign-in screen is a demo gate only. It does not verify a username or password and must not be used to protect real data.

## Run locally

Requirements: Node.js and npm.

```bash
git clone https://github.com/SUNNYKUMAR1232/assig.git
cd assig
npm install
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`. The built-in demo works without a database or AI key.

To configure optional services, copy `.env.example` to `.env.local` and set values there:

```dotenv
DATABASE_URL=
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b
```

For database-backed use, provide a Neon-compatible PostgreSQL connection string in `DATABASE_URL`. On a new, empty demo database, initialize the schema and fictional records with:

```bash
node scripts/init-db.mjs
```

Set `GROQ_API_KEY` to enable provider-backed AI assistance. Keep credentials server-side; do not use real citizen data with this prototype.

Useful project commands:

```bash
npm run check
npm test
npm run build
```

## Demo sign-in

The sign-in form is prefilled with `rajesh.kumar` and `password123`. Any non-empty values will proceed because authentication is not implemented in this prototype.

## Limitations and data safety

- All applicant records are fictional.
- The prototype does not issue or sign certificates and does not connect to official government systems.
- Demo checks are illustrative and are not a substitute for current official rules or an officer's review.
- Authentication and authorization are not implemented. Database persistence is optional; without `DATABASE_URL`, data changes are not durable.

## Project structure

```text
app/                  Next.js pages and API route handlers
components/           Dashboard, application, and review UI
lib/                  Application, validation, AI, rules, decisions, and audit modules
data/                 Fictional demo records
scripts/              Optional database initialization and demo seeding
tests/                Verification and decision workflow tests
```

Process references: [Bihar RTPS portal](https://serviceonline.bihar.gov.in/) and [published action-process diagram](https://serviceonline.bihar.gov.in/resources/homePage/10/Document/GAD_action_diagram.pdf).
