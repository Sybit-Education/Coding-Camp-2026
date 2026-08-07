import { environment } from '@/environments/environment'
import type { ObservationResponse } from '@/shared/types/observation.types'
import type { LexiconEntry } from '@/shared/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'

export class ObservationService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  async getNewestBird(): Promise<LexiconEntry | null> {
    const observations = await this.getObservations()

    // Sort observations by newest date
    const sorted = observations.observations.sort((a, b) => Number(b.date) - Number(a.date))

    const lexiconEntries = await this.pocketBaseService.getAll<LexiconEntry>('lexiconEntries')

    // Find matching animal in pocketbase
    for (const observation of sorted) {
      const foundBird = lexiconEntries.find(
        (entry) =>
          entry.name.toLowerCase() === observation.species.toLowerCase() ||
          entry.latinName?.toLowerCase() === observation.taxonomy?.toLowerCase(),
      )

      if (foundBird) {
        return {
          ...foundBird,
          imageUrl: foundBird.media
            ? await this.pocketBaseService.getImageUrl(foundBird, foundBird.media)
            : undefined,
        }
      }
    }

    return null
  }

  private async getObservations(): Promise<ObservationResponse> {
    const response = await fetch(environment.obsercationAddress)

    if (!response.ok) {
      throw new Error('Observations konnten nicht geladen werden')
    }

    return await response.json()
  }
}
