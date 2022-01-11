'use strict'

const https = require('https')

module.exports.command = function({ host, path }) {
  return this.perform((browser, done) => {
    const request = https.request(
      { host, method: 'GET', path },
      ({ statusCode }) => {
        browser.assert.equal(statusCode, 200)
        done()
      }
    )
    request.on('error', function(error) {
      browser.assert.fail(
        JSON.stringify(error),
        '',
        `https://${host}${path} is missing!`
      )
      done()
    })
    request.end()
  })
}
