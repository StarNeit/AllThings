/* tslint:disable */
/// <reference path="global.d.ts" />

import { configure, shallow, render, mount } from 'enzyme'
import { createSerializer } from 'enzyme-to-json'
import { IntlProvider } from 'react-intl'
import Adapter from 'enzyme-adapter-react-16'
import configureStore from 'redux-mock-store'
import React from 'react'
import renderer from 'react-test-renderer'
import fetch, { FetchMock } from 'jest-fetch-mock'
import { GlobalWithFetchMock } from 'jest-fetch-mock'

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

process.env.NODE_ENV = 'test'
process.env.STAGE = 'test'

if (!(Intl as any).PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill')
  require('@formatjs/intl-pluralrules/dist/locale-data/en')
}

if (!(Intl as any).RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill')
  require('@formatjs/intl-relativetimeformat/dist/locale-data/en')
}

// Adapter for React 16.
configure({ adapter: new Adapter() })

// Add serializer for enzyme-to-json.
expect.addSnapshotSerializer(createSerializer({
  noKey: false,
  mode: 'deep',
}) as any)

// Add a store for Redux testing.
const middlewares: any = []
const mockStore = configureStore(middlewares)

const nodeWithIntlProvider = (node: any, messages = {}) =>
  React.createElement(
    IntlProvider,
    {
      messages,
      locale: 'en-US',
      textComponent: 'span',
      onError: err => {
        // no messages provided in test mode, so opt out of these messages
        if (!err.startsWith('[React Intl] Missing message')) {
          console.error(err)
        }
      },
    },
    node,
  )

const shallowIntl = (node: any) => shallow(nodeWithIntlProvider(node))
const mountIntl = (node: any, { context, childContextTypes } = {} as any) =>
  mount(nodeWithIntlProvider(node), { context, childContextTypes })

jest.doMock('cross-fetch', () => fetch)

const generateUuid = () =>
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

// Avoid annoying imports in all the tests.
global.nodeWithIntlProvider = nodeWithIntlProvider
global.uuid = generateUuid
global.mockStore = mockStore
global.mount = mount
global.fetch = fetch as FetchMock
global.mountIntl = mountIntl
global.render = render
global.renderer = renderer
global.shallow = shallow
global.shallowIntl = shallowIntl
/* tslint:enable */
