# Lexicon Mettnau-Highlight Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users filter the Lexikon overview to show only Mettnau highlights (`isProtected === true`) via a toggle chip, with an empty-state message when no entries match.

**Architecture:** Keep all filter logic in the view (`LexiconListView.vue`), following the existing pattern of the label filter. Add a `showHighlightsOnly` ref, extend the `filteredEntries` computed with a third AND-stage, render a toggle chip next to the label dropdown, and show a "Keine Einträge gefunden." card when the result list is empty. A new Vitest component test drives the implementation.

**Tech Stack:** Vue 3, TypeScript, Vitest, @vue/test-utils, Pinia, @lucide/vue, Tailwind CSS 4.

## Global Constraints

- Do not change the PocketBase API, data model, or seed data.
- Do not change `LexiconService` or the `LexiconListEntry` type.
- Do not change `MettnauHighlightBadge.vue` or `LexiconListItem.vue`.
- Do not change the detail view (`LexiconDetailView.vue`).
- Filter combination is AND: search, label filter, and highlight chip all apply together.
- Highlight check is `entry.isProtected === true` (explicit boolean, not truthiness).
- Chip label text: "Mettnau-Highlights".
- Empty-state text: "Keine Einträge gefunden."
- Add the component test before implementation changes (TDD).

---

## File Structure

- Create: `src/views/LexiconListView.spec.ts`
  - Component test for the view: chip filtering, chip + label combination, empty state.
- Modify: `src/views/LexiconListView.vue`
  - Adds the toggle chip, the `showHighlightsOnly` ref, the highlight filter stage, and the empty-state message.

---

### Task 1: Highlight Chip, Filter Logic, and Empty State

**Files:**
- Create: `src/views/LexiconListView.spec.ts`
- Modify: `src/views/LexiconListView.vue`

**Interfaces:**
- Consumes:
  - `LexiconListEntry` from `src/shared/types/lexicon.types.ts` (has `isProtected?: boolean`).
  - Injected `lexiconService` with `getLexiconEntriesList(): Promise<LexiconListEntry[]>` and `filterLexiconEntries(entries, searchTerm): LexiconListEntry[]`.
  - `useLabelsStore()` getter `getLabels: Label[]`; `useToxicityStore()` getter `getAllToxicityLevels: ToxicityLevel[]`.
- Produces:
  - `showHighlightsOnly: Ref<boolean>` in `LexiconListView.vue`, consumed only inside the view's `filteredEntries` computed.
  - No new exported functions or types.

- [ ] **Step 1: Write the failing component test**

Create `src/views/LexiconListView.spec.ts`:

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import LexiconListView from '@/views/LexiconListView.vue'

const entries: LexiconListEntry[] = [
  {
    id: 'highlight-bird',
    name: 'Highlight Vogel',
    description: 'Ein besonderer Vogel.',
    label: 'Vögel',
    isProtected: true,
  },
  {
    id: 'highlight-plant',
    name: 'Highlight Pflanze',
    description: 'Eine besondere Pflanze.',
    label: 'Pflanzen',
    isProtected: true,
  },
  {
    id: 'normal-bird',
    name: 'Normaler Vogel',
    description: 'Ein gewöhnlicher Vogel.',
    label: 'Vögel',
  },
]

vi.mock('@/stores/labels.store', () => ({
  useLabelsStore: () => ({
    getLabels: [],
  }),
}))

vi.mock('@/stores/toxicity.store', () => ({
  useToxicityStore: () => ({
    getAllToxicityLevels: [],
  }),
}))

const lexiconService = {
  getLexiconEntriesList: vi.fn(),
  filterLexiconEntries: vi.fn((list: LexiconListEntry[], _searchTerm: string) => list),
}

function mountView() {
  return mount(LexiconListView, {
    global: {
      plugins: [createPinia()],
      provide: { lexiconService },
      stubs: { RouterLink: true },
    },
  })
}

function findChip(wrapper: ReturnType<typeof mountView>) {
  const chip = wrapper
    .findAll('button')
    .find((button) => button.text().includes('Mettnau-Highlights'))
  if (!chip) throw new Error('Mettnau-Highlights chip not found')
  return chip
}

describe('LexiconListView', () => {
  beforeEach(() => {
    lexiconService.getLexiconEntriesList.mockResolvedValue(entries)
  })

  it('filters the list to Mettnau highlights when the chip is active', async () => {
    const wrapper = mountView()
    await flushPromises()

    await findChip(wrapper).trigger('click')

    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual([
      'Highlight Vogel',
      'Highlight Pflanze',
    ])
  })

  it('combines the highlight chip with the label filter', async () => {
    const wrapper = mountView()
    await flushPromises()

    const dropdownButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Alle'))!
    await dropdownButton.trigger('click')

    const labelButton = wrapper
      .findAll('button')
      .find((button) => button.text() === 'Vögel')!
    await labelButton.trigger('click')

    await findChip(wrapper).trigger('click')

    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual(['Highlight Vogel'])
  })

  it('shows an empty-state message when no entries match', async () => {
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

    await findChip(wrapper).trigger('click')

    expect(wrapper.findAll('h2')).toHaveLength(0)
    expect(wrapper.text()).toContain('Keine Einträge gefunden.')
  })
})
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
npm run test:unit -- src/views/LexiconListView.spec.ts
```

Expected: FAIL — the chip does not exist yet, so `findChip` throws "Mettnau-Highlights chip not found".

- [ ] **Step 3: Add the toggle chip to the template**

In `src/views/LexiconListView.vue`, insert the chip between the label dropdown `</div>` (line 47) and the filter bar closing `</div>` (line 48):

```html
      <button
        class="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
        :class="
          showHighlightsOnly
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
        :aria-pressed="showHighlightsOnly"
        @click="showHighlightsOnly = !showHighlightsOnly"
      >
        <LeafIcon class="h-4 w-4" />
        <span>Mettnau-Highlights</span>
      </button>
