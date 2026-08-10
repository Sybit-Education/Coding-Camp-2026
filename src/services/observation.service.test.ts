import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ObservationService } from './observation.service'
import type { PocketBaseService } from './pocket-base.service'

describe('ObservationService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns the newest bird by ISO date', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            source: 'test',
            count: 2,
            observations: [
              {
                date: '2024-01-01T10:00:00.000Z',
                speciesId: 'old-1',
                species: 'Old Bird',
                taxonomy: null,
                observer: 'A',
              },
              {
                date: '2024-02-01T10:00:00.000Z',
                speciesId: 'new-1',
                species: 'New Bird',
                taxonomy: null,
                observer: 'B',
              },
            ],
          }),
          { status: 200 },
        ),
      ),
    )

    const pocketBaseService = {
      getBy: vi.fn<(_collection: string, _field: string, value: string) => Promise<unknown>>(
        async (_collection: string, _field: string, value: string) => {
          if (value === 'New Bird') {
            return { id: 'new', name: 'New Bird', description: 'new' }
          }
          if (value === 'Old Bird') {
            return { id: 'old', name: 'Old Bird', description: 'old' }
          }
          return undefined
        },
      ),
      getImageUrl: vi.fn<() => Promise<string>>(),
    }

    const service = Object.create(ObservationService.prototype) as ObservationService
    Object.defineProperty(service, 'pocketBaseService', {
      value: pocketBaseService as unknown as PocketBaseService,
    })
    const bird = await service.getNewestBird()

    expect(bird?.name).toBe('New Bird')
  })
})
