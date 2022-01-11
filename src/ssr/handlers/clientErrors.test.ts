import handler from './clientErrors'
import { sourceMaps } from '../utils/mapErrorStack'

const sourceMapFile = Object.keys(sourceMaps)[0] || 'foobar-test.js.map'
const testErrorJsFile = sourceMapFile.replace('.map', '')

const testEvent = {
  headers: { 'content-type': 'application/json', 'content-length': 1 },
  body: JSON.stringify({
    name: 'ErrorTest',
    message: `This is a test error. If you see it, it's probbaly a good thing.`,
    stack: `TestError\\n  at foobar (/static/js/prod/${testErrorJsFile}:1:1)`,
    state: {},
  }),
} as any
const testContext = {} as any

it('should return valid response', () => {
  handler(testEvent, testContext, (error, { headers }) => {
    expect(error).toBeNull()
    expect(headers['content-type']).toBe('application/json')
  })
})
