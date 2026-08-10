import type {
  BirdRecognitionConfig,
  BirdRecognitionLanguages,
  CreateBirdRecognitionJobOptions,
  BirdRecognitionJobCreated,
  BirdRecognitionJob,
  BirdRecognitionLocation,
} from '@/shared/types/bird-recognition.types'
import type { MicroService } from './micro-service.service'

export class BirdRecognitionService {
  constructor(private microService: MicroService) {}

  // Get the config
  async getConfig(): Promise<BirdRecognitionConfig> {
    return this.microService.request<BirdRecognitionConfig>('/api/meta/config')
  }

  // Get all available languagaes
  async getLanguages(): Promise<BirdRecognitionLanguages> {
    return this.microService.request<BirdRecognitionLanguages>('/api/meta/languages')
  }

  // Start a recognition job
  async createJob(
    file: File,
    { latitude, longitude, week, language }: CreateBirdRecognitionJobOptions = {},
  ): Promise<BirdRecognitionJobCreated> {
    // Let the browser set the required multipart boundary for the audio upload.
    const formData = new FormData()
    formData.append('file', file)

    if (latitude !== undefined) {
      formData.append('lat', String(latitude))
    }
    if (longitude !== undefined) {
      formData.append('lon', String(longitude))
    }
    if (week !== undefined) {
      formData.append('week', String(week))
    }
    if (language) {
      formData.append('lang', language)
    }

    return this.microService.request<BirdRecognitionJobCreated>('/api/jobs', {
      method: 'POST',
      body: formData,
    })
  }

  // Poll the jobs result
  async getJob(jobId: string): Promise<BirdRecognitionJob> {
    // Job IDs are opaque values and must be safe when used as a URL path segment.
    return this.microService.request<BirdRecognitionJob>(`/api/jobs/${encodeURIComponent(jobId)}`)
  }

  // Auf Mettnau gehard-coded
  async getLocation(): Promise<BirdRecognitionLocation> {
    return {
      latitude: 47.7275,
      longitude: 9.004444,
    }
  }

  getCurrentWeek(): number {
    const targetDate = new Date()
    targetDate.setHours(0, 0, 0, 0)
    const DayNr = (targetDate.getDay() + 6) % 7
    targetDate.setDate(targetDate.getDate() - DayNr + 3)
    const firstThursday = targetDate.getTime()
    targetDate.setMonth(0, 4)

    const startDayNr = (targetDate.getDay() + 6) % 7
    targetDate.setDate(targetDate.getDate() - startDayNr + 3)
    const weekDiff = (firstThursday - targetDate.getTime()) / 604800000
    return 1 + Math.ceil(weekDiff)
  }
}
