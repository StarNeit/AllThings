import React from 'react'
import { Provider } from 'react-redux'
import CraftspeopleList from './CraftspeopleList'
import { BrowserRouter } from 'react-router-dom'

const store = global.mockStore({
  authentication: {
    accessToken: 'abcd1234',
  },
  app: {
    embeddedLayout: false,
  },
})

const NO_CRAFTSPEOPLE = '[data-e2e="no-craftspeople-text"]'
const CRAFTSPERSON = '[data-e2e="craftspeople-company-Cleaning Company GmbH"]'

describe('CraftspeopleList', () => {
  it('should render CraftspeopleList', async () => {
    const wrapper = global.mountIntl(
      <BrowserRouter>
        <Provider store={store}>
          <CraftspeopleList
            addressId="1234"
            craftspeople={[]}
            loading={false}
            locale="en_US"
          />
        </Provider>
      </BrowserRouter>,
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(NO_CRAFTSPEOPLE).exists()).toBeTruthy()
  })

  it('should render CraftspeopleList', async () => {
    const wrapper = global.mountIntl(
      <BrowserRouter>
        <Provider store={store}>
          <CraftspeopleList
            addressId="1234"
            craftspeople={[
              {
                _embedded: {
                  externalAgentCompany: { _embedded: { logo: 'abc.logo' } },
                },
                categories: [
                  {
                    description: { en_US: 'foo' },
                    id: '575961208433e195008b4567',
                    key: 'Cleaning',
                    name: { en_US: 'Cleaning' },
                    thirdPartyData: true,
                    vocabulary: 'bar',
                  },
                ],
                companyAddress: {
                  city: 'Freiburg',
                  houseNumber: '82',
                  postalCode: '79211',
                  street: 'Hindenburgstraße',
                },
                companyId: '675961208433e195008b4569',
                companyName: 'Cleaning Company GmbH',
                companyPhoneNumber: '+41 2329 77 77',
                id: '275961208433e195008b4564',
                phoneNumber: '+41 2329 23 23',
                username: 'testPerson',
              },
            ]}
            loading={false}
            locale="en_US"
          />
        </Provider>
      </BrowserRouter>,
    )

    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find(CRAFTSPERSON).exists()).toBeTruthy()
  })
})
