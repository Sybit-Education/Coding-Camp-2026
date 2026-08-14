<template>
  <main>
    <h1 class="mb-4">Lexikon</h1>

    <div class="mb-4 rounded-xl border border-border bg-background p-3 shadow-sm">
      <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
        <div
          class="flex min-w-0 flex-1 items-center rounded-md border border-border bg-white px-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        >
          <SearchIcon class="m-1 shrink-0 text-gray-400" aria-hidden="true" />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Suchen ..."
            class="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
          />
        </div>

        <div class="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
          <div ref="menuRef" class="relative shrink-0 text-left">
            <button
              class="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:w-auto"
              @click="isMenuOpen = !isMenuOpen"
            >
              <ListFilterIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span>{{ selectedLabel ? `Label: ${selectedLabel}` : 'Alle Labels' }}</span>
            </button>

            <div
              v-if="isMenuOpen"
              class="absolute right-0 z-50 mt-2 w-full min-w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg sm:w-44"
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

          <button
            class="flex w-full shrink-0 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors sm:w-auto"
            :class="
              showHighlightsOnly
                ? 'border-green-600 bg-green-600 text-white shadow-sm hover:bg-green-700'
                : 'border-border bg-gray-50 text-gray-700 hover:bg-gray-100'
            "
            :aria-pressed="showHighlightsOnly"
            @click="showHighlightsOnly = !showHighlightsOnly"
          >
            <LeafIcon class="h-4 w-4" aria-hidden="true" />
            <span>Mettnau-Highlights</span>
          </button>
        </div>
      </div>

      <div
        v-if="!isLoading"
        class="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-text/70"
      >
        <span>{{ resultSummary }}</span>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="font-medium text-primary underline-offset-4 hover:underline"
          @click="resetFilters"
        >
          Filter zurücksetzen
        </button>
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

    <section class="space-y-4" aria-label="Lexikoneinträge" :aria-busy="isLoading">
      <div v-if="isLoading" role="status" aria-live="polite" class="space-y-4">
        <span class="sr-only">Lexikoneinträge werden geladen …</span>

        <article
          v-for="skeleton in skeletonCards"
          :key="skeleton"
          data-testid="lexicon-skeleton-card"
          class="flex h-38 min-w-0 animate-pulse overflow-hidden rounded-xl border border-border bg-background shadow-sm"
        >
          <div class="h-full w-28 shrink-0 bg-background-mute sm:w-40"></div>

          <div class="flex min-w-0 flex-1 flex-col justify-center gap-3 p-2 sm:p-3">
            <div class="h-5 w-3/5 rounded-full bg-background-mute"></div>
            <div class="h-4 w-2/5 rounded-full bg-background-mute"></div>
            <div class="space-y-2 pt-1">
              <div class="h-4 w-full rounded-full bg-background-mute"></div>
              <div class="h-4 w-11/12 rounded-full bg-background-mute"></div>
              <div class="h-4 w-4/5 rounded-full bg-background-mute"></div>
            </div>
          </div>
        </article>
      </div>

      <template v-else-if="filteredEntries.length > 0">
        <LexiconListItem v-for="entry in filteredEntries" :key="entry.id" :entry="entry" />
      </template>

      <div v-else class="rounded-xl border border-border bg-background p-4 text-text">
        <p class="font-semibold text-heading">Keine Einträge gefunden.</p>
        <p class="mt-1 text-sm text-text/70">
          Versuche einen anderen Suchbegriff oder setze die Filter zurück.
        </p>
        <button
          type="button"
          class="mt-3 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          @click="resetFilters"
        >
          Filter zurücksetzen
        </button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import LexiconListItem from '@/features/lexicon/LexiconListItem.vue'
import { LexiconService } from '@/services/lexicon.service'
import { useLabelsStore } from '@/stores/labels.store'
import { useToxicityStore } from '@/stores/toxicity.store'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { LeafIcon, ListFilterIcon, SearchIcon } from '@lucide/vue'
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
const showHighlightsOnly = ref(false)
const isLoading = ref(true)
const skeletonCards = [1, 2, 3, 4]

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

  if (showHighlightsOnly.value) {
    result = result.filter((entry) => entry.isProtected === true)
  }

  return result
})

const hasActiveFilters = computed(
  () =>
    searchQuery.value.trim().length > 0 || Boolean(selectedLabel.value) || showHighlightsOnly.value,
)

const resultSummary = computed(
  () => `${filteredEntries.value.length} von ${entries.value.length} Einträgen`,
)

const toxicityReferences = computed(() => toxicityStore.getAllToxicityLevels)

function resetFilters() {
  searchQuery.value = ''
  selectedLabel.value = ''
  showHighlightsOnly.value = false
}

function closeMenuOnOutsideClick(event: PointerEvent) {
  if (menuRef.value && event.target instanceof Node && !menuRef.value.contains(event.target)) {
    isMenuOpen.value = false
  }
}

onMounted(async () => {
  document.addEventListener('pointerdown', closeMenuOnOutsideClick)

  try {
    isLoading.value = true
    entries.value = await lexiconService.getLexiconEntriesList()
  } finally {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsideClick)
})
</script>
