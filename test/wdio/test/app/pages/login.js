class Login {
  constructor() {
    this.defaultUrl = '/login-redirect'
    this.timeout = 30000
    this.useCustomElement = false
  }

  get accountsReady() {
    return $('[data-e2e="accounts-ready"]')
  }

  get backToLoginButton() {
    return $('[data-e2e="back-to-login-button"]')
  }

  get emailField() {
    return $('[data-e2e="login-email"]')
  }

  get passwordField() {
    return $('[data-e2e="login-password"]')
  }

  get submitButton() {
    return $('[data-e2e="login-button"]')
  }

  get notificationsButton() {
    return $('[data-e2e="notifications-button"]')
  }

  open({ url, element } = {}) {
    if (element) {
      this.useCustomElement = true
    }

    this.element = element

    this.url = url || this.defaultUrl

    browser.url(this.url)

    this.accountsReady.waitForExist()

    return this
  }

  login(email, password) {
    this.emailField.setValue(email || config.user.email)
    this.passwordField.setValue(password || config.user.password)
    this.submitButton.click()

    if (!this.useCustomElement) {
      this.notificationsButton.waitForExist(this.timeout)
    } else {
      $(this.element).waitForExist(this.timeout)
    }

    return this
  }
}

module.exports = new Login()
