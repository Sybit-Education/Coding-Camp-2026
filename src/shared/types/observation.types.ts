export type Observation = {
  date: string
  speciesId: string
  species: string
  taxonomy: string | null
  observer: string
}

export type ObservationResponse = {
  source: string
  count: number
  observations: Observation[]
}
