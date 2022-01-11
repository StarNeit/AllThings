import { extractCookie, storeCookie } from './cookie'

it('should store cookie value in document', () => {
  storeCookie('testCookie', '100==')
  expect(document.cookie).toBe('testCookie=100==')
})

it('should extract the cookie from document', () => {
  const cookieValue = extractCookie(document.cookie, 'testCookie')
  expect(cookieValue).toBe('100==')
})

it('should handle multple cookies', () => {
  storeCookie('testCookie1', 100)
  storeCookie('testCookie2', 200)
  storeCookie('testCookie3', 300)
  expect(extractCookie(document.cookie, 'testCookie1')).toBe('100')
  expect(extractCookie(document.cookie, 'testCookie2')).toBe('200')
  expect(extractCookie(document.cookie, 'testCookie3')).toBe('300')
})
