<template>
  <div
    ref="mapContainer"
    class="bg-black h-dvh"
    style="
      .map-container {
        width: 100%;
        min-height: 400px;
      }
    "
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
