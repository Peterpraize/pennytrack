# PennyTrack Technical Reflection

## Current progress

PennyTrack has a defined product scope, a React/Vite application shell, routed dashboard and transaction views, reusable components, financial utilities, localStorage helpers, transaction state management, validation, currency display formatting, and automated test cases. The code is organized so calculations and persistence are separated from page presentation.

## Decisions and trade-offs

- **React + Vite:** provides a small frontend build setup without introducing a backend.
- **localStorage:** keeps the MVP within the 21-hour budget, but data remains tied to the browser and is not backed up or synced.
- **Derived totals:** income, expenses, balance, and category totals are calculated from transaction records, avoiding duplicated state that can drift.
- **Display-only currency selector:** keeps formatting flexible without suggesting that exchange rates or actual conversion are handled.
- **Guarded storage writes:** avoids falsely showing a saved transaction when browser storage rejects a write and avoids silently replacing malformed saved transaction data.

## Challenges and limitations

The current execution environment could not resolve `registry.npmjs.org` (`EAI_AGAIN`), so dependencies could not be installed. Consequently, automated tests and the production build have not been executed in this environment. Deployment and public repository publication also remain outstanding. These are verification and delivery blockers, not evidence that the app has passed its checks.

## Next improvements

1. Run `npm install`, `npm test`, and `npm run build` in a network-enabled environment.
2. Fix any test or build failures and rerun the complete suite.
3. Manually verify direct route refresh, keyboard navigation, and responsive behavior.
4. Deploy the app with SPA fallback, then record a walkthrough and prepare the required presentation/evidence.
5. Incorporate genuine mentor or peer feedback into `docs/issue-log.md`.
