<template>
  <div
    ref="mapContainer"
    class="map"
    role="region"
  ></div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { MapService } from '@/services/map.service'

const mapService = inject('mapService') as MapService
const mapContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  if (mapContainer.value) {
    mapService.initialize(mapContainer.value)
  }
})
</script>

<style lang="postcss">
  .map {
    @apply w-screen h-dvh fixed;
  }
  .map:focus-visible {
    @apply outline-3 outline-offset-[-3px];
    outline-color: var(--color-primary);
  }
</style>
