import { beforeEach, describe, expect, test, vi } from 'vitest'
import type L from 'leaflet'
import { MapService } from './map.service'

const mapMock = {
  fitBounds: vi.fn<(bounds: unknown, options?: unknown) => void>(),
  remove: vi.fn<() => void>(),
  removeLayer: vi.fn<(layer: unknown) => void>(),
  setView: vi.fn<() => unknown>(),
}

const tileLayerAddTo = vi.fn<(map: unknown) => unknown>()
const routeLayerAddTo = vi.fn<(this: unknown, map: unknown) => unknown>(function (this: unknown) {
  return this
})
const routeLayerGetBounds = vi.fn<() => string>(() => 'route-bounds')
const fallbackLayerAddTo = vi.fn<(this: unknown, map: unknown) => unknown>(function (this: unknown) {
  return this
})
const fallbackLayerGetBounds = vi.fn<() => string>(() => 'fallback-bounds')

vi.mock('leaflet', () => ({
  default: {
    latLng: vi.fn<(lat: number, lng: number) => { lat: number; lng: number }>((lat, lng) => ({ lat, lng })),
    latLngBounds: vi.fn<(southWest: unknown, northEast: unknown) => { southWest: unknown; northEast: unknown }>((southWest, northEast) => ({ southWest, northEast })),
    map: vi.fn<() => unknown>(() => ({
      ...mapMock,
      setView: vi.fn<() => unknown>(() => mapMock),
    })),
    tileLayer: vi.fn<() => { addTo: typeof tileLayerAddTo }>(() => ({ addTo: tileLayerAddTo })),
    geoJSON: vi.fn<() => { addTo: typeof routeLayerAddTo; getBounds: typeof routeLayerGetBounds }>(() => ({
      addTo: routeLayerAddTo,
      getBounds: routeLayerGetBounds,
    })),
    polyline: vi.fn<() => { addTo: typeof fallbackLayerAddTo; getBounds: typeof fallbackLayerGetBounds }>(() => ({
      addTo: fallbackLayerAddTo,
      getBounds: fallbackLayerGetBounds,
    })),
    divIcon: vi.fn<<T>(options: T) => T>((options) => options),
    marker: vi.fn<(latlng: unknown, options: unknown) => { latlng: unknown; options: unknown }>((latlng, options) => ({ latlng, options })),
    GeoJSON: class GeoJSON {},
  },
}))

describe('MapService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal(
      'fetch',
      vi.fn<() => Promise<Pick<Response, 'ok' | 'json'>>>(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve({ features: [] }) }),
      ),
    )
  })

  test('does not draw a stale route after it was removed while loading', async () => {
    const service = Reflect.construct(MapService, []) as MapService
    ;(service as unknown as { map: L.Map }).map = mapMock as unknown as L.Map

    let resolveRoute!: (response: Response) => void
    vi.mocked(fetch).mockImplementationOnce(
      () => new Promise<Response>((resolve) => (resolveRoute = resolve)),
    )

    const routePromise = service.addRoute([
      [47.7321318891516, 8.985194406835003],
      [47.731143669968596, 8.991063792852087],
    ] as L.LatLngExpression[])

    service.removeRoute()
    resolveRoute({
      ok: true,
      json: () => Promise.resolve({ features: [{ type: 'Feature', geometry: null }] }),
    } as Response)

    await routePromise

    expect(routeLayerAddTo).not.toHaveBeenCalled()
    expect(fallbackLayerAddTo).not.toHaveBeenCalled()
    expect(mapMock.fitBounds).not.toHaveBeenCalled()
  })
})
