<template>
  <RouterLink
    :to="`/lexiconDetail/${entry.id}`"
    class="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
  >
    <article
      class="flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 ease-out group-hover:-translate-y-0.5 group-hover:border-emerald-200 group-hover:shadow-md"
    >
      <img
        :src="entry.imageUrl"
        :alt="entry.name"
        class="aspect-square h-24 w-24 shrink-0 rounded-lg object-cover"
      />
      <div class="min-w-0">
        <h2 class="text-xl font-bold text-slate-900">{{ entry.name }}</h2>
        <p class="mt-1 text-slate-600">{{ entry.description }}</p>
      </div>
    </article>
  </RouterLink>
</template>
<script setup lang="ts">
import type { LexiconListEntry } from '@/types/lexicon.types'

const props = defineProps<{ entry: LexiconListEntry }>()
</script>
