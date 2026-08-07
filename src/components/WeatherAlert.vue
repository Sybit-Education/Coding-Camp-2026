<template>
  <article class="card p-3">
    <!-- Messages -->
    <p v-if="loading">Lädt...</p>
    <p v-else-if="!weather" class="text-destructive">Wetterdaten konnten nicht geladen werden.</p>

    <!-- Data  -->
    <div v-else class="space-y-6">
      <!-- Left -->
      <div class="flex items-center justify-between">
        <div>
          <p class="text-4xl font-bold">{{ weather.temperature }}°C</p>

          <p>
            {{ weatherCondition }}
          </p>
        </div>

        <component :is="weatherIcon" class="h-12 w-12" />
      </div>

      <!-- Right -->
      <div class="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
        <div>
          <p>Wind</p>
          <p>{{ weather.wind_speed_10 }} km/h</p>
        </div>

        <div>
          <p>Niederschlag</p>
          <p>{{ weather.precipitation_10 }} mm</p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import type { CurrentWeather } from '@/shared/types/weather.types'
import { getWeatherIcon, translateWeatherCondition } from '@/shared/utils/weatherTranslation'
import type { WeatherService } from '@/services/weather.service'

const weatherService = inject('weatherService') as WeatherService

const weather = ref<CurrentWeather | null>(null)
const loading = ref(true)

const weatherIcon = computed(() => {
  if (!weather.value) {
    return getWeatherIcon('')
  }

  return getWeatherIcon(weather.value.icon)
})

const weatherCondition = computed(() => {
  if (!weather.value) return ''

  return translateWeatherCondition(weather.value.condition)
})

onMounted(async () => {
  try {
    weather.value = await weatherService.getCurrentWeather()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
