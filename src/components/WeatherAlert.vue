<template>
  <article class="rounded-lg border border-border bg-background p-6">
    <p v-if="loading" class="text-muted-foreground">Lädt...</p>
    <p v-else-if="!weather" class="text-red-500">Wetterdaten konnten nicht geladen werden.</p>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-4xl font-bold">{{ weather.temperature }}°C</p>

          <p>
            {{ weatherCondition }}
          </p>
        </div>

        <component :is="weatherIcon" class="h-12 w-12" />
      </div>

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
import { computed, onMounted, ref } from 'vue'

import { getCurrentWeather } from '@/services/weather.service'
import type { CurrentWeather } from '@/shared/types/weather.types'
import { getWeatherIcon, translateWeatherCondition } from '@/shared/utils/weatherTranslation'

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
    weather.value = await getCurrentWeather()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
