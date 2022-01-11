import * as sdk from '@allthings/sdk'
import querystring from 'query-string'
import getServiceHost from 'utils/getServiceHost'
import { storeCookie, extractCookie } from 'utils/cookie'

export const redirectPath = '/login'

const DEFAULT_SCOPE = 'user:profile'
const STATE_COOKIE_PREFIX = 'ST-'

const redirectUri = (hostname: string) =>
  `https://${hostname}${redirectPath}?provider=allthings`

export const accountsBaseUrl = (hostname: string) =>
  `https://${getServiceHost(hostname, 'accounts')}`

export const getStateCookieName = (state: string) => STATE_COOKIE_PREFIX + state

export const getOAuthState = (cookie: string, state: string): string => {
  const savedCookie = extractCookie(cookie, getStateCookieName(state))
  if (!savedCookie) {
    throw new Error(`Invalid state ${state}`)
  }

  return decodeURIComponent(savedCookie)
}

export const saveOAuthState = (state: string, value: string): void => {
  storeCookie(
    getStateCookieName(state),
    encodeURIComponent(value),
    1000 * 60 * 5,
  )
}
export const getLogoutUrl = (hostname: string) =>
  `${accountsBaseUrl(hostname)}/logout`

export const getAuthorizationUrlAndState = ({
  hostname,
  scope = DEFAULT_SCOPE,
  clientId,
  isSignup = false,
}: {
  hostname: string
  scope?: string
  clientId: string
  isSignup?: boolean
}) => {
  const client = sdk.restClient({
    clientId,
    scope,
    oauthUrl: accountsBaseUrl(hostname),
    redirectUri: redirectUri(hostname),
  })

  const state = client.oauth.generateState()
  const parsedOauthUrl = querystring.parseUrl(
    client.oauth.authorizationCode.getUri(state),
  )

  const url = `${parsedOauthUrl.url}?${querystring.stringify({
    ...parsedOauthUrl.query,
    ...(isSignup && { signup: '' }),
  })}`

  return {
    url,
    state,
  }
}

export const getAccessToken = ({
  authCode,
  hostname,
  clientId,
}: {
  authCode: string
  hostname: string
  clientId: string
}) => {
  const client = sdk.restClient({
    clientId,
    oauthUrl: accountsBaseUrl(hostname),
    redirectUri: redirectUri(hostname),
  })
  return client.oauth.authorizationCode.requestToken(authCode)
}

export const getRefreshToken = ({
  hostname,
  clientId,
  refreshToken,
}: {
  refreshToken: string
  hostname: string
  clientId: string
}) => {
  const client = sdk.restClient({
    clientId,
    oauthUrl: accountsBaseUrl(hostname),
  })
  return client.oauth.refreshToken(refreshToken)
}

export const stateAndCodeFromRequest = (request: ParsedRequest) => {
  if (request.path.startsWith(redirectPath) && request.queryStringParameters) {
    const { state, code } = request.queryStringParameters
    if (code && state) {
      return { state, code }
    }
  }
  return {}
}
