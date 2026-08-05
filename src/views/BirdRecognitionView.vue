<template>
  <div class="p-4 flex flex-col justify-center gap-5 items-center">
    <div class="p-4">
      <h1 class="text-3xl font-bold text-center">Bird Recognition</h1>
    </div>
    <button
      class="btn btn-secondary w-32 h-32 aspect-square"
      @click="isRecording ? stopRecording() : startRecording()"
    >
      {{ isRecording ? 'Stoppen' : 'Aufnehmen' }}
    </button>
    <audio v-if="recordedFile" controls :src="recordedFileUrl" class="bg-primary"></audio>
    <button class="btn btn-primary" @click="analyzeRecording()">Abschicken</button>
    <a :href="`/lexiconDetail/${animalID}`">
      {{ animalName }}
    </a>
  </div>
</template>
<script setup lang="ts">
import type { BirdRecognitionConfig, BirdRecognitionJob } from '@/services/bird-recognition.service'
import { ref, onMounted, onUnmounted, inject } from 'vue'
import { BirdRecognitionService } from '@/services/bird-recognition.service'
import { LexiconService } from '@/services/lexicon.service'
import { PocketBaseService } from '@/services/pocket-base.service'
import { PlayIcon, SquareIcon } from '@lucide/vue'

const birdRecognitionService = inject<BirdRecognitionService>('birdRecognitionService')!

const jobPollingIntervalMs = 3_000

const config = ref<BirdRecognitionConfig | null>(null)
const isLoadingMeta = ref(true)
const isRecording = ref(false)
const isSubmitting = ref(false)
const recordingDurationSeconds = ref(0)
const recordedFile = ref<File | null>(null)
const recordedFileUrl = ref('')
const job = ref<BirdRecognitionJob | null>(null)
const animalName = ref<string>('')
const animalID = ref<string>('')

let mediaRecorder: MediaRecorder | null = null
let audioStream: MediaStream | null = null
let recordedChunks: Blob[] = []
let recordingTimer: ReturnType<typeof setInterval> | null = null
let pollingTimeout: ReturnType<typeof setTimeout> | null = null

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
    recordedFile.value = new File(
      recordedChunks,
      `vogelstimme-${new Date().toISOString()}.${recordingSettings.extension}`,
      { type: recordingSettings.mimeType },
    )
    recordedFileUrl.value = URL.createObjectURL(recordedFile.value)
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

async function analyzeRecording(): Promise<void> {
  const recording = recordedFile.value

  if (!recording) {
    return
  }

  isSubmitting.value = true

  const location = await birdRecognitionService.getLocation()
  const createdJob = await birdRecognitionService.createJob(recording, {
    latitude: location?.latitude,
    longitude: location?.longitude,
    week: birdRecognitionService.getCurrentWeek(),
    language: 'de',
  })

  job.value = {
    job_id: createdJob.job_id,
    status: 'queued',
    stage: 'Die Analyse wird vorbereitet.',
    progress: 0,
  }
  await pollJob(createdJob.job_id)
  isSubmitting.value = false
}

// Refreshes the asynchronous analysis job until it completes or fails.
async function pollJob(jobId: string): Promise<void> {
  try {
    const currentJob = await birdRecognitionService.getJob(jobId)
    job.value = currentJob

    if (currentJob.status === 'error') {
      console.log(currentJob.error || 'Die Aufnahme konnte nicht analysiert werden.')
      return
    }

    if (currentJob.status !== 'done') {
      pollingTimeout = setTimeout(async () => {
        await pollJob(jobId)
      }, jobPollingIntervalMs)
    }

    if (currentJob.status === 'done') {
      animalName.value = currentJob.result?.detections[0]!.species_localized!
      const lex = new LexiconService(new PocketBaseService())
      const entries = await lex.getLexiconEntriesList()
      for (let entry of entries) {
        if (entry.name.toLowerCase() == animalName.value.toLowerCase()) {
          animalID.value = entry.id
          console.log(animalID.value)
          console.log(entry.id)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
