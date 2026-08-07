<template>
  <div class="page-view">
    <div class="mx-auto w-full max-w-4xl">
      <RouterLink
        to="/tours"
        class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
      >
        <ArrowLeft :size="18" aria-hidden="true" />
        Zurück zu den Führungen
      </RouterLink>

      <article
        v-if="tour"
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
          <h1 class="mb-6 break-words">{{ tour.title }}</h1>

          <dl class="space-y-4">
            <div class="flex items-start gap-3">
              <MapPin :size="20" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt class="text-sm font-medium text-text/60">Treffpunkt</dt>
                <dd class="break-words font-semibold text-text">{{ tour.location }}</dd>
              </div>
            </div>

            <div v-if="addressLabel" class="flex items-start gap-3">
              <MapPinned :size="20" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt class="text-sm font-medium text-text/60">Adresse</dt>
                <dd class="break-words text-text">{{ addressLabel }}</dd>
              </div>
            </div>

            <div v-if="tour.source" class="flex items-start gap-3">
              <Building2 :size="20" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <dt class="text-sm font-medium text-text/60">Veranstalter</dt>
                <dd class="break-words text-text">{{ tour.source }}</dd>
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
        <h1 id="unavailable-heading" class="mb-2">Tourdetails nicht verfügbar</h1>
        <p class="max-w-2xl text-text">
          Diese Führung konnte nicht geladen werden. Bitte wähle die Führung erneut aus der
          Übersicht aus.
        </p>
        <RouterLink to="/tours" class="btn btn-primary mt-6">
          Zu den Führungen
        </RouterLink>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GuidedTour } from '@/shared/types/tour-guides.types'
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ExternalLink,
  MapPin,
  MapPinned,
} from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

function isGuidedTour(value: unknown): value is GuidedTour {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  return typeof candidate.title === 'string' && typeof candidate.start === 'string'
}

const route = useRoute()

function getTourFromQuery(): GuidedTour | undefined {
  const serializedTour = route.query.tour

  if (typeof serializedTour !== 'string') {
    return undefined
  }

  try {
    const parsedTour: unknown = JSON.parse(serializedTour)
    return isGuidedTour(parsedTour) ? parsedTour : undefined
  } catch {
    return undefined
  }
}

const tour = getTourFromQuery()

const startDate = computed(() => {
  if (!tour) {
    return undefined
  }

  const date = new Date(tour.start)
  return Number.isNaN(date.getTime()) ? undefined : date
})

const dateTimeLabel = computed(() => {
  if (!tour) {
    return ''
  }

  if (!startDate.value) {
    return tour.start
  }

  const hasTime = tour.start.includes('T')

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

const addressLabel = computed(() => {
  if (!tour) {
    return ''
  }

  return [tour.postalCode, tour.city].filter(Boolean).join(' ')
})
</script>
