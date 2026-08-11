# MarkdownRenderer für LexikonDetailView — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine aktuelle Markdown-Render-Komponente (`marked` + `dompurify`) rendert die Beschreibung auf der LexikonDetailView mit `prose`-Styling, angepasst an die Design-Tokens.

**Architecture:** Neue generische Komponente `src/components/MarkdownRenderer.vue` nimmt `source: string` entgegen, parst mit `marked` (GFM, `breaks: false`), sanitized mit `dompurify` und rendert via `v-html` in einem `div.prose` mit Theme-Overrides. Integration in `src/views/LexiconDetailView.vue` ersetzt das Plain-Text-`<p>`. Das ungenutzte Duplikat `src/features/lexicon/LexiconDetail.vue` wird gelöscht.

**Tech Stack:** Vue 3.5 (`<script setup lang="ts">`), Tailwind CSS 4 (`@tailwindcss/typography`, bereits registriert), `marked@^18.0.9`, `dompurify@^3.4.13`, vitest + @vue/test-utils (jsdom).

## Global Constraints

- `marked` ≥ 18.0.9, `dompurify` ≥ 3.4.13 (beide liefern eigene TS-Typen mit)
- `breaks: false` (CommonMark-Standard — einzelne `\n` werden zu Leerzeichen)
- GFM nativ (Tabellen, Strikethrough, Autolinks) — Standard in `marked`
- Jedes gerenderte HTML MUSS durch `DOMPurify.sanitize()` laufen (XSS-Schutz)
- Styling über `prose`-Klassen + `--tw-prose-*`-Variablen, Farben aus den Design-Tokens (`--color-*`)
- Import-Pfade mit `@/`-Alias (bestehende Konvention)
- Keine Änderungen an uncommitteten Fremddateien im Working Tree (`src/services/map.service.ts`, `src/services/map.service.spec.ts`, `docs/superpowers/plans/2026-08-08-lexicon-search-word-variants.md`, Datei mit Binärnamen) — nur die eigenen Dateien stagen

---

### Task 1: Feature-Branch anlegen und Dependencies installieren

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `package-lock.json` (via npm install)

**Interfaces:**
- Produces: `marked` und `dompurify` als Runtime-Dependencies; Branch `feat/lexicon-markdown-renderer`

- [ ] **Step 1: Feature-Branch anlegen**

```bash
git checkout -b feat/lexicon-markdown-renderer
```

- [ ] **Step 2: Dependencies installieren**

```bash
npm install marked@^18.0.9 dompurify@^3.4.13
```

- [ ] **Step 3: Installation verifizieren**

Run: `npm ls marked dompurify`
Expected: beide Pakete ohne Fehler gelistet, keine `UNMET DEPENDENCY`-Meldungen

---

### Task 2: MarkdownRenderer-Komponente (TDD)

**Files:**
- Create: `src/components/MarkdownRenderer.spec.ts`
- Create: `src/components/MarkdownRenderer.vue`

**Interfaces:**
- Produces: `MarkdownRenderer` (default export, Vue SFC) mit Prop `source: string`; rendert sanitized HTML in `<div class="prose ...">`

- [ ] **Step 1: Failing Test schreiben**

`src/components/MarkdownRenderer.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MarkdownRenderer from './MarkdownRenderer.vue'

describe('MarkdownRenderer', () => {
  it('renders markdown as HTML', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '# Titel\n\n**fett** und *kursiv*' },
    })
    expect(wrapper.find('h1').text()).toBe('Titel')
    expect(wrapper.find('strong').text()).toBe('fett')
    expect(wrapper.find('em').text()).toBe('kursiv')
  })

  it('renders links', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '[Beispiel](https://example.com)' },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.text()).toBe('Beispiel')
  })

  it('renders GFM tables', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '| A | B |\n|---|---|\n| 1 | 2 |' },
    })
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('td').text()).toBe('1')
  })

  it('removes script tags (XSS protection)', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '<script>alert("xss")</script>' },
    })
    expect(wrapper.find('script').exists()).toBe(false)
  })

  it('strips dangerous HTML attributes (XSS protection)', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '<img src="x" onerror="alert(1)">' },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('onerror')).toBeUndefined()
  })

  it('renders nothing for empty source', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '' },
    })
    expect(wrapper.text()).toBe('')
  })
})
```

- [ ] **Step 2: Test ausführen und Fehlschlag verifizieren**

Run: `npx vitest run src/components/MarkdownRenderer.spec.ts`
Expected: FAIL — `Failed to resolve import "./MarkdownRenderer.vue"` (Komponente existiert noch nicht)

- [ ] **Step 3: Komponente implementieren**

`src/components/MarkdownRenderer.vue`:

