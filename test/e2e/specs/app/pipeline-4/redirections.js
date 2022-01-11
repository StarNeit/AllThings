'use strict'

const createCheckRedirect = browser => {
  return (path, expectedPath, elementSelector) => {
    browser
      .url(`${browser.launchUrl}${path}`)
      .waitForElementVisible(elementSelector, 20000)
    browser.assert.urlContains(expectedPath)
  }
}

module.exports = {
  tags: ['redirections'],
  'Check the default redirections': browser => {
    const checkRedirect = createCheckRedirect(browser)
    const postButton = '[data-e2e=pinboard-contribution-send]'
    const accountsLoginButton = '[data-e2e=login-accounts-button]'
    const accountsReady = '[data-e2e=accounts-ready]'

    // Redirections for anonymous users.
    checkRedirect('', `${browser.launchUrl}/login`, accountsLoginButton)
    checkRedirect('/pinboard', 'accounts', accountsReady)

    // Redirections for logged in users.
    browser.page
      .login()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.assert.urlEquals(`${browser.launchUrl}/pinboard`)
    checkRedirect(
      '/login-redirect',
      `${browser.launchUrl}/pinboard`,
      postButton,
    )
    checkRedirect('/signup', `${browser.launchUrl}/pinboard`, postButton)
    browser.end()
  },
  'Redirect user if they have an account': browser => {
    const checkRedirect = createCheckRedirect(browser)
    const loginButton = '[data-e2e=login-button]'
    const accountsLoginButton = '[data-e2e=login-accounts-button]'

    // Redirections for anonymous users without an account.
    checkRedirect('', `${browser.launchUrl}/login`, accountsLoginButton)

    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.assert.urlEquals(`${browser.launchUrl}/pinboard`)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.assert.urlEquals(`${browser.launchUrl}/login`)

    // Redirections for anonymous users with an account.
    checkRedirect('', `${browser.launchUrl}/login`, accountsLoginButton)
    browser.end()
  },
}
