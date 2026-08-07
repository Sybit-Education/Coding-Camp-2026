<template>
  <div class="page-view flex flex-col items-center gap-8 pb-24">
    <div class="w-full max-w-2xl">
      <h1 class="text-center text-3xl font-bold">Vogel Erkennung</h1>
      <p class="mt-2 text-center text-base-content/70">
        Nimm eine Vogelstimme auf und lasse sie analysieren.
      </p>
    </div>

    <div v-if="isLoadingMeta" class="flex items-center gap-2">
      <span class="loading loading-spinner loading-sm"></span>
      <span>Erkennungsservice wird vorbereitet …</span>
    </div>

    <template v-else>
      <section
        class="flex w-full max-w-2xl flex-col items-center gap-5 rounded-xl border border-border bg-background p-5 shadow-sm"
      >
        <button
          v-if="!recordedFile"
          class="btn btn-secondary h-32 w-32 aspect-square rounded-full"
          :disabled="isAnalyzing"
          @click="isRecording ? finishRecording() : startRecording()"
        >
          <SquareIcon v-if="isRecording" class="size-10 fill-current" />
          <MicIcon v-else class="size-10" />
        </button>

        <p v-if="isRecording" class="font-medium text-error" aria-live="polite">
          Aufnahme läuft: {{ formatDuration(recordingDurationSeconds) }}
        </p>

        <div v-if="recordedFile" class="flex w-full flex-col items-center gap-3">
          <audio controls :src="recordedFileUrl" class="w-full"></audio>

          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-if="job?.status !== 'done' && !isAnalyzing"
              class="btn btn-primary flex-sm"
              :disabled="isAnalyzing"
              @click="submitRecording"
            >
              <SendIcon class="size-5" /> Abschicken
            </button>
            <button class="btn btn-secondary flex-sm" :disabled="isAnalyzing" @click="reset">
              <RotateCwIcon class="size-5" /> Neue Aufnahme
            </button>
          </div>
        </div>

        <div v-if="isAnalyzing" class="flex items-center gap-3" aria-live="polite">
          <LoaderCircleIcon class="animate-spin" />
          <span>Analyse läuft …</span>
        </div>

        <div v-if="errorMessage" role="alert" class="alert alert-error w-full">
          <span>{{ errorMessage }}</span>
        </div>
      </section>

      <section v-if="job?.status === 'done'" class="w-full max-w-2xl border-t border-border pt-6">
        <h2 class="mb-3 text-center text-xl font-bold">Erkannte Vogelarten</h2>

        <p v-if="findings.length === 0" class="text-center text-base-content/70">
          In dieser Aufnahme wurden keine Vogelstimmen erkannt.
        </p>

        <ul v-else class="flex flex-col gap-3">
          <li v-for="finding in findings" :key="finding.key">
            <LexiconListItem
              v-if="finding.lexiconEntry"
              :entry="toRecognitionListEntry(finding)"
              :recognition-confidence="Math.round(finding.confidence * 100)"
              :scientific-name="finding.scientificName"
              :open-in-new-tab="true"
            />
            <article v-else class="rounded-xl border border-border bg-background p-4 shadow-sm">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-xl font-bold text-heading">{{ finding.name }}</h2>
                  <p v-if="finding.scientificName" class="text-sm text-text/60">
                    {{ finding.scientificName }}
                  </p>
                </div>
                <span
                  class="shrink-0 rounded-full bg-primary px-3 py-1 text-sm font-medium text-white"
                >
                  {{ formatConfidence(finding.confidence) }}
                </span>
              </div>
              <p class="mt-1 text-text">{{ findingSummary(finding) }}</p>
              <p class="mt-1 text-sm text-text/70">Nicht im Lexikon verfügbar.</p>
            </article>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import LexiconListItem from '@/features/lexicon/LexiconListItem.vue'
