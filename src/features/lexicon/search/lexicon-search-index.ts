import MiniSearch from 'minisearch'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import {
  getSearchTerms,
  normalizeSearchText,
  processGermanSearchTerm,
} from './german-search-normalizer'

const SEARCH_FIELDS = ['name', 'latinName', 'label', 'description'] as const

type SearchDocument = LexiconListEntry & {
  searchOrder: number
}

export function searchLexiconEntries(
  entries: LexiconListEntry[],
  searchTerm: string,
): LexiconListEntry[] {
  const searchTerms = getSearchTerms(searchTerm)
  if (searchTerms.length === 0) return entries

  const documents = entries.map<SearchDocument>((entry, searchOrder) => ({
    ...entry,
    searchOrder,
    latinName: entry.latinName ?? '',
  }))

  const index = new MiniSearch<SearchDocument>({
    fields: [...SEARCH_FIELDS],
    storeFields: ['id', 'searchOrder'],
    processTerm: processGermanSearchTerm,
    searchOptions: {
      boost: {
        name: 4,
        latinName: 3,
        label: 2,
        description: 1,
      },
      fuzzy: 0.2,
      prefix: true,
    },
  })

  index.addAll(documents)

  const entriesById = new Map(entries.map((entry) => [entry.id, entry]))

  const indexedResults = index
    .search(searchTerm)
    .sort((firstResult, secondResult) => {
      if (secondResult.score !== firstResult.score) {
        return secondResult.score - firstResult.score
      }

      return Number(firstResult.searchOrder) - Number(secondResult.searchOrder)
    })
    .map((result) => entriesById.get(result.id))
    .filter((entry): entry is LexiconListEntry => Boolean(entry))

  const matchedIds = new Set(indexedResults.map((entry) => entry.id))
  const compoundResults = entries.filter(
    (entry) => !matchedIds.has(entry.id) && entryContainsAllSearchTerms(entry, searchTerms),
  )

  return [...indexedResults, ...compoundResults]
}

function entryContainsAllSearchTerms(entry: LexiconListEntry, searchTerms: string[]): boolean {
  const searchableText = normalizeSearchText(
    [entry.name, entry.latinName, entry.label, entry.description].filter(Boolean).join(' '),
  )

  return searchTerms.every((term) => searchableText.includes(term))
}
