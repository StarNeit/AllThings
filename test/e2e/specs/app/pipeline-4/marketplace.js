'use strict'

module.exports = {
  tags: ['marketplace', 'sharing'],
  'Check marketplace': browser => {
    const myThingsBack = '[data-e2e=back-button]'
    const composeButton = '[data-e2e=compose-button]'
    const deleteButton = '[data-e2e=file-upload-delete-button-0]'
    const file = 'input[type="file"]'
    const me = '[data-e2e=marketplace-feed-me]'
    const newMarketplace = '[data-e2e=new-marketplace-item]'
    const overlayContact = '[data-e2e=marketplace-overlay-contact]'
    const overlayDescription = '[data-e2e=marketplace-overlay-description]'
    const overlayName = '[data-e2e=marketplace-overlay-name]'
    const overlayPrice = '[data-e2e=marketplace-overlay-price]'
    const overlaySubmit = '[data-e2e=marketplace-overlay-submit]'
    const thingDescription = '[data-e2e=marketplace-show-description]'
    const thingName = '[data-e2e=marketplace-show-name]'
    const thingPrice = '[data-e2e=marketplace-show-price]'
    const uuid = browser.globals.uuid()

    /*
     * Perform login first.
     */
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    const thingNameUuid = uuid.substring(0, 25)
    /*
     * Start creating new marketplace thing.
     * First the two mandatory fields (name and price) will be omitted,
     * and thus we are expecting to get some hints.
     */

    const myThingName = `[data-e2e=marketplace-thing-${thingNameUuid}]`
    const myThingEdit = `[data-e2e=marketplace-thing-${thingNameUuid}-edit]`
    const myThingDelete = `[data-e2e=marketplace-thing-${thingNameUuid}-delete]`

    browser
      .waitForElementClickable(composeButton)
      .click(composeButton)
      .waitForElementClickable(newMarketplace)
      .click(newMarketplace)
      .waitForElementClickable(overlayName)
      .perform(() => {
        if (browser.globals.fileUploadEnabled) {
          browser
            .setValueAndWait(file, browser.globals.dummy.filePath)
            .waitForElementClickable(deleteButton)
        }
      })
      .setValue(overlayDescription, uuid)
      .setValue(overlayContact, uuid)
      .click(overlaySubmit)
      .setValue(overlayName, uuid)
      .setValue(overlayPrice, '100')
      .click(overlaySubmit)
      .waitForElementClickable(thingName)
      .expect.element(thingName)
      .text.to.equal(thingNameUuid)
    browser.waitForElementPresent(myThingEdit)
    browser.waitForElementPresent(myThingDelete)
    browser.expect.element(thingDescription).text.to.equal(uuid)
    browser.expect.element(thingPrice).text.to.equal('100')
    browser.assert.urlContains(`${browser.launchUrl}/marketplace/me/`)

    // Go back to the feed view and play with the routes.
    browser.waitForElementClickable(myThingsBack).click(myThingsBack)
    browser.assert.urlEquals(`${browser.launchUrl}/marketplace`)

    // Change thing form
    const abortEdition = '[data-e2e=cancel-thing-overlay]'
    const image = '[data-e2e=file-upload-image-0]'
    const newUuid = browser.globals.uuid().substring(0, 25)
    browser
      .url(`${browser.launchUrl}/marketplace`)
      .expect.element(myThingName)
      .text.to.equal(thingNameUuid)
    browser
      .waitForElementClickable(myThingName)
      .click(myThingName)
      .waitForElementClickable(myThingEdit)
      .click(myThingEdit)
      .waitForElementClickable(abortEdition)
      .click(abortEdition)
      .waitForElementClickable(myThingEdit)
      .click(myThingEdit)
      .waitForElementClickable(abortEdition)
    if (browser.globals.fileUploadEnabled) {
      browser
        .waitForElementClickable(deleteButton)
        .click(deleteButton)
        .waitForElementNotPresent(image)
    }
    browser
      .clearValue(overlayName)
      .setValue(overlayName, newUuid)
      .waitForElementClickable(overlaySubmit)
      .click(overlaySubmit)
      .waitForElementClickable(thingName)
      .expect.element(thingName)
      .text.to.equal(newUuid)

    /*
     * Thing deletion.
     */
    const myUpdatedThingDelete = `[data-e2e=marketplace-thing-${newUuid}-delete]`
    const myUpdatedThingName = `[data-e2e=marketplace-thing-${newUuid}]`
    const confirmDialog = '[data-e2e=confirm-delete-thing-dialog]'
    browser
      .waitForElementClickable(me)
      .click(me)
      .waitForElementClickable(myUpdatedThingName)
      .click(myUpdatedThingName)
      .waitForElementClickable(myUpdatedThingDelete)
    // IE doesn't like scrolling in the overlay and next tests will fail.
    if (
      browser.options.desiredCapabilities.browserName !== 'internet explorer' &&
      browser.options.desiredCapabilities.browserName !== 'MicrosoftEdge'
    ) {
      browser.scrollDown()
    }
    browser
      .click(myUpdatedThingDelete)
      .waitForElementVisible(confirmDialog)
      .keys('\uE007') // press Enter to accept confirm dialog
    browser.expect.element(myUpdatedThingName).to.not.be.present
    browser.end()
  },
}
