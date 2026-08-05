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
  async createJob() {
    // To be developed
  }

  // Poll the jobs result
  async getJob() {
    // To be developed
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
