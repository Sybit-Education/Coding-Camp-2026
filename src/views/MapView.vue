<!-- MapView.vue -->
<template>
  <div class="relative h-dvh w-full bg-black">
    <div ref="mapContainer" class="map-container h-dvh bg-black"></div>

    <div class="absolute top-4 right-4 z-1000 flex gap-2">

      <button
        type="button"
        class="rounded-lg bg-white px-4 py-2 font-semibold text-black shadow-md transition-colors duration-200 hover:bg-gray-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        @click="toggleRoute"
      >
        {{ showRoute ? 'Route ausblenden' : 'Route anzeigen' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type L from 'leaflet'
import { inject, onMounted, onUnmounted, ref } from 'vue'
import type { MapService } from '@/services/map.service'

const mapService = inject('mapService') as MapService
const mapContainer = ref<HTMLDivElement | null>(null)
const showRoute = ref(false)

const routeWaypoints: L.LatLngExpression[] = [
  [47.7321318891516, 8.985194406835003],
  [47.731143669968596, 8.991063792852087],
  [47.73624028369614, 8.986056096357004],
  [47.72974636221454, 8.988998804754845],
  [47.725592257543816, 8.999595821648448],
  [47.72166443267375, 9.015671974922551],
]

function toggleRoute() {
  showRoute.value = !showRoute.value

  if (showRoute.value) {
    void mapService.addRoute(routeWaypoints)
  } else {
    mapService.removeRoute()
  }
}

onMounted(() => {
  if (mapContainer.value) {
    mapService.initialize(mapContainer.value)
  }
})

onUnmounted(() => {
  mapService.destroy()
})
</script>

<style scoped lang="postcss">
.map-container {
  width: 100%;
  min-height: 400px;
  z-index: 0;
}
</style>
