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
