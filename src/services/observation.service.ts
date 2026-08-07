import { environment } from '@/environments/environment'
import type { ObservationResponse } from '@/shared/types/observation.types'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'

export class ObservationService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  // Gets newest bird
  async getNewestBird(): Promise<LexiconEntry | null> {
    const observations = await this.getObservations()

    // Sort observations by newest date
    const sorted = observations.observations.sort((a, b) => Number(b.date) - Number(a.date))

    // Find matching animal in pocketbase
    for (const observation of sorted) {
      const foundBird = await this.pocketBaseService.getBy<LexiconEntry>(
        'lexiconEntries',
        'name',
        observation.species,
      )

      // Found bird
      if (foundBird) {
        return {
          ...foundBird,
          imageUrl: foundBird.media
            ? await this.pocketBaseService.getImageUrl(foundBird, foundBird.media)
            : undefined,
        }
      }
    }

    // Fallback
    return null
  }

  // Gets observations
  private async getObservations(): Promise<ObservationResponse> {
    const response = await fetch(environment.obsercationAddress)

    // Failed
    if (!response.ok) {
      throw new Error('Observations konnten nicht geladen werden')
    }

    // Parses response
    return await response.json()
  }
}
