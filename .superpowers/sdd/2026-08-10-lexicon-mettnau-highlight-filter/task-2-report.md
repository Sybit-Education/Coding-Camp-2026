Task 2 verification completed for the Lexicon Mettnau-Highlight Filter.

Checks run:
- `npm run test:unit` ✅
- `npm run type-check` ✅
- `npm run lint` ✅
- `npm run build-only` ✅

Fix made during verification:
- `src/views/LexiconListView.spec.ts`: added explicit Vitest type parameters to the mocked service functions so `oxlint` passes.

Failing output that triggered the fix:
- `src/views/LexiconListView.spec.ts:48:29: error vitest(require-mock-type-parameters): Missing type parameters on mock function call`
- `src/views/LexiconListView.spec.ts:49:28: error vitest(require-mock-type-parameters): Missing type parameters on mock function call`

Final state:
- Verification is clean.
- No source behavior changes were needed beyond the spec typing fix.

Smoke test (Step 5) — performed 2026-08-10 via agent-browser + Chromium against the live PocketBase backend:
- Chip "Mettnau-Highlights" renders on `/lexicon`; green leaf badges visible on protected entries.
- Chip active → exactly the 6 `isProtected` entries remain.
- Chip inactive → full list (86 entries) returns.
- Chip + search "Mehl" → only Mehl-Primel (AND).
- Chip + search "Amsel" → "Keine Einträge gefunden." (empty state).
- Chip + label "Vogel" → "Keine Einträge gefunden." (AND; all protected entries are plants).
- Chip + label "Pflanze" → all 6 protected entries (AND).
- No console errors observed.
