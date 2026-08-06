import type { RecordModel } from 'pocketbase'

export type LexiconListEntry = {
  id: string
  name: string
  description: string
  label: string
  imageUrl?: string

  isProtected?: boolean
  toxicityLevel?: ToxicityLevel
}

export type LexiconEntry = RecordModel & {
  id: string
  label: string
  name: string
  description: string
  imageUrl?: string
  latinName?: string

  isProtected?: boolean
  toxicityLevel?: ToxicityLevel | string
}

export type ToxicityLevel = RecordModel & {
  id: string
  type: string
  description: string
}

export type Label = RecordModel & {
  id: string
  name: string
}
