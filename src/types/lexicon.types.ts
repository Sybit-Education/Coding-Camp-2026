import type { RecordModel } from 'pocketbase'

export type LexiconListEntry = {
  collectionId: string
  name: string
  description: string
  imageUrl?: string
}

export type LexiconEntry = RecordModel & {
  collectionId: string
  categoryId: string
  name: string
  description: string
  imageUrl?: string
  latinName?: string
}
