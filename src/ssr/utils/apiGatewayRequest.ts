import qs from 'query-string'
import cookie from 'cookie'
import applyMiddleware from './applyMiddleware'

// Lowercases all header names
export const normalizeHeaders = ({
  headers = {},
  ...request
}: IndexSignature) => ({
  ...request,
  headers: Object.keys(headers).reduce(
    (normalizedHeaders, key) => ({
      ...normalizedHeaders,
      [key.toLowerCase()]: headers[key],
    }),
    {},
  ),
})

// Decodes the request body if it's been base64 encoded by API Gateway
export const decodeBase64Body = (request: IndexSignature) => {
  if (request.isBase64Encoded && request.body) {
    const bodyBuffer = Buffer.from(request.body, 'base64')

    return {
      ...request,
      body: bodyBuffer.toString('utf8'),
    }
  }

  return request
}

// Parses cookies out of cookie header
export const parseCookies = (request: IndexSignature) => ({
  ...request,
  cookies: cookie.parse((request.headers && request.headers.cookie) || ''),
})

// Parses JSON request body, if there is one
export const parseJsonBody = (request: IndexSignature) => {
  const { headers } = request
  let body = request.body

  if (
    headers['content-type'] === 'application/json' &&
    typeof body === 'string' &&
    body.length
  ) {
    try {
      body = JSON.parse(body)
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.warn('Unable to parse request json-body.', body)
      body = {}
    }
  }

  return { ...request, body }
}

// Sets the hostname on the request object
export const setHostname = (request: IndexSignature) => ({
  ...request,
  hostname: request.headers.host,
})

// Adds a timestamp for use in calculating ellapsed duration
export const addTimestamp = (request: IndexSignature) => ({
  ...request,
  timestamp: Date.now(),
})

export const setQueryString = (request: IndexSignature) => ({
  ...request,
  ...(request.queryStringParameters
    ? { queryString: '?' + qs.stringify(request.queryStringParameters) }
    : {}),
})

/*
parse a Lambda APIG event into a request object by
running the request event through list of middleware
*/
export default (event: AWSLambda.APIGatewayProxyEvent, context = {}) =>
  applyMiddleware<ParsedRequest>(
    [
      addTimestamp,
      normalizeHeaders,
      decodeBase64Body,
      parseCookies,
      parseJsonBody,
      setHostname,
      setQueryString,
    ],
    { ...event, context },
  )
