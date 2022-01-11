'use strict'

/*
 * 404
 */

module.exports = {
  tags: ['404'],
  'Check 404 redirection': browser => {
    const notFoundLink = '[data-e2e=not-found-link]'
    const uuid = browser.globals.uuid()
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser
      .url(`${browser.launchUrl}/${uuid}`)
      .waitForElementVisible(notFoundLink)
    browser.assert.urlEquals(`${browser.launchUrl}/${uuid}`)
    browser.end()
  },
}
