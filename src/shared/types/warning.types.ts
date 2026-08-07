import type { RecordModel } from 'pocketbase'

export type Warning = RecordModel & {
  id: string
  type: string
  heading: string
  content: string
  start: Date
  end: Date
}
