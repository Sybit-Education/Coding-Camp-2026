export type TourGuide = {
  id: string
  title: string
  description: string
  imageUrl: string
  audioUrl: string
  location: {
    latitude: number
    longitude: number
  }
}
