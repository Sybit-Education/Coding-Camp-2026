Implemented Task 1 for the Lexikon overview: added a Mettnau-Highlights toggle chip, extended list filtering with `isProtected === true`, and showed the empty-state message when no entries remain.

Files changed:
- `src/views/LexiconListView.vue`
- `src/views/LexiconListView.spec.ts`

What I tested:
- `npx vitest run .worktrees/lexicon-mettnau-highlight-filter/src/views/LexiconListView.spec.ts`

TDD evidence:
- RED: the new spec initially failed because the chip/empty state did not exist yet.
- GREEN: not achieved; the focused Vitest run still fails in this checkout due a Lucide render-time `useLucideProps(...)` error from the existing test/runtime setup.

Self-review:
- Completeness: the requested UI/filter behavior is implemented.
- Quality: kept the filter logic minimal and matched the explicit boolean highlight check.
- Discipline: no extra service/type changes.
- Testing: the spec file is present, but the run is not clean because of the Lucide issue.

Issues/concerns:
- The current Vitest environment in this checkout still resolves Lucide internals during mount, causing the spec to fail before assertions.

## Fix report

Changed to match the review findings:
- restored Lucide icons in `src/views/LexiconListView.vue`
- switched the spec back from `shallowMount` to `mount`
- removed the unnecessary Lucide mocks from the spec
- mocked the labels store with `Vögel` and `Pflanzen`

Tests run:
- `npx vitest run src/views/LexiconListView.spec.ts`
- `npm run test:unit`

Results:
- both commands passed
