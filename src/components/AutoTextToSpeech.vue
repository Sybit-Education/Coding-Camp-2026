<script setup>
import { PlayOff, Play } from '@lucide/vue'
import { ref, onMounted } from 'vue'
import { useSpeechSynthesis } from '@vueuse/core'

// Props erlauben es, den Bereich optional einzuschränken
const props = defineProps({
  // Standardmäßig wird das 'main'-Tag gelesen, alternativ 'article' oder 'body'
  targetSelector: {
    type: String,
    default: 'main'
  },
  lang: {
    type: String,
    default: 'de-DE'
  }
})

const extractedText = ref('')

// Der VueUse Hook wird mit der reaktiven Text-Variable initialisiert
const { speak, stop, isPlaying } = useSpeechSynthesis(extractedText, {
  lang: props.lang,
})

onMounted(() => {
  // Sucht das gewünschte Element auf der Seite (z.B. <main>)
  const targetElement = document.querySelector(props.targetSelector)

  if (targetElement) {
    // innerText extrahiert NUR den sichtbaren Text (ignoriert HTML-Tags, Scripte, CSS)
    extractedText.value = targetElement.innerText
  } else {
    // Fallback auf den gesamten Body, falls das Ziel-Tag nicht existiert
    extractedText.value = document.body.innerText
  }
})
</script>

<template>
  <div class="tts-auto-player" aria-label="Text-zu-Sprache Steuerung" role="group">
    <button
      type="button"
      class="btn merged"
      :class="{ active: isPlaying, stop: isPlaying }"
      :aria-pressed="isPlaying"
      :aria-label="isPlaying ? 'Vorlesen stoppen' : 'Seite vorlesen starten'"
      :title="isPlaying ? 'Vorlesen stoppen' : 'Seite vorlesen'"
      @click="isPlaying ? stop() : speak()"
    >
      <span aria-hidden="true" class="btn-icon">
        <component :is="isPlaying ? PlayOff : Play" />
      </span>
      <span class="btn-text">{{ isPlaying ? 'Stoppen' : 'Vorlesen' }}</span>
    </button>
  </div>
</template>

<style scoped>
.tts-auto-player {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f7fafc;
  border: 1px solid #d8e6f5;
  border-radius: 0.875rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.48rem;
  min-height: 2.5rem;
  min-width: 8.6rem;
  padding: 0.6rem 1.1rem;
  font: inherit;
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1;
  color: #0f3d63;
  background: #ffffff;
  border: 1px solid #b9d2e8;
  border-radius: 0.7rem;
  cursor: pointer;
  transition: background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
  user-select: none;
  position: relative;
}

.btn.merged .btn-text {
  display: inline-block;
  min-width: 4.3rem;
  text-align: left;
  /* verhindert Sprünge beim Wechsel */
}

.btn:hover:not(:disabled) {
  background: #eef6fd;
  border-color: #8fb9dc;
}

.btn.active,
.btn.stop,
.btn.merged.stop {
  background: #fff7f8;
  border-color: #e3b8bf;
  color: #8a2430;
}

.btn.merged.stop:hover:not(:disabled) {
  background: #fff1f3;
  border-color: #d796a1;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.67;
}

.btn:focus-visible {
  outline: 3px solid #1d6fa5;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(29, 111, 165, 0.15);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.13em;
}

@media (max-width: 500px) {
  .tts-auto-player {
    width: 100%;
    justify-content: stretch;
  }
  .btn {
    flex: 1 1 0;
    min-width: unset;
    width: 100%;
  }
  .btn.merged .btn-text {
    width: 100%;
    text-align: left;
    min-width: 0;
  }
}
</style>
