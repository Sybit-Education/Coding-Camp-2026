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
      <AutoTextToSpeech
          :targetSelector="'article'"
          lang="de-DE"
        />
      <div
        v-else
        class="flex aspect-square w-full items-center justify-center bg-background-mute"
        :aria-label="`${entry.name}: kein Bild verfügbar`"
      >
        <img :src="fallbackImage" alt="" class="h-1/2 w-1/2 grayscale opacity-50" />
      </div>
       <article class="p-5">
        <h1 class="text-2xl font-bold text-heading">{{ entry.name }}</h1>
        <p class="mt-3 text-text">{{ entry.description }}</p>

        <!-- Audio Title -->
        <h2 v-if="soundID.length !== 0" class="text-xl font-bold mt-4">Sounds</h2>

        <!-- Audio container -->
        <div class="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Audio -->
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
import type { LexiconService } from '@/services/lexicon.service'
import fallbackImage from '@/assets/logo.svg'
import type { AnimalAudioListEntry } from '@/shared/types/audio.types'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import XenoPlayer from '@/components/XenoPlayer.vue'
import type { AudioService } from '@/services/audio.service'

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
const hasImageError = ref(false)
const soundID = ref<AnimalAudioListEntry[]>([])

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
