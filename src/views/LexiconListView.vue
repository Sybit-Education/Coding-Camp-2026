<template>
    <div class="relative">
      <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg class="h-5 w-5 text-text/60" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </span>
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Suchen..."
        aria-label="Lexikon durchsuchen"
        class="w-full rounded-xl border border-border bg-background py-2.5 pr-4 pl-10 text-sm text-text shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
      />
    </div>

    <section class="space-y-4" aria-label="Lexikoneinträge">
      <LexiconListItem v-for="entry in filteredTest" :key="entry.id" :entry="entry" />
    </section>

</template>
<script setup lang="ts">
import { LexiconService } from '@/services/lexicon.service.ts'
import LexiconListItem from '../components/LexiconListItem.vue'
import { inject, onMounted, ref, computed } from 'vue'
import type { LexiconListEntry } from '@/shared/types/lexicon.types.ts'

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
