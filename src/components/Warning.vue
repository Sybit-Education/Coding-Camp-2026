<template>
  <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4 pb-24">
    <section class="space-y-4" aria-label="Lexikoneinträge">
      <Warning v-for="entry in filteredEntries" :key="entry.id" :entry="entry" />
    </section>
  </main>
</template>

<script setup lang="ts">
//import Warning from '@/components/Warning.vue'
import { WarningService } from '@/services/warning.service'
import type { Warning } from '@/shared/types/warning.types'
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  name: 'HomeView',
})

const warningService = inject('warningService') as WarningService

const entries = ref<Warning[]>([])
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
