import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseButton from '../base/BaseButton.vue'

describe('BaseButton', () => {
  it('renders properly', () => {
    const wrapper = mount(BaseButton, { slots: { default: 'Button text' } })

    expect(wrapper.find('button').text()).toBe('Button text')
  })

  it('applies listeners', async () => {
    const obj = {
      handler: () => {}
    }

    const clickSpy = vi.spyOn(obj, 'handler')
    const wrapper = mount(BaseButton, { attrs: { onClick: obj.handler } })

    expect(clickSpy).not.toHaveBeenCalled()

    await wrapper.find('button').trigger('click')
    await wrapper.find('button').trigger('click')

    expect(clickSpy).toHaveBeenCalledTimes(2)
  })

  it('applies attributes', () => {
    const wrapper = mount(BaseButton, { attrs: { disabled: true, id: 'spec' } })

    expect(wrapper.find('button').attributes()).toContain({
      disabled: '',
      id: 'spec'
    })
  })
})
