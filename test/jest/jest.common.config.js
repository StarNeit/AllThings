const path = require('path')
module.exports = {
  rootDir: path.resolve(__dirname, '..', '..'),
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  snapshotSerializers: ['enzyme-to-json/serializer', 'jest-glamor-react'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    '^components(.*)$': '<rootDir>/src/components$1',
    '^containers(.*)$': '<rootDir>/src/containers$1',
    '^enums(.*)$': '<rootDir>/src/enums$1',
    '^microapps(.*)$': '<rootDir>/src/microapps$1',
    '^pages(.*)$': '<rootDir>/src/pages$1',
    '^router(.*)$': '<rootDir>/src/router$1',
    '^store(.*)$': '<rootDir>/src/store$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
    '^lodash-es(.*)$': '<rootDir>node_modules/lodash$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/.yarncache/', '<rootDir>/dist/'],
  testURL: 'https://app.dev.allthings.me/test-path',
}
