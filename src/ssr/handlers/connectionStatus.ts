// import 'source-map-support/register'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'

// https://github.com/nodejs/node/issues/1741#issuecomment-190649817
;(process as any).stdout._handle.setBlocking(true)

export default function(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: (...args: any[]) => void,
) {
  const request = parseRequest(event, context)
  const response: any = makeResponse(request, callback)

  response.html('<link rel="icon" href="data:;base64,iVBORw0KGgo=">')
}
