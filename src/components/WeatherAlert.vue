<template>
  <article class="rounded-lg border border-border bg-background p-6">
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

  <!-- Warnings -->
  <div v-if="warnings.length" class="mt-4 space-y-4">
    <!-- Title-->
    <div class="rounded-lg bg-red-100 p-4 border-red-500">
      <h2 class="font-bold text-red-700 text-xl">Warnungen</h2>

      <p class="text-sm text-red-600">Aktuelle Warnungen für die Mettnau</p>
    </div>

    <!--Every Weather Warning-->
    <article
      v-for="warning in warnings"
      :key="warning.event + warning.expires"
      class="rounded-lg border border-red-500 bg-red-50 p-6"
    >
      <h3 class="font-bold text-red-700">
        {{ warning.headline }}
      </h3>

      <p class="mt-2 text-text">
        {{ warning.description }}
      </p>

      <div class="mt-4 border-t border-red-200 pt-3 text-sm">
        <p>
          <span class="font-semibold text-red-700">Gültig:</span>
          {{ new Date(warning.onset).toLocaleString('de-DE') }}
          -
          {{ new Date(warning.expires).toLocaleString('de-DE') }}
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import type { CurrentWeather } from '@/shared/types/weather.types'
import { getWeatherIcon, translateWeatherCondition } from '@/shared/utils/weatherTranslation'
import type { WeatherService } from '@/services/weather.service'
import type { WeatherWarning } from '@/shared/types/weather-warning.types'

const weatherService = inject('weatherService') as WeatherService

const weather = ref<CurrentWeather | null>(null)
const loading = ref(true)

const warnings = ref<WeatherWarning[]>([])

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
  }

  try {
    warnings.value = await weatherService.getWarnings()
  } catch (error) {
    console.error(error)
  }

  loading.value = false
})
</script>
