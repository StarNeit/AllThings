import React from 'react'
import JsonContainer from './jsonContainer'
import render from 'react-test-renderer'

it('JsonContainer Component', () => {
  const tree = render.create(<JsonContainer id="test" json="{}" />).toJSON()
  expect(tree).toMatchSnapshot()
})
