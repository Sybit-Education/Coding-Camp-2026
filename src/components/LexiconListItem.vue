<template>
  <RouterLink :to="`/lexiconDetail/${entry.id}`">
    <div class="p-4">
      <div class="flex flex-row p-4 object-fit items-center justify-center border-2 rounded-lg">
        <img :src="entry.imageUrl" :alt="entry.name" class="rounded-lg aspect-square w-32 h-32" />
        <div class="pl-8">
          <h1 class="text-xl font-bold">{{ entry.name }}</h1>
          <p>{{ entry.description }}</p>
        </div>
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
