import type { LexiconEntry, LexiconListEntry } from '@/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'

export class LexiconService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  async getLexiconEntriesList(): Promise<LexiconListEntry[]> {
    const lexiconEntries = await this.getAllLexiconEntries()
    const result = await Promise.all(
      lexiconEntries.map(async (entry) => ({
        id: entry.id,
        name: entry.name,
        description: this.sanatizeTextLength(entry.description, 100),
        imageUrl: entry.media ? await this.resolveImageUrl(entry, entry.media) : undefined,
      })),
    )
    return result
  }

  async getLexiconEntryById(id: string): Promise<LexiconEntry> {
    const entry = await this.pocketBaseService.getById<LexiconEntry>('lexiconEntries', id)
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

  private sanatizeTextLength(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text
    }
    let sanitizedText = text.substring(0, maxLength)
    const lastSpaceIndex = sanitizedText.lastIndexOf(' ')
    if (lastSpaceIndex > 0) {
      sanitizedText = sanitizedText.substring(0, lastSpaceIndex)
    }

    sanitizedText = sanitizedText.replace(/[,:.]+$/, '')
    return sanitizedText + ' ...'
  }
}
