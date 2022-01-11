import React from 'react'
import LegalDisclosure from 'pages/LegalDisclosure'
import { Provider } from 'react-redux'

describe('Check the legal disclosure component', () => {
  it('should render correctly if the user is not logged in', () => {
    const state = {
      authentication: {
        loggedIn: false,
      },
    }
    const store = global.mockStore(state)
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <LegalDisclosure />
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should render differently if the user is logged in', () => {
    const state = {
      authentication: {
        loggedIn: true,
      },
      app: {
        embeddedLayout: false,
        microApps: [],
      },
    } as any
    const store = global.mockStore(state)
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <LegalDisclosure />
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
