<template>
  <div
    class="relative max-w-md w-full m-3 flex items-center gap-1 sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
  >
    <Search class="text-gray-400 m-1" />
    <input type="search" placeholder="Suchen..." class="w-full pl-10 pr-4 py-2 text-" />
    <div class="relative text-left" ref="menuRef">
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        <ListFilter class="w-4 h-4 text-gray-400"> </ListFilter>
        <span
          >{{
            selectedCategory ? categories.find((c) => c.id === selectedCategory)?.label : 'Alle'
          }}
        </span>
      </button>

      <div
        v-if="isMenuOpen"
        class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
      >
        <button
          @click="((selectedCategory = ''), (isMenuOpen = false))"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Alle anzeigen
        </button>

        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="((selectedCategory = cat.id), (isMenuOpen = false))"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          :class="{ 'font-bold text-blue-600 bg-blue-50': selectedCategory === cat.id }"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>
  </div>

  <div v-for="entry in filteredTest" :key="entry.id">
    <LexiconListItem :entry="entry" />
  </div>
</template>

<script setup lang="ts">
import { ListFilter, Search } from 'lucide-vue-next'
import { LexiconService } from '@/services/lexicon.service.ts'
import LexiconListItem from '../components/LexiconListItem.vue'
import { inject, onMounted, ref, computed } from 'vue'
import type { LexiconListEntry } from '@/shared/types/lexicon.types.ts'

defineOptions({
  name: 'LexiconView',
})

const isMenuOpen = ref(false)
const selectedCategory = ref<string>('')
const menuRef = ref(null)
const searchQuery = ref('')
const test = ref<LexiconListEntry[]>([])

const categories = [
  { id: 'voegel', label: 'Vögel' },
  { id: 'pflanzen', label: 'Pflanzen' },
  { id: 'orte', label: 'Orte' },
]

const lexiconService = inject('lexiconService') as LexiconService

const filteredTest = computed(() => {
  let result = lexiconService.filterLexiconEntries(test.value, searchQuery.value)

  if (selectedCategory.value) {
    result = result.filter((entry) => (entry as any).category === selectedCategory.value)
  }

  return result
})

onMounted(async () => {
  test.value = await lexiconService.getLexiconEntriesList()
})

function FilterToggle(Category: string) {
  selectedCategory.value = Category
  isMenuOpen.value = false
}
</script>
