import {
  type LexiconEntry,
  type LexiconListEntry,
  type ToxicityLevel,
} from '@/shared/types/lexicon.types'
import type { PocketBaseService } from './pocket-base.service'
import { sanatizeTextLength } from '@/shared/utils/sanitizer'
import { useToxicityStore } from '@/stores/toxicity.store'

export class LexiconService {
  constructor(readonly pocketBaseService: PocketBaseService) {
    this.toxicityStore.fetchToxicityLevels(pocketBaseService)
  }

  private toxicityStore = useToxicityStore()

  async getLexiconEntriesList(): Promise<LexiconListEntry[]> {
    const lexiconEntries = await this.getAllLexiconEntries()
    const result = await Promise.all(
      lexiconEntries.map(async (entry) => ({
        id: entry.id,
        name: entry.name,
        description: sanatizeTextLength(entry.description, 100),
        imageUrl: entry.media ? await this.resolveImageUrl(entry, entry.media) : undefined,
        isProtected: entry.isProtected,
        toxicityLevel:
          typeof entry.toxicityLevel === 'string'
            ? await this.getToxicityLevelById(entry.toxicityLevel)
            : undefined,
      })),
    )
    return result.sort((a, b) => a.name.localeCompare(b.name, 'de'))
  }

  async getLexiconEntryById(id: string): Promise<LexiconEntry> {
    const entry = await this.pocketBaseService.getById<LexiconEntry>('lexiconEntries', id)
    const result: LexiconEntry = {
      ...entry,
      imageUrl: entry.media ? await this.resolveImageUrl(entry, entry.media) : undefined,
      toxicityLevel:
        typeof entry.toxicityLevel === 'string'
          ? await this.getToxicityLevelById(entry.toxicityLevel)
          : undefined,
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

  private async getAllLexiconEntries(): Promise<LexiconEntry[]> {
    return await this.pocketBaseService.getAll('lexiconEntries')
  }

  private async resolveImageUrl(entry: LexiconEntry, imagePath: string): Promise<string> {
    return await this.pocketBaseService.getImageUrl(entry, imagePath)
  }

  private async getToxicityLevelById(id: string): Promise<ToxicityLevel | undefined> {
    return this.toxicityStore.getToxicityLevelById(id)
  }
}
