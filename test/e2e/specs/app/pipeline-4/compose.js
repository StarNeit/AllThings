'use strict'

/*
 * Compose
 */

module.exports = {
  tags: ['compose'],
  'Check compose overlay': browser => {
    const composeButton = '[data-e2e=compose-button]'
    const overlay = '[data-e2e=overlay]'
    const cancelOverlay = '[data-e2e=cancel-overlay]'
    const closeMarketplaceOverlay = '[data-e2e=cancel-thing-overlay]'
    const serviceCenterOverlayDescription =
      '[data-e2e=service-center-overlay-description]'
    const activateComposeOverlay = () => {
      browser
        .waitForElementClickable(composeButton)
        .click(composeButton)
        .waitForElementClickable(overlay)
    }
    function composeAndTest(category) {
      browser
        .perform(activateComposeOverlay)
        .waitForElementClickable(`[data-e2e=${category}]`)
        .click(`[data-e2e=${category}]`)
      if (category === 'new-helpdesk-item') {
        browser
          .waitForElementClickable(serviceCenterOverlayDescription)
          .waitForElementClickable(cancelOverlay)
          .click(cancelOverlay)
          .waitForElementNotPresent(cancelOverlay)
      } else {
        browser
          .waitForElementClickable(closeMarketplaceOverlay)
          .click(closeMarketplaceOverlay)
          .waitForElementNotPresent(closeMarketplaceOverlay)
      }
    }
    /*
     * Perform login.
     */
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    /*
     * Test the behaviour of the compose button.
     */
    browser
      .perform(activateComposeOverlay)
      .waitForElementClickable(cancelOverlay)
      .click(cancelOverlay)
      .waitForElementNotPresent(overlay)
    browser.perform(() => {
      composeAndTest('new-helpdesk-item')
      composeAndTest('new-marketplace-item')
      composeAndTest('new-sharing-item')
      composeAndTest('new-services-item')
    })
    browser.end()
  },
}
