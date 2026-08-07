<template>
  <div class="relative h-dvh">
    <div ref="mapContainer" class="z-0 h-full min-h-100 w-full"></div>

    <RouterLink
      to="/tours"
      type="button"
      class="absolute top-4 right-4 z-1000 cursor-pointer rounded-md bg-white px-3.5 py-2.5 font-semibold text-gray-800 shadow-md hover:bg-gray-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      aria-label="Touren entdecken"
      title="Touren entdecken"
    >
      Touren entdecken
    </RouterLink>
  </div>
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
  width: 100%;
  height: 100%;
}

.map:focus-visible {
  @apply outline-3 outline-offset-[-3px];
  outline-color: var(--color-primary);
}
</style>
