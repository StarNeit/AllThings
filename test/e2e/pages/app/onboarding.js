'use strict'

/*
 * Onboarding page.
 */

module.exports = {
  elements: {
    welcomeMessage: '[data-e2e=onboarding-welcome-message]',
    welcomeText: '[data-e2e=onboarding-welcome-new-onboarder-text]',
    skipOnboardingButton: '[data-e2e=onboarding-skip-onboarding-button]',
    onboardingOverlay: '[data-e2e=onboarding-overlay]',
    newPost: '[data-e2e=pinboard-new-post]',
  },
  commands: [
    {
      skipOnboarding() {
        return this.waitForElementVisible('@welcomeMessage')
          .waitForElementVisible('@welcomeText')
          .waitForElementClickable('@skipOnboardingButton')
          .click('@skipOnboardingButton')
          .waitForElementVisible('@newPost')
          .waitForElementNotPresent('@onboardingOverlay')
      },
    },
  ],
}
