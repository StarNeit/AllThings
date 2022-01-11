import parseRequest, {
  normalizeHeaders,
  parseCookies,
  parseJsonBody,
  setHostname,
  setQueryString,
} from './apiGatewayRequest'

import testEventFixture from '../test/fixtures/requests/logged-in-route.json'

it('headers are normalized', () => {
  const normalized = normalizeHeaders({
    foo: 'bar',
    headers: { 'X-Foo-Bar': 'foobar' },
  })
  const expected = { foo: 'bar', headers: { 'x-foo-bar': 'foobar' } }

  expect(normalized).toEqual(expected)
})

it('cookies are parsed', () => {
  const testEvent = {
    foo: 'bar',
    headers: {
      cookie:
        'PHPSESSID=e61d68c319d12269c6af8cd939298857; REMEMBERME=yah; locale=de_DE',
    },
  }
  const expected = {
    ...testEvent,
    cookies: {
      PHPSESSID: 'e61d68c319d12269c6af8cd939298857',
      REMEMBERME: 'yah',
      locale: 'de_DE',
    },
  }

  const request = parseCookies(testEvent)

  expect(request).toEqual(expected)
})

it('query params are parsed', () => {
  const testEvent = {
    foo: 'bar',
    queryStringParameters: {
      code: 'FOO BAR',
    },
  }

  const expected = {
    ...testEvent,
    queryString: '?code=FOO%20BAR',
  }

  const request = setQueryString(testEvent)

  expect(request).toEqual(expected)
})

it('hostname is set', () => {
  const testEvent = {
    foo: 'bar',
    headers: {
      host: 'foobar.foo.bar',
    },
  }
  const expected = {
    ...testEvent,
    hostname: 'foobar.foo.bar',
  }

  const request = setHostname(testEvent)

  expect(request).toEqual(expected)
})

it('parse JSON body only if content-type application/json', () => {
  const testEvent = {
    headers: {
      'content-length': 14,
      'content-type': 'application/json',
    },
    body: '{"foo": "bar"}',
  }
  const expected = {
    ...testEvent,
    body: {
      foo: 'bar',
    },
  }

  const jsonRequest = parseJsonBody(testEvent as any)
  expect(jsonRequest).toEqual(expected)

  testEvent.body = 'foobar'
  delete testEvent.headers['content-type']
  const nonJsonRequest = parseJsonBody(testEvent as any)
  expect(nonJsonRequest).toEqual(testEvent)
})

it('correctly handle shitty JSON', () => {
  const testEvent = {
    headers: {
      'content-length': 1,
      'content-type': 'application/json',
    },
    body: '{"huurr hurr:" derp. can\'t parse this on purpose}',
  }
  const expected = {
    ...testEvent,
    body: {},
  }

  const request = parseJsonBody(testEvent as any)
  expect(request).toEqual(expected)
})

it('request middleware is applied correctly', () => {
  const { headers, cookies, hostname, body } = parseRequest(
    testEventFixture as any,
  )

  expect(headers['user-agent']).toBe(testEventFixture.headers['User-Agent'])
  expect(Object.keys(cookies).length).toBe(6)
  expect(hostname).toBe(testEventFixture.headers.Host)
  expect(body).toBeNull()
})

it('Base64 encoded body is correctly decoded when isBase64Encoded is true', () => {
  const testBody = 'foobar test body'
  const testBodyBuffer = Buffer.from(testBody, 'utf8')
  const { body } = parseRequest({
    ...testEventFixture,
    body: testBodyBuffer.toString('base64'),
    isBase64Encoded: true,
  } as any)

  expect(body).toBe(testBody)
})
