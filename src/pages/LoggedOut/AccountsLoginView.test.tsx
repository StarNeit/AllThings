import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import AccountsLoginView from './AccountsLoginView'

const LOGIN_MESSAGE = '[data-e2e="login-message"]'

describe('Check the account login view', () => {
  it('should not render the loginMessage if missing', () => {
    const state = {
      app: {
        authentication: { isLoggingIn: false },
        config: {},
        locale: 'en_US',
      },
    }
    const store = global.mockStore(state)
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <BrowserRouter>
          <AccountsLoginView />
        </BrowserRouter>
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(LOGIN_MESSAGE).exists()).toBeFalsy()
  })

  it('should render the loginMessage if present', () => {
    const state = {
      app: {
        authentication: { isLoggingIn: false },
        config: {
          loginMessage: {
            en_US: 'foo',
          },
        },
        locale: 'en_US',
      },
    }
    const store = global.mockStore(state)
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <BrowserRouter>
          <AccountsLoginView />
        </BrowserRouter>
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(LOGIN_MESSAGE).exists()).toBeTruthy()
  })

  it('should render differently if loading', () => {
    const state = {
      app: {
        authentication: { isLoggingIn: true },
        config: {},
        locale: 'en_US',
      },
    }
    const store = global.mockStore(state)
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <BrowserRouter>
          <AccountsLoginView />
        </BrowserRouter>
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
