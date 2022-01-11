'use strict'

/*
 * Notifications
 */

module.exports = {
  tags: ['notifications'],
  'Check notifications': browser => {
    const uuid = browser.globals.uuid()
    const username = uuid
    const email = `${uuid}@example.org`
    const password = `${uuid}password`
    const newNotifications = '[data-e2e=new-notifications]'
    const notificationsButton = '[data-e2e=notifications-button]'
    const markAllNotificationsRead = '[data-e2e=mark-all-notifications-read]'
    const composeButton = '[data-e2e=compose-button]'
    const newCommunityArticles = '[data-e2e=new-community-articles-item]'
    const pinboardContribution = '[data-e2e=pinboard-contribution]'
    const pinboardContributionSend = '[data-e2e=pinboard-contribution-send]'
    const notificationItemMisc = '[data-e2e=notification-item-miscellaneous]'
    const notificationItemMiscContent =
      '[data-e2e=notification-item-miscellaneous-content]'
    const notificationItemTicket = '[data-e2e=notification-item-ticket]'
    const pinboardPostContent = '[data-e2e=pinboard-detail-new-post-0-content]'
    browser.page
      .signup()
      .navigate()
      .signup(email, username, password, browser.globals.checkInCode)
    browser.page.onboarding().skipOnboarding()
    browser
      .waitForElementClickable(newNotifications)
      .click(notificationsButton)
      .waitForElementClickable(markAllNotificationsRead)
      .click(markAllNotificationsRead)
      .waitForElementNotPresent(markAllNotificationsRead)
      .waitForElementNotPresent(newNotifications)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser
      .waitForElementClickable(newNotifications)
      .click(notificationsButton)
      .waitForElementClickable(notificationItemTicket)
      .click(notificationItemTicket)
      .assert.urlContains(`${browser.launchUrl}/service-center/ticket`)
    browser
      .waitForElementClickable(composeButton)
      .click(composeButton)
      .waitForElementClickable(newCommunityArticles)
      .click(newCommunityArticles)
      .waitForElementClickable(pinboardContribution)
      .setValueAndWait(pinboardContribution, uuid)
      .waitForElementClickable(pinboardContributionSend)
      .click(pinboardContributionSend)
    browser.page
      .logout()
      .navigate()
      .logout()
    browser.page
      .login()
      .navigate()
      .login(email, password)
    browser
      .waitForElementClickable(newNotifications)
      .click(notificationsButton)
      .expect.element(notificationItemMiscContent)
      .text.to.contain(uuid)
    browser
      .click(notificationItemMisc)
      .waitForElementClickable(pinboardPostContent)
      .expect.element(pinboardPostContent)
      .text.to.contain(uuid)
    browser.assert.urlContains(`${browser.launchUrl}/pinboard`)
    browser.end()
  },
}
