<template>
  <div class="relative max-w-md w-full m-2.5">
    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <!-- Lupe / Such-Icon -->

        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>

    </span>
    <input
      type="search"
      placeholder="Suchen..."
      class="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      v-model="searchQuery"
      />
  </div>

  <div v-for="entry in filteredTest" :key="entry.id">
    <LexiconListItem :entry="entry" />
  </div>
</template>
<script setup lang="ts">
import { LexiconService } from '@/services/lexicon.service.ts'
import LexiconListItem from '../components/LexiconListItem.vue'
import {  inject, onMounted, ref, computed } from 'vue'
import type { LexiconListEntry } from '@/types/lexicon.types.ts'

const lexiconService = inject('lexiconService') as LexiconService

const test = ref<LexiconListEntry[]>([])

const searchQuery = ref('')
const filteredTest = computed(() => {
  return lexiconService.filterLexiconEntries(test.value, searchQuery.value)
})

defineOptions({
  name: 'LexiconView',
})

onMounted(async () => {
  test.value = await lexiconService.getLexiconEntriesList()
})
</script>
