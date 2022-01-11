import React from 'react'
import App from './App'

describe('Check the App', () => {
  it('should check the app', () => {
    const wrapper = global.shallowIntl(<App />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should propagate the translations down by having a validity object', () => {
    const wrapper = global.shallowIntl(<App />)
    expect(wrapper).toMatchSnapshot()
  })
})
