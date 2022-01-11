import 'source-map-support/register'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'
import logger from '../utils/logger'
import mapErrorStack from '../utils/mapErrorStack'

class BrowserError extends Error {
  inspect: () => string = null

  constructor(message: string, name: string, stack: string) {
    super(String(message))

    this.name = `Browser${name}`

    this.inspect = () => String(stack || `${this.name}: ${this.message}`)
  }
}

export default function(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: (...args: any[]) => void,
) {
  const request = parseRequest(event, context)
  const response: any = makeResponse(request, callback)

  const errorLogger = logger(request)

  const body = request.body as IndexSignature

  const stack = mapErrorStack(body.stack)
  request.state = body.state

  errorLogger.error(new BrowserError(body.message, body.name, stack))

  response.json({})
}
