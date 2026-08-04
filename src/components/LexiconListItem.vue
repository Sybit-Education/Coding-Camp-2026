<template>
  <RouterLink :to="`/lexiconDetail/${entry.id}`">
    <div class="flex flex-row lg:flex-row p-4">
      <img :src="entry.imageUrl" :alt="entry.name" class="aspect-square rounded-lg w-32" />
      <div class="p-8">
        <h1 class="text-xl font-bold">{{ entry.name }}</h1>
        <p>{{ entry.description }}</p>
      </div>
    </div>
  </RouterLink>
</template>
<script setup lang="ts">
import type { LexiconListEntry } from '@/types/lexicon.types'
import { onMounted } from 'vue'

const props = defineProps<{ entry: LexiconListEntry }>()
onMounted(() => {
  console.log('LexiconListItem mounted')
})
</script>
