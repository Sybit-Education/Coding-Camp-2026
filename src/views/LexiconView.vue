<template>
  <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4 pb-24">
    <div
      class="relative flex w-full items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
    >
      <Search class="m-1 shrink-0 text-gray-400" />
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Suchen..."
        class="min-w-0 flex-1 py-2 text-sm outline-none"
      />
      <div ref="menuRef" class="relative shrink-0 text-left">
        <button
          class="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          @click="isMenuOpen = !isMenuOpen"
        >
          <ListFilter class="h-4 w-4 text-gray-400" />
          <span>
            {{ selectedLabel || 'Alle' }}
          </span>
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

    <section class="space-y-4" aria-label="Lexikoneinträge">
      <LexiconListItem v-for="entry in filteredTest" :key="entry.id" :entry="entry" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { Search, ListFilter } from '@lucide/vue'
import { LexiconService } from '@/services/lexicon.service.ts'
import LexiconListItem from '../components/LexiconListItem.vue'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import type { LexiconListEntry } from '@/shared/types/lexicon.types.ts'

defineOptions({
  name: 'LexiconView',
})

const isMenuOpen = ref(false)
const selectedLabel = ref('')
const menuRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const test = ref<LexiconListEntry[]>([])

const labels = computed(() =>
  [...new Set(test.value.map((entry) => entry.label))].sort((first, second) =>
    first.localeCompare(second),
  ),
)

const lexiconService = inject('lexiconService') as LexiconService

const filteredTest = computed(() => {
  let result = lexiconService.filterLexiconEntries(test.value, searchQuery.value)

  if (selectedLabel.value) {
    result = result.filter((entry) => entry.label === selectedLabel.value)
  }

  return result
})

function closeMenuOnOutsideClick(event: PointerEvent) {
  if (menuRef.value && event.target instanceof Node && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('pointerdown', closeMenuOnOutsideClick)
  test.value = await lexiconService.getLexiconEntriesList()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsideClick)
})
</script>
