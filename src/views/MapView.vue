<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
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
