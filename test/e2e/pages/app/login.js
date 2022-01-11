'use strict'

/*
 * Login page.
 */

module.exports = {
  elements: {
    accountsReady: '[data-e2e=accounts-ready]',
    email: '[data-e2e=login-email]',
    password: '[data-e2e=login-password]',
    loginButton: '[data-e2e=login-button]',
    backToLoginButton: '[data-e2e=back-to-login-button]',
    notificationsButton: '[data-e2e=notifications-button]',
  },
  commands: [
    {
      login(email, password) {
        this.waitForElementPresent('@accountsReady')

        var that = this
        this.api.url(function(url) {
          if (url.value.includes('/signup')) {
            that.click('@backToLoginButton')
          }
        })

        return this.waitForElementClickable('@loginButton')
          .setValueAndWait('@email', email)
          .setValueAndWait('@password', password)
          .click('@loginButton')
          .waitForElementVisible('@notificationsButton', 15000)
      },
    },
  ],
  url: function() {
    return `${this.api.launchUrl}/login-redirect`
  },
}
