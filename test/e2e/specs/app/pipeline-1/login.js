'use strict'

/*
 * Login
 */

module.exports = {
  tags: ['login'],
  'Perform user login': browser => {
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.expect.element('[data-e2e=pinboard-contribution]').to.be.present
    browser.screenshotsDiff().end()
  },
}
