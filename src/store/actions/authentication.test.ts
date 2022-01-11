import authentication from './authentication'

it('should authenticate with predefined access_token', async () => {
  const dispatch = jest.fn()
  const api = jest.fn()
  api
    .mockReturnValueOnce({
      entity: '123',
      status: {
        code: 200,
      },
    })
    .mockReturnValueOnce({
      entity: {
        locale: 'de_DE',
      },
      status: {
        code: 200,
      },
    })

  await authentication.login({ accessToken: 'token' })(dispatch, api, {
    app: { config: { appID: '123' } },
  } as any)

  expect(dispatch).toHaveBeenCalledTimes(3)
  expect(dispatch).toHaveBeenLastCalledWith({
    payload: {
      accessToken: 'token',
      accessTokenExpires: null,
      refreshToken: null,
      user: '123',
    },
    status: 'ok',
    type: 'login',
  })
})
