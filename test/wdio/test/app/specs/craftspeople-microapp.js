const Login = require('../pages/login')

const overview = {
  // craftspeopleTitleBar: '[data-e2e="craftspeople-title"]',
  firstCraftsPerson:
    '[data-e2e="5a9d65d00ecb3300400ff9b3-craftspeople-address"]',
  sendRequestButton: '[data-e2e="craftspeople-send-request"]',
}

const overlay = {
  readonlyAddress:
    '[data-e2e="service-center-overlay-choose-address"][data-e2e-disabled]',
  readonlyCategory:
    '[data-e2e="service-center-overlay-choose-category"][data-e2e-disabled]',
  formDescription: '[data-e2e="service-center-overlay-description"]',
  formPhoneNumber: '[data-e2e="service-center-overlay-phonenumber"]',
  formSendButton: '[data-e2e="service-center-overlay-send"]',
  formSubject: '[data-e2e="service-center-overlay-title"]',
  formThirdPartyDisclaimer: '[data-e2e="third-party-disclaimer-text"]',
  ticketTitle: '[data-e2e="ticket-title"]',
}

describe('craftspeople app', () => {
  it('view craftspeople and send service center ticket', () => {
    Login.open({
      // element: overview.craftspeopleTitleBar,
      url: '/craftspeople',
    }).login()

    browser.waitAndClick(overview.firstCraftsPerson)
    browser.waitAndClick(overview.sendRequestButton)
    browser.waitForInteractive(overlay.formSubject)
    browser.waitForInteractive(overlay.readonlyCategory)

    $(overlay.readonlyCategory)
      .isDisplayed()
      .should.equal(true)

    $(overlay.readonlyAddress)
      .isDisplayed()
      .should.equal(true)

    browser.waitForInteractive(overlay.formThirdPartyDisclaimer)
    browser.waitAndSetValue(overlay.formDescription, 'test description')
    browser.waitAndSetValue(overlay.formSubject, 'test subject')
    browser.waitAndSetValue(overlay.formPhoneNumber, '+1234')
    browser.waitAndClick(overlay.formSendButton)
    browser.waitForInteractive(overlay.ticketTitle)
  })
})
