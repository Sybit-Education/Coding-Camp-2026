<template>
  <RouterLink
    :to="`/lexiconDetail/${entry.id}`"
    :target="openInNewTab ? '_blank' : '_self'"
    :rel="openInNewTab ? 'noopener noreferrer' : undefined"
    class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    <article
      :class="[
        'flex gap-5 rounded-xl border border-border bg-background p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md',
        recognitionConfidence === undefined ? 'items-center' : 'items-start',
      ]"
    >
      <img
        v-if="entry.imageUrl && !hasImageError"
        :src="entry.imageUrl"
        :alt="entry.name"
        class="aspect-square h-24 w-24 shrink-0 rounded-lg object-cover"
        @error="hasImageError = true"
      />
      <div
        v-else
        class="flex aspect-square h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-background-mute"
        :aria-label="`${entry.name}: kein Bild verfügbar`"
      >
        <img :src="fallbackImage" alt="" class="h-1/2 w-1/2 grayscale opacity-50" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-3">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xl font-bold text-heading">{{ entry.name }}</h2>
              <span
                v-if="entry.isProtected"
                class="flex items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs text-white"
              >
                <LeafIcon :size="14" aria-hidden="true" />
                Geschützt
              </span>
              <span
                v-if="entry.toxicityLevel"
                class="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                :aria-label="`Giftigkeit: ${entry.toxicityLevel.description}`"
                :title="entry.toxicityLevel.description"
              >
                <SkullIcon :size="14" aria-hidden="true" />
                {{ entry.toxicityLevel.type }}
              </span>
            </div>
            <p v-if="scientificName" class="text-sm text-text/60">{{ scientificName }}</p>
          </div>
          <span
            v-if="recognitionConfidence !== undefined"
            class="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-medium text-white"
          >
            {{ recognitionConfidence }} %
          </span>
        </div>
        <p class="mt-1 text-text">{{ entry.description }}</p>
      </div>
    </article>
  </RouterLink>
</template>

<script setup lang="ts">
import fallbackImage from '@/assets/logo.svg'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { LeafIcon, SkullIcon } from '@lucide/vue'
import { ref } from 'vue'

defineProps<{
  entry: LexiconListEntry
  recognitionConfidence?: number
  scientificName?: string | null
  openInNewTab?: boolean
}>()

const hasImageError = ref(false)
</script>
