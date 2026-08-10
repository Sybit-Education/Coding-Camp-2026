# NavigationBar Popover Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the bottom NavigationBar overflow menu into a compact, card-like popover without changing routes or navigation structure.

**Architecture:** Keep the existing single-file Vue component and reactive `open` state. Add a focused component test for the overflow behavior before production changes, then replace the current stacked primary buttons with quieter link rows inside a styled viewport-safe popover.

**Tech Stack:** Vue 3 `<script setup lang="ts">`, Vue Router `RouterLink`, `@vue/test-utils`, Vitest, Tailwind CSS utility classes, lucide-vue icons already present.

## Global Constraints

- Branch: `fix/navbar-popover-polish` in `.worktrees/navbar-popover-polish`.
- Primary implementation file: `src/components/Navbar.vue`.
- Primary test file: `src/components/Navbar.spec.ts`.
- Main navigation remains fixed at the bottom.
- Popover remains compact and aligned above/right of the hamburger trigger.
- Menu closes on outside click and after selecting an entry.
- External links keep `target="_blank"` and `rel="noopener noreferrer"`.
- No route changes and no new state-management dependency.
- Verification: `npm run test:unit -- src/components/Navbar.spec.ts --run`, `npm run type-check`, `npm run lint`, and `npm run build`.

---

## File Structure

- Create `src/components/Navbar.spec.ts`: focused tests that prove the overflow menu is hidden initially, opens from the hamburger trigger, renders the compact popover affordance, and closes after selecting an internal route.
- Modify `src/components/Navbar.vue`: add menu data arrays, close-on-select handling, improved trigger accessibility, and polished popover markup/classes.
- No new component file: the NavigationBar is small enough that extracting a separate menu component would add indirection without reuse.
- No global style changes: existing `.btn` and focus-visible styles remain available, but the popover rows use local Tailwind classes to avoid changing other buttons.

---

### Task 1: Add Failing Navbar Overflow Menu Test

**Files:**
- Create: `src/components/Navbar.spec.ts`
- Read: `src/components/Navbar.vue`

**Interfaces:**
- Consumes: current `Navbar.vue` component behavior.
- Produces: failing tests that define the desired overflow menu behavior before production changes.

- [ ] **Step 1: Write the failing component test**

Create `src/components/Navbar.spec.ts`:

```typescript
import { RouterLinkStub, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar.vue'

function mountNavbar() {
  return mount(Navbar, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

describe('Navbar overflow menu', () => {
  it('opens as a compact popover and closes after selecting a route', async () => {
    const wrapper = mountNavbar()

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)

    await wrapper.get('button[aria-label="Weitere Navigation öffnen"]').trigger('click')

    const menu = wrapper.get('#navbar-overflow-menu')
    expect(menu.text()).toContain('Mehr')
    expect(menu.text()).toContain('Gefahrenanleitung')
    expect(menu.classes()).toContain('bg-white/95')

    const dangerGuideLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props('to') === '/dangerguide')

    expect(dangerGuideLink).toBeTruthy()
    await dangerGuideLink!.trigger('click')

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)
  })
})
```

This catches these realistic bugs: the menu trigger is not accessible by name, the polished popover affordance is missing, or route selection leaves the menu open.

- [ ] **Step 2: Run test to verify RED**

Run: `npm run test:unit -- src/components/Navbar.spec.ts --run`

Expected: FAIL because the current hamburger trigger has no `aria-label` and the current dropdown has no `#navbar-overflow-menu`.

- [ ] **Step 3: Do not commit the failing test**

Do not commit this task by itself. Continue directly to Task 2 and Task 3, then commit the test with the production change after it passes.

---

### Task 2: Refactor Menu Items and Interaction Hooks

**Files:**
- Modify: `src/components/Navbar.vue:1-21`
- Test: `src/components/Navbar.spec.ts`

**Interfaces:**
- Consumes: failing test from Task 1 plus existing `open: Ref<boolean>` and `menuRef: Ref<HTMLElement | null>`.
- Produces: `closeMenu(): void`, `internalMenuItems`, and `externalMenuItems` for the template.

- [ ] **Step 1: Add close helper and menu item arrays**

Update the script block to this structure:

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MapIcon, InfoIcon, BookOpenTextIcon, MenuIcon, MicIcon, HouseIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'

const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const internalMenuItems = [
  { to: '/about', label: 'About Us' },
  { to: '/dangerguide', label: 'Gefahrenanleitung' },
  { to: '/bathing-spots', label: 'Wo darf man baden?' },
  { to: '/privacy-policy', label: 'Datenschutz' },
]

const externalMenuItems = [
  {
    href: 'https://www.sybit.com/de/impressum',
    label: 'Impressum',
  },
]

function closeMenu(): void {
  open.value = false
}

