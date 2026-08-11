# MarkdownRenderer für die LexikonDetailView

**Datum:** 2026-08-10
**Status:** Genehmigt (Entwurf vom User abgenommen, inkl. Löschung des Duplikats)

## Ziel

Die Beschreibung (`entry.description`) auf der LexikonDetailView wird aktuell als
Plain-Text in einem `<p>` gerendert (`src/views/LexiconDetailView.vue:59`). Es soll
eine aktuelle, gut gepflegte Markdown-Render-Komponente integriert werden, damit
Markdown-Syntax (Listen, Fett, Headings, Links, Tabellen, …) korrekt dargestellt wird.

## Entscheidungen (mit User abgestimmt)

| Thema | Entscheidung |
|---|---|
| Zeilenumbrüche | Standard-CommonMark: einzelne `\n` werden zu Leerzeichen, nur Leerzeilen ergeben Absätze (`breaks: false`) |
| Bibliothek | `marked` (GFM nativ, TS-Typen inklusive) + `dompurify` als Sanitizer |
| Styling | `prose`-Klassen aus `@tailwindcss/typography` (bereits installiert & registriert) mit Anpassung an die Design-Tokens |

## Architektur

### Neue Komponente: `src/components/MarkdownRenderer.vue`

- Props: `source: string` (Markdown-Text)
- `computed`: `DOMPurify.sanitize(marked.parse(props.source))`
- Template: `<div class="prose" v-html="renderedHtml" />`
- `marked` mit Standard-Konfiguration: GFM nativ (Tabellen, Strikethrough, Autolinks), `breaks: false`
- `dompurify` mit Standard-Konfiguration (XSS-Schutz, Defense-in-depth)

### Theme-Anpassung

Overrides der `--tw-prose-*`-CSS-Variablen im scoped Style der Komponente:

- Fließtext: `--color-text` (#2c3e50)
- Headings: Primär-/Sekundärfarben des Themes
- Links: `--color-primary` (#2a944d) + Hover
- Listen/Blockquotes/Code: dezente Neutraltöne passend zum Theme

### Integration in `src/views/LexiconDetailView.vue`

- Zeile 59 ersetzen: `<p class="mt-3 text-text">{{ entry.description }}</p>`
  → `<MarkdownRenderer :source="entry.description" class="mt-3" />`
- Komponente importieren
- `AutoTextToSpeech` funktioniert weiterhin (nutzt `innerText` auf dem `section`-Element)

### Löschung

- `src/features/lexicon/LexiconDetail.vue` ist ein ungenutztes Duplikat der View
  (nicht im Router referenziert) und wird gelöscht.

## Fehlerbehandlung

- Leerer/fehlender `source` → nichts rendern
- `marked.parse` ist tolerant gegenüber fehlerhaftem Markdown (wirft nicht)
- `dompurify.sanitize` wirft bei gültigem Input nicht

## Test

Neuer Unit-Test `src/components/MarkdownRenderer.spec.ts` (vitest + @vue/test-utils,
Muster existiert in `src/services/map.service.spec.ts`):

- rendert Bold/Headings/Listen korrekt
- escaped rohes HTML (`<script>` wird als Text angezeigt — XSS-Test)
- rendert GFM-Tabelle
- leerer Source → leeres Rendering

Verifikation: `npm run test:unit` + `npm run type-check`

## Außerhalb des Scopes

- Keine Datenänderungen (Labels wie „Verbreitung:" werden nicht gefettet — Datenfrage)
- Keine Änderungen an anderen Views