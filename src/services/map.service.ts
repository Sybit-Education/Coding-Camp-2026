import L from 'leaflet'


const METTNAU_CENTER: L.LatLngTuple = [47.728558, 9.000175]
const METTNAU_DEFAULT_ZOOM = 14


const MAP_BOUNDS = {
  southWest: L.latLng(47.49926433371864, 8.766776086610086),
  northEast: L.latLng(47.839096177396186, 9.88577290757221)
}


const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_LAYER_ATTRIBUTION = '&copy; OpenStreetMap contributors'


const TILE_LAYER_MAX_ZOOM = 19
const TILE_LAYER_MIN_ZOOM = 10

export class MapService {
  private map: L.Map | null = null

  initialize(container: HTMLElement): void {
    const bounds = L.latLngBounds(MAP_BOUNDS.southWest, MAP_BOUNDS.northEast)

    this.map = L.map(container, {
      minZoom: TILE_LAYER_MIN_ZOOM,
      maxZoom: TILE_LAYER_MAX_ZOOM,
      maxBounds: bounds
    }).setView(METTNAU_CENTER, METTNAU_DEFAULT_ZOOM)

    this.addTileLayer()


    this.map.fitBounds(bounds, { padding: [24, 24] })
  }

  destroy(): void {
    this.map?.remove()
    this.map = null
  }

  private addTileLayer(): void {
    if (!this.map) return

    L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_LAYER_ATTRIBUTION,
      maxZoom: TILE_LAYER_MAX_ZOOM,
      minZoom: TILE_LAYER_MIN_ZOOM
    }).addTo(this.map)
  }
}
