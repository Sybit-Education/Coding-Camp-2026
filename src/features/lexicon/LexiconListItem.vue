<template>
  <RouterLink
    :to="`/lexicon/${entry.id}`"
    :target="openInNewTab ? '_blank' : '_self'"
    :rel="openInNewTab ? 'noopener noreferrer' : undefined"
    class="group block"
  >
    <section
      :class="[
        'card flex min-w-0 h-38 gap-3 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md sm:gap-5',
        recognitionConfidence === undefined ? 'items-center' : 'items-start',
      ]"
    >
      <img
        v-if="entry.imageUrl && !hasImageError"
        :src="entry.imageUrl"
        :alt="entry.name"
        :aria-label="`Bild von ${entry.name}`"
        class="list-item-image min-h-full w-28 sm:w-40 self-stretch"
        @error="hasImageError = true"
      />
      <div
        v-else
        class="flex min-h-full w-28 sm:w-40 self-stretch"
      >
        <img
          :src="fallbackImage"
          :aria-label="`${entry.name}: kein Bild verfügbar`"
          :alt="`${entry.name}: kein Bild verfügbar`"
          class="list-item-image min-h-full "
        />
      </div>

      <div class="min-w-0 flex-1 p-2 sm:p-3">
        <div class="flex min-w-0 items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 border">
              <h2 class="wrap-break-word border">{{ entry.name }}</h2>

              <MettnauHighlightBadge v-if="entry.isProtected" />
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
            class="max-w-full shrink-0 rounded-full bg-primary px-2 py-1 text-xs font-medium text-white sm:px-3 sm:text-sm"
          >
            {{ recognitionConfidence }} %
          </span>
        </div>
      </div>
    </section>
  </RouterLink>
</template>

<script setup lang="ts">
import fallbackImage from '/img/mettnau-logo.svg'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { LeafIcon, SkullIcon } from '@lucide/vue'
import { ref } from 'vue'
import MettnauHighlightBadge from './MettnauHighlightBadge.vue';

defineProps<{
  entry: LexiconListEntry
  recognitionConfidence?: number
  openInNewTab?: boolean
}>()

const hasImageError = ref(false)
</script>

<style lang="css" scoped>
@import '../../styles.css';

.list-item-image {
  @apply bg-background-mute p-0 shrink-0 rounded-tl-xl rounded-bl-xl object-cover;
}
</style>
