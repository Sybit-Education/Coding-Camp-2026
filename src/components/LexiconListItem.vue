<template>
  <RouterLink :to="`/lexiconDetail/${entry.id}`">
    <div class="p-4">
      <div class="flex flex-row p-4 object-fit items-center justify-center border-2 rounded-lg">
        <img :src="entry.imageUrl" :alt="entry.name" class="rounded-lg aspect-square w-32 h-32" />
        <div class="pl-8">
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold">
              {{ entry.name }}
            </h1>

            <span
              v-if="entry.isProtected"
              class="bg-green-600 text-white text-xs px-2 py-1 rounded-full"
            >
              Geschützt
            </span>

            <span
              v-if="entry.isPoisonous"
              class="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex gap-2 items-center"
            >
              <SkullIcon />
              Giftig
            </span>
          </div>

          <p>{{ entry.description }}</p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
<script setup lang="ts">
import type { LexiconListEntry } from '@/types/lexicon.types'
import { SkullIcon } from '@lucide/vue'

const props = defineProps<{ entry: LexiconListEntry }>()
</script>
