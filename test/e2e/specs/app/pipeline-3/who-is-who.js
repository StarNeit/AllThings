'use strict'

const enableProfileButton = '[data-e2e=who-is-who-enable-profile-button]'
const selfUserListItem = '[data-e2e=who-is-who-self-user-list-item]'

const initTest = browser => {
  browser.page
    .signup()
    .navigate()
    .signupRandomUser()
  browser.page.onboarding().skipOnboarding()
  browser.url(`${browser.launchUrl}/who-is-who`)
}

const getToUserList = browser => {
  initTest(browser)
  browser
    .waitForElementClickable(enableProfileButton)
    .click(enableProfileButton)
    .waitForElementClickable(selfUserListItem)
}

module.exports = {
  tags: ['who-is-who'],
  'Enable and disable profile': browser => {
    const settingsMoreIcon = '[data-e2e=user-profile-settings-more-icon]'
    const hideProfileButton = '[data-e2e=user-profile-settings-hide-profile]'
    const confirmDialog = '[data-e2e=confirm-hide-profile-dialog]'

    const browserName = browser.options.desiredCapabilities.browserName
    getToUserList(browser)
    browser
      .waitForElementClickable(selfUserListItem)
      .click(selfUserListItem)
      .waitForElementClickable(settingsMoreIcon)
      .click(settingsMoreIcon)
      .waitForElementClickable(hideProfileButton)
      .click(hideProfileButton)
      .waitForElementVisible(confirmDialog)
      .keys('\uE007') // press Enter to accept confirm dialog
    if (!(browserName === 'iphone' || browserName === 'safari')) {
      browser.waitForElementClickable(enableProfileButton)
    }

    browser.end()
  },
  'See others profile': browser => {
    const userAndrewPaul = '[data-e2e=whoiswho-user--andrew_paul]'
    const userTreySmith = '[data-e2e=whoiswho-user--trey_smith]'
    const doScrollToKingDennis = `document.querySelector('[data-e2e=whoiswho-user--king_dennis]').scrollIntoView()`
    const doScrollToTreySmith = `document.querySelector('[data-e2e=whoiswho-user--trey_smith]').scrollIntoView()`
    const sendEmailButton = '[data-e2e=user-profile-send-email-button]'
    getToUserList(browser)
    browser
      .waitForElementClickable(userAndrewPaul)
      .execute(doScrollToKingDennis)
      .waitForElementVisible(userTreySmith)
      .execute(doScrollToTreySmith)
      .waitForElementClickable(userTreySmith)
      .click(userTreySmith)
      .waitForElementClickable(sendEmailButton)
    browser.end()
  },
}
