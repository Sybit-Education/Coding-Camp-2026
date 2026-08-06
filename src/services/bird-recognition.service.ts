import { environment } from '@/environments/environment'
import type {
  BirdRecognitionConfig,
  BirdRecognitionLanguages,
  CreateBirdRecognitionJobOptions,
  BirdRecognitionJobCreated,
  BirdRecognitionJob,
  BirdRecognitionLocation,
} from '@/shared/types/bird-recognition.types'

const API_BASE_URL = environment.birdRecognitionBaseAddress

export class BirdRecognitionService {
  // Sending an Request
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response

    try {
      response = await fetch(`${API_BASE_URL}${path}`, init)
    } catch {
      // Network failures do not provide an HTTP response body to parse.
      throw new Error('Der Erkennungsservice ist momentan nicht erreichbar.')
    }

    if (!response.ok) {
      const message = await this.readErrorMessage(response)
      throw new Error(message)
    }

    return (await response.json()) as T
  }

  // Get the config
  async getConfig(): Promise<BirdRecognitionConfig> {
    return this.request<BirdRecognitionConfig>('/api/meta/config')
  }

  // Get all available languagaes
  async getLanguages(): Promise<BirdRecognitionLanguages> {
    return this.request<BirdRecognitionLanguages>('/api/meta/languages')
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

    return this.request<BirdRecognitionJobCreated>('/api/jobs', {
      method: 'POST',
      body: formData,
    })
  }

  // Poll the jobs result
  async getJob(jobId: string): Promise<BirdRecognitionJob> {
    // Job IDs are opaque values and must be safe when used as a URL path segment.
    return this.request<BirdRecognitionJob>(`/api/jobs/${encodeURIComponent(jobId)}`)
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

  // Error handling
  private async readErrorMessage(response: Response): Promise<string> {
    try {
      const body = (await response.json()) as { detail?: string | { msg?: string }[] }
      if (typeof body.detail === 'string') {
        return body.detail
      }
      if (Array.isArray(body.detail)) {
        return (
          body.detail
            .map((detail) => detail.msg)
            .filter(Boolean)
            .join(' ') || 'Ungültige Anfrage.'
        )
      }
    } catch {
      // Use the HTTP status below if the service does not return JSON.
    }

    return `Die Anfrage ist fehlgeschlagen (${response.status}).`
  }
}
