'use strict'

/*
 * Signup
 */

const CHECK_IN_RATE_LIMIT = 5
const checkInButton = '[data-e2e=check-in-button]'
const checkInCancel = '[data-e2e=check-in-cancel]'
const checkInCodeInput = '[data-e2e=check-in-code]'
const checkInErrorHint = '[data-e2e=check-in-error-hint-status-400]'
const checkInErrorAttemptsHint = '[data-e2e=check-in-error-hint-status-429]'
const notificationsButton = '[data-e2e=notifications-button]'
const accountsLoginButton = '[data-e2e=login-accounts-button]'

const submitCheckInForm = browser => {
  browser
    .click(checkInButton)
    .waitForElementClickable(checkInErrorHint)
    .click(checkInErrorHint)
}

module.exports = {
  tags: ['signup'],

  'Signup with an invalid check-in code': browser => {
    const uuid = browser.globals.uuid()
    const signupUsername = uuid
    const signupEmail = `${uuid}@example.org`
    const signupPassword = `${uuid}pass`
    browser.page
      .signup()
      .navigate()
      .signupWithoutCheckin(signupEmail, signupUsername, signupPassword)
      // redirect from accounts and awaiting GraphQL to resolve takes more time
      .waitForElementPresent(checkInCodeInput, 35000)
      .expect.element(checkInErrorHint).to.not.be.present
    browser
      .setValueAndWait(checkInCodeInput, uuid)
      .click(checkInButton)
      .waitForElementClickable(checkInErrorHint)
      .click(checkInErrorHint)
      .expect.element(checkInErrorHint).to.not.be.present

    if (browser.options.desiredCapabilities.browserName === 'firefox') {
      browser.scrollDown().waitForElementClickable(checkInCancel)
    } else {
      browser
        .scrollDown()
        .waitForElementClickable(checkInCancel)
        .click(checkInCancel)
        .waitForElementClickable(accountsLoginButton)
    }
    browser.end()
  },

  'Signup with a valid check-in code': browser => {
    const uuid = browser.globals.uuid()
    const signupUsername = uuid
    const signupEmail = `${uuid}@example.org`
    const signupPassword = `${uuid}password`
    const inactiveConcierge =
      '[data-e2e=service-chooser-microapp-e-concierge-inactive]'
    const activePinboard =
      '[data-e2e=service-chooser-microapp-community-articles-active]'
    browser.page
      .signup()
      .navigate()
      .signup(
        signupEmail,
        signupUsername,
        signupPassword,
        browser.globals.checkInCode,
      )
    browser.page.onboarding().skipOnboarding()
    // Test for Micro-App not displayed if channeled after registration.
    // https://allthings.atlassian.net/browse/APP-1472
    browser.waitForElementClickable(inactiveConcierge)
    browser.waitForElementClickable(activePinboard)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.page
      .login()
      .navigate()
      .login(signupEmail, signupPassword)
    browser.end()
  },

  'Auto signup with provided check-in code': browser => {
    const uuid = browser.globals.uuid()
    const signupUsername = uuid
    const signupEmail = `${uuid}@example.org`
    const signupPassword = `${uuid}password`
    browser.url(`${browser.launchUrl}/signup/?code=space-pilot-3000`)
    browser.page
      .signup()
      .signupWithoutCheckin(signupEmail, signupUsername, signupPassword, true)
      .waitForElementClickable(notificationsButton)

    browser.end()
  },

  'Signup errors when too many attempts are made': browser => {
    const uuid = browser.globals.uuid()
    const signupUsername = uuid
    const signupEmail = `another-${uuid}@example.org`
    const signupPassword = `${uuid}pass`
    browser.page
      .signup()
      .navigate()
      .signupWithoutCheckin(signupEmail, signupUsername, signupPassword)
      .waitForElementPresent(checkInCodeInput, 35000)
      .expect.element(checkInErrorHint).to.not.be.present
    browser.setValueAndWait(checkInCodeInput, uuid)

    let n = 0
    while (n < CHECK_IN_RATE_LIMIT) {
      submitCheckInForm(browser)
      n++
    }
    browser
      .click(checkInButton)
      .waitForElementClickable(checkInErrorAttemptsHint)
      .click(checkInErrorAttemptsHint)
      .expect.element(checkInErrorAttemptsHint).to.not.be.present
    browser.end()
  },

  'Landing page redirects to accounts signup when you click the signup button': browser => {
    const uuid = browser.globals.uuid()

    const appSignupButton = '[data-e2e=register-accounts-button]'
    const accountsSignupButton = '[data-e2e=signup-button]'

    browser
      .url(browser.launchUrl)
      .click(appSignupButton)
      .waitForElementPresent(accountsSignupButton)

    browser.assert.urlContains(`https://accounts.dev.allthings.me/signup`)
  },
}
