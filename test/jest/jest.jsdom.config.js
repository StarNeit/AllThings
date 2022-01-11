const commonConfig = require('./jest.common.config')

module.exports = {
  ...commonConfig,
  displayName: 'jsdom',
  testRegex: ['(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$'],
  // don't run ssr handers tests in jsdom env - they should be run in node
  testPathIgnorePatterns: ['<rootDir>/src/ssr/handlers'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/jest/setup.ts'],
}
