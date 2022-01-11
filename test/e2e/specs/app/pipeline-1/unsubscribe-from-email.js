'use strict'

/*
 * UnsubscribeFromEmail
 */

const adminCheckBox = '[data-e2e=unsubscribe-email-adminCheckbox]'
const submitButton = '[data-e2e=unsubscribe-email-submit]'
const failureView = '[data-e2e=unsubscribe-email-failure]'

module.exports = {
  tags: ['unsubscribe-from-email'],
  'Unsubscribe from emails while being logged in': browser => {
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser
      .url(`${browser.launchUrl}/unsubscribe/testToken`)
      .waitForElementClickable(submitButton)
      .click(adminCheckBox)
      .click(submitButton)
      .expect.element(failureView).to.be.present
    browser.end()
  },
  'Unsubscribe from emails while being logged out': browser => {
    browser
      .url(`${browser.launchUrl}/unsubscribe/testToken`)
      .waitForElementClickable(submitButton)
      .click(adminCheckBox)
      .click(submitButton)
      .expect.element(failureView).to.be.present
    browser.end()
  },
}
