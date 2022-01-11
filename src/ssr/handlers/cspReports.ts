import { inspect } from 'util'
import 'source-map-support/register'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'
import logger from '../utils/logger'

class CSPViolation extends Error {
  inspect: () => string = null
  name: string = null
  constructor(message: string) {
    super(inspect(message))
    this.name = 'CSPViolation'
    this.inspect = function() {
      return this.message
    }
  }
}

export default function(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: (...args: any[]) => void,
) {
  const request = parseRequest(event, context)
  const response = makeResponse(request, callback)
  const cspLogger = logger(request)

  cspLogger.error(new CSPViolation(request.body as string))

  response.json({} as string)
}
