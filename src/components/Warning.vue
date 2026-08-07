<template>
  <main class="mx-auto w-full max-w-md space-y-4 px-4 py-4 pb-24">
    <section class="space-y-4" aria-label="Warnungen">
      <div v-for="entry in entries" :key="entry.id" :entry="entry">
        <p>{{ entry.heading }}</p>
      </div>
    </section>
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
