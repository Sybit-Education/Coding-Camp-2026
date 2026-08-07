<template>
  <div class="page-view">
    <h1 class="mb-4">Lexikon</h1>

    <div class="mb-4 flex min-w-0 items-center gap-2">
      <div
        class="flex min-w-0 flex-1 items-center rounded-md border border-border bg-background px-2"
      >
        <Search class="m-1 shrink-0 text-gray-400" />
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Suchen ..."
          class="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
        />
      </div>

      <div ref="menuRef" class="relative shrink-0 text-left">
        <button
          class="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          @click="isMenuOpen = !isMenuOpen"
        >
          <ListFilter class="h-4 w-4 text-gray-400" />
          <span>{{ selectedLabel || 'Alle' }}</span>
        </button>

        <div
          v-if="isMenuOpen"
          class="absolute right-0 z-50 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            @click="((selectedLabel = ''), (isMenuOpen = false))"
          >
            Alle anzeigen
          </button>
          <button
            v-for="label in labels"
            :key="label"
            class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            :class="{ 'bg-blue-50 font-bold text-blue-600': selectedLabel === label }"
            @click="((selectedLabel = label), (isMenuOpen = false))"
          >
            {{ label }}
          </button>
        </div>
      </div>
    </div>

    <details class="mb-4 rounded-xl border border-border bg-background p-3 text-sm text-text">
      <summary class="cursor-pointer font-semibold text-heading">Giftigkeitsstufen</summary>
      <dl class="mt-3 space-y-2">
        <div v-for="level in toxicityReferences" :key="level.id" class="flex gap-2">
          <dt class="min-w-10 font-bold text-red-700">{{ level.type }}</dt>
          <dd class="font-medium">{{ level.description }}</dd>
        </div>
      </dl>
    </details>

    <section class="space-y-4" aria-label="Lexikoneinträge">
      <LexiconListItem v-for="entry in filteredEntries" :key="entry.id" :entry="entry" />
    </section>
  </div>
</template>

<script setup lang="ts">
import LexiconListItem from '@/features/lexicon/LexiconListItem.vue'
import { LexiconService } from '@/services/lexicon.service'
import { useLabelsStore } from '@/stores/labels.store'
import { useToxicityStore } from '@/stores/toxicity.store'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { ListFilter, Search } from '@lucide/vue'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  name: 'LexiconView',
})

const lexiconService = inject('lexiconService') as LexiconService
const labelsStore = useLabelsStore()
const toxicityStore = useToxicityStore()

const entries = ref<LexiconListEntry[]>([])
const isMenuOpen = ref(false)
const selectedLabel = ref('')
const menuRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')

const labels = computed(() =>
  labelsStore.getLabels
    .map((label) => label.name)
    .sort((first, second) => first.localeCompare(second)),
)

const filteredEntries = computed(() => {
  let result = lexiconService.filterLexiconEntries(entries.value, searchQuery.value)

  if (selectedLabel.value) {
    result = result.filter((entry) => entry.label === selectedLabel.value)
  }

  return result
})

const toxicityReferences = computed(() => toxicityStore.getAllToxicityLevels)

function closeMenuOnOutsideClick(event: PointerEvent) {
  if (menuRef.value && event.target instanceof Node && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('pointerdown', closeMenuOnOutsideClick)
  entries.value = await lexiconService.getLexiconEntriesList()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsideClick)
})
</script>
