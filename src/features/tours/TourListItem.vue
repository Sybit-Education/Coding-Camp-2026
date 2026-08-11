<template>
  <RouterLink
    :to="`/tour/${tourId}`"
    class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    :aria-label="`Details zur Führung ${tour.title} ansehen`"
  >
    <article
      class="flex min-w-0 overflow-hidden rounded-xl border border-border bg-background shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md"
    >
      <div
        class="flex w-24 shrink-0 flex-col items-center justify-center bg-primary p-3 text-center text-white sm:w-28"
      >
        <CalendarDays :size="20" aria-hidden="true" />
        <time :datetime="tour.start" class="mt-2 text-xs font-semibold leading-tight">
          {{ dateLabel }}
        </time>
        <span v-if="timeLabel" class="mt-1 text-xs text-white/85">{{ timeLabel }}</span>
      </div>

      <div class="min-w-0 flex-1 p-4 sm:p-5">
        <div class="flex min-w-0 items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="mb-1 wrap-break-word text-xl text-heading">{{ tour.title }}</h2>
            <p class="flex items-start gap-2 wrap-break-word text-sm text-text">
              <MapPin :size="16" class="mt-1 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <span class="font-medium">{{ tour.location }}</span>
                <span v-if="addressLabel" class="block text-text/60">{{ addressLabel }}</span>
              </span>
            </p>
          </div>

          <ArrowRight
            :size="20"
            class="mt-1 shrink-0 text-primary transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>

        <span class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Details ansehen
          <ArrowRight :size="16" aria-hidden="true" />
        </span>
      </div>
    </article>
  </RouterLink>
</template>

<script setup lang="ts">
import { getTourId } from '@/shared/utils/tour-id'
import type { GuidedTour } from '@/shared/types/tour-guides.types'
import { ArrowRight, CalendarDays, MapPin } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{
  tour: GuidedTour
}>()

const tourId = computed(() => getTourId(props.tour))

const startDate = computed(() => {
  const date = new Date(props.tour.start)
  return Number.isNaN(date.getTime()) ? undefined : date
})

const dateLabel = computed(() => {
  if (!startDate.value) {
    return props.tour.start
  }

  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(startDate.value)
})

const timeLabel = computed(() => {
  if (!startDate.value || !props.tour.start.includes('T')) {
    return undefined
  }

  return new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(startDate.value)
})

const addressLabel = computed(() =>
  [props.tour.postalCode, props.tour.city].filter(Boolean).join(' '),
)
</script>
