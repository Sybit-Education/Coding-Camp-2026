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

<template>
  <nav
    class="fixed bottom-0 left-1/2 z-1000 flex -translate-x-1/2 justify-evenly gap-3 rounded-2xl bg-secondary/33 mb-5 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
  >
    <!-- Home page -->
    <RouterLink to="/">
      <button class="btn btn-primary"><HouseIcon /></button>
    </RouterLink>

    <!-- Map -->
    <RouterLink to="/map">
      <button class="btn btn-primary"><MapIcon /></button>
    </RouterLink>

    <!-- Bird recognition -->
    <RouterLink to="/bird-recognition">
      <button class="btn btn-primary"><MicIcon /></button>
    </RouterLink>

    <!-- Lexicon -->
    <RouterLink to="/lexicon">
      <button class="btn btn-primary"><BookOpenTextIcon /></button>
    </RouterLink>

    <!-- Dropdown -->
    <div ref="menuRef" class="relative">
      <!-- Hamburger trigger -->
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

      <!-- Dropdown menu -->
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
    </div>
  </nav>
</template>
