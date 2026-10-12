# PennyTrack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy PennyTrack, a responsive personal finance tracker that lets one local user record income and expenses, review totals, search and filter transactions, and retain data in browser storage.

**Architecture:** Build a React + Vite single-page application with React Router, reusable UI components, a `useTransactions` state/persistence hook, and pure finance utilities. Keep transaction records as the source of truth, derive totals from those records, and store transactions and display-currency preferences in `localStorage`.

**Tech Stack:** React, Vite, JavaScript, React Router, Vitest, React Testing Library, browser `localStorage`, GitHub, and a static hosting provider.

**Spec:** `PennyTrack_Design_Specification.docx` (approved design specification).

## Global Constraints

- Build a frontend-only, single-local-user application; do not add authentication, a backend, cloud sync, bank integrations, payment processing, or complex charts.
- Use React + Vite and React Router.
- Persist transactions with the `pennytrack_transactions` key and settings with the `pennytrack_settings` key.
- Store each transaction amount as a positive number and use `type: "income"` or `type: "expense"` to determine its meaning.
- Use fixed transaction categories and generate unique transaction IDs automatically.
- The display-currency selector changes formatting only; it does not convert transaction values.
- Calculate income, expenses, and balance from transaction records; do not persist duplicate totals.
- Provide dashboard (`/`), transactions (`/transactions`), and a not-found (`*`) route.
- Provide responsive, keyboard-accessible UI; visible labels; validation and understandable empty, no-results, and error states.
- Do not claim a save succeeded if browser storage is unavailable or a write fails.
- Include at least three automated tests, a public repository, deployment, README, walkthrough video, technical reflection, AI-use declaration, and a five-minute presentation/evidence required by the BuildLab guide.
- Budget the implementation for approximately 21 hours total, averaging one hour per day across three weeks.

## Review Focus

- Malformed or unexpected saved JSON must not crash the app or silently overwrite potentially recoverable data; add a storage parsing test.
- Browser storage may be unavailable or full; add a test that the UI reports a save failure rather than falsely confirming success.
- Empty transactions and searches with no matches must show distinct helpful states; add a component test for each.
- Direct navigation or refresh at `/transactions` must render the correct page on the deployed host; verify manually after deployment.
- Currency preference changes must not mutate underlying transaction amounts; add a utility or component test for unchanged values after a currency change.

---

## File Structure

Create the following focused files as the implementation proceeds:

- `src/main.jsx` — React entry point and root render.
- `src/app/App.jsx` — route declarations.
- `src/app/AppLayout.jsx` — shared page shell, header/navigation, currency selector.
- `src/pages/DashboardPage.jsx` — summary and recent-transaction dashboard.
- `src/pages/TransactionsPage.jsx` — transaction list and search/filter controls.
- `src/pages/NotFoundPage.jsx` — unknown-route page.
- `src/components/SummaryCard.jsx` — one financial summary card.
- `src/components/TransactionForm.jsx` — create/edit transaction form and inline validation.
- `src/components/TransactionList.jsx` — list wrapper, empty state and no-results state.
- `src/components/TransactionItem.jsx` — one transaction and edit/delete actions.
- `src/components/EmptyState.jsx` — reusable empty-state presentation where the same behavior is shared.
- `src/hooks/useTransactions.js` — transaction state, localStorage hydration, create/update/delete, persistence status.
- `src/utils/financeUtils.js` — pure totals, filtering and ID helpers.
- `src/utils/storage.js` — guarded storage read/write helpers.
- `src/utils/formatCurrency.js` — display formatting without conversion.
- `src/test/setup.js` — test setup.
- `src/utils/financeUtils.test.js` — pure utility tests.
- `src/hooks/useTransactions.test.jsx` — persistence and storage-failure tests.
- `src/components/TransactionForm.test.jsx` — form validation tests.
- `src/components/TransactionList.test.jsx` — empty and no-results state tests.
- `docs/README-evidence-checklist.md` — final submission/evidence checklist.
- `docs/issue-log.md` — mentor feedback and issue log with at least five entries.
- `docs/technical-reflection.md` — final technical reflection.
- `docs/ai-use-declaration.md` — transparent declaration of AI assistance.
- `README.md` — setup, features, tests, deployment, limitations and live URL.

---

## Task 1: Establish the repository and Vite app

**Time target:** 1.5 hours

**Files:** Create project scaffold; create or update `README.md`.

**Interfaces:**
- Produces a runnable React + Vite application and a public Git repository.
- Later tasks use the standard Vite `dev`, `build`, and `test` scripts.

