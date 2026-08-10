import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MarkdownRenderer from './MarkdownRenderer.vue'

describe('MarkdownRenderer', () => {
  it('renders markdown as HTML', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '# Titel\n\n**fett** und *kursiv*' },
    })
    expect(wrapper.find('h1').text()).toBe('Titel')
    expect(wrapper.find('strong').text()).toBe('fett')
    expect(wrapper.find('em').text()).toBe('kursiv')
  })

  it('renders links', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '[Beispiel](https://example.com)' },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.text()).toBe('Beispiel')
  })

  it('renders GFM tables', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '| A | B |\n|---|---|\n| 1 | 2 |' },
    })
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('td').text()).toBe('1')
  })

  it('removes script tags (XSS protection)', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '<script>alert("xss")</script>' },
    })
    expect(wrapper.find('script').exists()).toBe(false)
  })

  it('strips dangerous HTML attributes (XSS protection)', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '<img src="x" onerror="alert(1)">' },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('onerror')).toBeUndefined()
  })

  it('renders nothing for empty source', () => {
    const wrapper = mount(MarkdownRenderer, {
      props: { source: '' },
    })
    expect(wrapper.text()).toBe('')
  })
})