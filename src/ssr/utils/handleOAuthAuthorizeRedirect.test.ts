import handleOAuthAuthorizeRedirect from './handleOAuthAuthorizeRedirect'

describe('handleOAuthAuthorizeRedirect', () => {
  it('applies for GET /auth', () => {
    const request = {
      httpMethod: 'GET',
      path: '/auth/token',
      hostname: 'test.dev.allthings.me',
      queryString: '?i=x',
    }
    const response = { redirect: jest.fn() }

    expect(handleOAuthAuthorizeRedirect(request, response)).toBe(true)
    expect(response.redirect.mock.calls[0][0]).toBe(
      `https://accounts.dev.allthings.me/oauth/token?i=x`,
    )
  })

  it('applies for GET /oauth', () => {
    const request = {
      httpMethod: 'GET',
      path: '/oauth/token',
      hostname: 'test.dev.allthings.me',
      queryString: '?i=x',
    }
    const response = { redirect: jest.fn() }

    expect(handleOAuthAuthorizeRedirect(request, response)).toBe(true)
    expect(response.redirect.mock.calls[0][0]).toBe(
      `https://accounts.dev.allthings.me/oauth/token?i=x`,
    )
  })

  it('does not apply for POST /oauth', () => {
    const request = {
      httpMethod: 'POST',
      path: '/oauth/token',
      hostname: 'test.dev.allthings.me',
      queryString: '?i=x',
    }
    const response = { redirect: jest.fn() }

    expect(handleOAuthAuthorizeRedirect(request, response)).toBe(false)
    expect(response.redirect.mock.calls.length).toBe(0)
  })
})
