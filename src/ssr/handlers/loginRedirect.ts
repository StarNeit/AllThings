import 'source-map-support/register'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'
import {
  getAuthorizationUrlAndState,
  getStateCookieName,
} from 'utils/accountsOAuth'
import getServiceHost from 'utils/getServiceHost'
import fetch from 'cross-fetch'
import renderDebugResponse from '../utils/renderDebugResponse'

const getRedirectUrlAndState = async (
  hostname: string,
  queryStringParameters: IndexSignature<string>,
) => {
  const configUrl = `https://${getServiceHost(
    hostname,
  )}/api/v1/apps/${hostname}/configuration`
  const configRequest = await fetch(configUrl)

  if (configRequest.status >= 400) {
    throw new Error(
      `Error while retrieving config [GET ${configUrl}]: STATUS ${
        configRequest.status
      } body: ${await configRequest.text()}`,
    )
  }

  const { clientID } = await configRequest.json()

  return getAuthorizationUrlAndState({
    hostname,
    clientId: clientID,
    isSignup:
      queryStringParameters &&
      typeof queryStringParameters.signup !== 'undefined',
  })
}

export const requestHandler = (
  request: ParsedRequest,
  response: {
    redirect: (
      url: string,
      status?: number,
      context?: IndexSignature,
    ) => Promise<void>
    html: (body: string, status?: number) => void
  },
) => {
  const { hostname, queryStringParameters } = request

  const host = request.headers['x-forwarded-host'] || hostname

  return getRedirectUrlAndState(host, queryStringParameters)
    .then(({ state, url }) => {
      const headers = {
        'Set-Cookie': `${getStateCookieName(state)}=/; Expires=${new Date(
          new Date().getTime() + 60000 * 10,
        ).toUTCString()}`,
      }

      return response.redirect(url, 302, {
        headers,
      })
    })
    .catch(error => {
      // tslint:disable-next-line:no-console
      console.error(error)
      response.html(renderDebugResponse(request, error), 500)
    })
}

/* istanbul ignore next */
export default function(
  event: import('aws-lambda').APIGatewayProxyEvent,
  context: IndexSignature,
  callback: () => void,
) {
  const request = parseRequest(event, context)
  const response: any = makeResponse(request, callback)

  return requestHandler(request, response)
}