import type { BirdRecognitionService } from '@/services/bird-recognition.service'
import type { LexiconService } from '@/services/lexicon.service'
import type {
  BirdRecognitionConfig,
  BirdRecognitionJob,
  BirdDetection,
} from '@/shared/types/bird-recognition.types'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { LoaderCircleIcon, MicIcon, RotateCwIcon, SendIcon, SquareIcon } from '@lucide/vue'
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'

const birdRecognitionService = inject<BirdRecognitionService>('birdRecognitionService')
const lexiconService = inject<LexiconService>('lexiconService')

const defaultLanguage = 'de'
const jobPollingIntervalMs = 2_000

const config = ref<BirdRecognitionConfig | null>(null)
const isLoadingMeta = ref(true)
const isRecording = ref(false)
const isSubmitting = ref(false)
const recordingDurationSeconds = ref(0)
const recordedFile = ref<File | null>(null)
const recordedFileUrl = ref('')
const job = ref<BirdRecognitionJob | null>(null)
const errorMessage = ref('')
const lexiconEntries = ref<LexiconListEntry[]>([])

let mediaRecorder: MediaRecorder | null = null
let audioStream: MediaStream | null = null
let recordedChunks: Blob[] = []
let recordingTimer: ReturnType<typeof setInterval> | null = null
let pollingTimeout: ReturnType<typeof setTimeout> | null = null

type SpeciesFinding = {
  key: string
  name: string
  scientificName: string | null
  confidence: number
  occurrences: number
  lexiconEntry?: LexiconListEntry
}

const isAnalyzing = computed(
  () => isSubmitting.value || job.value?.status === 'queued' || job.value?.status === 'processing',
)
const findings = computed<SpeciesFinding[]>(() => {
  const detections = job.value?.result?.detections ?? []
  const groupedDetections = new Map<string, BirdDetection[]>()

  for (const detection of detections) {
    const key =
      detection.species_code || normalizeName(detection.scientific_name || detection.species)
    const speciesDetections = groupedDetections.get(key) ?? []
    speciesDetections.push(detection)
    groupedDetections.set(key, speciesDetections)
  }

  return [...groupedDetections.entries()]
    .map(([key, speciesDetections]) => {
      const firstDetection = speciesDetections[0]
      const confidence =
        1 -
        speciesDetections.reduce(
          (remainingConfidence, detection) => remainingConfidence * (1 - detection.confidence),
          1,
        )

      return {
        key,
        name: firstDetection!.species_localized || firstDetection!.species,
        scientificName: firstDetection!.scientific_name,
        confidence,
        occurrences: speciesDetections.length,
        lexiconEntry: getLexiconEntry(firstDetection!),
      }
    })
    .sort((firstFinding, secondFinding) => secondFinding.confidence - firstFinding.confidence)
})

onMounted(async () => {
  if (!birdRecognitionService) {
    errorMessage.value = 'Der Erkennungsservice ist nicht verfügbar.'
    isLoadingMeta.value = false
    return
  }

  try {
    config.value = await birdRecognitionService.getConfig()
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isLoadingMeta.value = false
  }
})

onUnmounted(() => {
  resetJob()
  stopRecording()
  releaseMicrophone()
  clearRecordedAudio()
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
  if (isRecording.value || isAnalyzing.value) return

  errorMessage.value = ''
  resetJob()

  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recordingSettings = getRecordingSettings()

    mediaRecorder = new MediaRecorder(audioStream, recordingSettings)
    recordedChunks = []
    recordingDurationSeconds.value = 0
    clearRecordedAudio()

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    })

    mediaRecorder.addEventListener('stop', () => {
      const recording = new File(
        recordedChunks,
        `vogelstimme-${new Date().toISOString()}.${recordingSettings.extension}`,
        { type: recordingSettings.mimeType },
      )

      releaseMicrophone()
      recordedFile.value = recording
      recordedFileUrl.value = URL.createObjectURL(recording)
    })

    mediaRecorder.start()
    isRecording.value = true
    recordingTimer = setInterval(() => {
      recordingDurationSeconds.value += 1
    }, 1_000)
  } catch (error) {
    releaseMicrophone()
    errorMessage.value = getMicrophoneErrorMessage(error)
  }
}

