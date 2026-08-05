<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="mx-auto w-full h-full max-w-max min-w-max space-y-4 px-4 py-4 pb-24">
    <RouterView />
  </main>
  <Navbar />
</template>
