<script setup lang="ts">
import { PlayOff, Play } from '@lucide/vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useSpeechSynthesis } from '@vueuse/core'

// Props erlauben es, den Bereich optional einzuschränken
const props = defineProps({
  // Standardmäßig wird das 'main'-Tag gelesen, alternativ 'article' oder 'body'
  targetSelector: {
    type: String,
    default: 'main',
  },
  lang: {
    type: String,
    default: 'de-DE',
  },
})

const extractedText = ref('')

// Der VueUse Hook wird mit der reaktiven Text-Variable initialisiert
const { speak, stop, isPlaying } = useSpeechSynthesis(extractedText, {
  lang: props.lang,
})

onMounted(() => {
  const targetElement = document.querySelector(props.targetSelector)

  if (targetElement instanceof HTMLElement) {
    extractedText.value = targetElement.innerText
  } else {
    // Fallback
    extractedText.value = document.body.innerText
  }
})
onUnmounted(() => {
  stop()
})
</script>

<template>
  <div
    class="inline-flex w-full max-w-fit items-center rounded-xl border border-sky-100 bg-slate-50 p-2"
    aria-label="Text-zu-Sprache Steuerung"
    role="group"
  >
    <button
      type="button"
      class="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:w-auto"
      :class="
        isPlaying
          ? 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100'
          : 'border-sky-200 bg-white text-sky-900 hover:bg-sky-50'
      "
      :aria-pressed="isPlaying"
      :aria-label="isPlaying ? 'Vorlesen stoppen' : 'Seite vorlesen starten'"
      :title="isPlaying ? 'Vorlesen stoppen' : 'Seite vorlesen'"
      @click="isPlaying ? stop() : speak()"
    >
      <span aria-hidden="true" class="inline-flex items-center justify-center">
        <component :is="isPlaying ? PlayOff : Play" />
      </span>
      <span class="inline-block min-w-18 text-left">
        {{ isPlaying ? 'Stoppen' : 'Vorlesen' }}
      </span>
    </button>
  </div>
</template>
