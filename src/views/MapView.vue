<!-- MapView.vue -->
<template>
  <div class="relative w-full h-dvh bg-black">
    <button
      @click="toggleRoute"
      class="absolute top-4 right-4 z-1000 px-4 py-2 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
    >
      {{ showRoute ? 'Route ausblenden' : 'Route anzeigen' }}
    </button>

    <div ref="mapContainer" class="map-container bg-black h-dvh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { MapService } from '@/services/map.service'
import type L from 'leaflet'

const mapService = inject('mapService') as MapService
const mapContainer = ref<HTMLDivElement | null>(null)
const showRoute = ref(false)

const routeWaypoints: L.LatLngExpression[] = [
  [47.733820222593046, 8.980158674040306], // Start
  //[47.727111741708896, 8.99621393716252],                        // Zwischenstopp 1
  [47.725592257543816, 8.999595821648448], // Zwischenstopp 2
  [47.72166443267375, 9.015671974922551], // Ziel
]

const toggleRoute = () => {
  showRoute.value = !showRoute.value

  if (showRoute.value) {
    mapService.addRoute(routeWaypoints)
  } else {
    mapService.removeRoute()
  }
}

onMounted(() => {
  if (mapContainer.value) {
    mapService.initialize(mapContainer.value)
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  min-height: 400px;
  z-index: 0;
}
</style>
