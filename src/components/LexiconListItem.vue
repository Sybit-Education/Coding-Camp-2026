import type { LexiconListEntry } from '@/types/lexicon.types' import { SkullIcon } from
'@lucide/vue' import type { LexiconListEntry } from '@/types/lexicon.types' import { LeafIcon } from
'@lucide/vue'
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
              class="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-leaf-icon lucide-leaf"
              >
                <path
                  d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
                />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              geschützt
            </span>

            <span
              v-if="entry.isPoisonous"
              class="bg-red-600 text-white text-xs px-2 py-1 rounded-full flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-skull-icon lucide-skull"
              >
                <path d="m12.5 17-.5-1-.5 1h1z" />
                <path
                  d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"
                />
                <circle cx="15" cy="12" r="1" />
                <circle cx="9" cy="12" r="1" />
              </svg>
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

const props = defineProps<{ entry: LexiconListEntry }>()
</script>
