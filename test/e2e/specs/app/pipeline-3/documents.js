'use strict'

/*
 * Documents.
 */

module.exports = {
  tags: ['documents'],
  'Check documents': browser => {
    // folder view
    const folders = '[data-e2e*=documents-item-folder-]'
    const files = '[data-e2e*=documents-item-file-]'
    const folderTitle = '[data-e2e=documents-title]'
    const backButton = '[data-e2e=back-button]'
    const localeSwitchFR = '[data-e2e=settings-switch-locale-fr_FR]'
    const activeLocaleFR = '[data-e2e=settings-active-locale-fr_FR]'
    const documentsNoItems = '[data-e2e=documents-no-items]'
    const documentsMenuItem =
      '[data-e2e=service-chooser-microapp-documents-inactive]'

    // Test documents with a random user because we want to test different locations
    const uuid = browser.globals.uuid()
    const username = uuid
    const email = `${uuid}@example.org`
    const password = `${uuid}password`

    browser.page
      .signup()
      .navigate()
      .signup(email, username, password, browser.globals.checkInCode)

    browser.page.onboarding().skipOnboarding()
    browser.click(documentsMenuItem)

    browser.assert.urlEquals(`${browser.launchUrl}/documents`)

    let folderLabel

    browser
      .waitForElementClickable(folders)
      .waitForElementClickable(files)
      .getText(`${folders}:nth-of-type(1)`, attr => {
        folderLabel = attr.value.replace(/\n/, '').split('\n')[0]
      })
      .click(`${folders}:nth-of-type(1)`)

    // use `perform()` so that `folderLabel` is filled with the correct value
    browser.perform(() => {
      browser
        .waitForElementClickable(folderTitle)
        .assert.attributeEquals(folderTitle, 'data-e2e-title', folderLabel)
        .expect.element(files).to.be.present
    })

    browser
      .waitForElementClickable(backButton)
      .click(backButton)
      .waitForElementNotPresent(backButton)

    // switch locale -> no documents page should be displayed
    browser
      .url(`${browser.launchUrl}/settings`)
      .waitForElementClickable(localeSwitchFR)
      .click(localeSwitchFR)
      .waitForElementClickable(activeLocaleFR)
      .url(`${browser.launchUrl}/documents`)
      .waitForElementClickable(documentsNoItems)
      .end()
  },
}
