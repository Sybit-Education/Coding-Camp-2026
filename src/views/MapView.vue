<template>
  <div class="relative h-dvh">
    <div ref="mapContainer" class="z-0 h-full min-h-100 w-full"></div>


  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from 'vue'
import type { MapService } from '@/services/map.service'

const mapService = inject('mapService') as MapService
const mapContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  if (mapContainer.value) {
    mapService.initialize(mapContainer.value)
  }
})

onUnmounted(() => {
  mapService.destroy()
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
