import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Provider } from 'react-redux'
import getTemplate from './template'
import renderFromTemplate from './renderFromTemplate'
import App from '../../App'
import AppAction from '../../store/actions/app'
import AuthAction from '../../store/actions/authentication'
import configureStore from '../../store/configureStore'
import waitForState from '../../store/waitForState'
import api from '../../store/api'
import StoreIntlProvider from '../../containers/StoreIntlProvider'
import { RESOURCE_PATH } from '@allthings/elements/ResourceProvider'
import { loadLanguage } from '@allthings/cdn-intl-provider'
import parser from 'accept-language-parser'
import get from 'lodash-es/get'
import { stateAndCodeFromRequest } from 'utils/accountsOAuth'
import { createMemoryHistory } from 'history'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'

export default async function render(request: ParsedRequest) {
  const location = {
    pathname: request.path,
    search: request.queryString,
  }
  // wrong typing for initialEntries, can be location objects too
  const history = createMemoryHistory({
    initialEntries: [location as any],
  })
  const Store = configureStore(api, undefined, history)

  const dispatch = Store.dispatch as FunctionalDispatch

  Store.subscribe(() => {
    request.state = Store.getState()
  })

  const accessToken =
    request.headers.authorization && request.headers.authorization.split(' ')[1]

  const acceptLanguage = request.headers['accept-language'] || 'en'
  const requestedLanguage = parser.parse(acceptLanguage)
  const cookies = request.cookies || {}

  dispatch(
    AppAction.initApp({
      hostname: request.headers['x-forwarded-host'] || request.hostname,
      headers: {
        'Accept-Language': acceptLanguage,
      },
      accessToken,
      embeddedLayout: !!accessToken,
      userAgent: request.headers['user-agent'],
      locale: cookies.locale || (request as any).get_locale_from_Browser,
      userLoggedInBefore: cookies.user_logged_in_before === '1',
    }),
  )

  let state = {} as any
  let locale
  try {
    state = await waitForState(Store, 3000)
    locale = state.app.locale
  } catch (error) {
    locale = `${requestedLanguage[0].code}_${requestedLanguage[0].region}`
    // tslint:disable-next-line:no-console
    console.log('Server side rendering too slow')
  }

  const { code: authCode, state: authState } = stateAndCodeFromRequest(request)
  if (!accessToken && authCode) {
    // set isLoggingIn state
    dispatch(AuthAction.loggingIn())

    /**
     * At this point, config (with OAuth client ID) might be loaded or might be
     * decided to load later on front-end (the way `waitForState` works).
     * To comply with that behavior, we check if we have client id -
     * if yes, exchange code to token right away here on backend; if not -
     * do that later on front-end where client id is guaranteed to exist.
     */
    if (get(state, 'app.config.clientID')) {
      await dispatch(
        AuthAction.loginWithAuthenticationCode(
          authCode,
          authState,
          request.headers.cookie,
        ),
      )
    }
  }

  const variation =
    get(state, 'app.config.segment', 'residential') === 'commercial'
      ? 'commercial-formal'
      : 'residential-informal'

  const messages = await loadLanguage(
    RESOURCE_PATH,
    'app',
    variation,
    locale,
    ['development', 'staging'].includes(process.env.STAGE)
      ? 'staging'
      : 'production',
  )
  const context = {} as any

  const client = new ApolloClient({
    uri: 'https://graphql.dev.allthings.me',
  })

  const reactPrerenderedHtml = () =>
    renderToString(
      <Provider store={Store}>
        <ApolloProvider client={client}>
          <StoreIntlProvider messages={messages}>
            <StaticRouter location={location} context={context}>
              <App />
            </StaticRouter>
          </StoreIntlProvider>
        </ApolloProvider>
      </Provider>,
    )

  if (context.url) {
    return {
      statusCode: 307,
      location: context.url,
    }
  }

  const body = renderFromTemplate(
    getTemplate(request),
    reactPrerenderedHtml,
    Store.getState(),
  )

  return { statusCode: 200, body }
}
