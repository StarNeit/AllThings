'use strict'

/*
 * Logout page.
 */

module.exports = {
  elements: {
    accountsLoginButton: '[data-e2e=login-accounts-button]',
  },
  commands: [
    {
      logout() {
        return this.waitForElementVisible('@accountsLoginButton')
      },
    },
  ],
  url: function() {
    return `${this.api.launchUrl}/logout`
  },
}
