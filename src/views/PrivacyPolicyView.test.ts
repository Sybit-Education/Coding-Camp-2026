import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PrivacyPolicyView from './PrivacyPolicyView.vue'

describe('PrivacyPolicyView', () => {
  it('shows the correct privacy contact email', () => {
    const wrapper = mount(PrivacyPolicyView)

    expect(wrapper.text()).toContain('datenschutz@sybit.de')
    expect(wrapper.text()).not.toContain('XXXX@sybit.de')
  })
})
