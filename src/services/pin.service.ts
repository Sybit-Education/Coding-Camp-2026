import * as Leaflet from 'leaflet'
import type { DiscoveryCard, NatureCategory } from '@/shared/types/card.types'

const PIN_COLORS: Record<NatureCategory, string> = {
  Vogel: 'var(--color-primary1)',
  Pflanze: 'var(--color-primary2)',
  Insekt: 'var(--color-accent1)',
  Baum: 'var(--color-primary2)',
}

const PIN_ICON_SIZE: Leaflet.PointTuple = [24, 36]
const PIN_ICON_ANCHOR: Leaflet.PointTuple = [12, 36]
const PIN_POPUP_ANCHOR: Leaflet.PointTuple = [0, -36]

export class PinService {
  private readonly map: Leaflet.Map
  private readonly markers: Map<number, Leaflet.Marker> = new Map()

  constructor(
    map: Leaflet.Map,
    private readonly layerGroup?: Leaflet.LayerGroup,
  ) {
    this.map = map
  }

  private createColoredIcon(color: string): Leaflet.DivIcon {
    return Leaflet.divIcon({
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
    if (!this.hasValidCoordinates(discovery)) {
      return
    }

    const color = PIN_COLORS[discovery.label]
    const icon = this.createColoredIcon(color)
    const marker = Leaflet.marker([discovery.coordinatesX, discovery.coordinatesY], {
      icon,
      title: discovery.name,
    }).bindPopup(this.createPopupContent(discovery.name))

    if (this.layerGroup) {
      this.layerGroup.addLayer(marker)
    } else {
      marker.addTo(this.map)
    }

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
    if (this.layerGroup) {
      this.layerGroup.removeLayer(marker)
    } else {
      this.map.removeLayer(marker)
    }
    this.markers.delete(id)
  }

  private hasValidCoordinates(discovery: DiscoveryCard): boolean {
    return (
      Number.isFinite(discovery.coordinatesX) &&
      Number.isFinite(discovery.coordinatesY) &&
      discovery.coordinatesX >= -90 &&
      discovery.coordinatesX <= 90 &&
      discovery.coordinatesY >= -180 &&
      discovery.coordinatesY <= 180 &&
      !(discovery.coordinatesX === 0 && discovery.coordinatesY === 0)
    )
  }

  private createPopupContent(name: string): HTMLElement {
    const content = document.createElement('strong')
    content.textContent = name
    return content
  }
}
