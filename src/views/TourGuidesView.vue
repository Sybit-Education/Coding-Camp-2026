<template>
  <div>
    <h1>Tour Guides</h1>
    <ul>
      <li v-for="tour in tours" :key="tour.id">
        {{ tour.title }}
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { TourGuidesService } from '@/services/tour-guides.service'
import { computedAsync } from '@vueuse/core'
import { inject } from 'vue'

const tourService = inject('tourGuidesService') as TourGuidesService

const tours = computedAsync(async () => await tourService.getTourGuides())
</script>
