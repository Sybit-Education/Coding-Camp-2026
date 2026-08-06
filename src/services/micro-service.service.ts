import { environment } from '@/environments/environment'

const API_BASE_URL = environment.birdRecognitionBaseAddress

export class MicroService {
  constructor() {}

  async request<T>(path: string, init?: RequestInit): Promise<T> {
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
