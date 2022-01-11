class SignUp {
  get accountsReady() {
    return $('[data-e2e="accounts-ready"]')
  }

  get checkInButton() {
    return $('[data-e2e="check-in-button"]')
  }

  get checkInCode() {
    return $('[data-e2e="check-in-code"]')
  }

  get usernameField() {
    return $('[data-e2e="signup-fullName"]')
  }

  get emailField() {
    return $('[data-e2e="signup-email"]')
  }

  get passwordField() {
    return $('[data-e2e="signup-password"]')
  }

  get termsAndServicesCheckbox() {
    return $('[data-e2e="signup-accept-terms-of-use"]')
  }

  get dataPrivacyCheckbox() {
    return $('[data-e2e="signup-accept-privacy-policy"]')
  }

  get signUpButton() {
    return $('[data-e2e="signup-button"]')
  }

  get noCodeButton() {
    return $('[data-e2e="no-code-button"]')
  }

  get accountsSignupConrinuteButton() {
    return $('[data-e2e="accounts.signup.success-continue"]')
  }

  open() {
    browser.url('/login-redirect?signup=true')
    this.accountsReady.waitForExist()

    return this
  }

  signUp(email, password, username, checkInCode) {
    this.usernameField.setValue(username)
    this.emailField.setValue(email)
    this.passwordField.setValue(password)
    this.termsAndServicesCheckbox.click()
    this.dataPrivacyCheckbox.click()
    this.signUpButton.click()
    this.accountsSignupConrinuteButton.waitForExist()
    this.accountsSignupConrinuteButton.click()

    if (typeof checkInCode !== 'undefined') {
      this.checkInCode.waitForExist()
      this.checkInCode.setValue(checkInCode)
      this.checkInButton.click()
    } else {
      this.noCodeButton.waitForExist()
    }
  }
}

module.exports = new SignUp()
