import React from 'react'
import { Item } from './Item'

const restProps = {
  store: global.mockStore({
    authentication: {
      accessToken: 'abcd1234',
    },
    app: {
      embeddedLayout: false,
    },
  }),
}

describe('Check the Item component of the terms of use', () => {
  it('should render correctly', () => {
    const wrapper = global.mount(
      <Item message="A message" url="https://www.google.de" {...restProps} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
