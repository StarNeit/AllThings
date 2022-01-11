'use strict'

// Throw for any unhandled rejections in Promise chains:
process.on('unhandledRejection', function(reason) {
  throw reason
})

// Define the globals config:
const config = {
  before: function(done) {
    if (this.test_settings.selenium_host === 'chromedriver') {
      // Enable file upload tests against the dockerized chromedriver:
      this.fileUploadEnabled = true
    }
    if (this.test_settings.selenium_host === 'localhost') {
      require('chromedriver').start(['--port=4444', '--url-base=/wd/hub'])
      // Use the docker hostname as mailhog hostname:
      const mailhogHostname = (process.env.DOCKER_HOST || 'localhost').replace(
        /^tcp:\/\/|:\d+$/g,
        ''
      )
      process.env.MAILHOG_API_URL = `http://${mailhogHostname}:8025/api/v2`
    }
    done()
  },
  after: function(done) {
    if (this.test_settings.selenium_host === 'localhost') {
      require('chromedriver').stop()
    }
    done()
  },
  beforeEach: function(browser, done) {
    require('nightwatch-video-recorder').start(browser, () => {
      if (this.test_settings.selenium_host === 'hub.browserstack.com') {
        return require('nightwatch-browserstack').storeSessionId(browser, done)
      }
      done()
    })
  },
  afterEach: function(browser, done) {
    require('nightwatch-video-recorder').stop(browser, () => {
      if (this.test_settings.selenium_host === 'hub.browserstack.com') {
        return require('nightwatch-browserstack').updateStatus(browser, done)
      }
      done()
    })
  },
}

module.exports = function(globals) {
  // Add the globals to each nightwatch test setting:
  for (const key of Object.keys(require('./nightwatch.conf').test_settings)) {
    config[key] = globals
  }
  return config
}
