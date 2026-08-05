<template>
  <div class="p-4">
    <img :src="entry?.imageUrl" alt="" class="rounded-xl" />
    <div class="pt-4">
      <h1 class="text-3xl font-bold text-center">{{ entry?.name }}</h1>
      <p class="pt-4">{{ entry?.description }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LexiconService } from '@/services/lexicon.service'
import type { LexiconEntry } from '@/types/lexicon.types'
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
