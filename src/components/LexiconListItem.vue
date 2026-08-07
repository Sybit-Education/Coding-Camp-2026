<template>
  <RouterLink
    :to="`/lexiconDetail/${entry.id}`"
    :target="openInNewTab ? '_blank' : '_self'"
    :rel="openInNewTab ? 'noopener noreferrer' : undefined"
    class="group block"
  >
    <section
      :class="[
        'card my-3 flex gap-5 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md',
        recognitionConfidence === undefined ? 'items-center' : 'items-start',
      ]"
    >
      <img
        v-if="entry.imageUrl && !hasImageError"
        :src="entry.imageUrl"
        :alt="entry.name"
        :aria-label="`Bild von ${entry.name}`"
        class="list-item-image"
        @error="hasImageError = true"
      />
      <div
        v-else
        class="flex aspect-square h-1/3 w-1/3 shrink-0 items-center justify-center  bg-background-mute"

      >
        <img
          :src="fallbackImage"
          :aria-label="`${entry.name}: kein Bild verfügbar`"
          :alt="`${entry.name}: kein Bild verfügbar`"
          class="list-item-image grayscale opacity-50" />
      </div>

      <div class="min-w-0 flex-1 m-3 flex items-start justify-between">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2>{{ entry.name }}</h2>
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
            <p v-if="entry.latinName" class="text-text/60">{{ entry.latinName }}</p>
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
    </section>
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
  openInNewTab?: boolean
}>()

const hasImageError = ref(false)
</script>

<style lang="css" scoped>
@import '../styles.css';

.list-item-image {
  @apply aspect-square h-1/3 w-1/3 p-0 shrink-0 rounded-tl-xl rounded-bl-xl object-cover;
}

</style>
