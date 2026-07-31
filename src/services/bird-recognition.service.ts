const API_BASE_URL = 'https://cc26-microservice.sybit.education'

export interface BirdRecognitionConfig {
  extensions: string[]
  upload_limit_mb: number
  poll_interval_ms: number
  default_language: string
}

export interface BirdRecognitionLanguages {
  languages: string[]
  default: string
}

export interface CreateBirdRecognitionJobOptions {
  latitude?: number
  longitude?: number
  week?: number
  language?: string
}

export interface BirdDetection {
  species: string
  species_code: string
  confidence: number
  start: number
  end: number
  species_localized: string | null
  scientific_name: string | null
}

export interface BirdRecognitionResult {
  meta: {
    filename: string | null
    lat: number | null
    lon: number | null
    week: number | null
    lang: string
  }
  detections: BirdDetection[]
}

export interface BirdRecognitionJobCreated {
  job_id: string
}

export interface BirdRecognitionJob {
  job_id: string
  status: 'queued' | 'processing' | 'done' | 'error'
  stage: string
  progress: number
  result?: BirdRecognitionResult | null
  error?: string | null
}

export class BirdRecognitionService {
  async getConfig(): Promise<BirdRecognitionConfig> {
    return this.request<BirdRecognitionConfig>('/api/meta/config')
  }

  async getLanguages(): Promise<BirdRecognitionLanguages> {
    return this.request<BirdRecognitionLanguages>('/api/meta/languages')
  }

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

  async getJob(jobId: string): Promise<BirdRecognitionJob> {
    // Job IDs are opaque values and must be safe when used as a URL path segment.
    return this.request<BirdRecognitionJob>(`/api/jobs/${encodeURIComponent(jobId)}`)
  }

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
