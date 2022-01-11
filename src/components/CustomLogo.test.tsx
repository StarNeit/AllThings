import React from 'react'
import CustomLogo from './CustomLogo'
import { cleanup, render, wait } from '@testing-library/react'

const COLOR = '#fff'
const URL = 'https://app.dev.allthings.me/test-icon.svg'
const FALLBACK_URL =
  'https://static.allthings.me/react-icons/production/logoutFilled.svg'

// Sadly Enzyme doesn't support hooks yet!
// https://github.com/airbnb/enzyme/issues/2011
// And react-testing-library has a verbosity issue
// https://github.com/kentcdodds/react-testing-library/issues/281

afterEach(cleanup)

describe('Check the CustomLogo component', () => {
  beforeEach(() => {
    global.fetch.resetMocks()
  })
  it('should fetch and retry again with a fallback', async () => {
    global.fetch
      .mockResponseOnce(JSON.stringify({}), {
        status: 404,
      })
      .mockResponseOnce(JSON.stringify({ status: 200 }))
    const { container } = render(<CustomLogo color={COLOR} url={URL} />)
    expect(container).toMatchSnapshot()
    expect(global.fetch.mock.calls.length).toEqual(1)
    expect(global.fetch.mock.calls[0][0]).toEqual(URL)
    await wait(() => {
      expect(global.fetch.mock.calls.length).toEqual(2)
      expect(global.fetch.mock.calls[1][0]).toEqual(FALLBACK_URL)
    })
  })
})
