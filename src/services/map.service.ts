import L from 'leaflet'
import type { Feature, FeatureCollection, Geometry } from 'geojson'

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

// Location data
const LOCATIONS_GEOJSON_URL = '/map/mettnau-locations.geojson'

interface LocationProperties {
  category:
    | 'train'
    | 'bus'
    | 'destination'
    | 'parking'
    | 'leisure'
    | 'nature'
    | 'closure'
    | 'bathing_place'
    | 'restaurant'
  name: string
  number?: number
  start?: string
  end?: string
}

type LocationCategory = LocationProperties['category']

const CATEGORY_COLORS: Record<LocationCategory, string> = {
  train: '#e63946',
  bus: '#1d3557',
  destination: '#2a9d8f',
  parking: '#457b9d',
  leisure: '#f4a261',
  nature: '#2b9348',
  closure: '#d90429',
  bathing_place: '#07737a',
  restaurant: '#a56b2b',
}

const CATEGORY_LABELS: Record<LocationCategory, string> = {
  train: '🚆',
  bus: '🚌',
  destination: '📍',
  parking: '🅿️',
  leisure: '🌳',
  nature: '🌿',
  closure: '🚧',
  bathing_place: '🏖️',
  restaurant: '🍽️',
}

const ALL_CATEGORIES = Object.keys(CATEGORY_COLORS) as LocationCategory[]

export class MapService {
  private map: L.Map | null = null
  private loadLocationsRequestId = 0

  // Statt eines einzelnen Layers: eine LayerGroup pro Kategorie,
  // damit sich einzelne Kategorien unabhängig ein-/ausblenden lassen.
  private categoryLayers = new Map<LocationCategory, L.LayerGroup>()
  private activeCategories = new Set<LocationCategory>(ALL_CATEGORIES)

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
    this.categoryLayers.forEach((group) => group.remove())
    this.categoryLayers.clear()
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

      // Vorherige Gruppen entfernen, falls loadLocations erneut aufgerufen wird
      this.categoryLayers.forEach((group) => group.remove())
      this.categoryLayers.clear()

      L.geoJSON(data, {
        pointToLayer: (feature, latlng) => this.createLocationMarker(feature, latlng),
        style: (feature) => this.styleLocationFeature(feature),
        onEachFeature: (feature, layer) => {
          this.bindLocationPopup(feature, layer)
          this.addToCategoryLayer(feature, layer)
        },
      })

      // Alle Gruppen kurz mounten, damit die SVG-Pfade für addTextAlongPath existieren
      this.categoryLayers.forEach((group) => group.addTo(this.map as L.Map))

      this.categoryLayers.get('closure')?.eachLayer((layer) => {
        if (!(layer instanceof L.Polyline)) {
          return
        }
        const properties = (layer.feature?.properties ?? {}) as LocationProperties
        this.addTextAlongPath(layer, this.createClosureLabel(properties))
      })

      // Aktuellen Filterzustand anwenden
      this.applyCategoryFilter()
    } catch (error) {
      console.error('Standorte konnten nicht geladen werden.', error)
    }
  }

  // --- Kategorie-Filter API ---

  /** Setzt den Filter auf eine bestimmte Menge an Kategorien, oder 'all' für alle. */
  setCategoryFilter(categories: LocationCategory[] | 'all'): void {
    this.activeCategories = categories === 'all' ? new Set(ALL_CATEGORIES) : new Set(categories)
    this.applyCategoryFilter()
  }

  /** Schaltet eine einzelne Kategorie an/aus. */
  toggleCategory(category: LocationCategory): void {
    if (this.activeCategories.has(category)) {
      this.activeCategories.delete(category)
    } else {
      this.activeCategories.add(category)
    }
    this.applyCategoryFilter()
  }

  /** Prüft, ob eine Kategorie aktuell sichtbar ist. */
  isCategoryActive(category: LocationCategory): boolean {
    return this.activeCategories.has(category)
  }

  /** Alle möglichen Kategorien inkl. Farbe/Icon, z.B. für eine Filter-UI. */
  getAvailableCategories(): { category: LocationCategory; color: string; label: string }[] {
    return ALL_CATEGORIES.map((category) => ({
      category,
      color: CATEGORY_COLORS[category],
      label: CATEGORY_LABELS[category],
    }))
  }

  /** Aktuell aktive Kategorien. */
  getActiveCategories(): LocationCategory[] {
    return Array.from(this.activeCategories)
  }

  private applyCategoryFilter(): void {
    if (!this.map) {
      return
    }
    this.categoryLayers.forEach((group, category) => {
      const shouldShow = this.activeCategories.has(category)
      const isOnMap = this.map!.hasLayer(group)
      if (shouldShow && !isOnMap) {
        group.addTo(this.map as L.Map)
      }
      if (!shouldShow && isOnMap) {
        group.remove()
      }
    })
  }

  private addToCategoryLayer(feature: Feature<Geometry, LocationProperties>, layer: L.Layer): void {
    const category = feature.properties.category
    let group = this.categoryLayers.get(category)
    if (!group) {
      group = L.layerGroup()
      this.categoryLayers.set(category, group)
    }
    group.addLayer(layer)
  }

  // --- Marker- und Feature-Aufbau ---

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
    feature: Feature<Geometry, LocationProperties> | undefined,
  ): L.PathOptions {
    if (feature?.properties.category === 'closure') {
      return {
        color: CATEGORY_COLORS.closure,
        weight: 5,
        opacity: 0.85,
        dashArray: '10, 8',
      }
    }
    return {}
  }

  private bindLocationPopup(feature: Feature<Geometry, LocationProperties>, layer: L.Layer): void {
    const { name, category, start, end } = feature.properties
    let content = `<strong>${name}</strong>`

    if (category === 'closure' && start && end) {
      content = this.createClosureLabel(feature.properties)
    }

    layer.bindPopup(content)
  }

  private createClosureLabel(properties: LocationProperties): string {
    if (!properties.start || !properties.end) {
      return properties.name
    }

    return `Weg gesperrt von ${this.formatClosureDate(properties.start)} bis ${this.formatClosureDate(properties.end)}`
  }

  private addTextAlongPath(path: L.Polyline, text: string): void {
    const pathElement = path.getElement() as SVGPathElement | null
    const svg = pathElement?.ownerSVGElement

    if (!pathElement || !svg) {
      return
    }

    const pathId = `closure-route-${Date.now()}-${Math.random().toString(36).slice(2)}`
    pathElement.id = pathId

    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textElement.setAttribute('fill', CATEGORY_COLORS.closure)
    textElement.setAttribute('font-size', '12')
    textElement.setAttribute('font-weight', '600')
    textElement.setAttribute('dy', '-8')

    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
    textPath.setAttribute('href', `#${pathId}`)
    textPath.setAttribute('startOffset', '8%')
    textPath.textContent = text

    textElement.append(textPath)
    svg.append(textElement)
  }

  private formatClosureDate(date: string): string {
    const [month, day] = date.split('-')
    if (!month || !day) {
      return date
    }
    return `${day}.${month}.`
  }

  private addTileLayer(): void {
    if (!this.map) return

    L.tileLayer(TILE_LAYER_URL, {
      attribution: TILE_LAYER_ATTRIBUTION,
      maxZoom: TILE_LAYER_MAX_ZOOM,
      minZoom: TILE_LAYER_MIN_ZOOM,
    }).addTo(this.map)
  }
}
