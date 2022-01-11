import { requestHandler } from './loginRedirect'
import fetch from 'cross-fetch'

jest.mock('cross-fetch')
const fetchMock = fetch as jest.Mock

describe('loginRedirect handler', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('should redirect', async () => {
    const mockResponse = Promise.resolve({
      json: () => ({ clientID: 'myTestClientId' }),
      status: 200,
      statusText: 'OK',
    })
    fetchMock.mockResolvedValueOnce(mockResponse)
    const mockRedirect = jest.fn()

    const request = {
      headers: {
        'x-forwarded-host': 'example.org',
      },
      hostname: 'example.org',
    }
    const response = {
      redirect: mockRedirect,
    }

    await requestHandler(request as any, response as any)
    expect(mockRedirect.mock.calls[0][1]).toBe(302)
    expect(mockRedirect.mock.calls[0][0]).toContain(
      'https://accounts.allthings.me/oauth/authorize',
    )
    expect(mockRedirect.mock.calls[0][0]).toContain('client_id=myTestClientId')
    expect(mockRedirect.mock.calls[0][0]).toContain(
      'https%3A%2F%2Fexample.org%2Flogin%3Fprovider%3Dallthings',
    )
    expect(mockRedirect.mock.calls[0][0]).toContain('response_type=code')
    expect(mockRedirect.mock.calls[0][2].headers).toBeDefined()
    expect(mockRedirect.mock.calls[0][2].headers['Set-Cookie']).toContain('ST-') // state
  })

  it('should redirect to signup', async () => {
    const mockResponse = Promise.resolve({
      json: () => ({ clientID: 'myTestClientId' }),
      status: 200,
      statusText: 'OK',
    })
    fetchMock.mockResolvedValueOnce(mockResponse)
    const mockRedirect = jest.fn()

    const request = {
      headers: {
        'x-forwarded-host': 'example.org',
      },
      hostname: 'example.org',
      queryStringParameters: { signup: '' },
    }
    const response = {
      redirect: mockRedirect,
    }

    await requestHandler(request as any, response as any)
    expect(mockRedirect.mock.calls[0][1]).toBe(302)
    expect(mockRedirect.mock.calls[0][0]).toContain(
      'https://accounts.allthings.me/oauth/authorize',
    )
    expect(mockRedirect.mock.calls[0][0]).toContain('client_id=myTestClientId')
    expect(mockRedirect.mock.calls[0][0]).toContain(
      'https%3A%2F%2Fexample.org%2Flogin%3Fprovider%3Dallthings',
    )
    expect(mockRedirect.mock.calls[0][0]).toContain('signup=')
    expect(mockRedirect.mock.calls[0][0]).toContain('response_type=code')
    expect(mockRedirect.mock.calls[0][2].headers).toBeDefined()
    expect(mockRedirect.mock.calls[0][2].headers['Set-Cookie']).toContain('ST-') // state
  })

  it('should fail gracefully if the config cannot be retrieved', async () => {
    const mockResponse = Promise.resolve({
      text: () => `{ error: 'outschn' }`,
      status: 500,
      statusText: 'outschn',
    })
    fetchMock.mockResolvedValueOnce(mockResponse)
    const mockErrorHtml = jest.fn()

    const request = {
      headers: {
        'x-forwarded-host': 'example.org',
      },
      hostname: 'example.org',
    }
    const response = {
      html: mockErrorHtml,
    }

    await requestHandler(request as any, response as any)
    expect(mockErrorHtml.mock.calls[0][1]).toBe(500)
  })
})
