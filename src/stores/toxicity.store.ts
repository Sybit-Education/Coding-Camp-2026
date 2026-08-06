import { PocketBaseService } from '@/services/pocket-base.service'
import type { ToxicityLevel } from '@/shared/types/lexicon.types'
import { defineStore } from 'pinia'

export const useToxicityStore = defineStore('toxicity', {
  state: () => ({
    toxicityLevels: [] as ToxicityLevel[],
  }),

  getters: {
    getToxicityLevelById: (state) => {
      return (id: string): ToxicityLevel | undefined => {
        return state.toxicityLevels.find((level) => level.id === id)
      }
    },

    getAllToxicityLevels: (state) => {
      return state.toxicityLevels
    },
  },

  actions: {
    async fetchToxicityLevels(pocketBaseService: PocketBaseService) {
      try {
        const toxicityLevels = await pocketBaseService.getAll<ToxicityLevel>('toxicityLevel')
        this.toxicityLevels = toxicityLevels
      } catch (error) {
        console.error('Error fetching toxicity levels:', error)
      }
    },
  },
})
