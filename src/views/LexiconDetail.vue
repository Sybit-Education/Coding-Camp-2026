<template>
  <div class="p-4">
    <!-- Image -->
    <img :src="entry?.imageUrl" alt="" class="rounded-xl" />
    <!-- Code -->
    <div class="pt-4">
      <h1 class="text-3xl font-bold text-center">{{ entry?.name }}</h1>
      <p class="pt-4">{{ entry?.description }}</p>
    </div>
  </div>

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
</template>
<script setup lang="ts">
import type { LexiconService } from '@/services/lexicon.service'
import type { AudioService } from '@/services/audio.service'
import type { AnimalAudioListEntry, LexiconEntry } from '@/types/lexicon.types'
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
