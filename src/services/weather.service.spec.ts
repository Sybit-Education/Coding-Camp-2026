import { afterEach, describe, expect, it, vi } from 'vitest'

import { WeatherService } from './weather.service'

function mockFetchJson(data: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn<() => Promise<{ ok: boolean; json: () => Promise<unknown> }>>().mockResolvedValue({
      ok: true,
      json: vi.fn<() => Promise<unknown>>().mockResolvedValue(data),
    }),
  )
}

describe('WeatherService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps DWD warning arrays to warnings for Radolfzell', async () => {
    mockFetchJson({
      warnings: [
        {
          event: 'GEWITTER',
          headline: 'Amtliche WARNUNG vor GEWITTER',
          description: 'Gewitter in Radolfzell',
          severity: 'Severe',
          start: '2026-08-09T10:00:00.000Z',
          end: '2026-08-09T11:00:00.000Z',
          regions: [
            {
              polygonGeometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [8.9, 47.7],
                    [9.1, 47.7],
                    [9.1, 47.8],
                    [8.9, 47.8],
                    [8.9, 47.7],
                  ],
                ],
              },
            },
          ],
        },
        {
          event: 'STURM',
          headline: 'Amtliche WARNUNG vor STURM',
          description: 'Sturm anderswo',
          severity: 'Moderate',
          start: '2026-08-09T12:00:00.000Z',
          end: '2026-08-09T13:00:00.000Z',
          regions: [
            {
              polygonGeometry: {
                type: 'Polygon',
                coordinates: [
                  [
                    [10.0, 48.0],
                    [10.1, 48.0],
                    [10.1, 48.1],
                    [10.0, 48.1],
                    [10.0, 48.0],
                  ],
                ],
              },
            },
          ],
        },
      ],
    })

    await expect(new WeatherService().getWarnings()).resolves.toEqual([
      {
        event: 'GEWITTER',
        headline: 'Amtliche WARNUNG vor GEWITTER',
        description: 'Gewitter in Radolfzell',
        severity: 'Severe',
        onset: '2026-08-09T10:00:00.000Z',
        expires: '2026-08-09T11:00:00.000Z',
      },
    ])
  })
})
