<template>
  <main class="mx-auto w-full max-w-md px-4 py-4">
    <article
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
      <div class="p-5">
        <h1 class="text-2xl font-bold text-heading">{{ entry.name }}</h1>
        <p class="mt-3 text-text">{{ entry.description }}</p>
      </div>
    </article>
  </main>
</template>
<script setup lang="ts">
import type { LexiconService } from '@/services/lexicon.service'
import fallbackImage from '@/assets/logo.svg'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const lexiconService = inject('lexiconService') as LexiconService

const id = computed(() => {
  const route = useRoute()
  return route.params.id?.toString()
})

const entry = ref<LexiconEntry>()
const hasImageError = ref(false)

onMounted(async () => {
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  entry.value = await lexiconService.getLexiconEntryById(id.value)
})
</script>