function finishRecording(): void {
  stopRecording()
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

async function submitRecording(): Promise<void> {
  const recording = recordedFile.value

  if (!recording || isAnalyzing.value || !birdRecognitionService) return

  isSubmitting.value = true
  errorMessage.value = ''
  resetJob()

  try {
    const submissionFile = new File(
      [recording],
      `vogelstimme-${new Date().toISOString()}.${recording.name.split('.').pop() || 'audio'}`,
      { type: recording.type },
    )
    const location = await birdRecognitionService.getLocation()
    const createdJob = await birdRecognitionService.createJob(submissionFile, {
      latitude: location.latitude,
      longitude: location.longitude,
      week: birdRecognitionService.getCurrentWeek(),
      language: defaultLanguage || config.value?.default_language,
    })

    job.value = {
      job_id: createdJob.job_id,
      status: 'queued',
      stage: 'Die Analyse wird vorbereitet.',
      progress: 0,
    }
    await pollJob(createdJob.job_id)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isSubmitting.value = false
  }
}

async function pollJob(jobId: string): Promise<void> {
  if (!birdRecognitionService) return

  try {
    const currentJob = await birdRecognitionService.getJob(jobId)
    job.value = currentJob

    if (currentJob.status === 'error') {
      errorMessage.value = currentJob.error || 'Die Aufnahme konnte nicht analysiert werden.'
      return
    }

    if (currentJob.status === 'done') {
      await loadLexiconEntries()
      return
    }

    pollingTimeout = setTimeout(() => {
      void pollJob(jobId)
    }, jobPollingIntervalMs)
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  }
}

async function loadLexiconEntries(): Promise<void> {
  if (!lexiconService) return

  try {
    lexiconEntries.value = await lexiconService.getLexiconEntriesList()
  } catch {
    // The recognition result remains visible even when the Lexicon lookup fails.
    lexiconEntries.value = []
  }
}

function toRecognitionListEntry(finding: SpeciesFinding): LexiconListEntry {
  return {
    ...finding.lexiconEntry!,
    name: finding.name,
    description: findingSummary(finding),
  }
}

function findingSummary(finding: SpeciesFinding): string {
  const recognitionLabel = finding.occurrences === 1 ? 'Erkennung' : 'Erkennungen'
  return `${finding.occurrences} ${recognitionLabel}`
}

function getLexiconEntry(detection: BirdDetection): LexiconListEntry | undefined {
  const detectionNames = [detection.species_localized, detection.species, detection.scientific_name]
    .filter((name): name is string => Boolean(name))
    .map(normalizeName)

  return lexiconEntries.value.find((entry) => {
    const entryNames = [entry.name, entry.latinName]
      .filter((name): name is string => Boolean(name))
      .map(normalizeName)

    return entryNames.some((entryName) => detectionNames.includes(entryName))
  })
}

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .toLowerCase()
}

function clearRecordedAudio(): void {
  if (recordedFileUrl.value) {
    URL.revokeObjectURL(recordedFileUrl.value)
  }

  recordedFile.value = null
  recordedFileUrl.value = ''
}

function resetJob(): void {
  if (pollingTimeout) {
    clearTimeout(pollingTimeout)
  }

  pollingTimeout = null
  job.value = null
  lexiconEntries.value = []
}

function reset(): void {
  resetJob()
  clearRecordedAudio()
  recordingDurationSeconds.value = 0
  errorMessage.value = ''
}

function getMicrophoneErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === 'NotAllowedError') {
    return 'Für die Vogelstimmenerkennung wird der Zugriff auf das Mikrofon benötigt.'
  }

  return getErrorMessage(error)
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Es ist ein unerwarteter Fehler aufgetreten.'
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}
</script>
