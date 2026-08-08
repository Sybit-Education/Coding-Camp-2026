// map.service.ts
import L from 'leaflet'
import type { Feature, FeatureCollection, Geometry } from 'geojson'

const ORS_API_KEY =
  'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI1ZGQ1ZTNlYzcxYzRhMzdiNWM0MjYzNjljMTRiYmRkIiwiaCI6Im11cm11cjY0In0='

const METTNAU_CENTER: L.LatLngTuple = [47.728558, 9.000175]
const METTNAU_DEFAULT_ZOOM = 14

const MAP_BOUNDS = {
  southWest: L.latLng(47.49926433371864, 8.766776086610086),
  northEast: L.latLng(47.839096177396186, 9.88577290757221),
}

const TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_LAYER_ATTRIBUTION = '&copy; OpenStreetMap contributors'
const TILE_LAYER_MAX_ZOOM = 19
const TILE_LAYER_MIN_ZOOM = 10

const LOCATIONS_GEOJSON_URL = '/map/mettnau-locations.geojson'

interface LocationProperties {
  category: 'train' | 'bus' | 'destination' | 'parking' | 'leisure' | 'nature' | 'bathing_place'
  name: string
  number?: number
}

const CATEGORY_COLORS: Record<LocationProperties['category'], string> = {
  train: '#e63946',
  bus: '#1d3557',
  destination: '#2a9d8f',
  parking: '#457b9d',
  leisure: '#f4a261',
  nature: '#2b9348',
  bathing_place: '#07737a',
}

const CATEGORY_LABELS: Record<LocationProperties['category'], string> = {
  train: '🚆',
  bus: '🚌',
  destination: '📍',
  parking: '🅿️',
  leisure: '🌳',
  nature: '🌿',
  bathing_place: '🏖️',
}

export class MapService {
  private map: L.Map | null = null
  private routeLayer: L.GeoJSON | L.Polyline | null = null
  private locationsLayer: L.GeoJSON | null = null
  private routeRequestId = 0
  private loadLocationsRequestId = 0

  initialize(container: HTMLElement): void {
    const requestId = ++this.loadLocationsRequestId
    const bounds = L.latLngBounds(MAP_BOUNDS.southWest, MAP_BOUNDS.northEast)

    this.map = L.map(container, {
      minZoom: TILE_LAYER_MIN_ZOOM,
      maxZoom: TILE_LAYER_MAX_ZOOM,
      maxBounds: bounds,
    }).setView(METTNAU_CENTER, METTNAU_DEFAULT_ZOOM)

    this.addTileLayer()

    void this.loadLocations(requestId)
  }

  destroy(): void {
    this.loadLocationsRequestId += 1
    this.locationsLayer = null
    this.removeRoute()
    this.map?.remove()
    this.map = null
  }

  async loadLocations(requestId = this.loadLocationsRequestId): Promise<void> {
    if (!this.map) {
      return
    }

    try {
      const response = await fetch(LOCATIONS_GEOJSON_URL)
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Standorte: ${response.status}`)
      }

      const data = (await response.json()) as FeatureCollection<Geometry, LocationProperties>

      if (!this.map || requestId !== this.loadLocationsRequestId) {
        return
      }

      this.locationsLayer = L.geoJSON(data, {
        pointToLayer: (feature, latlng) => this.createLocationMarker(feature, latlng),
        style: (feature) => this.styleLocationFeature(feature),
        onEachFeature: (feature, layer) => this.bindLocationPopup(feature, layer),
      }).addTo(this.map)
    } catch (error) {
      console.error('Standorte konnten nicht geladen werden.', error)
    }
  }

  private createLocationMarker(
    feature: Feature<Geometry, LocationProperties>,
    latlng: L.LatLng,
  ): L.Layer {
    const { category, number } = feature.properties
    const color = CATEGORY_COLORS[category]
    const label = number ?? CATEGORY_LABELS[category]

    const icon = L.divIcon({
      className: 'custom-location-pin',
      html: `
        <div style="
          background:${color};
          width:28px;
          height:28px;
          border-radius:50%;
          border:2px solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.4);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:14px;
          color:white;
        ">${label}</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    })

    return L.marker(latlng, { icon })
  }

  private styleLocationFeature(
    _feature: Feature<Geometry, LocationProperties> | undefined,
  ): L.PathOptions {
    return {}
  }

  private bindLocationPopup(feature: Feature<Geometry, LocationProperties>, layer: L.Layer): void {
    layer.bindPopup(`<strong>${feature.properties.name}</strong>`)
  }

  private addTileLayer(): void {
    if (!this.map) {
      return
    }

    L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_LAYER_ATTRIBUTION,
      maxZoom: TILE_LAYER_MAX_ZOOM,
      minZoom: TILE_LAYER_MIN_ZOOM,
    }).addTo(this.map)
  }

  async addRoute(coords: L.LatLngExpression[]) {
    if (!this.map) {
      return
    }

    this.removeRoute()
    const requestId = ++this.routeRequestId

    try {
      // ORS erwartet [lng, lat] statt [lat, lng]
      const coordinates = coords.map((coordinate) => {
        const [lat, lng] = Array.isArray(coordinate) ? coordinate : [coordinate.lat, coordinate.lng]

        return [lng, lat]
      })

      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson',
        {
          method: 'POST',
          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`ORS-Fehler ${response.status}:`, errorText)
        throw new Error(`ORS-Fehler: ${response.status}`)
      }

      const data = await response.json()

      if (!this.isCurrentRouteRequest(requestId)) {
        return
      }

      if (!data.features?.length) {
        console.warn('Keine Route gefunden, zeichne Wegpunkte direkt')
        this.routeLayer = L.polyline(coords, { color: '#3388ff', weight: 5 }).addTo(this.map)
      } else {
        this.routeLayer = L.geoJSON(data, {
          style: { color: '#3388ff', weight: 5 },
        }).addTo(this.map)
      }

      const bounds =
        this.routeLayer instanceof L.GeoJSON
          ? this.routeLayer.getBounds()
          : this.routeLayer.getBounds()

      this.map.fitBounds(bounds, { padding: [40, 40] })
    } catch (error) {
      if (!this.isCurrentRouteRequest(requestId)) {
        return
      }

      console.error('ORS-Routing fehlgeschlagen, fallback auf direkte Linie:', error)
      this.routeLayer = L.polyline(coords, { color: '#3388ff', weight: 5 }).addTo(this.map)
      this.map.fitBounds(this.routeLayer.getBounds(), { padding: [40, 40] })
    }
  }

  removeRoute() {
    this.routeRequestId += 1

    if (this.routeLayer && this.map) {
      this.map.removeLayer(this.routeLayer)
      this.routeLayer = null
    }
  }

  private isCurrentRouteRequest(requestId: number): boolean {
    return this.routeRequestId === requestId && this.map !== null
  }
}
