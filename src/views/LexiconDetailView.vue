<template>
    <main>
    <article
      v-if="entry"
      class="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
    >
      <div class="relative">
        <a
          v-if="
            entry.imageUrl &&
            entry.attributionURL &&
            entry.attributionAuthor &&
            entry.attributionLicense &&
            !hasImageError
          "
          :href="entry.attributionURL"
          target="_blank"
          class="flex items-center flex-sm nowrap absolute bottom-0 right-0 text-sm bg-black/60 text-white text-right px-1"
        >
          <CopyrightIcon class="size-4" /> {{ entry.attributionAuthor }},
          {{ entry.attributionLicense }}
        </a>
        <img
          v-if="entry.imageUrl && !hasImageError"
          :src="entry.imageUrl"
          :alt="entry.name"
          class="aspect-square w-full object-cover"
          @error="hasImageError = true"
        />
        <div
          v-else
          class="flex aspect-square w-full items-center justify-center bg-background-mute"
          :aria-label="`${entry.name}: kein Bild verfügbar`"
        >
          <img :src="fallbackImage" alt="" class="h-1/2 w-1/2 grayscale opacity-50" />
        </div>
      </div>

      <AutoTextToSpeech :targetSelector="'section'" lang="de-DE" />

      <section class="p-4">
        <h1>{{ entry.name }}</h1>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-if="entry.isProtected"
            class="flex w-fit items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-xs text-white"
          >
            <LeafIcon :size="14" aria-hidden="true" />
            Geschützt
          </span>
          <span
            v-if="toxicityReference"
            class="flex w-fit items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
            :aria-label="`Giftigkeit: ${toxicityReference.description}`"
            :title="toxicityReference.description"
          >
            <SkullIcon :size="14" aria-hidden="true" />
            {{ toxicityReference.type }}
          </span>
        </div>

        <p v-if="toxicityReference" class="mt-2 text-sm text-text">
          {{ toxicityReference.description }}
        </p>
        <p class="mt-3">{{ entry.description }}</p>
      </section>

      <section
        v-if="soundID.length"
        class="card p-3 m-3"
        aria-labelledby="sounds-heading"
      >
        <h2 id="sounds-heading">Vogelstimmen</h2>
        <div class="space-y-3">
          <XenoPlayer
            v-for="item in soundID"
            :key="item.id"
            :id="item.xenocanto_id"
            :darkBackground="false"
          />
        </div>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import AutoTextToSpeech from '@/components/AutoTextToSpeech.vue'
import fallbackImage from '@/assets/logo.svg'
import XenoPlayer from '@/components/XenoPlayer.vue'
import type { AudioService } from '@/services/audio.service'
import type { LexiconService } from '@/services/lexicon.service'
import type { AnimalAudioListEntry } from '@/shared/types/audio.types'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import { CopyrightIcon, LeafIcon, LinkIcon, SkullIcon } from '@lucide/vue'
import { computed, inject, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const lexiconService = inject('lexiconService') as LexiconService
const audioService = inject('audioService') as AudioService

const id = computed(() => {
  const route = useRoute()
  return route.params.id?.toString()
})

const entry = ref<LexiconEntry>()
const hasImageError = ref(false)
const soundID = ref<AnimalAudioListEntry[]>([])

const toxicityReference = computed(() => {
  if (entry.value?.toxicityLevel && typeof entry.value.toxicityLevel === 'object') {
    return entry.value.toxicityLevel
  }

  return undefined
})

onMounted(async () => {
  if (!id.value || Array.isArray(id.value)) {
    console.error('No valid id found in route params')
    return
  }

  entry.value = await lexiconService.getLexiconEntryById(id.value)
  soundID.value = await audioService.getAudioIdsForLexiconEntry(id.value)
})
</script>
