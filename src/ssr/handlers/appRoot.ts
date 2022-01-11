import 'source-map-support/register'
import AwsXray from 'aws-xray-sdk-core'
import logger from '../utils/logger'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'
import renderReactApp from '../utils/renderReactApp'
import renderDebugResponse from '../utils/renderDebugResponse'
import handleOAuthAuthorizeRedirect from 'ssr/utils/handleOAuthAuthorizeRedirect'

if (process.env.STAGE !== 'development') {
  // tslint:disable:no-var-requires
  AwsXray.captureHTTPsGlobal(require('http'))
  AwsXray.captureHTTPsGlobal(require('https'))
  // tslint:enable:no-var-requires
  // tslint:disable:no-console
  process.on('unhandledRejection', console.warn.bind(console))
  process.on('uncaughtException', console.error.bind(console))
  // tslint:enable:no-console
}

export default function handler(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: (...args: any[]) => void,
) {
  /*
    context.callbackWaitsForEmptyEventLoop is set to false in order to send our
    handler's callback() response from our invocation to API Gateway ASAP.
    We do have to do this because we race an Allthings API request with a timeout
    and because, by default, Lambda waits for an empty event loop before finishing
    the Lambda functions invocation, our function won't end until _both_ of the raced
    Promises complete. This is problematic when the API is taking a long time to
    respond—If we wait for a response from the API, we've bound our Lambda's
    response to the API.
    See also:
    http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html#nodejs-prog-model-context-properties
  */
  context.callbackWaitsForEmptyEventLoop = false

  // If we're invoked by the "keep this function warm"
  // AWS CloudWatch (scheduled) Event, we bail because we're done.
  if ((event as any).source === 'aws.events') {
    return callback(null, {})
  }

  const request = parseRequest(event, context)
  const response = makeResponse(request, callback)

  if (!request.isOffline) {
    Object.assign(console, logger(request))
  }

  if (handleOAuthAuthorizeRedirect(request, response)) {
    return
  }

  renderReactApp(request)
    .then(({ statusCode, location, body }) => {
      if (location) {
        return response.redirect(location, statusCode)
      }

      return response.html(body, statusCode)
    })
    .catch(error => {
      // tslint:disable-next-line:no-console
      console.error('SSR render error', error)
      response.html(renderDebugResponse(request, error), 500)
    })
}
