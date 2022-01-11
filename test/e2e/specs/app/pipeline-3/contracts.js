'use strict'

/*
 * Contracts
 */

module.exports = {
  tags: ['contracts'],
  'check contracts micro app': browser => {
    const firstContract = '[data-e2e=contract-item-0]'
    const headingType = '[data-e2e=contract-item-0-heading-type]'
    const subheadingType = '[data-e2e=contract-item-0-subheading-type]'
    const subheadingId = '[data-e2e=contract-item-0-subheading-id]'
    const contentAddress = '[data-e2e=contract-item-0-address]'
    const contentDescription = '[data-e2e=contract-item-0-description]'
    const contentStartDate = '[data-e2e=contract-item-0-start-date]'
    const contentCancellation = '[data-e2e=contract-item-0-cancellation]'

    browser.url(`${browser.launchUrl}/contracts`)
    browser.page
      .login()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.waitForElementClickable(firstContract)
    browser.expect.element(headingType).text.to.not.equal('')
    browser.expect.element(subheadingType).text.to.not.equal('')
    browser.expect.element(subheadingId).text.to.not.equal('')
    browser.expect.element(contentAddress).text.to.not.equal('')
    browser.expect.element(contentDescription).text.to.not.equal('')
    browser.expect.element(contentStartDate).text.to.not.equal('')
    browser.expect.element(contentCancellation).text.to.not.equal('')
    browser.end()
  },
}
