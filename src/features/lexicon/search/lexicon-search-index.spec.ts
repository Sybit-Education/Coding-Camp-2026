import { describe, expect, it } from 'vitest'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { searchLexiconEntries } from './lexicon-search-index'

const entries: LexiconListEntry[] = [
  {
    id: 'description-only',
    name: 'Schilfrohrsänger',
    latinName: 'Acrocephalus schoenobaenus',
    label: 'Tiere',
    description: 'Mehrere Erkennungen in feuchten Wiesen.',
  },
  {
    id: 'name-match',
    name: 'Vögel im Schilf',
    latinName: 'Avis palustris',
    label: 'Tiere',
    description: 'Ein Eintrag über Tiere am Wasser.',
  },
  {
    id: 'latin-match',
    name: 'Rohrammer',
    latinName: 'Vogelus mettnauensis',
    label: 'Tiere',
    description: 'Lebt am Ufer.',
  },
  {
    id: 'label-match',
    name: 'Fieberklee',
    latinName: 'Menyanthes trifoliata',
    label: 'Vögel',
    description: 'Eine Pflanze in Feuchtgebieten.',
  },
]

describe('lexicon search index', () => {
  it('returns all entries unchanged for an empty search term', () => {
    expect(searchLexiconEntries(entries, '   ').map((entry) => entry.id)).toEqual([
      'description-only',
      'name-match',
      'latin-match',
      'label-match',
    ])
  })

  it('finds umlaut and ascii spelling variants', () => {
    expect(searchLexiconEntries(entries, 'Voegel').map((entry) => entry.id)).toEqual([
      'name-match',
      'latin-match',
      'label-match',
    ])
  })

  it('finds German word variants via processed stems', () => {
    expect(searchLexiconEntries(entries, 'Erkennung').map((entry) => entry.id)).toEqual([
      'description-only',
    ])
  })

  it('ranks name matches before latin name, label, and description matches', () => {
    expect(searchLexiconEntries(entries, 'Vogel').map((entry) => entry.id)).toEqual([
      'name-match',
      'latin-match',
      'label-match',
    ])
  })

  it('tolerates small typos in searched terms', () => {
    expect(searchLexiconEntries(entries, 'Schilfrohresanger')[0]?.id).toBe('description-only')
  })
})