- [ ] **Step 1: Create the public repository** named `pennytrack` (or a clearly equivalent name) and clone it locally.
- [ ] **Step 2: Scaffold React + Vite** in the repository and confirm the initial app starts.
- [ ] **Step 3: Add React Router, Vitest, React Testing Library, and the DOM testing environment** as development/runtime dependencies where appropriate.
- [ ] **Step 4: Add scripts** for `dev`, `build`, `preview`, and `test` in `package.json`.
- [ ] **Step 5: Add a README starter** describing PennyTrack, its scope, setup commands, and current status.
- [ ] **Step 6: Verify the scaffold.** Run `npm run dev` and `npm run build`; expected: the app opens locally and the production build exits successfully.
- [ ] **Step 7: Commit** with message `chore: scaffold PennyTrack React app`.

## Task 2: Build the shared layout and route skeleton

**Time target:** 1.5 hours

**Files:** `src/main.jsx`, `src/app/App.jsx`, `src/app/AppLayout.jsx`, `src/pages/DashboardPage.jsx`, `src/pages/TransactionsPage.jsx`, `src/pages/NotFoundPage.jsx`.

**Interfaces:**
- `App` declares `/`, `/transactions`, and `*`.
- `AppLayout` renders shared header/navigation and an outlet for page content.
- Page components export a default React component.

- [ ] **Step 1: Write route smoke tests** for dashboard, transactions, and unknown routes.
- [ ] **Step 2: Run the tests** and confirm they fail because the routes/pages do not exist yet.
- [ ] **Step 3: Implement the app entry and routes** with React Router.
- [ ] **Step 4: Implement the shared layout** with a clear PennyTrack title and keyboard-accessible navigation links.
- [ ] **Step 5: Add simple page headings and a useful not-found message** with a link back to the dashboard.
- [ ] **Step 6: Run route tests and `npm run build`.** Expected: all three route states render and build succeeds.
- [ ] **Step 7: Commit** with message `feat: add PennyTrack routes and layout`.

## Task 3: Implement and test financial utilities

**Time target:** 1 hour

**Files:** `src/utils/financeUtils.js`, `src/utils/financeUtils.test.js`.

**Interfaces:**
- `calculateTotals(transactions) -> { income, expenses, balance }`.
- `filterTransactions(transactions, filters) -> transaction[]`.
- `generateTransactionId() -> string`.

- [ ] **Step 1: Write the failing totals test** using an income transaction of `100000` and an expense transaction of `25000`; assert `{ income: 100000, expenses: 25000, balance: 75000 }`.
- [ ] **Step 2: Run the targeted test** and confirm it fails before implementation.
- [ ] **Step 3: Implement `calculateTotals`** using transaction `type` and positive `amount` values.
- [ ] **Step 4: Write and run filtering tests** for description search, type, and category; include combined filters.
- [ ] **Step 5: Implement `filterTransactions`** as a pure function that does not mutate the source array.
- [ ] **Step 6: Implement `generateTransactionId`** using `crypto.randomUUID()` when available with a safe unique fallback.
- [ ] **Step 7: Run `npm test -- --run src/utils/financeUtils.test.js`.** Expected: all utility tests pass.
- [ ] **Step 8: Commit** with message `feat: add tested finance utilities`.

## Task 4: Add safe localStorage helpers and transaction state

**Time target:** 2 hours

**Files:** `src/utils/storage.js`, `src/hooks/useTransactions.js`, `src/hooks/useTransactions.test.jsx`.

**Interfaces:**
- `readStoredValue(key, fallback)` returns parsed stored data or a safe result indicating fallback/recovery is needed.
- `writeStoredValue(key, value)` returns an explicit success/failure result.
- `useTransactions()` exposes `transactions`, `createTransaction`, `updateTransaction`, `deleteTransaction`, and a storage/error status.

- [ ] **Step 1: Write failing tests** for restoring valid saved transactions and handling malformed JSON.
- [ ] **Step 2: Run the targeted tests** and confirm they fail before implementation.
- [ ] **Step 3: Implement guarded storage reads** with `try/catch`; do not crash on malformed JSON or inaccessible storage.
- [ ] **Step 4: Add a test** where `localStorage.setItem` throws; assert the write reports failure.
- [ ] **Step 5: Implement guarded storage writes** that return success/failure without claiming success after an exception.
- [ ] **Step 6: Implement `useTransactions`** with create/update/delete operations, positive finite amounts, generated IDs, and persistence status.
- [ ] **Step 7: Add tests** for create, edit, delete, and storage write failure.
- [ ] **Step 8: Run `npm test -- --run src/hooks/useTransactions.test.jsx`.** Expected: hydration, CRUD, malformed data, and write-failure tests pass.
- [ ] **Step 9: Commit** with message `feat: persist transaction state safely`.

## Task 5: Build transaction creation and editing

**Time target:** 2 hours

**Files:** `src/components/TransactionForm.jsx`, `src/components/TransactionForm.test.jsx`, `src/components/TransactionItem.jsx`.

