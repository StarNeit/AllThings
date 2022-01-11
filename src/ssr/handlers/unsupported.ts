import getServiceHost from '../../utils/getServiceHost'
import makeResponse from '../utils/apiGatewayResponse'
import parseRequest from '../utils/apiGatewayRequest'
import readFileIntoString from '../utils/readFileIntoString'
import { MIXPANEL_DEV_TOKEN, MIXPANEL_PROD_TOKEN, IS_DEV } from '../constants'
import { version } from '../../../package.json'

export default async function(
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context,
  callback: () => void,
) {
  const request = parseRequest(event, context)
  const hostname = request.headers['x-forwarded-host'] || request.hostname

  let template = readFileIntoString(
    __dirname,
    '../../../',
    `public/unsupported.html`,
  )

  const config = async () => {
    try {
      const currentRequest = await fetch(
        `https://${getServiceHost(
          hostname,
        )}/api/v1/apps/${hostname}/configuration`,
      )
      return await currentRequest.json()
    } catch (error) {
      return {
        appId: 'unknownAppID',
        appName: 'Allthings',
      }
    }
  }

  const configResult = await config()
  const appId = configResult.appID
  const appName = configResult.appName

  const mixpanelToken = IS_DEV ? MIXPANEL_DEV_TOKEN : MIXPANEL_PROD_TOKEN

  const cssPath = IS_DEV
    ? '/static/css/bundle.dev.css'
    : '/static/css/prod.min.css'

  template = template
    .replace(/\$CDN_HOST_URL_PREFIX\$/g, process.env.CDN_HOST_URL_PREFIX || '')
    .replace(/\$CSS\$/g, cssPath)
    .replace(/\$VERSION\$/g, version)
    .replace('$MIXPANEL_TOKEN$', mixpanelToken)
    .replace(/\$APP_ID\$/g, appId)
    .replace(/\$APP_NAME\$/g, appName)

  const response = makeResponse(request, callback)

  response.html(template)
}
