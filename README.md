# PennyTrack

PennyTrack is a responsive personal finance tracker for recording income and expenses, reviewing a balance, and searching transaction history. It is a frontend-only BuildLab Stage 1 project built with React and Vite.

> **Project status:** The application source and tests have been authored locally. Automated tests, production build, deployment, and public GitHub publication still need to be verified. This environment could not reach the npm registry (`EAI_AGAIN`), so dependencies could not be installed here.

## Features

- Dashboard with income, expenses, available balance, recent activity, and top expense categories.
- Create, edit, and delete transactions.
- Search by description and filter by type/category.
- Fixed categories and automatic transaction IDs.
- Browser `localStorage` persistence for transactions and display-currency preference.
- Currency formatting selector (display formatting only; it does not convert values).
- Responsive light interface, keyboard-visible focus styles, form validation, empty/no-results states, and storage-error messaging.
- Routes: `/`, `/transactions`, and a not-found page.

## Tech stack

React, Vite, React Router, Vitest, React Testing Library, and browser `localStorage`.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```bash
npm test
npm run build
npm run preview
```

The tests cover financial calculations, search/filter logic, category totals, currency formatting, invalid form input, route rendering, localStorage restoration, malformed saved data, storage write failures, and transaction CRUD. Run the commands locally after installing dependencies; passing results have not yet been confirmed in this restricted environment.

## Persistence and privacy

PennyTrack stores records only in the current browser's `localStorage`. Data is not synced to a server or another device. Clearing browser data may remove saved records. Currency selection changes how numbers are displayed; it does not convert or update the underlying transaction amounts. All records are assumed to use the same currency basis.

If saved transaction JSON is malformed or has an unexpected structure, PennyTrack avoids overwriting it automatically. If storage writes fail, it does not apply the requested transaction change and reports the failure.

## Deployment

Deployment URL: **Not deployed yet.**

For a static host, build with `npm run build` and publish the generated `dist/` directory. Configure single-page-app fallback/rewrite behavior so direct navigation and refresh at `/transactions` serve `index.html`.

## BuildLab evidence

- Design specification: `docs/superpowers/specs/2026-10-12-pennytrack-design.md`
- Implementation plan: `docs/superpowers/plans/2026-10-12-pennytrack.md`
- Issue log: `docs/issue-log.md`
- Technical reflection: `docs/technical-reflection.md`
- AI-use declaration: `docs/ai-use-declaration.md`
- Evidence checklist: `docs/README-evidence-checklist.md`

Public repository, deployed URL, screenshots, walkthrough video, and five-minute presentation remain to be added before final submission.
