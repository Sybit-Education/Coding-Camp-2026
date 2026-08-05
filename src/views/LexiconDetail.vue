<template>
  <main class="mx-auto w-full max-w-md px-4 py-4">
    <div
      v-if="entry"
      class="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    >
      <img
        v-if="entry.imageUrl && !hasImageError"
        :src="entry.imageUrl"
        :alt="entry.name"
        class="aspect-square w-full object-cover"
        @error="hasImageError = true"
      />
      <div
        v-else
        class="flex aspect-square w-full items-center justify-center bg-background-mute"
        :aria-label="`${entry.name}: kein Bild verfügbar`"
      >
        <img :src="fallbackImage" alt="" class="h-1/2 w-1/2 grayscale opacity-50" />
      </div>

      <AutoTextToSpeech :targetSelector="'article'" lang="de-DE" />

      <article class="p-5">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-2xl font-bold text-heading">{{ entry.name }}</h1>
          <span
            v-if="entry.isProtected"
            class="rounded-full bg-green-600 px-2 py-1 text-xs text-white"
          >
            Geschützt
          </span>
          <span
            v-if="entry.isPoisonous"
            class="rounded-full bg-red-600 px-2 py-1 text-xs text-white"
          >
            Giftig
          </span>
        </div>

        <p class="mt-3 text-text">{{ entry.description }}</p>

        <h2 v-if="soundID.length !== 0" class="mt-4 text-xl font-bold">Sounds</h2>

        <div class="mb-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <XenoPlayer
            v-for="item in soundID"
            :key="item.id"
            :id="item.xenocanto_id"
            :darkBackground="false"
          />
        </div>
      </article>
    </div>
  </main>
</template>

<script setup lang="ts">
import AutoTextToSpeech from '@/components/AutoTextToSpeech.vue'
import fallbackImage from '@/assets/logo.svg'
import XenoPlayer from '@/components/XenoPlayer.vue'
import type { AudioService } from '@/services/audio.service'
import type { LexiconService } from '@/services/lexicon.service'
import type { AnimalAudioListEntry } from '@/shared/types/audio.types'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const lexiconService = inject('lexiconService') as LexiconService
const audioService = inject('audioService') as AudioService

const id = computed(() => {
  const route = useRoute()
  return route.params.id?.toString()
})

const entry = ref<LexiconEntry>()
const hasImageError = ref(false)
const soundID = ref<AnimalAudioListEntry[]>([])

onMounted(async () => {
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  entry.value = await lexiconService.getLexiconEntryById(id.value)
  soundID.value = await audioService.getAudioIdsForLexiconEntry(id.value)
})
</script>
