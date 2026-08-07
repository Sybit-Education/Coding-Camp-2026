export type GuidedToursResponse = {
  count: number
  events: GuidedTour[]
}

export type GuidedTour = {
  source: string
  title: string
  start: string
  postalCode: string
  city: string
  location: string
  sourceUrl: string
}