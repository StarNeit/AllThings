'use strict'

/*
 * Settings
 */

const FRENCH = 'Français'

module.exports = {
  tags: ['settings'],
  'Check settings': browser => {
    const checkmarkIcon = '[data-e2e=settings-checkmark]'
    const settingsInputUsername = '[data-e2e=settings-input-username]'
    const settingsInputPhoneNumber = '[data-e2e=settings-input-phonenumber]'
    const frenchOption = '[data-e2e=settings-switch-locale-fr_FR]'
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser
      .url(`${browser.launchUrl}/settings`)
      .waitForElementClickable(settingsInputUsername)
      .reallyClearValue(settingsInputUsername)
      .setValueAndWait(settingsInputUsername, 'Luke Skywalker')
      // force input blur
      .click('body')
      .waitForElementPresent(checkmarkIcon)
      .waitForElementNotPresent(checkmarkIcon)
      .waitForElementClickable(settingsInputPhoneNumber)
      .reallyClearValue(settingsInputPhoneNumber)
      .setValueAndWait(settingsInputPhoneNumber, '+123456789')
      .click('body')
      .waitForElementPresent(checkmarkIcon)
      .waitForElementNotPresent(checkmarkIcon)
    browser.page.settings().changeLanguage('fr_FR')

    browser
      .url(`${browser.launchUrl}/settings`)
      .waitForElementClickable(settingsInputUsername)
      .assert.value(settingsInputUsername, 'Luke Skywalker')
      .assert.value(settingsInputPhoneNumber, '+123456789')
    browser.expect.element(frenchOption).text.to.equal(FRENCH)

    browser.end()
  },
}
