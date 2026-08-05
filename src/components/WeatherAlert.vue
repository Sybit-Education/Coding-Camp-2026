<template>
  <article class="rounded-xl border border-border bg-background p-5 shadow-sm">
    <h2 class="mb-4 text-xl font-bold">Aktuelle Wetterlage</h2>

    <p v-if="loading">Wetterdaten werden geladen...</p>

    <div v-else-if="weather">
      <div class="text-4xl font-bold">{{ weather.temperature }} °C</div>

      <p class="mt-2 text-lg">
        {{ weather.condition }}
      </p>

      <div class="mt-4 space-y-2">
        <p>
          🌬 Wind:
          {{ weather.wind_speed }} km/h
        </p>

        <p>
          🌧 Niederschlag:
          {{ weather.precipitation }} mm
        </p>
      </div>

      <img
        v-if="weather.icon"
        :src="`https://brightsky.dev/images/weather_icons/${weather.icon}.png`"
        alt="Wettersymbol"
        class="mt-4 h-16 w-16"
      />
    </div>

    <p v-else class="text-red-500">Wetterdaten konnten nicht geladen werden.</p>
  </article>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getCurrentWeather } from '@/services/weather.service'
import type { CurrentWeather } from '@/shared/types/weather.types'

const weather = ref<CurrentWeather | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    weather.value = await getCurrentWeather()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
