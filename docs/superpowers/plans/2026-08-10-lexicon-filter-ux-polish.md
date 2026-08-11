# Lexikon Filter UX Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Lexikon filter UX so search, label filtering, and the Mettnau highlight toggle are clearer, more responsive, and easier to reset.

**Architecture:** Keep the existing single-view implementation in `LexiconListView.vue`. Add small computed helpers and one reset method around the existing `filteredEntries` data flow; do not introduce new global components or services.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Tailwind utility classes, Vitest, Vue Test Utils, Pinia.

## Global Constraints

- Preserve current AND semantics between search, label filter, and highlight filter.
- Do not change backend queries, PocketBase data, routes, or list card design.
- Keep `Mettnau-Highlights` as a native button with `aria-pressed`.
- Keep skeleton loading behavior and existing loading tests intact.
- Add focused component test coverage for reset behavior and key semantic states (`aria-pressed`, result summary, empty-state reset button).
- Unit tests, type-check, lint, and build must pass before pushing.

---

## File Structure

- Modify `src/views/LexiconListView.vue`: responsive toolbar, active filter summary, recovery empty state, `hasActiveFilters`, `resultSummary`, and `resetFilters()`.
- Modify `src/views/LexiconListView.spec.ts`: tests for `aria-pressed`, result summary, empty-state reset button, and reset behavior.
- No new source components. This keeps the PR focused and avoids introducing a design-system abstraction for one toolbar.

---

### Task 1: Lexikon Filter Toolbar UX

**Files:**
- Modify: `src/views/LexiconListView.vue`
- Test: `src/views/LexiconListView.spec.ts`

**Interfaces:**
- Consumes: existing `entries`, `isLoading`, `searchQuery`, `selectedLabel`, `showHighlightsOnly`, `filteredEntries`, `labels`, `toxicityReferences`.
- Produces:
  - `hasActiveFilters: ComputedRef<boolean>` — true when search text is non-empty after trimming, a label is selected, or the highlight toggle is active.
  - `resultSummary: ComputedRef<string>` — `${filteredEntries.length} von ${entries.length} Einträgen`.
  - `resetFilters(): void` — clears `searchQuery`, `selectedLabel`, and `showHighlightsOnly`.

- [ ] **Step 1: Add failing tests for semantic states and reset recovery**

In `src/views/LexiconListView.spec.ts`, extend the existing tests with these assertions/tests.

Add this assertion to the existing `filters the list to Mettnau highlights when the chip is active` test after `await waitForHeadingCount(wrapper, 3)`:

```ts
expect(findChip(wrapper).attributes('aria-pressed')).toBe('false')
expect(wrapper.text()).toContain('3 von 3 Einträgen')
```

Add this assertion after the chip click and `await waitForHeadingCount(wrapper, 2)`:

```ts
expect(findChip(wrapper).attributes('aria-pressed')).toBe('true')
expect(wrapper.text()).toContain('2 von 3 Einträgen')
```

Then replace the existing empty-state test body with this recovery-oriented version:

```ts
it('shows an empty-state reset action and restores entries after reset', async () => {
  lexiconService.getLexiconEntriesList.mockResolvedValue([
    {
      id: 'plain-plant',
      name: 'Gewöhnliche Pflanze',
      description: 'Nichts Besonderes.',
      label: 'Pflanzen',
    },
  ])
  const wrapper = mountView()
  await flushPromises()
  await nextTick()
  await waitForHeadingCount(wrapper, 1)

  await findChip(wrapper).trigger('click')
  await nextTick()

  expect(wrapper.findAll('h2')).toHaveLength(0)
  expect(wrapper.text()).toContain('Keine Einträge gefunden.')
  expect(wrapper.text()).toContain('Versuche einen anderen Suchbegriff oder setze die Filter zurück.')

  const resetButton = wrapper
    .findAll('button')
    .find((button) => button.text() === 'Filter zurücksetzen')
  expect(resetButton).toBeTruthy()

  await resetButton!.trigger('click')
  await nextTick()

  expect(findChip(wrapper).attributes('aria-pressed')).toBe('false')
  expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual(['Gewöhnliche Pflanze'])
})
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run:

```bash
npm run test:unit -- src/views/LexiconListView.spec.ts
```

Expected: FAIL because the result summary, recovery text, and reset button do not exist yet.

- [ ] **Step 3: Implement the responsive toolbar and reset UI**

In `src/views/LexiconListView.vue`, replace the current top filter row (`<div class="mb-4 flex min-w-0 items-center gap-2">...</div>`) with this structure:

```vue
<div class="mb-4 rounded-xl border border-border bg-background p-3 shadow-sm">
  <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
    <div
      class="flex min-w-0 flex-1 items-center rounded-md border border-border bg-white px-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
    >
      <Search class="m-1 shrink-0 text-gray-400" aria-hidden="true" />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Suchen ..."
        class="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
      />
    </div>

    <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
      <div ref="menuRef" class="relative shrink-0 text-left">
        <button
          class="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto"
          @click="isMenuOpen = !isMenuOpen"
        >
          <ListFilter class="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span>{{ selectedLabel ? `Label: ${selectedLabel}` : 'Alle Labels' }}</span>
        </button>

        <div
          v-if="isMenuOpen"
          class="absolute right-0 z-50 mt-2 w-full min-w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg sm:w-44"
        >
          <button
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            @click="((selectedLabel = ''), (isMenuOpen = false))"
          >
            Alle anzeigen
          </button>
          <button
            v-for="label in labels"
            :key="label"
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            :class="{ 'bg-blue-50 font-bold text-blue-600': selectedLabel === label }"
            @click="((selectedLabel = label), (isMenuOpen = false))"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <button
        class="flex w-full shrink-0 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors sm:w-auto"
        :class="
          showHighlightsOnly
            ? 'border-green-600 bg-green-600 text-white shadow-sm hover:bg-green-700'
            : 'border-border bg-gray-50 text-gray-700 hover:bg-gray-100'
        "
        :aria-pressed="showHighlightsOnly"
        @click="showHighlightsOnly = !showHighlightsOnly"
      >
        <LeafIcon class="h-4 w-4" aria-hidden="true" />
        <span>Mettnau-Highlights</span>
      </button>
    </div>
  </div>

  <div v-if="!isLoading" class="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-text/70">
    <span>{{ resultSummary }}</span>
    <button
      v-if="hasActiveFilters"
      type="button"
      class="font-medium text-primary underline-offset-4 hover:underline"
      @click="resetFilters"
    >
      Filter zurücksetzen
    </button>
  </div>
