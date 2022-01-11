'use strict'

/*
 * Signup page.
 */

module.exports = {
  elements: {
    accountsReady: '[data-e2e=accounts-ready]',
    accountsRegisterButton: '[data-e2e=login-register]',
    checkInButton: '[data-e2e=check-in-button]',
    checkInCodeInput: '[data-e2e=check-in-code]',
    email: '[data-e2e=signup-email]',
    notificationsButton: '[data-e2e=notifications-button]',
    password: '[data-e2e=signup-password]',
    signupButton: '[data-e2e=signup-button]',
    termsOfUse: '[data-e2e=signup-accept-terms-of-use]',
    privacyPolicy: '[data-e2e=signup-accept-privacy-policy]',
    username: '[data-e2e=signup-fullName]',
    signupSuccessContinueButton:
      '[data-e2e="accounts.signup.success-continue"]',
  },
  commands: [
    {
      signup(email, username, password, checkInCode) {
        return (
          this.waitForElementPresent('@accountsReady')
            .waitForElementClickable('@accountsRegisterButton')
            .click('@accountsRegisterButton')
            .waitForElementClickable('@signupButton')
            .setValueAndWait('@username', username)
            .setValueAndWait('@email', email)
            .setValueAndWait('@password', password)
            .click('@termsOfUse')
            .click('@privacyPolicy')
            .click('@signupButton')
            .waitForElementClickable('@signupSuccessContinueButton')
            .click('@signupSuccessContinueButton')
            // redirect from accounts and awaiting GraphQL to resolve takes more time
            .waitForElementPresent('@checkInCodeInput', 35000)
            .setValueAndWait('@checkInCodeInput', checkInCode)
            .click('@checkInButton')
            .waitForElementVisible('@notificationsButton')
        )
      },
      signupWithoutCheckin(
        email,
        username,
        password,
        alreadyRedirectedToSignup = false,
      ) {
        this.waitForElementPresent('@accountsReady')
        if (!alreadyRedirectedToSignup) {
          this.waitForElementClickable('@accountsRegisterButton').click(
            '@accountsRegisterButton',
          )
        }
        return this.waitForElementClickable('@signupButton')
          .setValueAndWait('@username', username)
          .setValueAndWait('@email', email)
          .setValueAndWait('@password', password)
          .click('@termsOfUse')
          .click('@privacyPolicy')
          .click('@signupButton')
          .waitForElementClickable('@signupSuccessContinueButton')
          .click('@signupSuccessContinueButton')
      },
      signupRandomUser() {
        const uuid = this.api.globals.uuid()

        return this.signup(
          `${uuid}@example.com`,
          uuid,
          // accounts password rule does not allow password to be the same as username
          `${uuid}_pass`,
          this.api.globals.checkInCode,
        )
      },
    },
  ],
  url: function() {
    return `${this.api.launchUrl}/login-redirect`
  },
}
