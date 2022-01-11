import parseRequest from './apiGatewayRequest'
import renderDebugResponse from './renderDebugResponse'

import testEvent from '../test/fixtures/requests/login-route.json'

it('should render the debug response', () => {
  const request = parseRequest(testEvent as any, null)
  const error = 'Test Error'

  expect(() => {
    const result = renderDebugResponse(request, new Error(error))

    expect(result).toBeTruthy()
  }).not.toThrow(error)
})
