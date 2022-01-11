import { Locale } from 'enums'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import noop from 'utils/noop'
import ServiceChooser from './ServiceChooser'

const storeBase: any = {
  app: {
    config: {
      clientID: 123,
    },
    embeddedLayout: false,
    microApps: [],
  },
}

describe('ServiceChooser', () => {
  it('renders ServiceChooser without errors', () => {
    const store = global.mockStore({
      ...storeBase,
      authentication: {
        accessToken: 'abcd1234',
        user: {
          locale: 'en_US',
        },
      },
    })

    const wrapper = global.mountIntl(
      <Provider store={store}>
        <MemoryRouter>
          <ServiceChooser
            chooserVisible
            country="any"
            locale={Locale.en_US}
            microApps={[
              {
                color: '#297fb8',
                icon: 'wrench-screwdriver-filled',
                type: 'craftspeople',
                label: {
                  [Locale.en_US]: 'cp',
                },
                _embedded: {
                  type: {
                    id: 'craftspeople',
                    defaultIcon: 'wrench-screwdriver-filled',
                    name: 'Craftspeople',
                    type: 'System',
                  },
                },
              },

              {
                color: null,
                type: 'clipboard',
                icon: 'shopping-cart-filled',
                label: null,
                _embedded: {
                  type: {
                    id: 'clipboard',
                    defaultIcon: 'shopping-cart-filled',
                    name: 'clipboard',
                    type: 'System',
                  },
                },
              },
            ]}
            onChooseService={noop}
            onGoTo={noop}
            onLogoutClick={noop}
            onMailClick={noop}
            onSearchClick={noop}
            title="title"
            unreadCount={5}
          />
        </MemoryRouter>
      </Provider>,
    )

    expect(wrapper).toMatchSnapshot()
  })
})
