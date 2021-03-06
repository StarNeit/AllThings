import zlib from 'zlib'
import accepts from 'accepts'
import compressible from 'compressible'
import { csp as cspPolicies } from '../../../package.json'
import applyMiddleware from './applyMiddleware'
import logger from './logger'

// Apply headers we want to always set
export const enforcedHeaders = ({
  headers,
  ...rest
}: ReturnType<typeof makeResponseObject>) => ({
  ...rest,
  headers: {
    ...headers,
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  },
})

// Apply CSP headers
const cachedCspString = Object.keys(cspPolicies)
  .map(
    policy =>
      `${policy} ${cspPolicies[policy]} ${
        policy.substr(-4) === '-src' && process.env.CDN_HOST_URL
          ? process.env.CDN_HOST_URL // add the CDN as a permitted origin
          : ''
      }`,
  )
  .join(';')
export const cspHeaders = (
  { headers = {}, ...rest } = {},
  request: ParsedRequest,
) => ({
  ...rest,
  headers: {
    ...headers,

    // Only transmit the origin cross-domain and no referer without HTTPS:
    'referrer-policy': 'strict-origin-when-cross-origin',

    // Instruct browsers to strictly follow the Content-Type header:
    'x-content-type-options': 'nosniff',

    // Always enable the browser XSS protection:
    'x-xss-protection': '1; mode=block',

    // Convert the csp options in package.json to a policies list:
    'content-security-policy': cachedCspString,

    // report-uri directive in content-security-policy header is deprecated,
    // therefore this header should be added to specify the csp reports endpoint
    'report-to': JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [
        {
          url: `https://${request.hostname}/csp-reports`,
        },
      ],
    }),

    // Map "frame-ancestors" to the equivalent "X-Frame-Options":
    'x-frame-options':
      {
        [`'self'`]: 'SAMEORIGIN',
        [`'none'`]: 'DENY',
      }[cspPolicies['frame-ancestors']] || undefined,
  },
})

// Gzip/deflate response body when appropriate
export const compress = (
  { body, headers, ...rest }: ReturnType<typeof makeResponseObject>,
  request: ParsedRequest,
) => {
  const zlibOptions = {
    level: 5,
  }
  const compressHeaders = {}
  const compressBody: any = {}
  const accept = accepts(request as any)
  let encoding = accept.encoding(['gzip', 'deflate', 'identity'])

  // prefer gzip over deflate
  if (encoding === 'deflate' && accept.encoding(['gzip'])) {
    encoding = accept.encoding(['gzip', 'identity'])
  }

  // Gzip compression is only required when running in lambda,
  // as in our development/CI setup, this is handled by nginx:
  const weShouldCompress =
    !(request as any).isOffline &&
    compressible(headers['content-type']) &&
    encoding &&
    encoding !== 'identity' &&
    body &&
    body.length > 256

  if (weShouldCompress) {
    const compressed =
      encoding === 'gzip'
        ? zlib.gzipSync(body, zlibOptions)
        : zlib.deflateSync(body, zlibOptions)

    compressBody.body = compressed.toString('base64')
    compressBody.isBase64Encoded = true
    compressHeaders['content-encoding'] = encoding
    compressHeaders['content-length'] = compressed.byteLength
  }

  return {
    ...rest,
    body,
    headers: { ...headers, ...compressHeaders },
    ...compressBody,
  }
}

export const contentLengthHeader = ({
  body,
  headers,
  ...rest
}: ParsedRequest) => ({
  ...rest,
  body,
  headers: {
    ...headers,
    'content-length': headers['content-length']
      ? headers['content-length']
      : body.length,
  },
})

// Logs request/response info for CloudWatch/Kibana
export const logResponse = (
  response: ReturnType<typeof makeResponseObject>,
  request: ParsedRequest,
) => {
  if (process.env.LOGGING) {
    logger(request, response).info()
  }

  return { ...response }
}

export const makeResponseObject = (
  body = '',
  statusCode = 200,
  { headers = {}, ...options } = {},
  contentType: string = null,
) => ({
  statusCode,
  body,
  headers: {
    'content-type': contentType,
    ...headers,
  },
  ...options,
})

const text = (body: string, statusCode?: number, options?: IndexSignature) =>
  makeResponseObject(body, statusCode, options, 'text/plain')

const html = (body: string, statusCode?: number, options?: IndexSignature) =>
  makeResponseObject(body, statusCode, options, 'text/html')

const json = (body: string, statusCode?: number, options?: IndexSignature) =>
  makeResponseObject(
    JSON.stringify(body),
    statusCode,
    options,
    'application/json',
  )

const redirect = (
  location: string,
  statusCode = 302,
  options?: { headers?: IndexSignature<string> },
) =>
  makeResponseObject(undefined, statusCode, {
    ...options,
    headers: {
      ...(options && options.headers),
      location,
    },
  })

export default (
  request: Partial<ParsedRequest>,
  callback: (...args: any) => void,
): {
  text: typeof text
  html: typeof html
  json: typeof json
  redirect: typeof redirect
} =>
  [text, html, json, redirect].reduce(
    (methods, method) => ({
      ...methods,
      [method.name]: (...args: Parameters<typeof method>) =>
        callback(
          null,
          applyMiddleware(
            [
              compress,
              cspHeaders,
              contentLengthHeader,
              enforcedHeaders,
              logResponse,
            ],
            method(...args),
            request,
          ),
        ),
    }),
    {},
  ) as any
