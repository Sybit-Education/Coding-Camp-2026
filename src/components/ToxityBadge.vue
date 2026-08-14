<template>
  <RouterLink to="/dangerguide">
    <button class="cursor-pointer flex">
      <span
        class="flex w-fit items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
        :aria-label="`Giftigkeit: ${toxicityReference.description}`"
        :title="toxicityReference.description"
      >
        <SkullIcon :size="14" aria-hidden="true" />
        {{ toxicityReference.type }}
      </span>
    </button>
  </RouterLink>
</template>

<script setup lang="ts">
import type { ToxicityLevel } from '@/shared/types/lexicon.types'
import { SkullIcon } from '@lucide/vue'
const props = defineProps<{
  toxicityReference: ToxicityLevel
}>()
</script>
