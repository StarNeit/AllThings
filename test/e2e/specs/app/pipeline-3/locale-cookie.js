'use strict'

/**
 * Locale cookie
 */

module.exports = {
  tags: ['locale-cookie'],
  'check locale cookies': browser => {
    const loginActiveLocaleFR = '[data-e2e-active-locale=fr_FR]'

    // Signup a new user
    const uuid = browser.globals.uuid()
    const username = uuid
    const email = `${uuid}@example.org`
    const password = `${uuid}password`
    browser.page
      .signup()
      .navigate()
      .signup(email, username, password, browser.globals.checkInCode)
    browser.page.onboarding().skipOnboarding()
    browser.page
      .settings()
      .navigate()
      .changeLanguage('fr_FR')
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.refresh()
    browser.waitForElementClickable(loginActiveLocaleFR)

    browser.end()
  },
}
