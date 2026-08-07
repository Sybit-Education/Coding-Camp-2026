import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar.vue'

describe('Navbar', () => {
  it('closes the expanded menu when a menu route is opened', async () => {
    const wrapper = mount(Navbar, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const menuButton = wrapper.findAll('button')[4]
    if (!menuButton) {
      throw new Error('Menu button not found')
    }
    await menuButton.trigger('click')
    expect(wrapper.text()).toContain('Datenschutz')

    const privacyLink = wrapper.findAllComponents(RouterLinkStub).find((link) => {
      return link.props('to') === '/privacy-policy'
    })

    expect(privacyLink).toBeTruthy()
    await privacyLink?.trigger('click')

    expect(wrapper.text()).not.toContain('Datenschutz')
  })
})
