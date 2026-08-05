<template>
  <div class="p-4">
    <img :src="entry?.imageUrl" alt="" class="rounded-xl" />
    <h1 class="text-3xl font-bold text-center">
      {{ entry?.name }}
    </h1>

    <div class="flex justify-center gap-2 mt-2">
      <span
        v-if="entry?.isProtected"
        class="bg-green-600 text-white text-xs px-2 py-1 rounded-full"
      >
        Geschützt
      </span>

      <span v-if="entry?.isPoisonous" class="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
        Giftig
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { LexiconService } from '@/services/lexicon.service'
import type { LexiconEntry } from '@/types/lexicon.types'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const lexiconService = inject('lexiconService') as LexiconService

const id = computed(() => {
  const route = useRoute()
  return route.params.id?.toString()
})

const entry = ref<LexiconEntry>()

onMounted(async () => {
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  entry.value = await lexiconService.getLexiconEntryById(id.value)
})
</script>
