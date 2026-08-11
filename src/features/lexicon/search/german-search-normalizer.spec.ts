import { describe, expect, it } from 'vitest'
import {
  getSearchTerms,
  normalizeSearchText,
  processGermanSearchTerm,
} from './german-search-normalizer'

describe('German lexicon search normalization', () => {
  it('normalizes case, umlauts, sharp-s, punctuation, and repeated spaces', () => {
    expect(normalizeSearchText('  Süßwasser-Vögel, Äste & Öl!  ')).toBe(
      'susswasser vogel aste ol',
    )
  })

  it('treats common ascii spellings like German umlaut spellings', () => {
    expect(normalizeSearchText('Voegel Aeste Oel Suess')).toBe('vogel aste ol suss')
  })

  it('returns unique non-empty normalized terms in input order', () => {
    expect(getSearchTerms('Vögel, vogel; Äste')).toEqual(['vogel', 'aste'])
  })

  it('returns both normalized and stemmed variants for search indexing', () => {
    expect(processGermanSearchTerm('Erkennungen')).toEqual(['erkennungen', 'erkennung'])
    expect(processGermanSearchTerm('Vögel')).toEqual(['vogel'])
  })

  it('drops empty terms after normalization', () => {
    expect(processGermanSearchTerm('---')).toBeNull()
  })
})
