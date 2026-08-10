import { RouterLinkStub, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar.vue'

function mountNavbar() {
  return mount(Navbar, {
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

describe('Navbar overflow menu', () => {
  it('opens as a compact popover and closes after selecting a route', async () => {
    const wrapper = mountNavbar()

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)

    await wrapper.get('button[aria-label="Weitere Navigation öffnen"]').trigger('click')

    const menu = wrapper.get('#navbar-overflow-menu')
    expect(menu.text()).toContain('Mehr')
    expect(menu.text()).toContain('Gefahrenanleitung')
    expect(menu.classes()).toContain('bg-white/95')

    const dangerGuideLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props('to') === '/dangerguide')

    expect(dangerGuideLink).toBeTruthy()
    await dangerGuideLink!.trigger('click')

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)
  })
})
