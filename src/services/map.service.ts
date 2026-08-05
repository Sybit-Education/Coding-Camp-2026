import L from 'leaflet'

const METTNAU_CENTER: L.LatLngTuple = [47.728558, 9.000175]
const METTNAU_DEFAULT_ZOOM = 14

const MAP_BOUNDS = {
  southWest: [47.7, 8.95] as L.LatLngTuple,
  northEast: [47.75, 9.05] as L.LatLngTuple,
}

const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_LAYER_ATTRIBUTION = '&copy; OpenStreetMap contributors'
const TILE_LAYER_MAX_ZOOM = 20

export class MapService {
  private map: L.Map | null = null

  initialize(container: HTMLDivElement): void {
    this.map = L.map(container, {}).setView(METTNAU_CENTER, METTNAU_DEFAULT_ZOOM)
    this.addTileLayer()
    this.map.fitBounds(L.latLngBounds(MAP_BOUNDS.southWest, MAP_BOUNDS.northEast))
  }

  destroy(): void {
    this.map?.remove()
    this.map = null
  }

  // fitToConfiguredBounds(): void {
  //   const map = this.requireMap()
  //   const bounds = L.latLngBounds(MAP_BOUNDS.southWest, MAP_BOUNDS.northEast)
  //   map.fitBounds(bounds, { padding: [24, 24] })
  // }

  // setAllowedBounds(bounds: L.LatLngBoundsExpression): void {
  //   const map = this.requireMap()
  //   map.setMaxBounds(bounds)
  //   map.panInsideBounds(bounds, { animate: true })
  // }

  private addTileLayer(): void {
    if (!this.map) {
      return
    }
    L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_LAYER_ATTRIBUTION,
      maxZoom: TILE_LAYER_MAX_ZOOM,
    }).addTo(this.map)
  }

  // private addDiscoveryPins(discoveries: DiscoveryCard[]): void {
  //   if (!this.map) {
  //     return
  //   }
  //   const pinService = new PinService(this.map)
  //   pinService.addMultiple(discoveries)
  // }

  // private requireMap(): L.Map {
  //   if (!this.map) {
  //     throw new Error('MapService wurde noch nicht initialisiert.')
  //   }
  //   return this.map
  // }
}
