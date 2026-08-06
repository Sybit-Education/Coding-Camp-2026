import type { RecordModel } from 'pocketbase'

export type LexiconListEntry = {
  id: string
  name: string
  description: string
  label: string
  imageUrl?: string
  latinName?: string
}

export type LexiconEntry = RecordModel & {
  id: string
  label: string
  name: string
  description: string
  imageUrl?: string
  latinName?: string
}

export type Label = RecordModel & {
  id: string
  name: string
}
