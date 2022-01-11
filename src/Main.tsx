// /!\ The pofills MUST remain imported upfront!
// ES6 imports are executed asynchronously and prior to the script.
// See http://exploringjs.com/es6/ch_modules.html#sec_modules-in-browsers
import 'utils/polyfills'
import 'utils/rehydrate'

import get from 'lodash-es/get'
import React from 'react'
import * as ReactDOM from 'react-dom'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import AppActions from 'store/actions/app'
import AuthActions from 'store/actions/authentication'
import configureStore from 'store/configureStore'
import { extractCookie, storeCookie } from 'utils/cookie'
import { installHelpers } from 'utils/debug'
import waitForState from 'store/waitForState'
import StoreIntlProvider from 'containers/StoreIntlProvider'
import extractContainerData from 'utils/extractContainerData'
import api from 'store/api'
import logBrowserError from 'utils/logBrowserError'
import qs from 'query-string'
import { ConnectedRouter } from 'connected-react-router'
import App from './App'
import { createBrowserHistory } from 'history'
import { ResourceProvider } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import exposeAppActions from './store/exposeAppActions'
import ConnectedApolloProvider from './containers/ConnectedApolloProvider'
import { Locale } from 'enums'
import { redirectPath } from 'utils/accountsOAuth'

const history = createBrowserHistory()

const pushHistory = () => {
  const storageUrl = window.localStorage.getItem('lastVisited')
  const isStandAloneApp = (window as any).navigator.standalone
  if (isStandAloneApp && storageUrl) {
    // if storageUrl exists, it means the user clicked on a PDF which opened in
    // safari. This helps the user be redirected to the last opened page when
    // returning to standalone app
    history.push(storageUrl.toString())
    window.localStorage.removeItem('lastVisited')
  }
}

function renderApp(store: Store) {
  Boolean(
    ReactDOM.hydrate(
      <ResourceProvider>
        <Provider store={store}>
          <ConnectedApolloProvider>
            <StoreIntlProvider>
              <ConnectedRouter history={history}>
                <App />
              </ConnectedRouter>
            </StoreIntlProvider>
          </ConnectedApolloProvider>
        </Provider>
      </ResourceProvider>,
      document.getElementById('app'),
      () =>
        document.getElementById('app').setAttribute('data-e2e', 'app-ready'),
    ),
  ) && pushHistory()
}

async function maybeObtainAccessToken(store: Store) {
  const state = store.getState()

  const { code: authCode, state: authState } = qs.parse(window.location.search)

  if (
    window.location.pathname === redirectPath &&
    authCode &&
    !get(state, 'authentication.accessToken')
  ) {
    const dispatch = store.dispatch as FunctionalDispatch
    dispatch(AuthActions.loggingIn())
    await dispatch(
      AuthActions.loginWithAuthenticationCode(
        authCode,
        authState,
        document.cookie,
      ),
    )
  }
}

async function runApp() {
  if (process.env.NODE_ENV === 'production') {
    const colors = Object.values(ColorPalette).filter(
      color => typeof color === 'string',
    )
    const styles = colors.map(
      color => `background-color:${color};font-size:1.5em`,
    )
    // tslint:disable:no-console
    console.log.apply(null, ['%c  '.repeat(colors.length), ...styles])

    const allthings = `                              .      .
                                .      .
                                :      :    ( ((()
            .  .                |     ||               .  .
            :  :       ...... . ||     | . ......      :  :
            |  |  . .. :  .     |      |     .  : .. . |  |
   .........|  |.......;..:     |      |     :..:......|  |.........
   :        |  · .              |     ||        .      ·  |  :    :
          _____  .__  .__   __: .__    .__.     :            :
         /  _  \\ |  | |  |_/  |_|  |__ |__| :___:   ____  ___:__
        /  /_\\  \\|  | |  |\\.  __\\  |  \\|  |/  . \\ ./ ___\\/ .___/
       /    |  . \\  |_|  |_|  | |   Y  \\  |   |  \\/ /_/ >___ \\
       \\____|__  /____/____/__| |___|  /__|___|  /\\___  /____ >
            |  \\/      .        .    \\/        \\/:_____/     \\/
   :        ·          .        |      |        .         ·        :
   :........|  ·.......:...     |     ||     ...:......·  |........:
            |  |       :..:.. . |      | . ..:..:      |  |
            |  |          .     ||     |     .         |  |
            :  :                |      |               :  :
            .  .    ())) )      :      :               .  .
            ·                   ·      ·
           %c👋🏻 Hello from allthings!
Since you're here, you're probably interested in how things work.
Well, this particular page you're on was built with React, Redux (and some other stuff.)
We did a bit of server-side-rendering on AWS Lambda before serving it to you via AWS API Gateway.`

    console.log(allthings, `font-weight: bold`)
    console.log(
      `Are these the types of technologies that excite you? Perhaps you'd be interested in working with us! 🤩 %cHere are our open positions: 🔜 https://goo.gl/J6jg8V`,
      'font-weight: bold',
    )
    console.groupCollapsed(
      'Want to learn more about how this app is built? Check us out on Github!',
    )
    console.log(
      '%cUI component library: https://github.com/allthings/elements',
      'font-weight: bold',
    )
    console.log(
      '%cJS SDK: https://github.com/allthings/js-sdk',
      'font-weight: bold',
    )
    console.log(
      '%cColors we like: https://github.com/allthings/colors',
      'font-weight: bold',
    )
    console.log(
      '%cOr just all of our cool stuff: https://github.com/allthings',
      'font-weight: bold',
    )
    console.groupEnd()
    // tslint:enable:no-console
  }

  let serverState: any = {}
  try {
    serverState = extractContainerData('__SERVER_STATE__')
  } catch (e) {
    logBrowserError(e)
  }

  const store = configureStore(api, serverState, history)

  if (!serverState || !serverState.app) {
    const locale = extractCookie(document.cookie, 'locale') as Locale
    const userLoggedInBefore = extractCookie(
      document.cookie,
      'user_logged_in_before',
    )
    // tslint:disable-next-line:no-console
    console.info('No server state found')

    const dispatch = store.dispatch as FunctionalDispatch

    dispatch(
      AppActions.initApp({
        hostname: window.location.hostname,
        locale,
        userAgent: window.navigator.userAgent,
        userLoggedInBefore: userLoggedInBefore === '1',
      }),
    )
  }

  if (serverState && serverState.app && serverState.app.embeddedLayout) {
    ;(window as any).NativeCommunication = exposeAppActions(store)
  }

  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('error', function errorHandler(event) {
      logBrowserError(
        event.error || new Error(event.message),
        store && store.getState(),
      )
    })
  } else {
    installHelpers(store)
  }

  try {
    await waitForState(store)
  } catch (e) {
    logBrowserError(e)
  } finally {
    renderApp(store)
    maybeObtainAccessToken(store).then(
      () =>
        get(store.getState(), 'authentication.accessToken') &&
        storeCookie('user_logged_in_before', 1),
    )
  }
}

// Window.onload is already taken by Mixpanel 🤷.
window.addEventListener('load', runApp)
