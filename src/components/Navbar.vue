<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MapIcon, RouteIcon, BookOpenTextIcon, MenuIcon, MicIcon, HouseIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'
const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const menuButtonRef = ref<HTMLButtonElement | null>(null)

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

function closeMenu(options: { restoreFocus?: boolean } = {}): void {
  open.value = false

  if (options.restoreFocus) {
    menuButtonRef.value?.focus()
  }
}

function closeMenuOnOutsideClick(event: PointerEvent): void {
  if (menuRef.value && event.target instanceof Node && !menuRef.value.contains(event.target)) {
    closeMenu()
  }
}

function closeMenuOnEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    closeMenu({ restoreFocus: true })
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', closeMenuOnOutsideClick)
  document.addEventListener('keydown', closeMenuOnEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsideClick)
  document.removeEventListener('keydown', closeMenuOnEscape)
})
</script>

<template>
  <nav class="navbar" aria-label="Hauptnavigation">
    <!-- Home page -->
    <RouterLink to="/">
      <button class="btn btn-primary" type="button" aria-label="Startseite öffnen"><HouseIcon /></button>
    </RouterLink>

    <!-- Map -->
    <RouterLink to="/map">
      <button class="btn btn-primary" type="button" aria-label="Karte öffnen"><MapIcon /></button>
    </RouterLink>

    <!-- Bird recognition -->
    <RouterLink to="/bird-recognition">
      <button class="btn btn-primary" type="button" aria-label="Vogelerkennung öffnen"><MicIcon /></button>
    </RouterLink>

    <!-- Lexicon -->
    <RouterLink to="/lexicon">
      <button class="btn btn-primary" type="button" aria-label="Lexikon öffnen"><BookOpenTextIcon /></button>
    </RouterLink>

    <!-- Guided tours -->
    <RouterLink to="/tours">
      <button class="btn btn-primary"  type="button" aria-label="Führungen anzeigen"><RouteIcon/></button>
    </RouterLink>

    <!-- Dropdown -->
    <div ref="menuRef" class="relative">
      <!-- Hamburger trigger -->
      <button
        ref="menuButtonRef"
        class="btn btn-primary"
        type="button"
        aria-label="Weitere Navigation öffnen"
        :aria-expanded="open"
        aria-controls="navbar-overflow-menu"
        @click="open = !open"
      >
        <MenuIcon />
      </button>

      <!-- Dropdown menu -->
      <div
        v-if="open"
        id="navbar-overflow-menu"
        class="navbar-popover"
        role="menu"
        aria-labelledby="navbar-overflow-label"
      >
        <div id="navbar-overflow-label" class="navbar-popover-label">
          Mehr
        </div>

        <div class="navbar-popover-list">
          <RouterLink
            v-for="item in internalMenuItems"
            :key="item.to"
            :to="item.to"
            class="navbar-popover-link"
            role="menuitem"
            @click="closeMenu()"
          >
            {{ item.label }}
          </RouterLink>

          <a
            v-for="item in externalMenuItems"
            :key="item.href"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar-popover-link"
            role="menuitem"
            @click="closeMenu()"
          >
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>
