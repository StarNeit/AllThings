import { ColorPalette } from '@allthings/colors'
import React from 'react'
import { GatewayDest, GatewayProvider } from 'react-gateway'
import { Provider } from 'react-redux'
import ServiceCenterCreateOverlay from './ServiceCenterCreateOverlay'
import { MicroApps } from 'enums'
import { MemoryRouter } from 'react-router'

const category = {
  description: { en_US: 'foo' },
  id: 'category-1234',
  key: 'some-key',
  name: { en_US: 'Cleaning' },
  thirdPartyData: true,
  vocabulary: 'bar',
}

const store = global.mockStore({
  app: {
    config: {
      clientID: 123,
    },
    embeddedLayout: false,
    locale: 'en_US',
    microApps: [{ color: ColorPalette.red, type: MicroApps.HELPDESK }],
  },
  authentication: {
    accessToken: 'abcd1234',
    user: {
      activePeriod: { id: '9999' },
      addresses: [
        { id: 'address-1234', key: 'Address#1' },
        { id: 'address-3456', key: 'Address#2' },
      ],
      email: 'test@test.com',
      locale: 'en_US',
      phoneNumber: '+49 000 00000',
    },
  },
  form: {},
  serviceCenter: {
    categories: {
      items: [category],
    },
  },
  theme: {
    microApps: {
      helpdesk: '#000000',
    },
  },
})

const READONLY_ADDRESS = `[data-e2e="service-center-overlay-choose-address"][data-e2e-disabled]`
const READONLY_CATEGORY = `[data-e2e="service-center-overlay-choose-category"][data-e2e-disabled]`

describe('ServiceCenterCreateOverlay', () => {
  it('should render ServiceCenterCreateOverlay with readonly info, if category is already chosen', async () => {
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <GatewayProvider>
          <MemoryRouter>
            <GatewayDest name="root" />
            <ServiceCenterCreateOverlay
              onRequestClose={jest.fn()}
              overlayData={{
                addressId: 'address-1234',
                category,
                craftsperson: 'Some Person',
              }}
            />
          </MemoryRouter>
        </GatewayProvider>
      </Provider>,
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(READONLY_ADDRESS).exists()).toBeTruthy()
    expect(wrapper.find(READONLY_CATEGORY).exists()).toBeTruthy()
  })
})
