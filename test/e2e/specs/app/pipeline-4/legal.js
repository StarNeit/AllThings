'use strict'

const appReady = '[data-e2e=app-ready]'
const host = 'docs.allthings.me'

module.exports = {
  tags: ['legal'],
  'check the legal disclosure': browser => {
    const loginLegal = '[data-e2e=login-legal]'
    const servicechooserLegal = '[data-e2e=service-chooser-legal]'
    const title = '[data-e2e=legal-disclosure-title]'
    const backButton = '[data-e2e=back-button]'

    // Start with a non logged-in user from the login page.
    browser
      .url(`${browser.launchUrl}/login`)
      .waitForElementClickable(appReady)
      .waitForElementClickable(loginLegal)
      .click(loginLegal)
      .waitForElementClickable(backButton)
    browser.assert.urlEquals(`${browser.launchUrl}/legal`)

    // Proceed with a logged-in one.
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.click(servicechooserLegal).waitForElementPresent(title)
    browser.assert.urlEquals(`${browser.launchUrl}/legal`)

    browser.end()
  },
}
