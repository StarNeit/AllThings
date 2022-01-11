import app from './app'

it('that init app works 🤩', async () => {
  const fetchConfig = (fetch as any).mockResponse(
    JSON.stringify({ test: 'Hallo Welt' }),
  )
  const dispatch = jest.fn()
  const api = jest.fn()
  api.mockReturnValueOnce({
    entity: {},
  })
  api.mockReturnValueOnce({
    entity: '123',
    status: {
      code: 200,
    },
  })

  await app.initApp({
    hostname: 'test',
    userAgent: '007',
    embeddedLayout: true,
  } as any)(dispatch, api)

  expect(fetchConfig).toHaveBeenCalled()
  expect(dispatch).toHaveBeenCalledTimes(3)
  expect(dispatch).toHaveBeenCalledWith({
    payload: {
      config: { test: 'Hallo Welt' },
      environment: 'test',
      hostname: 'test',
      userAgent: '007',
      embeddedLayout: true,
      userLoggedInBefore: null,
    },
    status: 'ok',
    type: 'initApp',
  })
})
