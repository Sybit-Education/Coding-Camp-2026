import type { PocketBaseService } from '@/services/pocket-base.service'
import type { Label } from '@/shared/types/lexicon.types'
import { defineStore } from 'pinia'

export const useLabelsStore = defineStore('labels', {
  state: () => ({
    labels: [] as Label[],
  }),
  getters: {
    getLabels: (state) => state.labels,
    getLabelById: (state) => {
      return (id: string) => state.labels.find((label) => label.id === id)
    },
  },
  actions: {
    async loadLabels(pocketbase: PocketBaseService) {
      const labels = await pocketbase.getAll<Label>('label')
      console.log('Loaded labels:', labels)
      this.labels = labels
    },
  },
})
