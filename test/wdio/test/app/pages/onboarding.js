class Onboarding {
  get welcomeMessage() {
    return $('[data-e2e="onboarding-welcome-message"]')
  }

  get welcomeText() {
    return $('[data-e2e="onboarding-welcome-new-onboarder-text"]')
  }

  get skipOnboardingButton() {
    return $('[data-e2e="onboarding-skip-onboarding-button"]')
  }

  get onboardingOverlay() {
    return $('[data-e2e="onboarding-overlay"]')
  }

  get newPost() {
    return $('[data-e2e="pinboard-new-post"]')
  }

  skip() {
    this.welcomeMessage.waitForExist()
    this.welcomeText.waitForExist()
    this.skipOnboardingButton.waitForExist()
    this.skipOnboardingButton.click()
    this.newPost.waitForExist()
    // Wait for overlay to be gone.
    this.onboardingOverlay.waitForExist(10000, true)
  }
}

module.exports = new Onboarding()
