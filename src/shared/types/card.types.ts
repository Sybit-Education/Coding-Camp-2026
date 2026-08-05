export interface DiscoveryCard {
  id: number
  media: string
  label: NatureCategory
  name: string
  description: string
  day: string
  time: string
  coordinatesX: number
  coordinatesY: number
}

export type NatureCategory = 'Vogel' | 'Pflanze' | 'Insekt' | 'Baum'
