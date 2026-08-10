import { RouterLinkStub, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import Navbar from './Navbar.vue'

function mountNavbar() {
  return mount(Navbar, {
    attachTo: document.body,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
      },
    },
  })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Navbar overflow menu', () => {
  it('labels icon-only navigation controls for assistive technology', () => {
    const wrapper = mountNavbar()

    expect(wrapper.find('nav[aria-label="Hauptnavigation"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Startseite öffnen"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Karte öffnen"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Vogelerkennung öffnen"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Lexikon öffnen"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="Weitere Navigation öffnen"]').exists()).toBe(true)
  })

  it('opens as a compact popover and closes after selecting a route', async () => {
    const wrapper = mountNavbar()

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)

    await wrapper.get('button[aria-label="Weitere Navigation öffnen"]').trigger('click')

    const menu = wrapper.get('#navbar-overflow-menu')
    expect(menu.attributes('role')).toBe('menu')
    expect(menu.attributes('aria-labelledby')).toBe('navbar-overflow-label')
    expect(menu.text()).toContain('Mehr')
    expect(menu.text()).toContain('Gefahrenanleitung')
    expect(menu.classes()).toContain('navbar-popover')

    expect(wrapper.get('#navbar-overflow-label').text()).toBe('Mehr')
    expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(5)

    const dangerGuideLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props('to') === '/dangerguide')

    expect(dangerGuideLink).toBeTruthy()
    await dangerGuideLink!.trigger('click')

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)
  })

  it('closes the overflow menu with Escape and returns focus to the trigger', async () => {
    const wrapper = mountNavbar()
    const trigger = wrapper.get('button[aria-label="Weitere Navigation öffnen"]')

    await trigger.trigger('click')
    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(true)

    await document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#navbar-overflow-menu').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger.element)
  })
})
