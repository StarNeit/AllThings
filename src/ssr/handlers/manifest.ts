import 'source-map-support/register'
import getServiceHost from 'utils/getServiceHost'
import parseRequest from '../utils/apiGatewayRequest'
import makeResponse from '../utils/apiGatewayResponse'

export default function(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: (...args: any[]) => void,
) {
  const request = parseRequest(event, context)
  const response: any = makeResponse(request, callback)

  const hostname = request.headers['x-forwarded-host'] || request.hostname
  fetch(
    `https://${getServiceHost(hostname)}/api/v1/apps/${process.env.APP_DOMAIN ||
      hostname}/configuration`,
  )
    .then(resp => resp.json())
    .then(({ appName }) => {
      response.json(
        {
          name: appName,
          display: 'fullscreen',
          orientation: 'portrait',
          start_url: '/',
        },
        200,
      )
    })
    .catch(() => {
      response.json({}, 500)
    })
}
