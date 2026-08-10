import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import MapView from './MapView.vue'

describe('MapView', () => {
  it('initializes the map on mount and destroys it on unmount', async () => {
    const initialize = vi.fn<(container: HTMLElement) => void>()
    const destroy = vi.fn<() => void>()

    const wrapper = mount(MapView, {
      global: {
        provide: {
          mapService: { initialize, destroy },
        },
        stubs: {
          RouterLink: true,
        },
      },
    })

    await nextTick()

    expect(initialize).toHaveBeenCalledTimes(1)
    expect(initialize).toHaveBeenCalledWith(expect.any(HTMLElement))

    wrapper.unmount()

    expect(destroy).toHaveBeenCalledTimes(1)
  })
})
