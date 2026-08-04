import type { LexiconEntry, LexiconListEntry } from '@/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'

export class LexiconService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  async getLexiconEntries(): Promise<LexiconEntry[]> {
    return await this.getAllLexiconEntries()
  }

  async getLexiconEntriesList(): Promise<LexiconListEntry[]> {
    const lexiconEntries = await this.getAllLexiconEntries()
    return Promise.all(
      lexiconEntries.map(async (entry) => ({
        collectionId: entry.collectionId,
        name: entry.name,
        description: entry.description,
        imageUrl: entry.imageUrl ? await this.resolveImageUrl(entry, entry.imageUrl) : undefined,
      })),
    )
  }

  async getLexiconEntryById(id: string): Promise<LexiconEntry> {
    return await this.pocketBaseService.getById('lexiconEntries', id)
  }

  private async getAllLexiconEntries(): Promise<LexiconEntry[]> {
    return await this.pocketBaseService.getAll('lexiconEntries')
  }

  private async resolveImageUrl(entry: LexiconEntry, imagePath: string): Promise<string> {
    return await this.pocketBaseService.getImageUrl(entry, imagePath)
  }
}
