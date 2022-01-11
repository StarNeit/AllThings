const fs = require('fs')
const path = require('path')

const project = process.env.PROJECT || 'app'
const environment = process.env.ENVIRONMENT || 'dev'

const specsLocation = `test/${project}/specs/`
const numberOfSuites = 3

const listFiles = (directoryPath, files = []) =>
  fs
    .readdirSync(directoryPath)
    .reduce(
      (acc, file) =>
        fs.statSync(path.join(directoryPath, file)).isDirectory()
          ? [...acc, ...listFiles(path.join(directoryPath, file), files)]
          : [...acc, path.join(__dirname, directoryPath, file)],
      files,
    )

const allFiles = listFiles(specsLocation)

const chunkSize = Math.ceil(allFiles.length / numberOfSuites)

const chunkedFiles = Array(Math.ceil(allFiles.length / chunkSize))
  .fill()
  .map((_, index) => allFiles.slice(index * chunkSize, (index + 1) * chunkSize))

exports.config = {
  ...require('./hooks'),
  hostname: 'chromedriver',
  path: '/',
  capabilities: [
    {
      // Set maxInstances to 1 if screen recordings are enabled:
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        // Disable headless mode if screen recordings are enabled:
        args: [
          '--headless',
          '--disable-gpu',
          '--disable-setuid-sandbox',
          '--window-size=1440,900',
        ],
      },
    },
  ],
  logLevel: 'warn',
  reporters: ['spec'],
  framework: 'mocha',
  mochaOpts: {
    timeout: 120000,
  },
  maximizeWindow: true,
  screenshots: {
    saveOnFail: true,
  },
  videos: {
    enabled: false,
    resolution: '1440x900',
    startDelay: 500,
    stopDelay: 500,
  },
  assetsDir: '/home/webdriver/assets/',
  mailhog: {
    host: 'mailhog',
  },
  project,
  environment,
  specs: [`${specsLocation}**/*.js`],
  suites: {
    'suite-1': chunkedFiles[0],
    'suite-2': chunkedFiles[1],
    'suite-3': chunkedFiles[2],
  },
  baseUrl: `https://${project}.${environment}.allthings.me`,
  waitforTimeout: 30000,
}
