import React from 'react'
import TermsAndDataPrivacy from './TermsAndDataPrivacy'
import { ThemeProvider } from '@allthings/elements'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'

const DATA_PROTECTION = 'input#dataProtection'
const TERMS_OF_USE = 'input#termsOfUse'
const store = global.mockStore({
  authentication: {
    accessToken: 'abcd1234',
  },
  app: {
    embeddedLayout: false,
  },
})

describe('Check the TermsAndDataPrivacy component of SignUp', () => {
  it('should render two unticked checkboxes and no error message - data protection checking', () => {
    const mockHandleDataProtection = jest.fn()
    const mockHandleTermsOfUse = jest.fn()
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={{}}>
            <TermsAndDataPrivacy
              dataProtection={false}
              dataProtectionURL={'https://xyz'}
              onDataProtection={mockHandleDataProtection}
              onTermsOfUse={mockHandleTermsOfUse}
              termsOfUse={false}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
    // By default both checkboxes should be unchecked.
    expect(wrapper.find(DATA_PROTECTION).prop('checked')).toBeFalsy()
    expect(wrapper.find(TERMS_OF_USE).prop('checked')).toBeFalsy()
    // Check the data protection.
    wrapper.find(DATA_PROTECTION).simulate('change')
    expect(mockHandleDataProtection.mock.calls.length).toBe(1)
    expect(mockHandleTermsOfUse.mock.calls.length).toBe(0)
  })
  it('should render two unticked checkboxes and no error message - terms of use checking', () => {
    const mockHandleDataProtection = jest.fn()
    const mockHandleTermsOfUse = jest.fn()
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={{}}>
            <TermsAndDataPrivacy
              dataProtection={false}
              dataProtectionURL={'https://xyz'}
              onDataProtection={mockHandleDataProtection}
              onTermsOfUse={mockHandleTermsOfUse}
              termsOfUse={false}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
    // By default both checkboxes should be unchecked.
    expect(wrapper.find(DATA_PROTECTION).prop('checked')).toBeFalsy()
    expect(wrapper.find(TERMS_OF_USE).prop('checked')).toBeFalsy()
    // Check the data protection.
    wrapper.find(TERMS_OF_USE).simulate('change')
    expect(mockHandleDataProtection.mock.calls.length).toBe(0)
    expect(mockHandleTermsOfUse.mock.calls.length).toBe(1)
  })
  it('should render two ticked checkboxes and an error message', () => {
    const mockHandleDataProtection = jest.fn()
    const mockHandleTermsOfUse = jest.fn()
    const wrapper = global.mountIntl(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={{}}>
            <TermsAndDataPrivacy
              dataProtection={true}
              dataProtectionURL={'https://xyz'}
              onDataProtection={mockHandleDataProtection}
              onTermsOfUse={mockHandleTermsOfUse}
              termsOfUse={true}
            />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    )
    expect(wrapper).toMatchSnapshot()
    // By default both checkboxes should be unchecked.
    expect(wrapper.find(DATA_PROTECTION).prop('checked')).toBeTruthy()
    expect(wrapper.find(TERMS_OF_USE).prop('checked')).toBeTruthy()
    expect(mockHandleDataProtection.mock.calls.length).toBe(0)
    expect(mockHandleTermsOfUse.mock.calls.length).toBe(0)
  })
})
