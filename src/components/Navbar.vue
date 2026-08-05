<script setup lang="ts">
import { ref } from 'vue'
import { MapIcon, InfoIcon, BookOpenTextIcon, MenuIcon } from '@lucide/vue'
import { RouterLink } from 'vue-router'

const open = ref(false)
</script>

<template>
  <div class="flex justify-evenly inset-x-0 bottom-0 p-3 bg-secondary/85 fixed z-50">
    <!-- Home page -->
    <RouterLink to="/">
      <button class="btn btn-primary"><InfoIcon /></button>
    </RouterLink>

    <!-- Map -->
    <RouterLink to="/map">
      <button class="btn btn-primary"><MapIcon /></button>
    </RouterLink>

    <!-- Lexicon -->
    <RouterLink to="/lexicon">
      <button class="btn btn-primary"><BookOpenTextIcon /></button>
    </RouterLink>

    <!-- Dropdown -->
    <div class="relative">
      <!-- Hamburger trigger -->
      <button class="btn btn-primary" @click="open = !open">
        <MenuIcon />
      </button>

      <!-- Dropdown menu -->
      <div
        v-if="open"
        class="absolute bottom-14 left-1/2 mb-2 -translate-x-1/2 origin-bottom flex flex-col gap-2 rounded-lg bg-secondary/90 p-2 shadow-lg"
      >
        <!-- About us -->
        <RouterLink to="/">
          <button class="btn btn-primary w-full">About Us</button>
        </RouterLink>

        <!-- Impressum -->
        <RouterLink to="/imprint">
          <button class="btn btn-primary w-full">Impressum</button>
        </RouterLink>

        <!-- Data-protection -->
        <RouterLink to="/dataprotection">
          <button class="btn btn-primary w-full">Datenschutz</button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
