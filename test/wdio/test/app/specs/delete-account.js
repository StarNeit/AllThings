const SignUp = require('../pages/signup')
const Onboarding = require('../pages/onboarding')

const uuid = uuidv4()
const accountsReady = '[data-e2e="accounts-ready"]'
const deleteAccountErrorMessage = '[data-e2e="delete-account-error-message"]'
const deleteAccountSuccess = '[data-e2e="delete-account-success"]'
const deleteButton = '[data-e2e="delete-account-button"]'
const deleteButtonCancel = '[data-e2e="delete-account-overlay-cancel"]'
const deleteButtonConfirm = '[data-e2e="delete-account-overlay-confirm"]'
const deleteInputEmail = '[data-e2e="delete-account-overlay-input"]'
const email = `${uuid}@example.org`
const password = `${uuid}password`
const settingsMenuItem =
  '[data-e2e="service-chooser-microapp-settings-inactive"]'
const username = uuid

describe('delete account', () => {
  it('should signup and then delete the newly created account', () => {
    SignUp.open().signUp(email, username, password, config.checkInCode)

    Onboarding.skip()

    browser.waitAndClick(settingsMenuItem)
    browser.waitAndClick(deleteButton)
    browser.waitForInteractive(deleteInputEmail)
    browser.waitForInteractive(deleteButtonCancel)
    browser.waitForInteractive(deleteButtonConfirm)

    $(deleteAccountErrorMessage).waitForExist(10000, true)

    browser.waitAndClick(deleteButtonConfirm)
    browser.waitAndSetValue(deleteInputEmail, 'invalid@example.org')
    browser.waitAndClick(deleteButtonConfirm)
    browser.waitForInteractive(deleteAccountErrorMessage)
    browser.waitAndSetValue(deleteInputEmail, email)
    browser.waitAndClick(deleteButtonConfirm)

    $(deleteAccountErrorMessage).waitForExist(10000, true)

    browser.waitForInteractive(deleteAccountSuccess)
    browser.waitForInteractive(accountsReady)
  })
})
