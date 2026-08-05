<template>
  <main class="mx-auto w-full max-w-md px-4 py-4">
    <!-- Card -->
    <article
      v-if="entry"
      class="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    >
      <img :src="entry.imageUrl" :alt="entry.name" class="aspect-square w-full object-cover" />
      <div class="p-5">
        <h1 class="text-2xl font-bold text-heading">{{ entry.name }}</h1>
        <p class="mt-3 text-text">{{ entry.description }}</p>
      </div>
    </article>

    <!-- Audio Title -->
    <h1 v-if="soundID.length !== 0" class="text-xl font-bold mt-4">Sounds</h1>

    <!-- Audio container -->
    <div class="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Audio -->
      <iframe
        v-for="item in soundID"
        :key="item.id"
        :src="`https://xeno-canto.org/${item.xenocanto_id}/embed`"
        scrolling="no"
        frameborder="0"
        class="w-full"
        height="220"
      />
    </div>
  </main>
</template>
<script setup lang="ts">
import type { AudioService } from '@/services/audio.service'
import type { LexiconService } from '@/services/lexicon.service'
import type { AnimalAudioListEntry, LexiconEntry } from '@/shared/types/lexicon.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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

// On mount
onMounted(async () => {
  // Checks if id exists
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  // Loads data
  entry.value = await lexiconService.getLexiconEntryById(id.value)
  soundID.value = await audioService.getyAudioIDByAnimalID(id.value)
})
</script>
