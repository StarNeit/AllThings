import React from 'react'
import { Provider } from 'react-redux'
import Craftspeople from './Craftspeople'
import { MicroApps } from 'enums'

const storeBase = {
  app: {
    config: {
      clientID: 123,
    },
    embeddedLayout: false,
    microApps: [
      {
        customLogo: 'someLogo',
        type: MicroApps.CRAFTSPEOPLE,
        label: { en_US: 'Craftspeople' },
      },
    ],
  },
}

const ADDRESS1 = '[data-e2e="1234-craftspeople-address"]'
const ADDRESS2 = '[data-e2e="3456-craftspeople-address"]'

describe('Craftspeople', () => {
  it('should render Craftspeople', async () => {
    const store = global.mockStore({
      ...storeBase,
      authentication: {
        accessToken: 'abcd1234',
        user: {
          addresses: [
            { id: '1234', key: 'Address#1' },
            { id: '3456', key: 'Address#2' },
          ],
          locale: 'en_US',
        },
      },
    })
    const wrapper = global.mountIntl(
      global
        .shallow(
          <Provider store={store}>
            <Craftspeople />
          </Provider>,
        )
        .get(0),
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(ADDRESS1).exists()).toBeTruthy()
    expect(wrapper.find(ADDRESS2).exists()).toBeTruthy()
  })
})
