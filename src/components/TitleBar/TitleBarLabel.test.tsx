import React from 'react'
import TitleBarLabel from './TitleBarLabel'
import { render } from '@testing-library/react'
import { createStore } from 'redux'
import rootReducers from 'store/rootReducers'
import { Provider } from 'react-redux'
import { FetchMock } from 'jest-fetch-mock'
import { ResourceProvider } from '@allthings/elements'
import { MicroApps } from '../../enums'
import createRootReducer from 'store/reducers'

const fetchMock = fetch as FetchMock

function renderWithRedux(ui: JSX.Element, initialState: IReduxState) {
  const store = createStore(
    (state, action) => rootReducers(state, action, createRootReducer()),
    initialState,
  )

  return render(<Provider store={store}>{ui}</Provider>)
}

const mockedState = ({
  app: {
    microApps: [
      {
        label: {
          de_DE: 'External content 0',
          en_US: 'External content 0',
          fr_FR: 'External content 0',
        },
        type: 'external-content',
        icon: 'logout-filled',
        navigationHidden: false,
        enabled: true,
        url: 'https://custom.domain',
        customLogo: 'https://custom.logo',
        id: '1st external content micro app',
      },
      {
        enabled: true,
        label: {
          de_DE: 'External content 1',
          en_US: 'External content 1',
          fr_FR: 'External content 1',
        },
        type: 'external-content',
        icon: 'logout-filled',
        url: 'https://custom2.domain',
        customLogo: 'https://custom2.logo',
        navigationHidden: false,
        id: '2nd external content micro app',
      },
      {
        enabled: true,
        label: {
          de_DE: 'External content 2',
          en_US: 'External content 2',
          fr_FR: 'External content 2',
        },
        type: '__unknown__',
        icon: null,
        url: 'https://custom2.domain',
        customLogo: null,
        navigationHidden: false,
        id: '3nd unknown type micro app',
      },
    ],
  },
} as unknown) as IReduxState

beforeEach(fetchMock.resetMocks)

describe('TitleBarLabel', () => {
  // https://allthings.atlassian.net/browse/APP-3293
  // Before the `customLogo` property external content logo was always the same
  it('should render correct icon', async () => {
    fetchMock.mockResponse('<div data-testid="logo" />')

    renderWithRedux(
      <TitleBarLabel
        microAppId={mockedState.app.microApps[1].id}
        microAppType={MicroApps.EXTERNAL_CONTENT}
      >
        External content 1
      </TitleBarLabel>,
      mockedState,
    )

    expect(fetchMock.mock.calls[0][0]).toBe(
      mockedState.app.microApps[1].customLogo,
    )
  })

  it('should render correct fallback icon', () => {
    // no real response needed. only used to check the correct url
    fetchMock.mockResponse('')

    renderWithRedux(
      <ResourceProvider>
        <TitleBarLabel microAppType={mockedState.app.microApps[2].type}>
          External content 2
        </TitleBarLabel>
      </ResourceProvider>,
      mockedState,
    )

    expect(fetchMock.mock.calls[0][0]).toMatchInlineSnapshot(
      `"https://static.allthings.me/react-icons/production/tileFilled.svg"`,
    )
  })
})
