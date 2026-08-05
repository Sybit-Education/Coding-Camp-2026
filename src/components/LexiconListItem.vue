<template>
  <RouterLink
    :to="`/lexiconDetail/${entry.id}`"
    class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  >
    <article
      class="flex items-center gap-5 rounded-xl border border-border bg-background p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md"
    >
      <img
        :src="entry.imageUrl"
        :alt="entry.name"
        class="aspect-square h-24 w-24 shrink-0 rounded-lg object-cover"
      />
      <div class="min-w-0">
        <h2 class="text-xl font-bold text-heading">{{ entry.name }}</h2>
        <p class="mt-1 text-text">{{ entry.description }}</p>
      </div>
    </article>
  </RouterLink>
</template>
<script setup lang="ts">
import type { LexiconListEntry } from '@/shared/types/lexicon.types'

const props = defineProps<{ entry: LexiconListEntry }>()
</script>
