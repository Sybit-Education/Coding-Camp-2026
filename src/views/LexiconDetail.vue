<template>
  <main class="mx-auto w-full max-w-md px-4 py-4">
    <div
      v-if="entry"
      class="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    >
      <img :src="entry.imageUrl" :alt="entry.name" class="aspect-square w-full object-cover" />
      <AutoTextToSpeech
          :targetSelector="'article'"
          lang="de-DE"
        />
      <article class="p-5">
        <h1 class="text-2xl font-bold text-heading">{{ entry.name }}</h1>
        <p class="mt-3 text-text">{{ entry.description }}</p>
      </article>
    </div>
  </main>
</template>
<script setup lang="ts">
import AutoTextToSpeech from '@/components/AutoTextToSpeech.vue'
import type { LexiconService } from '@/services/lexicon.service'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const lexiconService = inject('lexiconService') as LexiconService

const id = computed(() => {
  const route = useRoute()
  return route.params.id?.toString()
})

const entry = ref<LexiconEntry>()

onMounted(async () => {
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  entry.value = await lexiconService.getLexiconEntryById(id.value)
})
</script>
