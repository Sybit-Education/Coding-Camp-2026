<template>
  <RouterLink
    :to="`/tour/${tour.id}`"
    class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    <h2>{{ tour.title }}</h2>
    <p>{{ tour.description }}</p>
  </RouterLink>
</template>
<script setup lang="ts">
import type { TourGuide } from '@/shared/types/tour-guides.types'

defineProps<{
  tour: TourGuide
}>()
</script>
