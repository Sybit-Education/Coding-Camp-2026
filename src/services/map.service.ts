// map.service.ts
import L from 'leaflet'

const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjI1ZGQ1ZTNlYzcxYzRhMzdiNWM0MjYzNjljMTRiYmRkIiwiaCI6Im11cm11cjY0In0='

export class MapService {
  private map: L.Map | null = null
  private routeLayer: L.GeoJSON | L.Polyline | null = null
  private routeMarkers: L.LayerGroup | null = null

  initialize(container: HTMLDivElement) {
    this.map = L.map(container).setView([47.7285, 9.0], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map)
  }

  async addRoute(coords: L.LatLngExpression[]) {
    if (!this.map) return

    this.removeRoute()

    try {
      // ORS erwartet [lng, lat] statt [lat, lng]
      const coordinates = coords.map((c) => {
        const [lat, lng] = Array.isArray(c) ? c : [(c as L.LatLng).lat, (c as L.LatLng).lng]
        return [lng, lat]
      })

      const res = await fetch(
        'https://api.openrouteservice.org/v2/directions/foot-hiking/geojson',
        {
          method: 'POST',
          headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates }),
        }
      )

      if (!res.ok) {
        const errorText = await res.text()
        console.error(`ORS-Fehler ${res.status}:`, errorText)
        throw new Error(`ORS-Fehler: ${res.status}`)
      }

      const data = await res.json()

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
          : (this.routeLayer as L.Polyline).getBounds()

      this.map.fitBounds(bounds, { padding: [40, 40] })
    } catch (err) {
      console.error('ORS-Routing fehlgeschlagen, fallback auf direkte Linie:', err)
      this.routeLayer = L.polyline(coords, { color: '#3388ff', weight: 5 }).addTo(this.map)
      this.map.fitBounds((this.routeLayer as L.Polyline).getBounds(), { padding: [40, 40] })
    }
  }

  removeRoute() {
    if (this.routeLayer && this.map) {
      this.map.removeLayer(this.routeLayer)
      this.routeLayer = null
    }
  }
}
