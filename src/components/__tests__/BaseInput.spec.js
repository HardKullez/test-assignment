import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseInput from '../base/BaseInput.vue'

describe('BaseInput', () => {
  it('renders properly with initial value', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: 'Input text' } })

    expect(wrapper.find('input').element.value).toBe('Input text')
  })

  it('emits on value change', () => {
    const wrapper = mount(BaseInput, { props: { modelValue: 'Input text' } })

    wrapper.find('input').setValue('Inner input text')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['Inner input text'])
  })

  it('applies listeners', async () => {
    const obj = {
      handler: () => {}
    }

    const clickSpy = vi.spyOn(obj, 'handler')
    const wrapper = mount(BaseInput, { attrs: { onClick: obj.handler } })

    expect(clickSpy).not.toHaveBeenCalled()

    await wrapper.find('input').trigger('click')
    await wrapper.find('input').trigger('click')

    expect(clickSpy).toHaveBeenCalledTimes(2)
  })

  it('applies attributes', () => {
    const wrapper = mount(BaseInput, { attrs: { disabled: true, id: 'spec' } })

    expect(wrapper.find('input').attributes()).toContain({
      disabled: '',
      id: 'spec'
    })
  })
})
