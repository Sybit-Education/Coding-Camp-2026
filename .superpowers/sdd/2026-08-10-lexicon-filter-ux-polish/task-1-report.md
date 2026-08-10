Task 1 implementation completed for the Lexikon Filter Toolbar UX polish.

Files changed:
- `src/views/LexiconListView.vue`
- `src/views/LexiconListView.spec.ts`

Commit:
- `b85cf0d` (`feat: polish lexicon filter ux`)

Commands run:
- `npm run test:unit -- src/views/LexiconListView.spec.ts` — failed first as expected, then passed after implementation.
- `npm run lint` — passed.

Deviations from plan:
- None reported.

## Fix round 1

Commands run:
- `npm run test:unit -- src/views/LexiconListView.spec.ts` — passed.
- `npm run lint` — passed.

Fix applied:
- Scoped the empty-state reset lookup to `section[aria-label="Lexikoneinträge"]` so the test targets the empty-state button instead of the toolbar button.