**Interfaces:**
- `TransactionForm` receives `initialTransaction`, `onSubmit(transactionFields)`, and `onCancel`.
- Form fields: description, positive amount, type, category, and date.
- `TransactionItem` receives a transaction plus edit/delete callbacks.

- [ ] **Step 1: Write failing form tests** asserting blank description, missing category/date, non-numeric amount, zero, and negative amount are rejected.
- [ ] **Step 2: Run the tests** and confirm the expected validation failures.
- [ ] **Step 3: Implement a labeled, keyboard-accessible form** with inline error text and a positive finite amount check.
- [ ] **Step 4: Add tests** that valid input submits the expected fields and edit mode pre-fills existing values.
- [ ] **Step 5: Implement create/edit submission behavior** and cancel behavior.
- [ ] **Step 6: Implement transaction item actions** with accessible button labels and a confirmation step before deletion.
- [ ] **Step 7: Run the form tests.** Expected: invalid inputs are blocked and valid create/edit submissions work.
- [ ] **Step 8: Commit** with message `feat: add transaction create and edit form`.

## Task 6: Implement currency formatting and settings

**Time target:** 1 hour

**Files:** `src/utils/formatCurrency.js`, `src/app/AppLayout.jsx`, `src/utils/formatCurrency.test.js`.

**Interfaces:**
- `formatCurrency(amount, currencyCode) -> string`.
- Settings use `pennytrack_settings`; currency selection updates formatting only.

- [ ] **Step 1: Write failing formatting tests** for the default currency and a second selectable currency.
- [ ] **Step 2: Implement formatting with `Intl.NumberFormat`** and a documented default currency.
- [ ] **Step 3: Add a labeled currency selector** to the shared header and persist the selected currency setting.
- [ ] **Step 4: Test that changing the currency does not alter transaction amounts.**
- [ ] **Step 5: Run formatting tests and the production build.** Expected: formatting updates and stored numeric amounts remain unchanged.
- [ ] **Step 6: Commit** with message `feat: add display currency preference`.

## Task 7: Build the dashboard and summary cards

**Time target:** 2 hours

**Files:** `src/pages/DashboardPage.jsx`, `src/components/SummaryCard.jsx`, `src/components/TransactionList.jsx`, `src/components/EmptyState.jsx`.

**Interfaces:**
- Dashboard consumes `useTransactions`, `calculateTotals`, and `formatCurrency`.
- `SummaryCard` receives a title, formatted value, and accessible context.
- `TransactionList` receives transactions and edit/delete callbacks.

- [ ] **Step 1: Write failing dashboard tests** for income, expenses, and balance display using the known 100000/25000 fixture.
- [ ] **Step 2: Implement three summary cards** and a recent-transactions section.
- [ ] **Step 3: Add an empty-state test** for a new user with no transactions.
- [ ] **Step 4: Implement the helpful empty state** with a clear action to add the first transaction.
- [ ] **Step 5: Connect the transaction form and list** to the transaction hook.
- [ ] **Step 6: Run dashboard tests and `npm run build`.** Expected: summary values, recent items, and empty state work.
- [ ] **Step 7: Commit** with message `feat: build finance dashboard`.

## Task 8: Build the transactions page, search, and filters

**Time target:** 2 hours

**Files:** `src/pages/TransactionsPage.jsx`, `src/components/TransactionList.jsx`, `src/components/TransactionItem.jsx`, related tests.

**Interfaces:**
- `TransactionsPage` reads transactions from `useTransactions` and derives visible records with `filterTransactions`.
- Search supports description; filters support type and category.

- [ ] **Step 1: Write failing tests** for description search, income/expense filters, category filter, and combined filters.
- [ ] **Step 2: Implement search and filter controls** with visible labels and an obvious way to clear filters.
- [ ] **Step 3: Add a no-results test** that distinguishes no matching search results from an account with no transactions.
- [ ] **Step 4: Implement the no-results state** with a clear-filters action.
- [ ] **Step 5: Add edit/delete interactions** to transaction rows and confirm changes update the dashboard.
- [ ] **Step 6: Run related tests and `npm run build`.** Expected: filters combine correctly and CRUD updates both routes.
- [ ] **Step 7: Commit** with message `feat: add transaction search and filters`.

## Task 9: Responsive design, accessibility, and feedback-driven refinement

**Time target:** 2 hours

**Files:** shared layout, pages, components, CSS files, `docs/issue-log.md`.

**Interfaces:**
- Shared styling remains consistent across both routes.
- Issue log contains at least five entries, each with observed issue, severity/priority, fix or decision, and status.

