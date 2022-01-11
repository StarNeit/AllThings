'use strict'

const guestRoomA = '[data-e2e=assetlistitem-guest-room-a]'
const bookButton = '[data-e2e=booking-book-asset-button]'
const submitButton = '[data-e2e=booking-overlay-submit-button]'
const phoneInput = '[data-e2e=booking-phonenumber]'
const successButton = '[data-e2e=booking-success-button]'
const doClickDayInsideTheMonth = `document.querySelectorAll('button[class*="react-calendar"]')[12].click()`
const doClickNextMonth = `document.querySelector('[class="react-calendar__navigation__arrow react-calendar__navigation__next-button"]').click()`
const laundryMachineC = '[data-e2e=assetlistitem-laundry-machine-c]'

module.exports = {
  tags: ['booking'],
  'Visit booking page': browser => {
    const hourslot_8_am = '[data-e2e=booking-hour-8]'
    const nextDayButton = '[data-e2e=booking-overlay-next-day-button]'
    const meetingRoomA = '[data-e2e=assetlistitem-meeting-room-a]'

    browser
      .url(`${browser.launchUrl}/booking`)
      .page.login()
      .login(browser.globals.user.email, browser.globals.user.password)

    browser
      .waitForElementClickable(laundryMachineC)
      .moveToElement(meetingRoomA, 0, 0)
      .waitForElementClickable(meetingRoomA)
      .click(meetingRoomA)
      .waitForElementClickable(bookButton)
      .click(bookButton)
    // Always select bookings for the next day to ensure there is at least one timeslot for this asset
    browser.execute(doClickNextMonth).pause(1000)
    browser
      .execute(doClickDayInsideTheMonth)
      .pause(1000)
      .waitForElementClickable(hourslot_8_am)
      .click(hourslot_8_am)
      .waitForElementClickable(submitButton)
      .click(submitButton)
      // for some odd reasons the submit button was never clicked
      // to force the click use this hack
      // taken from https://github.com/nightwatchjs/nightwatch/issues/1047
      .waitForElementClickable(phoneInput)
      .clearValue(phoneInput)
      .setValueAndWait(phoneInput, '+1234567890')
      .click(submitButton)
      .moveToElement(submitButton, 0, 0)
      .mouseButtonClick(0)
      .waitForElementClickable(successButton)
      .click(successButton)
    browser.end()
  },
  'Check the filter': browser => {
    const doClickFilter =
      'document.querySelector("[data-e2e=booking-filter-parent]").childNodes[0].childNodes[0].childNodes[0].click()'
    const nameInputFilter = '[data-e2e=booking-filter-name]'
    const laundryMachineA = '[data-e2e=assetlistitem-laundry-machine-a]'
    const laundryMachineB = '[data-e2e=assetlistitem-laundry-machine-b]'
    const doOpenCategoryDropdown =
      'document.querySelector("[role=combobox]").childNodes[0].childNodes[0].click()'
    const doSelectLaundryMachinesCategory =
      'document.querySelector("[id=downshift-0-item-2]").click()'
    const doClickOnSelectDayToTriggerCalendar =
      'document.querySelector("[data-e2e=booking-filter-parent]").childNodes[0].childNodes[1].childNodes[0].childNodes[5].childNodes[0].childNodes[1].click()'
    const quarterhourslot_8_am = '[data-e2e=booking-quarter-hour-32]'
    const quarterhourslot_4_45_pm = '[data-e2e=booking-quarter-hour-67]'

    browser
      .url(`${browser.launchUrl}/booking`)
      .page.login()
      .login(browser.globals.user.email, browser.globals.user.password)

      .waitForElementClickable(laundryMachineC)
      .waitForElementNotVisible(nameInputFilter)
    browser
      // set the category to laundry machines now ---> see all laundry machines
      .pause(1000)
      .execute(doClickFilter)
      .waitForElementClickable(laundryMachineC)
      .pause(1000)
    browser.execute(doOpenCategoryDropdown)
    browser.pause(1000)
    browser
      .execute(doSelectLaundryMachinesCategory)
      .pause(1000)
      .waitForElementClickable(laundryMachineA)
      .waitForElementClickable(laundryMachineB)
      .waitForElementClickable(laundryMachineC)
    // select a day in the filter then book (selecting hours is not possible at the moment)
    browser.execute(doClickOnSelectDayToTriggerCalendar).pause(1000)
    browser.execute(doClickNextMonth).pause(1000)
    browser
      .execute(doClickDayInsideTheMonth)
      .pause(1000)
      .click(laundryMachineC)
      .waitForElementClickable(bookButton)
      .click(bookButton)
      .waitForElementClickable(quarterhourslot_8_am)
      .click(quarterhourslot_8_am)
      .moveToElement(quarterhourslot_4_45_pm, 0, 0)
      .waitForElementClickable(quarterhourslot_4_45_pm)
      .click(quarterhourslot_4_45_pm)
      .waitForElementClickable(submitButton)
      .click(submitButton)
      // for some odd reasons the submit button was never clicked
      // to force the click use this hack
      // taken from https://github.com/nightwatchjs/nightwatch/issues/1047
      .waitForElementClickable(phoneInput)
      .clearValue(phoneInput)
      .setValueAndWait(phoneInput, '+1234567890')
      .click(submitButton)
      .moveToElement(submitButton, 0, 0)
      .mouseButtonClick(0)
      .waitForElementClickable(successButton)
      .click(successButton)
    browser.end()
  },
  'Check if price is correct': browser => {
    const doClickFilter =
      'document.querySelector("[data-e2e=booking-filter-parent]").childNodes[0].childNodes[0].childNodes[0].click()'
    const nameInputFilter = '[data-e2e=booking-filter-name]'
    const doClick4DaysLater = `document.querySelectorAll('button[class*="react-calendar"]')[16].click()`
    const price100EUR = '[data-e2e=total-price-100-EUR]'

    browser
      .url(`${browser.launchUrl}/booking`)
      .page.login()
      .login(browser.globals.user.email, browser.globals.user.password)
      .waitForElementClickable(guestRoomA)
      .waitForElementNotVisible(nameInputFilter)
    browser
      .execute(doClickFilter)
      .waitForElementClickable(nameInputFilter)
      .setValueAndWait(nameInputFilter, 'guest room a')
      .pause(2000)
      .waitForElementClickable(guestRoomA)
      .click(guestRoomA)

      .waitForElementClickable(bookButton)
      .click(bookButton)
    browser.execute(doClickNextMonth).pause(1000)
    browser
      .execute(doClickDayInsideTheMonth)
      .pause(1000)
      .execute(doClick4DaysLater)
      .pause(1000)
      .waitForElementClickable(submitButton)
      .click(submitButton)
      // for some odd reasons the submit button was never clicked
      // to force the click use this hack
      // taken from https://github.com/nightwatchjs/nightwatch/issues/1047
      .waitForElementClickable(price100EUR)

    browser.end()
  },
}
