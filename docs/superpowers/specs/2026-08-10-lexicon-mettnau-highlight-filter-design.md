# Lexicon Mettnau-Highlight Filter Design

**Date:** 2026-08-10
**Status:** Approved

## Goal

Let users explicitly filter the Lexikon overview (`LexiconListView.vue`) to show only entries marked as Mettnau highlights (`isProtected === true`), the same flag that drives the existing `MettnauHighlightBadge`.

## Context

- `LexiconListView.vue` already offers a search field and a label filter dropdown (`selectedLabel`), combined with AND logic in the `filteredEntries` computed.
- `LexiconListEntry` already carries `isProtected?: boolean`; the service (`LexiconService.getLexiconEntriesList()`) already maps it through.
- `MettnauHighlightBadge.vue` renders when `entry.isProtected` is truthy, with a green leaf identity ("Besonderes Highlight auf der Mettnau").
- Seed data currently has no `isProtected` entries; the flag comes from the PocketBase database.

## Decisions

- **UI form:** A separate toggle chip next to the label dropdown (not an entry inside the dropdown), because `isProtected` is a boolean property, not a label.
- **Empty state:** A general "Keine Einträge gefunden." message whenever `filteredEntries` is empty (search + filters combined), replacing the current silently empty list.
- **Filter combination:** AND logic — search, label filter, and highlight chip all apply together.
- **Implementation approach:** Filter logic stays in the view (Approach A), following the existing pattern of the label filter. No new service methods or composables.

## Design

### 1. UI — Toggle chip

Add a toggle chip to the filter bar in `LexiconListView.vue` (next to the label dropdown, `src/views/LexiconListView.vue:18-47`):

- Shape matches the dropdown button: `rounded-md px-3 py-2 text-sm font-medium`, with `LeafIcon` (from `@lucide/vue`) and label "Mettnau-Highlights".
- Inactive: `bg-gray-100 text-gray-700 hover:bg-gray-200`.
- Active: `bg-green-600 text-white hover:bg-green-700` (green identity consistent with `MettnauHighlightBadge`).
- `aria-pressed` reflects the active state; click toggles `showHighlightsOnly`.

### 2. Filter logic

In `src/views/LexiconListView.vue`:

- Add `const showHighlightsOnly = ref(false)`.
- Extend the `filteredEntries` computed (`src/views/LexiconListView.vue:95-103`) with a third stage:

```ts
if (showHighlightsOnly.value) {
  result = result.filter((entry) => entry.isProtected === true)
}
```

### 3. Empty state

When `filteredEntries.length === 0`, render a card in the style of the existing boxes (`rounded-xl border border-border bg-background p-4 text-text`) with the text "Keine Einträge gefunden." instead of the empty list.

### 4. Component test (optional but planned)

Add a focused Vitest component test for `LexiconListView.vue` covering:

- The chip filters the list to `isProtected === true` entries only.
- The empty-state message appears when no entries match.
- The chip combines with the label filter (AND).

The project has no existing view tests; this test establishes the pattern for `LexiconListView` with mocked stores (`labels.store`, `toxicity.store`) and the injected `lexiconService`.

## Out of Scope

- No changes to the PocketBase API, data model, or seed data.
- No changes to `LexiconService` or `LexiconListEntry` type.
- No changes to `MettnauHighlightBadge` or `LexiconListItem`.
- No changes to the detail view.

## Verification

- `npm run test:unit` (new component test + existing specs)
- `npm run type-check`
- `npm run lint`
- `npm run build-only`