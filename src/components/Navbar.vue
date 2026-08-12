<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MapIcon, RouteIcon, BookOpenTextIcon, MenuIcon, MicIcon, HouseIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'
const open = ref(false)
const menuRef = ref<HTMLElement | null>(null)

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

    <!-- Guided tours -->
    <RouterLink to="/tours">
      <button class="btn btn-primary"><RouteIcon/></button>
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
        class="absolute bottom-[calc(100%+0.5rem+4px)] right-0 z-1001 flex max-h-[calc(100dvh-6rem)] w-[min(14rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] flex-col gap-2 overflow-y-auto rounded-t-2xl bg-secondary/33 p-2 shadow-xl"
      >
        <!-- About us -->
        <RouterLink to="/about" @click="closeMenu">
          <button class="btn btn-primary w-full">About Us</button>
        </RouterLink>

        <RouterLink to="/dangerguide" @click="closeMenu">
          <button class="btn btn-primary w-full whitespace-normal text-center">
            Gefahrenanleitung
          </button>
        </RouterLink>

        <!-- bathing spots -->
        <RouterLink to="/bathing-spots" @click="closeMenu">
          <button class="btn btn-primary w-full">Wo darf man baden?</button>
        </RouterLink>

        <!-- Impressum -->
        <a href="https://www.sybit.com/de/impressum" target="_blank" rel="noopener noreferrer">
          <button class="btn btn-primary w-full">Impressum</button>
        </a>


        <!-- Data-protection -->
        <RouterLink to="/privacy-policy" @click="closeMenu">
          <button class="btn btn-primary w-full">Datenschutz</button>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