```vue
<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps<{
  source: string
}>()

const renderedHtml = computed(() => {
  if (!props.source) return ''
  return DOMPurify.sanitize(marked.parse(props.source, { async: false }))
})
</script>

<template>
  <div class="prose max-w-none" v-html="renderedHtml" />
</template>

<style scoped>
.prose {
  --tw-prose-body: var(--color-text);
  --tw-prose-headings: var(--color-heading);
  --tw-prose-links: var(--color-primary);
  --tw-prose-bold: var(--color-text);
  --tw-prose-counters: var(--color-text);
  --tw-prose-bullets: var(--color-primary);
  --tw-prose-hr: var(--color-border);
  --tw-prose-quotes: var(--color-text);
  --tw-prose-quote-borders: var(--color-primary);
  --tw-prose-code: var(--color-text);
  --tw-prose-pre-code: var(--color-text);
  --tw-prose-pre-bg: var(--color-background-mute);
  --tw-prose-th-borders: var(--color-border);
  --tw-prose-td-borders: var(--color-border);
  --tw-prose-captions: var(--color-text);
}

.prose :deep(h1) {
  color: var(--color-primary);
}

.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
  color: var(--color-secondary);
}
</style>
```

- [ ] **Step 4: Test ausführen und Bestehen verifizieren**

Run: `npx vitest run src/components/MarkdownRenderer.spec.ts`
Expected: PASS — alle 6 Tests grün

- [ ] **Step 5: Commit**

```bash
git add src/components/MarkdownRenderer.vue src/components/MarkdownRenderer.spec.ts
git commit -m "feat: add markdown renderer component with sanitization"
```

---

### Task 3: Integration in LexiconDetailView und Löschung des Duplikats

**Files:**
- Modify: `src/views/LexiconDetailView.vue:59` (Beschreibungs-`<p>` ersetzen) und Import-Block (Zeile 90–100)
- Delete: `src/features/lexicon/LexiconDetail.vue`

**Interfaces:**
- Consumes: `MarkdownRenderer` (default export) aus Task 2 mit Prop `source: string`

- [ ] **Step 1: Import hinzufügen**

In `src/views/LexiconDetailView.vue` im `<script setup>`-Block (bei den anderen `@/`-Imports):

```ts
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
```

- [ ] **Step 2: Beschreibung durch MarkdownRenderer ersetzen**

Zeile 59 ersetzen:

```vue
<p class="mt-3 text-text">{{ entry.description }}</p>
```

durch:

```vue
<MarkdownRenderer :source="entry.description" class="mt-3" />
```

(`class="mt-3"` fällt in Vue 3 automatisch auf das Root-`div.prose` durch.)

- [ ] **Step 3: Ungenutztes Duplikat löschen**

```bash
git rm src/features/lexicon/LexiconDetail.vue
```

- [ ] **Step 4: Verifizieren**

Run: `npm run type-check`
Expected: keine Fehler

Run: `npx vitest run src/components/MarkdownRenderer.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/LexiconDetailView.vue
git commit -m "feat: render lexicon description as markdown, remove unused duplicate"
```

---

### Task 4: Gesamtverifikation und PR

**Files:**
- Keine Code-Änderungen

**Interfaces:**
- Consumes: alle Änderungen aus Task 1–3

- [ ] **Step 1: Unit-Tests**

Run: `npm run test:unit`
Expected: alle Tests grün (inkl. bestehender `map.service.spec.ts`)

- [ ] **Step 2: Type-Check**

Run: `npm run type-check`
Expected: keine Fehler

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: keine Warnungen/Fehler (oxlint mit `--deny-warnings`)

- [ ] **Step 4: Working-Tree prüfen**

Run: `git status --short`
Expected: nur die eigenen Dateien committet; die fremden uncommitteten Dateien (`src/services/map.service.ts`, `src/services/map.service.spec.ts`, `docs/superpowers/plans/2026-08-08-lexicon-search-word-variants.md`, Datei mit Binärnamen) bleiben unangetastet im Working Tree

- [ ] **Step 5: Branch pushen und PR erstellen**

```bash
git push -u origin feat/lexicon-markdown-renderer
gh pr create --base main --head feat/lexicon-markdown-renderer \
  --title "feat: Markdown-Rendering für Lexikon-Beschreibungen" \
  --body "Rendert \`entry.description\` auf der LexikonDetailView als Markdown.

- Neue Komponente \`src/components/MarkdownRenderer.vue\` (\`marked\` + \`dompurify\`, GFM, CommonMark-Zeilenumbruch-Verhalten)
- \`prose\`-Styling mit Anpassung an die Design-Tokens
- Unit-Tests für Rendering, GFM-Tabellen und XSS-Schutz
- Ungenutztes Duplikat \`src/features/lexicon/LexiconDetail.vue\` gelöscht"
```

- [ ] **Step 6: PR-URL ausgeben**

Run: `gh pr view --json url -q .url`
Expected: PR-URL an den User melden