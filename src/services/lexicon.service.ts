import type { LexiconEntry, LexiconListEntry } from '@/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'

export class LexiconService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  async getLexiconEntries(): Promise<LexiconEntry[]> {
    return await this.getAllLexiconEntries()
  }

  async getLexiconEntriesList(): Promise<LexiconListEntry[]> {
    const lexiconEntries = await this.getAllLexiconEntries()
    const result = await Promise.all(
      lexiconEntries.map(async (entry) => ({
        id: entry.id,
        name: entry.name,
        description: entry.description,
        imageUrl: entry.media ? await this.resolveImageUrl(entry, entry.media) : undefined,
      })),
    )
    console.log('getLexiconEntriesList', result)
    return result
  }

  async getLexiconEntryById(id: string): Promise<LexiconEntry> {
    const entry = await this.pocketBaseService.getById('lexiconEntries', id)
    const result: LexiconEntry = {
      ...entry,
      imageUrl: entry.media ? await this.resolveImageUrl(entry, entry.media) : undefined,
    }
    return result

  }

  private async getAllLexiconEntries(): Promise<LexiconEntry[]> {
    return await this.pocketBaseService.getAll('lexiconEntries')
  }

  private async resolveImageUrl(entry: LexiconEntry, imagePath: string): Promise<string> {
    return await this.pocketBaseService.getImageUrl(entry, imagePath)
  }
}
