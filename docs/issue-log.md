# PennyTrack Issue Log

This log records implementation and delivery issues observed during the build. It does not claim mentor feedback that has not been received.

| ID | Issue / observation | Priority | Action or decision | Status |
|---|---|---|---|---|
| PT-01 | The workspace did not contain an existing PennyTrack Git checkout. | Medium | Created a new local repository on `build/pennytrack`; public GitHub publication is left for a confirmed publishing step. | Local repo created; publication pending |
| PT-02 | npm registry DNS resolution failed with `EAI_AGAIN`, preventing dependency installation. | High | Kept package scripts and dependencies documented; full automated test/build verification must run in an environment with registry access. | Blocked by environment |
| PT-03 | Malformed JSON in localStorage could crash the UI or be overwritten on the next save. | High | Added guarded storage reads and a rule that blocks transaction writes when stored transaction data is malformed/unexpected. | Implemented; tests authored, not executed here |
| PT-04 | A localStorage write can fail because storage is unavailable or quota is exceeded. | High | Transaction state is only updated after a successful storage write; failures produce a visible status message. | Implemented; tests authored, not executed here |
| PT-05 | Currency selector could be mistaken for currency conversion. | Medium | README and design specification explicitly state the selector changes display formatting only. | Documented |
| PT-06 | A deployed SPA can return a server 404 when a user refreshes `/transactions`. | Medium | README calls out the required host fallback/rewrite and manual direct-route verification. | Pending deployment verification |
| PT-07 | Responsive and keyboard behavior cannot be confirmed by source inspection alone. | Medium | Added responsive styles and focus-visible rules; mobile, desktop, and keyboard checks remain on the final evidence checklist. | Pending manual verification |
