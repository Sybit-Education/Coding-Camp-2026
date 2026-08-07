import type { GuidedTour } from '@/shared/types/tour-guides.types'

/**
 * Builds a deterministic, URL-safe identifier from every field supplied by the
 * guided-tour API. The API does not expose a dedicated event ID.
 */
export function getTourId(tour: GuidedTour): string {
  const serializedTourIdentity = JSON.stringify([
    tour.title,
    tour.start,
    tour.location,
    tour.postalCode,
    tour.city,
    tour.source,
    tour.sourceUrl,
  ])

  const bytes = new TextEncoder().encode(serializedTourIdentity)
  let binaryValue = ''

  for (const byte of bytes) {
    binaryValue += String.fromCharCode(byte)
  }

  return btoa(binaryValue).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
