import handler from './cookieMonster'

const testEventWithCookies = {
  headers: { Cookie: 'foo=bar; equation=E%3Dmc%5E2' },
}
const testEventWithEmptyCookies = { headers: { Cookie: '' } }
const testEventWithoutCookies = {}
const testContext = {} as any

it('should return statusCode 200 when cookies are supported', () => {
  handler(testEventWithCookies as any, testContext, (error, { statusCode }) => {
    expect(error).toBeNull()
    expect(statusCode).toBe(200)
  })
})

it('should return statusCode 400 when cookies are not supported', () => {
  handler(
    testEventWithEmptyCookies as any,
    testContext,
    (error, { statusCode }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(400)
    },
  )

  handler(
    testEventWithoutCookies as any,
    testContext,
    (error, { statusCode }) => {
      expect(error).toBeNull()
      expect(statusCode).toBe(400)
    },
  )
})
