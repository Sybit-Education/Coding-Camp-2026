import L from 'leaflet'
import type { DiscoveryCard, NatureCategory } from '@/types/card.types'

const PIN_COLORS: Record<NatureCategory, string> = {
  Vogel: '#ff00ff',
  Pflanze: '#00ff00',
  Insekt: '#00ffff',
  Baum: '#ffff00',
}

const PIN_ICON_SIZE: L.PointTuple = [24, 36]
const PIN_ICON_ANCHOR: L.PointTuple = [12, 36]
const PIN_POPUP_ANCHOR: L.PointTuple = [0, -36]

export class PinService {
  private readonly map: L.Map
  private readonly markers: Map<number, L.Marker> = new Map()

  constructor(map: L.Map) {
    this.map = map
  }

  private createColoredIcon(color: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-pin',
      html: `
        <svg width="24" height="36" viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24c0-6.6-5.4-12-12-12z" fill="${color}"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>
      `,
      iconSize: PIN_ICON_SIZE,
      iconAnchor: PIN_ICON_ANCHOR,
      popupAnchor: PIN_POPUP_ANCHOR,
    })
  }

  addDiscovery(discovery: DiscoveryCard): void {
    const color = PIN_COLORS[discovery.label]
    const icon = this.createColoredIcon(color)
    const marker = L.marker([discovery.coordinatesX, discovery.coordinatesY], { icon })
      .addTo(this.map)
      .bindPopup(`<strong>${discovery.name}</strong>`)
    this.markers.set(discovery.id, marker)
  }

  addMultiple(discoveries: DiscoveryCard[]): void {
    discoveries.forEach((discovery) => this.addDiscovery(discovery))
  }

  removeDiscovery(id: number): void {
    const marker = this.markers.get(id)
    if (!marker) {
      return
    }
    this.map.removeLayer(marker)
    this.markers.delete(id)
  }
}
