# Lexikon Filter UX Polish Design

## Goal

Improve the Lexikon filter experience in the existing Mettnau highlight filter PR without changing the underlying data model or filter semantics. The UI should make search, label filtering, and the `Mettnau-Highlights` toggle easier to understand and use on desktop and mobile.

## Scope

In scope:
- Polish `src/views/LexiconListView.vue` filter controls.
- Preserve current AND semantics between search, label filter, and highlight filter.
- Improve active filter clarity.
- Improve the empty state so users can recover from over-filtering.
- Add focused component test coverage for reset behavior and key semantic states (`aria-pressed`, result summary, empty-state reset button).

Out of scope:
- Redesigning Lexikon list cards.
- Changing backend queries or PocketBase data.
- Changing route structure.
- Adding new global design-system components.

## Recommended Design

Use a compact responsive filter toolbar.

### Layout

- Wrap the search field, label dropdown, and `Mettnau-Highlights` chip in a subtle rounded container/card.
- Use a responsive layout:
  - Mobile: vertical stack with search full-width first, then filter controls below.
  - Tablet/desktop: horizontal row with the search field taking remaining width and controls aligned to the right.
- Keep the toxicity details block below the filter toolbar.

### Filter Controls

- Search remains the primary control and keeps the current placeholder `Suchen ...`.
- Label dropdown button should communicate its purpose:
  - Default: `Alle Labels`
  - Selected: `Label: <name>`
- `Mettnau-Highlights` remains a native button with `aria-pressed`.
- The highlight button should have a stronger active state:
  - Inactive: neutral background, visible border, green leaf icon.
  - Active: green background, white text/icon, subtle selected styling.

### Active Filter Summary

Show a small helper line below the controls when filters are active or results are loaded:
- If entries are loaded: show `<filtered count> von <total count> Einträgen`.
- If filters are active: show a compact `Filter zurücksetzen` button/link.
- Do not show this while skeleton loading is active.

### Empty State

Replace the bare `Keine Einträge gefunden.` text with a recovery-oriented block:

- Title: `Keine Einträge gefunden.`
- Helper text: `Versuche einen anderen Suchbegriff oder setze die Filter zurück.`
- Button: `Filter zurücksetzen`

The reset action clears `searchQuery`, `selectedLabel`, and `showHighlightsOnly`.

## Accessibility

- Keep all controls as native buttons/inputs.
- Preserve `aria-pressed` on the highlight toggle.
- Add accessible labels only if visible text is insufficient.
- The result-count helper should be plain text; it does not need live-region behavior for this small filter UI.
- Reset buttons must be keyboard reachable and visible.

## Data Flow

No filter data flow changes:

1. `entries` load from `lexiconService.getLexiconEntriesList()`.
2. `filteredEntries` first delegates search to `lexiconService.filterLexiconEntries(entries, searchQuery)`.
3. Label filtering narrows the result if `selectedLabel` is set.
4. Highlight filtering narrows the result if `showHighlightsOnly` is true.

Add small computed helpers:
- `hasActiveFilters`: true when search, label, or highlight filter is active.
- `resultSummary`: count text based on `filteredEntries.length` and `entries.length`.

Add one method:
- `resetFilters()`: clears search, label, and highlight filter.

## Testing

Update `src/views/LexiconListView.spec.ts` with focused coverage:
- Existing highlight toggle tests remain valid.
- Empty-state test should assert the recovery text and reset button.
- Add or extend a test to verify reset clears active filters and restores matching entries.
- Keep existing skeleton loading test intact after layout changes.

## Risks

- The label dropdown is absolutely positioned; ensure it still opens correctly inside the new toolbar container.
- Long label names need to wrap or truncate without breaking mobile layout.
- The result-count helper must not appear during loading, otherwise skeleton tests may needlessly couple to loaded state.
- Keep changes small so the PR remains focused on Lexikon filter UX polish.

## Acceptance Criteria

- On mobile-width layouts, the search field is full width and controls are not cramped.
- The active `Mettnau-Highlights` state is visually obvious.
- Users can reset filters from the active-filter summary or empty state.
- Search, label, and highlight filters still combine with AND semantics.
- Unit tests, type-check, lint, and build pass.
