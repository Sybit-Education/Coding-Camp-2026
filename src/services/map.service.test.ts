import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const leafletMocks = vi.hoisted(() => {
  const addTo = vi.fn<() => any>()
  const remove = vi.fn<() => void>()
  const setView = vi.fn<() => any>()
  const mapInstance = { remove, setView }
  setView.mockReturnValue(mapInstance)
  const tileLayerLayer = { addTo }
  const geoJSONAddTo = vi.fn<() => any>()
  const geoJSONEachLayer = vi.fn<() => void>()
  const geoJSONLayer = { addTo: geoJSONAddTo, eachLayer: geoJSONEachLayer }
  geoJSONAddTo.mockReturnValue(geoJSONLayer)
  const map = vi.fn<() => any>().mockReturnValue(mapInstance)
  const tileLayer = vi.fn<() => any>().mockReturnValue(tileLayerLayer)
  const geoJSON = vi.fn<() => any>().mockReturnValue(geoJSONLayer)

  return { addTo, remove, setView, map, tileLayer, geoJSONAddTo, geoJSONEachLayer, geoJSON }
})

vi.mock('leaflet', () => ({
  default: {
    map: leafletMocks.map,
    tileLayer: leafletMocks.tileLayer,
    geoJSON: leafletMocks.geoJSON,
    latLng: vi.fn<(lat: number, lng: number) => any>((lat: number, lng: number) => [lat, lng]),
    latLngBounds: vi.fn<() => any>(),
    divIcon: vi.fn<() => any>(),
    marker: vi.fn<() => any>(),
  },
}))

import { MapService } from './map.service'

describe('MapService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ignores stale location loads after remount', async () => {
    const flush = async () => {
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
    }

    let resolveFirstFetch: ((value: Response) => void) | undefined
    let resolveSecondFetch: ((value: Response) => void) | undefined

    vi.stubGlobal(
      'fetch',
      vi
        .fn<typeof fetch>()
        .mockImplementationOnce(
          () =>
            new Promise<Response>((resolve) => {
              resolveFirstFetch = resolve
            }),
        )
        .mockImplementationOnce(
          () =>
            new Promise<Response>((resolve) => {
              resolveSecondFetch = resolve
            }),
        ),
    )

    const service = Object.create(MapService.prototype) as MapService
    Object.assign(service as unknown as { loadLocationsRequestId: number }, {
      loadLocationsRequestId: 0,
    })
    const container = document.createElement('div')

    service.initialize(container)
    service.initialize(container)

    resolveFirstFetch?.(
      new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }), { status: 200 }),
    )
    await flush()
    expect(leafletMocks.geoJSON).not.toHaveBeenCalled()

    resolveSecondFetch?.(
      new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }), { status: 200 }),
    )
    await flush()
    expect(leafletMocks.geoJSON).toHaveBeenCalledTimes(1)
  })
})
