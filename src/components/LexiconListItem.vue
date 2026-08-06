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
        <div class="flex gap-2 flex-wrap">
          <span
            v-if="entry.isProtected"
            class="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 w-fit"
          >
            <LeafIcon :size="14" />
            Geschützt
          </span>

          <span
            v-if="toxicityReference"
            class="flex w-fit items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
            :aria-label="`Giftigkeit: ${toxicityReference.label}`"
            :title="toxicityReference.label"
          >
            <SkullIcon :size="14" />
            {{ toxicityReference.type }}
          </span>
        </div>
        <p class="mt-1 text-text">{{ entry.description }}</p>
      </div>
    </article>
  </RouterLink>
</template>
<script setup lang="ts">
import { type LexiconListEntry } from '@/shared/types/lexicon.types'
import { SkullIcon } from '@lucide/vue'
import { LeafIcon } from '@lucide/vue'
import { computed } from 'vue'

const props = defineProps<{ entry: LexiconListEntry }>()

const toxicityReference = computed(() => {
  return props.entry.toxicityLevel
})
</script>
