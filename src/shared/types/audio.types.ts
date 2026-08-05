import type { RecordModel } from 'pocketbase'
import type { LexiconEntry } from './lexicon.types'

export type AnimalAudioListEntry = {
  id: string
  xenocanto_id: string
}

export type AnimalAudioEntry = RecordModel & {
  id: string
  relation: LexiconEntry
  xenocanto_id: string
}