function closeMenuOnOutsideClick(event: PointerEvent): void {
  if (menuRef.value && event.target instanceof Node && !menuRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', closeMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsideClick)
})
</script>
```

- [ ] **Step 2: Run focused checks**

Run: `npm run type-check && npm run test:unit -- src/components/Navbar.spec.ts --run`

Expected: type-check PASS; test still FAIL until Task 3 adds the accessible trigger, popover id, and close-on-selection markup.

- [ ] **Step 3: Do not commit yet**

This task is part of the same TDD cycle as Task 1 and Task 3. Commit only after the test passes in Task 3.

---

### Task 3: Replace Dropdown with Polished Compact Popover

**Files:**
- Modify: `src/components/Navbar.vue:47-86`
- Test: `src/components/Navbar.spec.ts`

**Interfaces:**
- Consumes: `open`, `closeMenu`, `internalMenuItems`, `externalMenuItems` from Task 2.
- Produces: accessible compact popover menu markup with close-on-selection.

- [ ] **Step 1: Improve hamburger trigger accessibility**

Replace the trigger button with:

```vue
<button
  class="btn btn-primary"
  type="button"
  aria-label="Weitere Navigation öffnen"
  :aria-expanded="open"
  aria-controls="navbar-overflow-menu"
  @click="open = !open"
>
  <MenuIcon />
</button>
```

- [ ] **Step 2: Replace dropdown body with compact card popover**

Replace the current `v-if="open"` dropdown `<div>` and its hardcoded links with:

```vue
<div
  v-if="open"
  id="navbar-overflow-menu"
  class="absolute bottom-[calc(100%+0.75rem)] right-0 z-1001 w-[min(16rem,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-2 text-left text-heading shadow-2xl shadow-black/25 backdrop-blur-md"
>
  <div class="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary/70">
    Mehr
  </div>

  <div class="flex max-h-[calc(100dvh-7rem)] flex-col gap-1 overflow-y-auto">
    <RouterLink
      v-for="item in internalMenuItems"
      :key="item.to"
      :to="item.to"
      class="rounded-2xl px-3 py-2.5 text-sm font-medium leading-snug text-heading transition hover:bg-neutral2 hover:text-secondary focus-visible:bg-neutral2"
      @click="closeMenu"
    >
      {{ item.label }}
    </RouterLink>

    <a
      v-for="item in externalMenuItems"
      :key="item.href"
      :href="item.href"
      target="_blank"
      rel="noopener noreferrer"
      class="rounded-2xl px-3 py-2.5 text-sm font-medium leading-snug text-heading transition hover:bg-neutral2 hover:text-secondary focus-visible:bg-neutral2"
      @click="closeMenu"
    >
      {{ item.label }}
    </a>
  </div>
</div>
```

- [ ] **Step 3: Run focused checks and verify GREEN**

Run: `npm run type-check && npm run test:unit -- src/components/Navbar.spec.ts --run && npm run lint`

Expected: all PASS.

- [ ] **Step 4: Commit test and popover implementation**

```bash
git add src/components/Navbar.vue src/components/Navbar.spec.ts
git commit -m "fix: polish navbar overflow popover"
```

---

### Task 4: Final Verification and PR Prep

**Files:**
- Verify: `src/components/Navbar.vue`
- Verify: `src/components/Navbar.spec.ts`
- Verify: `docs/superpowers/specs/2026-08-10-navbar-popover-design.md`
- Verify: `docs/superpowers/plans/2026-08-10-navbar-popover-polish.md`

**Interfaces:**
- Consumes: completed Tasks 1, 2, and 3.
- Produces: clean branch ready for PR.

- [ ] **Step 1: Run full requested verification**

Run:

```bash
npm run test:unit -- src/components/Navbar.spec.ts --run && npm run type-check && npm run lint && npm run build
```

Expected: all commands PASS.

- [ ] **Step 2: Inspect final diff**

Run:

```bash
git status --short
git diff main...HEAD -- src/components/Navbar.vue src/components/Navbar.spec.ts docs/superpowers/specs/2026-08-10-navbar-popover-design.md docs/superpowers/plans/2026-08-10-navbar-popover-polish.md
```

Expected: only the Navbar polish, focused test, and planning docs are included.

- [ ] **Step 3: Push branch and create PR**

Run:

```bash
git push -u origin fix/navbar-popover-polish
gh pr create \
  --base main \
  --head fix/navbar-popover-polish \
  --title "Polish NavigationBar overflow menu" \
  --body "## Summary\n- add a focused Navbar overflow menu test\n- restyle the NavigationBar overflow menu as a compact card-like popover\n- keep existing routes and close behavior while closing on menu selection\n- add design and implementation planning docs\n\n## Verification\n- npm run test:unit -- src/components/Navbar.spec.ts --run\n- npm run type-check\n- npm run lint\n- npm run build"
```

Expected: PR URL returned.
