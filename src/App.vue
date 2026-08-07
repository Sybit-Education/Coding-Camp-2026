<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showHeader = computed(() => route.name !== 'map')
</script>

<template>
  <div class="app-shell">
    <HeaderComponent v-if="showHeader" class="shrink-0" />

    <main class="app-content" :class="{ 'map-content': route.name === 'map' }">
      <RouterView />
    </main>

    <Navbar />
  </div>
</template>
