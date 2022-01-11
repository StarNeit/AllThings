const SignUp = require('../pages/signup')

const loginEmail = '[data-e2e=login-email]'
const multipleAddressOne = '[data-e2e=multiple-address-0]'
const multipleAddressTwo = '[data-e2e=multiple-address-1]'
const noCodeButton = '[data-e2e=no-code-button]'
const requestSentPage = '[data-e2e=request-access-request-sent]'
const submitButton = '[data-e2e=check-in-button]'
const loginButton = '[data-e2e=login-accounts-button]'
const typeaheadDropdownItem = '[id=downshift-0-item-0]'
const typeaheadInput = '[id*=input]'
const userOne = uuidv4()
const userTwo = uuidv4()

describe('request-check-in-flow', () => {
  it('should send request if matching address is found', () => {
    SignUp.open()
    SignUp.signUp(`${userOne}@example.me`, 'testing123', userOne)

    // press "I don't have a code" button
    browser.waitAndClick(noCodeButton)

    browser.waitAndSetValue(typeaheadInput, 'Runzmattenweg 6 Freiburg')

    // wait for google API to return
    browser.waitAndClick(typeaheadDropdownItem)

    browser.waitAndClick(submitButton)

    browser.waitForInteractive(requestSentPage)

    browser.url('/logout')

    browser.waitForInteractive(loginButton)
  })

  it('should show address selector if multiple are in radius', () => {
    SignUp.open()
    SignUp.signUp(`${userTwo}@example.me`, 'testing123', userTwo)

    // press "I don't have a code" button
    browser.waitAndClick(noCodeButton)

    browser.waitAndSetValue(typeaheadInput, 'Kaiser-Joseph-Str 262 Freiburg')

    // wait for google API to return
    browser.pause(10000)

    // accept first choice returned from google
    browser.keys('\uE007')

    browser.waitAndClick(submitButton)

    // expect multiple address choices
    browser.waitForInteractive(multipleAddressTwo)

    browser.waitAndClick(multipleAddressOne)

    browser.waitForInteractive(requestSentPage)

    browser.waitAndClick(submitButton)

    browser.url('/logout')

    browser.waitForInteractive(loginButton)
  })
})
