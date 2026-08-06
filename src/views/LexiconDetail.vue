<template>
  <main class="mx-auto w-full max-w-sm space-y-4 px-4 py-4 pb-24">
    <article
      v-if="entry"
      class="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    >
      <img :src="entry.imageUrl" :alt="entry.name" class="aspect-square w-full object-cover" />
      <div class="p-4">
        <h1 class="text-2xl font-bold text-heading">{{ entry.name }}</h1>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-if="entry.isProtected"
            class="flex w-fit items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs text-white"
          >
            <LeafIcon :size="14" />
            Geschützt
          </span>
          <span
            v-if="toxicityReference"
            class="flex w-fit items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
            :aria-label="`Giftigkeit: ${toxicityReference.label}`"
            :title="toxicityReference.label"
          >
            <SkullIcon :size="14" />
            {{ toxicityReference.type }}
          </span>
        </div>
        <p v-if="toxicityReference" class="mt-2 text-sm text-text">
          {{ toxicityReference.description }}
        </p>
        <p class="mt-3 text-text">{{ entry.description }}</p>
      </div>
    </article>

    <section
      v-if="soundID.length"
      class="space-y-3 rounded-xl border border-border bg-background p-4 shadow-sm"
      aria-labelledby="sounds-heading"
    >
      <h2 id="sounds-heading" class="text-xl font-bold text-heading">Sounds</h2>
      <div class="space-y-3">
        <XenoPlayer
          v-for="item in soundID"
          :key="item.id"
          :id="item.xenocanto_id"
          :darkBackground="false"
        />
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import type { AudioService } from '@/services/audio.service'
import type { LexiconService } from '@/services/lexicon.service'
import type { AnimalAudioListEntry } from '@/shared/types/audio.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import XenoPlayer from '@/components/XenoPlayer.vue'
import { LeafIcon, SkullIcon } from '@lucide/vue'
import type { LexiconEntry } from '@/shared/types/lexicon.types'

// Service
const lexiconService = inject('lexiconService') as LexiconService
const audioService = inject('audioService') as AudioService

// Gets id
const id = computed(() => {
  const route = useRoute()
  return route.params.id?.toString()
})

// Entry info
const entry = ref<LexiconEntry>()
const soundID = ref<AnimalAudioListEntry[]>([])

const toxicityReference = computed(() => {
  if (entry.value?.toxicityLevel && typeof entry.value.toxicityLevel === 'string') {
    return undefined
  } else if (entry.value?.toxicityLevel && typeof entry.value.toxicityLevel === 'object') {
    return entry.value.toxicityLevel
  }
  return undefined
})

// On mount
onMounted(async () => {
  // Checks if id exists
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  // Loads data
  entry.value = await lexiconService.getLexiconEntryById(id.value)
  soundID.value = await audioService.getAudioIdsForLexiconEntry(id.value)
})
</script>
