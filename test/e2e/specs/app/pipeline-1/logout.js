'use strict'

/*
 * Logout
 */

module.exports = {
  tags: ['logout'],
  'Perform user logout': browser => {
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.assert.urlEquals(`${browser.launchUrl}/pinboard`)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.assert.urlEquals(`${browser.launchUrl}/login`)
    browser.screenshotsDiff().end()
  },
}
