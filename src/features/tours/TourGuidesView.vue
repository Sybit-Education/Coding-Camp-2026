<template>
  <div class="page-view">
    <section class="mx-auto w-full max-w-4xl">
      <header class="mb-6">
        <h1 class="mb-2">Führungen auf der Mettnau</h1>
        <p class="max-w-2xl text-text">
          Entdecke aktuelle Naturführungen und erfahre mehr über die Mettnau.
        </p>
        <p v-if="tours.length" class="mt-2 text-sm text-text/60">
          {{ tours.length }} {{ tours.length === 1 ? 'Führung' : 'Führungen' }} verfügbar
        </p>
      </header>

      <p
        v-if="isLoading"
        class="rounded-xl border border-border bg-background-mute p-4 text-text"
        role="status"
      >
        Führungen werden geladen …
      </p>

      <div
        v-else-if="errorMessage"
        class="rounded-xl border border-border bg-background p-4 text-text"
        role="alert"
      >
        <h2 class="mb-1 text-xl text-heading">Führungen konnten nicht geladen werden</h2>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary mt-4" type="button" @click="loadTours">
          Erneut versuchen
        </button>
      </div>

      <div
        v-else-if="!tours.length"
        class="rounded-xl border border-border bg-background-mute p-4 text-text sm:p-6"
      >
        <h2 class="mb-1 text-xl text-heading">Keine Führungen verfügbar</h2>
        <p>Zurzeit sind keine Führungen für die Mettnau angekündigt.</p>
      </div>

      <section v-else class="space-y-4" aria-label="Verfügbare Führungen">
        <TourListItem v-for="tour in tours" :key="getTourKey(tour)" :tour="tour" />
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { TourGuidesService } from '@/services/tour-guides.service'
import type { GuidedTour } from '@/shared/types/tour-guides.types'
import { inject, onMounted, ref } from 'vue'
import TourListItem from './TourListItem.vue'

const tourService = inject<TourGuidesService>('tourGuidesService')
const tours = ref<GuidedTour[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

function getTourKey(tour: GuidedTour) {
  return `${tour.title}-${tour.start}-${tour.location}`
}

async function loadTours() {
  if (!tourService) {
    errorMessage.value = 'Der Dienst für Führungen ist derzeit nicht verfügbar.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await tourService.getTourGuides()
    tours.value = response.events
  } catch {
    errorMessage.value = 'Bitte prüfe deine Verbindung und versuche es anschließend erneut.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadTours)
</script>
