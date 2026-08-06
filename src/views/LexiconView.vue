<template>
  <main class="mx-auto w-full max-w-sm space-y-4 px-4 py-4 pb-24">
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

    <details class="rounded-xl border border-border bg-background p-3 text-sm text-text">
      <summary class="cursor-pointer font-semibold text-heading">Giftigkeitsstufen</summary>
      <dl class="mt-3 space-y-2">
        <div v-for="level in toxicityReferences" :key="level.id" class="flex gap-2">
          <dt class="min-w-10 font-bold text-red-700">{{ level.type }}</dt>
          <dd>
            <span class="font-medium">{{ level.description }}</span>
          </dd>
        </div>
      </dl>
    </details>

    <section class="space-y-4" aria-label="Lexikoneinträge">
      <LexiconListItem v-for="entry in filteredEntries" :key="entry.id" :entry="entry" />
    </section>
  </main>
</template>
<script setup lang="ts">
import { LexiconService } from '@/services/lexicon.service.ts'
import LexiconListItem from '../components/LexiconListItem.vue'
import { inject, onMounted, ref, computed } from 'vue'
import { type LexiconListEntry } from '@/shared/types/lexicon.types.ts'
import { useToxicityStore } from '@/stores/toxicity.store.ts'

const lexiconService = inject('lexiconService') as LexiconService
const toxicityStore = useToxicityStore()

const entries = ref<LexiconListEntry[]>([])

const searchQuery = ref('')
const filteredEntries = computed(() => {
  return lexiconService.filterLexiconEntries(entries.value, searchQuery.value)
})

const toxicityReferences = computed(() => {
  return toxicityStore.getAllToxicityLevels
})

defineOptions({
  name: 'LexiconView',
})

onMounted(async () => {
  entries.value = await lexiconService.getLexiconEntriesList()
})
</script>
