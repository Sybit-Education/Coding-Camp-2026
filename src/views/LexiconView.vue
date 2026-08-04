<template>
  <h1 class="text-3xl font-bold underline">Lexikon</h1>
  <div v-for="entry in test" :key="entry.collectionId">
    <LexiconListItem :entry="entry" />
  </div>
</template>
<script setup lang="ts">
import type { LexiconService } from '@/services/lexicon.service.ts'
import LexiconListItem from '../components/LexiconListItem.vue'
import { inject, onMounted, ref } from 'vue'
import type { LexiconListEntry } from '@/types/lexicon.types.ts'

const lexiconService = inject('lexiconService') as LexiconService

const test = ref<LexiconListEntry[]>([])

onMounted(async () => {
  test.value = await lexiconService.getLexiconEntriesList()
})
</script>
