# PennyTrack Design Specification

**Status:** Approved by the user on 12 October 2026  
**Purpose:** Define the smallest useful, testable PennyTrack application that satisfies the BuildLab Stage 1 workflow within one focused hour per day for 21 days.

## Product overview

PennyTrack is a responsive, browser-based personal finance tracker that helps one local user record income and expenses, view a running balance, and review spending through simple summaries.

### Success criteria
- Users can add, edit, and delete transactions.
- Income, expenses, balance, and category summaries are derived correctly from transaction records.
- Users can search and filter transactions by description, type, and category.
- Data persists after refresh in the same browser when localStorage is available.
- `/`, `/transactions`, and unknown routes render correctly, including direct route access on the deployed host.
- The interface is responsive, keyboard-usable, and provides clear validation, empty, no-results, and storage-error states.
- At least three automated tests pass; README, public repository, deployment, walkthrough video, technical reflection, AI-use declaration, and presentation/evidence are prepared.

## Scope

Included: dashboard, income/expense/balance summary, recent transactions, category summary, create/edit/delete transactions, history search and filters, fixed categories, selectable display currency, localStorage persistence, light responsive visual style, accessible navigation/forms, two primary routes, not-found route, and tests.

Out of scope: backend, authentication, cloud sync, bank integrations, payment processing, foreign-exchange conversion, complex charts, and custom categories.

## Architecture

React + Vite single-page application; React Router for navigation; reusable components; `useTransactions` hook for state and persistence; pure utilities for calculations/filtering; `localStorage` for browser-specific persistence.

Suggested folders:

```text
src/
  app/          # App shell and routes
  components/   # Shared UI components
  pages/        # DashboardPage, TransactionsPage, NotFoundPage
  hooks/        # useTransactions and persistence
  utils/        # financeUtils, formatting and calculations
  test/         # Automated tests
docs/           # Brief, issue log, reflection and design notes
```

Components: `App`, `AppLayout`, `DashboardPage`, `SummaryCard`, `TransactionsPage`, `TransactionList`, `TransactionItem`, `TransactionForm`, `EmptyState`, `NotFoundPage`, `useTransactions`, and finance/storage/formatting utilities.

## Transaction model and persistence

```js
{
  id: "generated-unique-id",
  description: "Monthly salary",
  amount: 250000,
  type: "income",
  category: "Salary",
  date: "2026-10-12"
}
```

`amount` is a finite positive number; `type` is `income` or `expense`; `date` uses `YYYY-MM-DD`; IDs are generated. Categories are fixed (for example Salary, Food, Transport, Education, Bills, Other). Storage keys: `pennytrack_transactions` and `pennytrack_settings`. Currency selection changes display formatting only, not stored values. Browser storage is not cloud backup.

Income is the sum of income amounts; expenses are the sum of expense amounts; balance is income minus expenses. Derive totals rather than storing them separately.

## Routing

- `/` → dashboard with summaries, recent transactions, and category summary.
- `/transactions` → transaction history, search/filter, create/edit/delete.
- `*` → not-found page with a link to the dashboard.

The shared header contains navigation and the currency selector. Hosting must rewrite client-side routes to the app entry point.

## Validation, errors, and recovery

- Empty description, invalid/zero/negative amount, missing category, or invalid date: show inline validation and do not save.
- No transactions: show a first-transaction prompt.
- No search matches: show a distinct no-results state and a clear-filters action.
- Malformed stored JSON: do not crash or silently overwrite the original before recovery is considered.
- Storage unavailable/full: communicate that the save did not persist; never falsely confirm success.
- Unknown route: render the not-found page.

## Accessibility and responsive behavior

Use semantic landmarks, associated form labels, keyboard-operable navigation/controls, visible focus indicators, readable contrast, accessible action names, and do not rely on color alone to distinguish income and expense. Verify mobile and desktop layouts without horizontal overflow.

## Testing

Use Vitest and React Testing Library. Core tests: (1) 100,000 income and 25,000 expense produce a 75,000 balance; (2) invalid/zero amount is rejected; (3) a saved transaction is restored from localStorage. Add tests for filtering, malformed storage, storage write failure, CRUD, empty/no-results states, and currency display behavior. Manually verify direct navigation, refresh, keyboard navigation, and responsive layouts.

## Time budget and definition of done

Proposed cadence: 21 days at one hour per day; official BuildLab dates take precedence. Done means CRUD, calculations, search/filter, persistence, routes, validation and error handling, accessibility/responsive checks, at least three passing automated tests, deployment, README, issue log with at least five genuine entries, walkthrough, reflection, AI-use declaration, and presentation/evidence are ready.

## Decisions

- App name: PennyTrack.
- Stack: React + Vite, React Router, localStorage, Vitest, React Testing Library.
- Visual style: light and responsive.
- Currency: selectable display formatting only; no conversion.
- IDs: generated automatically.
- Categories: fixed predefined list.
- One local user; no backend or cloud sync.
