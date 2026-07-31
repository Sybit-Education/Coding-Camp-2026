import L from 'leaflet'
import type { DiscoveryCard } from '@/types/card.types'
import { PinService } from './pin.service'

const METTNAU_CENTER: L.LatLngTuple = [47.75, 8.99]
const METTNAU_DEFAULT_ZOOM = 13
const METTNAU_BOUNDS = {
  southWest: L.latLng(47.72, 8.98),
  northEast: L.latLng(47.72, 9.03),
}
const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_LAYER_ATTRIBUTION = '&copy; OpenStreetMap contributors'
const TILE_LAYER_MAX_ZOOM = 19

export class MapService {
  private map: L.Map | null = null

  initialize(container: HTMLDivElement, discoveries: DiscoveryCard[]): void {
    const bounds = new L.LatLngBounds(METTNAU_BOUNDS.southWest, METTNAU_BOUNDS.northEast)

    this.map = L.map(container, {
      maxBounds: bounds,
      maxBoundsViscosity: 0.5,
    }).setView(METTNAU_CENTER, METTNAU_DEFAULT_ZOOM)

    this.addTileLayer()
    this.addDiscoveryPins(discoveries)
  }

  destroy(): void {
    this.map?.remove()
    this.map = null
  }

  private addTileLayer(): void {
    if (!this.map) {
      return
    }
    L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_LAYER_ATTRIBUTION,
      maxZoom: TILE_LAYER_MAX_ZOOM,
    }).addTo(this.map)
  }

  private addDiscoveryPins(discoveries: DiscoveryCard[]): void {
    if (!this.map) {
      return
    }
    const pinService = new PinService(this.map)
    pinService.addMultiple(discoveries)
  }
}
