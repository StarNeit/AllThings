const commonConfig = require('./jest.common.config')

module.exports = {
  ...commonConfig,
  displayName: 'node',
  testMatch: [
    '<rootDir>/src/ssr/handlers/**/*.test.ts',
    '<rootDir>/src/ssr/handlers/**/*.test.tsx',
  ],
  testEnvironment: 'node',
}
