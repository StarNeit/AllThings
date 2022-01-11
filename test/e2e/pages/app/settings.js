'use strict'

module.exports = {
  elements: {
    activeLanguage: '[data-e2e^=settings-active-locale-]',
  },
  commands: [
    {
      changeLanguage(language) {
        return this.waitForElementVisible('@activeLanguage')
          .waitForElementClickable(
            `[data-e2e=settings-switch-locale-${language}]`
          )
          .click(`[data-e2e=settings-switch-locale-${language}]`)
          .waitForElementVisible(
            `[data-e2e=settings-active-locale-${language}]`
          )
      },
    },
  ],
  url: function() {
    return `${this.api.launchUrl}/settings`
  },
}
