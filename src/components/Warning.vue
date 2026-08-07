<template>
  <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4 pb-24">
    <article
      class="rounded-lg border border-red-500 bg-red-50 p-6"
      aria-label="Warnungen"
      v-for="entry in entries"
      :key="entry.id"
      :entry="entry"
    >
      <h3 class="font-bold text-red-700">{{ entry.heading }}</h3>
      <p class="mt-2 text-text">{{ entry.content }}</p>
      <div class="mt-4 border-t border-red-200 pt-3 text-sm">
        <p>
          <span class="font-semibold text-red-700"> Gültig: </span>
          {{ new Date(entry.start).toLocaleString('de-DE').slice(0, 9) }}
          -
          {{ new Date(entry.end).toLocaleString('de-DE').slice(0, 9) }}
        </p>
      </div>
    </article>
  </main>
</template>

<script setup lang="ts">
import { WarningService } from '@/services/warning.service'
import type { Warning } from '@/shared/types/warning.types'
import { inject, onMounted, ref } from 'vue'

defineOptions({
  name: 'HomeView',
})

const warningService = inject<WarningService>('warningService')!
const entries = ref<Warning[]>([])

onMounted(async () => {
  entries.value = await warningService.getWarnings()
})
</script>
