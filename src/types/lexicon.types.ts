import type { RecordModel } from 'pocketbase'

export type LexiconListEntry = {
  id: string
  name: string
  description: string
  imageUrl?: string

  isProtected?: boolean
  isPoisonous?: boolean
}

export type LexiconEntry = RecordModel & {
  id: string
  categoryId: string
  name: string
  description: string
  imageUrl?: string
  latinName?: string

  isProtected?: boolean
  isPoisonous?: boolean
}
