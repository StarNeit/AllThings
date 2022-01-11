import 'source-map-support/register'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'

export default function(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: (...args: any[]) => void,
) {
  const request = parseRequest(event, context)
  const response: any = makeResponse(request, callback)

  const statusCode = Object.keys(request.cookies).length ? 200 : 400

  response.json({}, statusCode)
}
