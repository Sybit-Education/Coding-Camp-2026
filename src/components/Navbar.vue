<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MapIcon, InfoIcon, BookOpenTextIcon, MenuIcon, MicIcon, HouseIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'
const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function closeMenuOnOutsideClick(event: PointerEvent): void {
  if (menuRef.value && event.target instanceof Node && !menuRef.value.contains(event.target)) {
    open.value = false
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
    class="relative z-[1000] flex w-full shrink-0 justify-evenly bg-secondary/85 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
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
      <button class="btn btn-primary" @click="open = !open">
        <MenuIcon />
      </button>

      <!-- Dropdown menu -->
      <div
        v-if="open"
        class="absolute bottom-[calc(100%+0.5rem)] right-0 z-[1001] flex max-h-[calc(100dvh-6rem)] w-[min(14rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] flex-col gap-2 overflow-y-auto rounded-lg bg-secondary/95 p-2 shadow-xl"
      >
        <!-- About us -->
        <RouterLink to="/about">
          <button class="btn btn-primary w-full">About Us</button>
        </RouterLink>

        <RouterLink to="/dangerguide">
          <button class="btn btn-primary w-full whitespace-normal text-center">
            Gefahrenanleitung
          </button>
        </RouterLink>

        <!-- Impressum -->
        <a href="https://www.sybit.com/de/impressum" target="_blank" rel="noopener noreferrer">
          <button class="btn btn-primary w-full">Impressum</button>
        </a>
        <!-- bathing spots -->
        <RouterLink to="/bathingSpots">
          <button class="btn btn-primary w-full">Wo darf man baden?</button>
        </RouterLink>

        <!-- Data-protection -->
        <RouterLink to="/privacy-policy">
          <button class="btn btn-primary w-full">Datenschutz</button>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
