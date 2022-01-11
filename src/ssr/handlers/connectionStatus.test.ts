import handler from './connectionStatus'

const testEvent = {}
const testContext = {} as any

it('should return valid response', () => {
  handler(
    testEvent as any,
    testContext,
    (error: Error, { statusCode, headers, body }: any) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(200)
      expect(headers['content-type']).toBe('text/html')
      expect(body).toBe('<link rel="icon" href="data:;base64,iVBORw0KGgo=">')
    },
  )
})
