'use strict'

/*
 * Unsupported Browser redirect test
 */

const UNSUPPORTED_BROWSER_QUERY_PARAMETER = 'force-unsupported-browser'

module.exports = {
  tags: ['unsupported'],
  'Test for unsupported browsers': browser => {
    browser
      .url(`${browser.launchUrl}/?${UNSUPPORTED_BROWSER_QUERY_PARAMETER}`)
      .waitForElementVisible('#deprecation', 2000)
      .assert.urlContains(
        '/unsupported',
        'You should have been redirected to /unsupported!'
      )
    browser.end()
  },
}