- [ ] **Step 1: Create `docs/issue-log.md`** and add the five real issues found during implementation or mentor/peer feedback; do not invent feedback that was not received.
- [ ] **Step 2: Inspect at narrow, medium, and wide viewport sizes** and record layout defects.
- [ ] **Step 3: Fix responsive layout issues** so cards, forms, filters, and lists fit small screens without horizontal overflow.
- [ ] **Step 4: Audit keyboard navigation, visible focus, labels, headings, contrast, and accessible action names.**
- [ ] **Step 5: Add or improve semantic markup and focus styles** for every issue found.
- [ ] **Step 6: Run the complete test suite and production build.** Expected: no failing tests and no build errors.
- [ ] **Step 7: Commit** with message `fix: improve responsive and accessible interactions`.

## Task 10: Deployment and end-to-end verification

**Time target:** 1.5 hours

**Files:** host configuration if required, `README.md`.

**Interfaces:**
- Public deployment serves the application over HTTPS.
- Direct requests to `/transactions` fall back to the app entry point.

- [ ] **Step 1: Deploy the app** to the chosen static hosting provider and record the live URL.
- [ ] **Step 2: Configure SPA fallback/rewrite** so direct navigation to `/transactions` and unknown routes loads the React app.
- [ ] **Step 3: Manually verify** dashboard, create/edit/delete, search/filter, currency preference, refresh persistence, empty state, invalid form, and not-found route.
- [ ] **Step 4: Test storage failure behavior** by simulating a write exception; confirm the UI does not falsely report a successful save.
- [ ] **Step 5: Test keyboard-only navigation** and inspect mobile and desktop layouts.
- [ ] **Step 6: Update README** with live URL, stack, features, setup, test command, deployment notes, limitations, and screenshots/evidence links.
- [ ] **Step 7: Commit** with message `docs: document deployment and usage`.

## Task 11: Tests, reflection, AI declaration, and final evidence

**Time target:** 1.5 hours

**Files:** `README.md`, `docs/technical-reflection.md`, `docs/ai-use-declaration.md`, `docs/README-evidence-checklist.md`.

- [ ] **Step 1: Run the full automated suite** using `npm test -- --run`; expected: all tests pass.
- [ ] **Step 2: Confirm at least three automated tests** cover totals, invalid amount rejection, and localStorage restoration; retain the additional edge-case tests written in earlier tasks.
- [ ] **Step 3: Write `docs/technical-reflection.md`** describing architecture choices, what went well, difficulties, limitations, feedback addressed, and what would be improved next.
- [ ] **Step 4: Write `docs/ai-use-declaration.md`** accurately identifying how AI assistance was used and what was independently reviewed/tested.
- [ ] **Step 5: Complete `docs/README-evidence-checklist.md`** with links or file locations for public repo, deployment, screenshots, five-minute presentation, walkthrough video, issue log, tests, reflection, and AI declaration.
- [ ] **Step 6: Record the walkthrough video** and prepare the five-minute presentation.
- [ ] **Step 7: Perform a final clean-checkout review**: install dependencies, run tests, build, and confirm the README instructions are sufficient.
- [ ] **Step 8: Commit** with message `docs: complete BuildLab submission evidence`.

---

## Suggested 21-Day Cadence

- **Days 1–2:** Task 1 — repository, scaffold, scripts, README starter.
- **Days 3–4:** Task 2 — routes and shared layout.
- **Day 5:** Task 3 — calculations, filters, ID utility.
- **Days 6–7:** Task 4 — safe persistence and transaction state.
- **Days 8–9:** Task 5 — form validation and CRUD controls.
- **Day 10:** Task 6 — currency formatting and preference.
- **Days 11–12:** Task 7 — dashboard and summary cards.
- **Days 13–14:** Task 8 — transaction page, search, filters.
- **Days 15–16:** Task 9 — feedback log, responsive and accessibility refinement.
- **Days 17–18:** Task 10 — deploy and verify direct routes.
- **Days 19–20:** Task 11 — final tests, README, reflection, AI declaration, video and evidence.
- **Day 21:** Buffer for mentor/peer feedback, fixes, and final submission check.

This is a proposed cadence, not an official BuildLab deadline calendar. Follow any official dates provided by BuildLab.

## Completion Checklist

- [ ] Public repository exists and README setup instructions work.
- [ ] Dashboard and transactions routes work; unknown routes show a not-found page.
- [ ] Income, expenses, and balance are derived correctly from transactions.
- [ ] Create, edit, delete, search, and filters work.
- [ ] Transactions and currency preference persist in localStorage.
- [ ] Invalid data, malformed storage, and storage-write failures do not crash the app or produce false success messages.
- [ ] Empty state and no-results state are distinct and useful.
- [ ] Responsive layout and keyboard accessibility have been checked.
- [ ] Three or more automated tests pass.
- [ ] Deployment works, including direct navigation to `/transactions`.
- [ ] README, issue log (5+ genuine entries), walkthrough video, technical reflection, AI-use declaration, and presentation/evidence are ready.
