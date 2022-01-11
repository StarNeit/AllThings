'use strict'

const elements = {
  appReady: '[data-e2e=app-ready]',
  email: '[data-e2e=password-reset-request-email]',
  passwordRequestButton: '[data-e2e=password-request-button]',
  token: '[data-e2e=password-reset-token]',
  password: '[data-e2e=password]',
  passwordRepeat: '[data-e2e=password-repeat]',
  passwordResetButton: '[data-e2e=password-reset-button]',
  accountsReady: '[data-e2e=accounts-ready]',
}

module.exports = {
  elements: elements,
  commands: [
    {
      reset(email, password, useTokenInput) {
        const mailhog = require('mailhog')()
        this.waitForElementPresent('@appReady')
          .waitForElementClickable('@passwordRequestButton')
          .setValueAndWait('@email', email)
          .scrollDown()
          .click('@passwordRequestButton')
          .waitForElementVisible('@token')
        // Wait for Email to arrive:
        this.api.pause(1000)
        this.api.perform(function(browser, done) {
          mailhog.getLatest(email).then(function(result) {
            const match = result.content.match(
              /href="(https:\/\/[^/]+\/password\/reset\/([^"]+))"/,
            )
            if (useTokenInput) {
              const token = match[2]
              browser.setValueAndWait(elements.token, token)
            } else {
              const passwordResetURL = match[1]
              browser.url(passwordResetURL)
            }
            done()
          })
        })
        this.waitForElementVisible('@password')
          .setValueAndWait('@password', password)
          .setValueAndWait('@passwordRepeat', password)
          .scrollDown()
          .click('@passwordResetButton')
          .waitForElementVisible('@accountsReady')
        return this
      },
    },
  ],
  url: function() {
    return `${this.api.launchUrl}/password/reset-request`
  },
}