</div>
```

Then replace the current empty-state paragraph inside the list section with:

```vue
<div v-else class="rounded-xl border border-border bg-background p-4 text-text">
  <p class="font-semibold text-heading">Keine Einträge gefunden.</p>
  <p class="mt-1 text-sm text-text/70">
    Versuche einen anderen Suchbegriff oder setze die Filter zurück.
  </p>
  <button
    type="button"
    class="mt-3 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
    @click="resetFilters"
  >
    Filter zurücksetzen
  </button>
</div>
```

Below the existing `filteredEntries` computed property, add:

```ts
const hasActiveFilters = computed(
  () => searchQuery.value.trim().length > 0 || Boolean(selectedLabel.value) || showHighlightsOnly.value,
)

const resultSummary = computed(() => `${filteredEntries.value.length} von ${entries.value.length} Einträgen`)

function resetFilters() {
  searchQuery.value = ''
  selectedLabel.value = ''
  showHighlightsOnly.value = false
}
```

- [ ] **Step 4: Run focused test to verify it passes**

Run:

```bash
npm run test:unit -- src/views/LexiconListView.spec.ts
```

Expected: PASS.

- [ ] **Step 5: Run lint on modified files**

Run:

```bash
npm run lint
```

Expected: PASS. If formatting/lint reports class or line-length issues, adjust the template without changing behavior.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add src/views/LexiconListView.vue src/views/LexiconListView.spec.ts
git commit -m "feat: polish lexicon filter ux"
```

---

### Task 2: Integration Verification and PR Update

**Files:**
- Modify only if verification exposes issues from Task 1.

**Interfaces:**
- Consumes: Task 1 toolbar, reset method, computed helpers, updated tests.
- Produces: verified PR branch pushed to GitHub.

- [ ] **Step 1: Run all unit tests**

Run:

```bash
npm run test:unit
```

Expected: PASS for all test files.

- [ ] **Step 2: Run TypeScript type-checking**

Run:

```bash
npm run type-check
```

Expected: PASS.

- [ ] **Step 3: Run linting**

Run:

```bash
npm run lint
```

Expected: PASS, including `check:service-boundaries`.

- [ ] **Step 4: Run production build**

Run:

```bash
npm run build-only
```

Expected: PASS.

- [ ] **Step 5: Smoke-test the polished UX in dev mode**

Run:

```bash
npm run dev
```

Open `/lexicon` and verify:

- Search field is full width on narrow/mobile layout and controls do not look cramped.
- Label dropdown shows `Alle Labels` by default and `Label: <name>` when selected.
- `Mettnau-Highlights` active state is visually obvious and `aria-pressed` changes.
- Result summary updates as filters change.
- `Filter zurücksetzen` clears search, label, and highlight filter from the summary and from the empty state.
- Skeleton loading still appears before entries load.

Expected: all checks pass without console errors.

- [ ] **Step 6: Commit verification fixes if required**

If Steps 1-5 required code changes, commit only those changes:

```bash
git add src/views/LexiconListView.vue src/views/LexiconListView.spec.ts
git commit -m "fix: stabilize lexicon filter ux polish"
```

If no changes were required, do not create a commit.

- [ ] **Step 7: Push the branch**

Run:

```bash
git push
```

Expected: PR #72 updates successfully.

---

## Self-Review Notes

- Spec coverage: responsive toolbar, active state, label wording, result summary, reset actions, empty-state recovery, accessibility, data-flow preservation, and verification are covered by Tasks 1-2.
- Placeholder scan: no placeholder markers or open-ended instructions remain.
- Type consistency: `hasActiveFilters`, `resultSummary`, and `resetFilters()` are defined in Task 1 and used only in `LexiconListView.vue` template/script.
