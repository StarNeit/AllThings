'use strict'

/*
 * Password-reset
 */

module.exports = {
  tags: ['password'],

  'Reset the user password via reset URL': browser => {
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
      .logout()
      .navigate()
      .logout()
    browser.page
      .password()
      .navigate()
      .reset(email, password)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.page
      .login()
      .navigate()
      .login(email, password)
    browser.page
      .logout()
      .navigate()
      .logout()
  },

  'Set password when user is created from cockpit ticket creation': browser => {
    const errorMessage = '[data-e2e=select-password-error-message]'
    const passwordField = '[data-e2e=password]'
    const passwordRepeatField = '[data-e2e=password-repeat]'
    const termsOfUse = '[data-e2e=signup-accept-terms-of-use]'
    const dataProtection = '[data-e2e=signup-accept-data-protection]'
    const tokenOfCreatedUser = 'cchilYRubMkRl0UAh1zQmW7WppHQt4sKj9BzbmfZoRs'
    const loginButton = '[data-e2e=login-button-label]'
    const accountsLoginButton = '[data-e2e=login-accounts-button]'
    const accountsReady = '[data-e2e=accounts-ready]'

    browser
      // try login with wrong token
      .url(
        `${browser.launchUrl}/password/create/${tokenOfCreatedUser}thismakesitwrong`,
      )
      .waitForElementClickable(passwordField)
      .waitForElementNotPresent(errorMessage)
      // fill correct passwords
      .setValueAndWait(passwordField, '11111111')
      .setValueAndWait(passwordRepeatField, '11111111')
      // and accept the data policy and terms of use
      .click(termsOfUse)
      .click(dataProtection)
      .click(loginButton)
      .waitForElementClickable(errorMessage)
      .click(errorMessage)
      .waitForElementNotPresent(errorMessage)

      // now use the correct token
      .url(`${browser.launchUrl}/password/create/${tokenOfCreatedUser}`)
      // fill correct passwords
      .setValueAndWait(passwordField, '11111111')
      .setValueAndWait(passwordRepeatField, '11111111')
      // try to login without data prot and without terms
      .click(loginButton)
      .waitForElementClickable(errorMessage)
      .click(errorMessage)
      .waitForElementNotPresent(errorMessage)
      // try login with only termsOfUse
      .click(termsOfUse)
      .click(loginButton)
      .waitForElementClickable(errorMessage)
      .click(errorMessage)
      .waitForElementNotPresent(errorMessage)
      // try login with only data protection
      .click(dataProtection)
      .click(termsOfUse)
      .click(loginButton)
      .waitForElementClickable(errorMessage)
      .click(errorMessage)
      .waitForElementNotPresent(errorMessage)
      // try login with accepting both
      .click(termsOfUse)
      .click(loginButton)
      .waitForElementVisible(accountsReady)

    browser.end()
  },

  'Reset the user password via token input': browser => {
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
      .logout()
      .navigate()
      .logout()
    browser.page
      .password()
      .navigate()
      .reset(email, password, true)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.page
      .login()
      .navigate()
      .login(email, password)
    browser.page
      .logout()
      .navigate()
      .logout()
  },

  'Reset request for a non-existing user acccount': browser => {
    const uuid = browser.globals.uuid()
    const email = `${uuid}@example.org`
    const emailInput = '[data-e2e=password-reset-request-email]'
    const passwordRequestButton = '[data-e2e=password-request-button]'
    const requestWrongEmailHint = '[data-e2e=password-request-wrong-email]'
    browser
      .url(`${browser.launchUrl}/password/reset-request`)
      .waitForElementClickable(emailInput)
      .expect.element(requestWrongEmailHint).to.not.be.present
    browser
      .setValueAndWait(emailInput, email)
      .scrollDown()
      .click(passwordRequestButton)
      .waitForElementClickable(requestWrongEmailHint)
      .click(requestWrongEmailHint)
      .expect.element(requestWrongEmailHint).to.not.be.present
  },

  'Reset request with an invalid token': browser => {
    const uuid = browser.globals.uuid()
    const tokenInput = '[data-e2e=password-reset-token]'
    const passwordInput = '[data-e2e=password]'
    const passwordRepeatInput = '[data-e2e=password-repeat]'
    const passwordResetButton = '[data-e2e=password-reset-button]'
    const tokenErrorHint = '[data-e2e=password-reset-token-error-hint]'
    browser
      .url(`${browser.launchUrl}/password/reset`)
      .waitForElementClickable(tokenInput)
      .expect.element(tokenErrorHint).to.not.be.present
    browser
      .setValueAndWait(tokenInput, uuid)
      .setValueAndWait(passwordInput, uuid)
      .setValueAndWait(passwordRepeatInput, uuid)
      .scrollDown()
      .waitForElementClickable(passwordResetButton)
      .click(passwordResetButton)
      .waitForElementClickable(tokenErrorHint)
      .click(tokenErrorHint)
      .expect.element(tokenErrorHint).to.not.be.present
  },

  'Reset request with non matching passwords': browser => {
    const uuid = browser.globals.uuid()
    const tokenInput = '[data-e2e=password-reset-token]'
    const passwordInput = '[data-e2e=password]'
    const passwordRepeatInput = '[data-e2e=password-repeat]'
    const passwordResetButton = '[data-e2e=password-reset-button]'
    const passwordErrorHint = '[data-e2e=password-error-hint]'
    browser
      .url(`${browser.launchUrl}/password/reset`)
      .waitForElementClickable(tokenInput)
      .expect.element(passwordErrorHint).to.not.be.present
    browser
      .setValueAndWait(tokenInput, uuid)
      .setValueAndWait(passwordInput, uuid)
      .setValueAndWait(passwordRepeatInput, uuid + 2)
      .scrollDown()
      .click(passwordResetButton)
      .waitForElementClickable(passwordErrorHint)
      .click(passwordErrorHint)
      .expect.element(passwordErrorHint).to.not.be.present
    browser.end()
  },
}
