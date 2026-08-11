import { describe, expect, it } from 'vitest'
import type { LexiconListEntry } from '@/shared/types/lexicon.types'
import { LexiconService } from './lexicon.service'

const entries: LexiconListEntry[] = [
  {
    id: 'bird',
    name: 'Vögel im Schilf',
    latinName: 'Avis palustris',
    label: 'Tiere',
    description: 'Mehrere Erkennungen im Frühjahr.',
  },
  {
    id: 'plant',
    name: 'Sumpfdotterblume',
    label: 'Pflanzen',
    description: 'Gelbe Blüte am Wasser.',
  },
]

function createService(): LexiconService {
  return Object.create(LexiconService.prototype) as LexiconService
}

describe('LexiconService search filtering', () => {
  it('finds entries through German spelling and word variants', () => {
    const service = createService()

    expect(service.filterLexiconEntries(entries, 'Voegel').map((entry) => entry.id)).toEqual(['bird'])
    expect(service.filterLexiconEntries(entries, 'Erkennung').map((entry) => entry.id)).toEqual([
      'bird',
    ])
  })

  it('returns all entries for an empty search term', () => {
    const service = createService()

    expect(service.filterLexiconEntries(entries, '').map((entry) => entry.id)).toEqual([
      'bird',
      'plant',
    ])
  })
})
