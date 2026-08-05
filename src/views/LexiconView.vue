<template>
  <section class="mx-auto w-full max-w-md space-y-3 px-4 py-4">
    <LexiconListItem v-for="entry in test" :key="entry.id" :entry="entry" />
  </section>
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
