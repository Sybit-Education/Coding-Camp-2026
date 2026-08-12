<template>
  <main>
      <RouterLink
        to="/tours"
        class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
      >
        <ArrowLeft :size="18" aria-hidden="true" />
        Zurück zu den Führungen
      </RouterLink>

      <p
        v-if="isLoading"
        class="rounded-xl border border-border bg-background-mute p-4 text-text"
        role="status"
      >
        Tourdetails werden geladen …
      </p>

      <section
        v-else-if="errorMessage"
        class="rounded-xl border border-border bg-background p-4 shadow-sm sm:p-6"
        aria-labelledby="error-heading"
        role="alert"
      >
        <h1 id="error-heading" class="mb-2">Tourdetails konnten nicht geladen werden</h1>
        <p class="max-w-2xl text-text">{{ errorMessage }}</p>
        <button class="btn btn-primary mt-6" type="button" @click="loadTour">
          Erneut versuchen
        </button>
      </section>

      <article
        v-else-if="tour"
        class="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
      >
        <header class="bg-primary p-5 text-white sm:p-6">
          <div class="flex items-start gap-3">
            <CalendarDays :size="24" class="mt-1 shrink-0" aria-hidden="true" />
            <div>
              <p class="text-sm font-medium text-white/85">Termin</p>
              <time :datetime="tour.start" class="text-lg font-semibold sm:text-xl">
                {{ dateTimeLabel }}
              </time>
            </div>
          </div>
        </header>

        <section class="p-4 sm:p-6">
          <h1 class="mb-6 wrap-break-word">{{ tour.title }}</h1>

          <dl class="space-y-4">
            <div class="flex items-start gap-3">
              <MapPin :size="20" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt class="text-sm font-medium text-text/60">Treffpunkt</dt>
                <dd class="wrap-break-word font-semibold text-text">{{ tour.location }}</dd>
              </div>
            </div>

            <div v-if="addressLabel" class="flex items-start gap-3">
              <MapPinned :size="20" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt class="text-sm font-medium text-text/60">Adresse</dt>
                <dd class="wrap-break-word text-text">{{ addressLabel }}</dd>
              </div>
            </div>

            <div v-if="tour.source" class="flex items-start gap-3">
              <Building2 :size="20" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt class="text-sm font-medium text-text/60">Veranstalter</dt>
                <dd class="wrap-break-word text-text">{{ tour.source }}</dd>
              </div>
            </div>
          </dl>

          <a
            v-if="tour.sourceUrl"
            :href="tour.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary mt-8 w-full gap-2 sm:w-auto"
          >
            Weitere Informationen
            <ExternalLink :size="18" aria-hidden="true" />
          </a>
        </section>
      </article>

      <section
        v-else
        class="rounded-xl border border-border bg-background p-4 shadow-sm sm:p-6"
        aria-labelledby="unavailable-heading"
      >
        <h1 id="unavailable-heading" class="mb-2">Tour nicht gefunden</h1>
        <p class="max-w-2xl text-text">
          Diese Führung ist nicht verfügbar oder wurde inzwischen entfernt.
        </p>
        <RouterLink to="/tours" class="btn btn-primary mt-6"> Zu den Führungen </RouterLink>
      </section>
  </main>
</template>

<script setup lang="ts">
import { getTourId } from '@/shared/utils/tour-id'
import type { TourGuidesService } from '@/services/tour-guides.service'
import type { GuidedTour } from '@/shared/types/tour-guides.types'
import { ArrowLeft, Building2, CalendarDays, ExternalLink, MapPin, MapPinned } from '@lucide/vue'
import { computed, inject, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tourService = inject<TourGuidesService>('tourGuidesService')
const tour = ref<GuidedTour>()
const isLoading = ref(true)
const errorMessage = ref('')

const routeId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : undefined
})

const startDate = computed(() => {
  if (!tour.value) {
    return undefined
  }

  const date = new Date(tour.value.start)
  return Number.isNaN(date.getTime()) ? undefined : date
})

const dateTimeLabel = computed(() => {
  if (!tour.value) {
    return ''
  }

  if (!startDate.value) {
    return tour.value.start
  }

  const hasTime = tour.value.start.includes('T')

  return new Intl.DateTimeFormat(
    'de-DE',
    hasTime
      ? {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      : {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        },
  ).format(startDate.value)
})

const addressLabel = computed(() =>
  tour.value ? [tour.value.postalCode, tour.value.city].filter(Boolean).join(' ') : '',
)

async function loadTour() {
  if (!tourService) {
    errorMessage.value = 'Der Dienst für Führungen ist derzeit nicht verfügbar.'
    isLoading.value = false
    return
  }

  if (!routeId.value) {
    errorMessage.value = 'Die Tour-Adresse ist ungültig.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  tour.value = undefined

  try {
    const response = await tourService.getTourGuides()
    tour.value = response.events.find((event) => getTourId(event) === routeId.value)
  } catch {
    errorMessage.value = 'Bitte prüfe deine Verbindung und versuche es anschließend erneut.'
  } finally {
    isLoading.value = false
  }
}

watch(routeId, loadTour, { immediate: true })
</script>
