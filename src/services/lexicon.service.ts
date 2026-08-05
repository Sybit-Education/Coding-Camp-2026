import type { Label, LexiconEntry, LexiconListEntry } from '@/shared/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'
import { sanatizeTextLength } from '@/shared/utils/sanitizer'

export class LexiconService {
  constructor(readonly pocketBaseService: PocketBaseService) {}

  async getLexiconEntriesList(): Promise<LexiconListEntry[]> {
    const lexiconEntries = await this.getAllLexiconEntries()

    console.log(lexiconEntries)
    const result = await Promise.all(
      lexiconEntries.map(async (entry) => ({
        id: entry.id,
        name: entry.name,
        label: await this.resolveLabelName(entry.label),
        description: sanatizeTextLength(entry.description, 100),
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

  filterLexiconEntries(entries: LexiconListEntry[], searchTerm: string): LexiconListEntry[] {
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        entry.description.toLowerCase().includes(lowerCaseSearchTerm),
    )
  }

  private async resolveLabelName(labelId: string): Promise<string> {
      const label = await this.pocketBaseService.getById<Label>('label', labelId)
    return label.name
  }

  private async getAllLexiconEntries(): Promise<LexiconEntry[]> {
    return await this.pocketBaseService.getAll('lexiconEntries')
  }

  private async resolveImageUrl(entry: LexiconEntry, imagePath: string): Promise<string> {
    return await this.pocketBaseService.getImageUrl(entry, imagePath)
  }
}
