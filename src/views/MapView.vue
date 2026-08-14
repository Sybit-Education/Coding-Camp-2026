<template>
  <div class="relative h-dvh">
    <div ref="mapContainer" class="z-0 h-full min-h-100 w-full"></div>

    <div class="absolute top-4 right-4 z-1000 flex items-start gap-2">
      <RouterLink
        to="/tours"
        type="button"
        class="cursor-pointer flex-sm items-center rounded-md bg-white px-3.5 py-2.5 font-semibold text-gray-800 shadow-md hover:bg-gray-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        aria-label="Touren entdecken"
        title="Touren entdecken"
      >
        <FootprintsIcon class="size-4" />
        Touren entdecken
      </RouterLink>

      <div class="relative" ref="menuRoot">
        <button
          class="flex-sm cursor-pointer items-center justify-center rounded-md bg-white px-3.5 py-2.5 font-semibold text-gray-800 shadow-md hover:bg-gray-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          aria-haspopup="true"
          :aria-expanded="isMenuOpen"
          @click="isMenuOpen = !isMenuOpen"
        >
          <FunnelIcon class="size-4" />
          <span>{{ filterLabel }}</span>
        </button>

        <div
          v-if="isMenuOpen"
          class="absolute top-full right-0 mt-2 w-56 rounded-md border border-border bg-white p-2 shadow-lg"
          role="menu"
        >
          <button
            class="mb-1 w-full rounded px-2 py-1.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
            @click="selectAll"
          >
            Alle anzeigen
          </button>

          <div class="my-1 border-t border-border"></div>

          <label
            v-for="{ category, color, label } in categories"
            :key="category"
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
          >
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300"
              :checked="activeCategories.includes(category)"
              @change="onToggle(category)"
            />
            <span
              class="flex h-5 w-5 items-center justify-center rounded-full text-xs"
              :style="{ background: color }"
            >
              {{ label }}
            </span>
            <span>{{ categoryNames[category] }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted } from 'vue'
import type { MapService } from '@/services/map.service'
import { FootprintsIcon, FunnelIcon } from '@lucide/vue'

const mapService = inject('mapService') as MapService
const mapContainer = ref<HTMLDivElement | null>(null)
const menuRoot = ref<HTMLDivElement | null>(null)
const isMenuOpen = ref(false)

const categories = mapService.getAvailableCategories()
const activeCategories = ref<string[]>(mapService.getActiveCategories())
const filterLabel = ref('Alle Kategorien')

// Nur für die Anzeige des Labels/Texts im Menü - deutsche Bezeichnungen
const categoryNames: Record<string, string> = {
  train: 'Bahn',
  bus: 'Bus',
  destination: 'Ziel',
  parking: 'Parkplatz',
  leisure: 'Freizeit',
  nature: 'Natur',
  closure: 'Sperrung',
  bathing_place: 'Badestelle',
  restaurant: 'Restaurant',
}

function updateFilterLabel(): void {
  const total = categories.length
  const active = activeCategories.value.length

  if (active === total) {
    filterLabel.value = 'Alle Kategorien'
  } else if (active === 0) {
    filterLabel.value = 'Keine Kategorie'
  } else if (active === 1) {
    const onlyCategory = activeCategories.value[0]
    filterLabel.value = onlyCategory ? (categoryNames[onlyCategory] ?? 'Kategorie') : 'Kategorie'
  } else {
    filterLabel.value = `${active} Kategorien`
  }
}

function onToggle(category: string): void {
  mapService.toggleCategory(category as never)
  activeCategories.value = mapService.getActiveCategories()
  updateFilterLabel()
}

function selectAll(): void {
  mapService.setCategoryFilter('all')
  activeCategories.value = mapService.getActiveCategories()
  updateFilterLabel()
}

function onClickOutside(event: MouseEvent): void {
  if (isMenuOpen.value && menuRoot.value && !menuRoot.value.contains(event.target as Node)) {
    isMenuOpen.value = false
  }
}

onMounted(async () => {
  if (mapContainer.value) {
    mapService.initialize(mapContainer.value)
  }
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  mapService.destroy()
  document.removeEventListener('click', onClickOutside)
})
</script>
