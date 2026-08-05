<template>
  <div class="p-4 flex flex-col justify-center gap-5 items-center">
    <div class="p-4">
      <h1 class="text-3xl font-bold text-center">Bird Recognition</h1>
    </div>
    <button
      class="btn btn-secondary w-32 h-32 aspect-square"
      @click="isRecording ? stopRecording() : startRecording()"
    >
      <RatIcon></RatIcon>
      {{ isRecording ? 'Stoppen' : 'Aufnehmen' }}
    </button>
    <audio v-if="recordingUrl" controls :src="recordingUrl" class="bg-primary"></audio>
    <button class="btn btn-primary">Abschicken</button>
  </div>
</template>
<script setup lang="ts">
import type { BirdRecognitionConfig } from '@/services/bird-recognition.service'
import { RatIcon } from '@lucide/vue'
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { BirdRecognitionService } from '@/services/bird-recognition.service'

const birdRecognitionService = inject<BirdRecognitionService>('birdRecognitionService')!
const config = ref<BirdRecognitionConfig | null>(null)
const isLoadingMeta = ref(true)
const isRecording = ref(false)
const recordingDurationSeconds = ref(0)
let mediaRecorder: MediaRecorder | null = null
let audioStream: MediaStream | null = null
let recordedChunks: Blob[] = []
let recordingTimer: ReturnType<typeof setInterval> | null = null
const recordingFile = ref<File | null>(null)
const recordingUrl = ref('')

onMounted(async () => {
  config.value = await birdRecognitionService.getConfig()
  isLoadingMeta.value = false
})

onUnmounted(() => {
  stopRecording()
})

function getRecordingSettings(): { mimeType: string; extension: string } {
  const supportedExtensions = config.value?.extensions ?? []

  const candidates = [
    { mimeType: 'audio/mp4', extension: 'm4a' },
    { mimeType: 'audio/ogg;codecs=opus', extension: 'ogg' },
    { mimeType: 'audio/aac', extension: 'aac' },
  ]

  const selectedFormat = candidates.find(
    ({ mimeType, extension }) =>
      supportedExtensions.includes(`.${extension}`) && MediaRecorder.isTypeSupported(mimeType),
  )

  if (!selectedFormat) {
    throw new Error(
      'Dein Browser unterstützt kein mit dem Erkennungsservice kompatibles Audioformat.',
    )
  }

  return selectedFormat
}

async function startRecording(): Promise<void> {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const recordingSettings = getRecordingSettings()

  mediaRecorder = new MediaRecorder(audioStream, recordingSettings)
  recordedChunks = []
  recordingDurationSeconds.value = 0

  mediaRecorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
    }
  })

  mediaRecorder.addEventListener('stop', () => {
    recordingFile.value = new File(
      recordedChunks,
      `vogelstimme-${new Date().toISOString()}.${recordingSettings.extension}`,
      { type: recordingSettings.mimeType },
    )
    recordingUrl.value = URL.createObjectURL(recordingFile.value)
    releaseMicrophone()
  })

  mediaRecorder.start()
  isRecording.value = true
  recordingTimer = setInterval(() => {
    recordingDurationSeconds.value += 1
  }, 1_000)
}

function stopRecording(): void {
  if (mediaRecorder?.state === 'recording') {
    mediaRecorder.stop()
  }

  isRecording.value = false

  if (recordingTimer) {
    clearInterval(recordingTimer)
  }

  recordingTimer = null
}

function releaseMicrophone(): void {
  audioStream?.getTracks().forEach((track) => track.stop())
  audioStream = null
  mediaRecorder = null
}
</script>
