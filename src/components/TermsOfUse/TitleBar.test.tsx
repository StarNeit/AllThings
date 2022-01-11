import React from 'react'
import { TitleBar } from './TitleBar'

describe('Check the TitleBar component of the terms of use', () => {
  it('should render correctly for logged in users', () => {
    const mockClick = jest.fn()
    const wrapper = global.mount(
      <TitleBar loggedIn={true} onClick={mockClick} title="A nice title" />,
    )
    expect(wrapper).toMatchSnapshot()
    wrapper.simulate('click')
    expect(mockClick.mock.calls.length).toBe(0)
  })
  it('should render correctly for non logged in users and handle going back', () => {
    const mockClick = jest.fn()
    const wrapper = global.mount(
      <TitleBar onClick={mockClick} title="A nice title" />,
    )
    expect(wrapper).toMatchSnapshot()
    wrapper.simulate('click')
    expect(mockClick.mock.calls.length).toBe(1)
  })
})
