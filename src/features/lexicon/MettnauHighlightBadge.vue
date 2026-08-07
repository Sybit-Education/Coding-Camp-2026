<script setup lang="ts">
import { LeafIcon } from '@lucide/vue'

withDefaults(
  defineProps<{
    showTextInBadge?: boolean
  }>(),
  {
    showTextInBadge: false,
  },
)
</script>

<template>
  <span
    class="group relative inline-flex items-center justify-center rounded-full bg-green-600 text-white shadow-sm outline-none transition hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
    :class="[
      showTextInBadge ? 'gap-1 px-2 py-1 text-xs' : 'size-7 cursor-help',
    ]"
    role="img"
    tabindex="0"
    aria-label="Besonderes Highlight auf der Mettnau"
  >
    <LeafIcon :size="16" aria-hidden="true" />
    <span v-if="showTextInBadge">Besonderes Highlight auf der Mettnau</span>
    <span
      v-if="!showTextInBadge"
      class="pointer-events-none absolute left-0 top-[calc(100%+0.5rem)] z-10 w-max max-w-56 rounded-md bg-gray-900 px-2 py-1 text-xs font-normal text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      role="tooltip"
    >
      Besonderes Highlight auf der Mettnau
    </span>
  </span>
</template>