```

- [ ] **Step 4: Add the empty-state message to the template**

In `src/views/LexiconListView.vue`, replace the entry section (lines 60-62):

```html
    <section v-if="filteredEntries.length > 0" class="space-y-4" aria-label="Lexikoneinträge">
      <LexiconListItem v-for="entry in filteredEntries" :key="entry.id" :entry="entry" />
    </section>
    <p v-else class="rounded-xl border border-border bg-background p-4 text-text">
      Keine Einträge gefunden.
    </p>
```

- [ ] **Step 5: Add the script logic**

In `src/views/LexiconListView.vue`:

1. Update the lucide import (line 72):

```ts
import { LeafIcon, ListFilter, Search } from '@lucide/vue'
```

2. Add the ref next to the other refs (after line 87, `const searchQuery = ref('')`):

```ts
const showHighlightsOnly = ref(false)
```

3. Extend the `filteredEntries` computed (lines 95-103) with the highlight stage:

```ts
const filteredEntries = computed(() => {
  let result = lexiconService.filterLexiconEntries(entries.value, searchQuery.value)

  if (selectedLabel.value) {
    result = result.filter((entry) => entry.label === selectedLabel.value)
  }

  if (showHighlightsOnly.value) {
    result = result.filter((entry) => entry.isProtected === true)
  }

  return result
})
```

- [ ] **Step 6: Run the test and verify it passes**

Run:

```bash
npm run test:unit -- src/views/LexiconListView.spec.ts
```

Expected: PASS (all three tests).

- [ ] **Step 7: Commit Task 1**

```bash
git add src/views/LexiconListView.spec.ts src/views/LexiconListView.vue
git commit -m "feat: add mettnau highlight filter to lexicon overview"
```

---

### Task 2: Verification and Integration Check

**Files:**
- Modify only if type-checking or linting exposes issues from Task 1.

**Interfaces:**
- Consumes: the chip, filter logic, and empty state from Task 1.
- Produces: verified feature ready for app-level review.

- [ ] **Step 1: Run all unit tests**

Run:

```bash
npm run test:unit
```

Expected: PASS — the new `LexiconListView.spec.ts` plus the existing `map.service.spec.ts`.

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

Expected: PASS (includes `check:service-boundaries`).

- [ ] **Step 4: Run production build**

Run:

```bash
npm run build-only
```

Expected: PASS.

- [x] **Step 5: Manually smoke-test the filter in dev mode**

Run:

```bash
npm run dev
```

Open the Vite URL and test on the Lexikon page:

- Click "Mettnau-Highlights": only entries with the green leaf badge remain.
- Click again: full list returns.
- Activate the chip and type a search term: both filters apply together (AND).
- Activate the chip and select a label: both filters apply together (AND).
- With a combination that matches nothing, "Keine Einträge gefunden." appears.

Expected: all checks pass without console errors.

**Smoke-test evidence (2026-08-10, agent-browser + Chromium against live PocketBase):**
- Chip "Mettnau-Highlights" renders on `/lexicon`; green leaf badges visible on protected entries.
- Chip active → exactly the 6 `isProtected` entries remain (Bodensee-Vergissmeinnicht, Europäischer Strandling, Lungen-Enzian, Mehl-Primel, Sibirische Schwertlilie, Ufer-Hahnenfuß).
- Chip inactive → full list (86 entries) returns.
- Chip + search "Mehl" → only Mehl-Primel (AND).
- Chip + search "Amsel" → "Keine Einträge gefunden." (empty state).
- Chip + label "Vogel" → "Keine Einträge gefunden." (AND; all protected entries are plants).
- Chip + label "Pflanze" → all 6 protected entries (AND).
- No console errors observed.

- [ ] **Step 6: Commit verification fixes if any were required**

If Steps 1-4 required code changes, commit only those changes:

```bash
git add src/views/LexiconListView.vue src/views/LexiconListView.spec.ts
git commit -m "fix: stabilize lexicon highlight filter verification"
```

If Steps 1-4 passed without code changes, do not create a commit in this step.

---

## Self-Review Notes

- Spec coverage: chip UI (spec section 1), filter logic (section 2), empty state (section 3), component test (section 4), and verification (section 5) are covered by Tasks 1-2.
- Placeholder scan: no placeholder markers, incomplete task, undefined function, or open-ended instruction remains.
- Type consistency: `showHighlightsOnly` is defined in Task 1 Step 5 and used only in the same file's template and computed; the test references only the chip label text and rendered `h2` elements, not internal identifiers.