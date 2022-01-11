'use strict'

const overlayCategoryWrapper = '[data-e2e=category-wrapper]'
const overlayChooseCategory =
  '[data-e2e=service-center-overlay-choose-category]'
const overlayCategoryListItems = '[data-e2e^=service-center-category-label-]'
const overlayAddressWrapper = '[data-e2e=address-wrapper]'
const overlayChooseAddress = '[data-e2e=service-center-overlay-choose-address]'
const overlayAddressListItems = '[data-e2e^=service-center-address-label-]'
const commentContent = idx =>
  `[data-e2e=pinboard-detail-new-comment-text-${idx}]`
const imageDeleteButton = '[data-e2e=file-upload-delete-button-0]'
const composeButton = '[data-e2e=compose-button]'
const serviceCenterCreate = '[data-e2e=new-helpdesk-item]'
const overviewListOpened = '[data-e2e=service-center-overview-list-opened]'
const overviewListClosed = '[data-e2e=service-center-overview-list-closed]'
const overlayDescriptionTextarea =
  '[data-e2e=service-center-overlay-description]'
const overlayTitle = '[data-e2e=service-center-overlay-title]'
const overlayPhoneNumberInput = '[data-e2e=service-center-overlay-phonenumber]'
const overlaySendButton = '[data-e2e=service-center-overlay-send]'
const file = filename => `[data-e2e="ticket-conversation-file-${filename}"]`
const ticketTitle = '[data-e2e=ticket-title]'
const ticketContent = '[data-e2e=ticket-content]'
const commentTextarea = '[data-e2e=service-center-ticket-contribution]'
const sendComment = '[data-e2e=service-center-ticket-contribution-send]'
const comment = text => `[data-e2e-message="${text}"]`
const messageFile = filename => `[data-e2e="ticket-message-file-${filename}"]`
const resolveTicket = '[data-e2e=ticket-close]'
const reopenTicket = '[data-e2e=ticket-reopen]'
const reopenTicketFromActions = '[data-e2e=ticket-actions-reopen]'

module.exports = {
  tags: ['service-center'],
  'Create ticket': browser => {
    const createUuid = browser.globals.uuid

    browser
      .url(`${browser.launchUrl}/service-center`)
      .page.login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    const expectedDescriptionText = createUuid()
    const expectedTitle = createUuid()

    browser
      .waitForElementClickable(composeButton)
      .click(composeButton)
      .waitForElementClickable(serviceCenterCreate)
      .click(serviceCenterCreate)

    // Select the category.
    browser
      .waitForElementPresent(overlayChooseCategory)
      .execute(`document.querySelector("${overlayChooseCategory}").click()`)
      .waitForElementClickable(`${overlayCategoryWrapper} [id$=-item-0]`)
      .click(`${overlayCategoryWrapper} [id$=-item-0]`)

    // Select the address.
    browser
      .waitForElementPresent(overlayChooseAddress)
      .execute(`document.querySelector("${overlayChooseAddress}").click()`)
      .waitForElementClickable(`${overlayAddressWrapper} [id$=-item-0]`)
      .click(`${overlayAddressWrapper} [id$=-item-0]`)

    browser
      .waitForElementClickable(overlayDescriptionTextarea)
      .setValueAndWait(overlayDescriptionTextarea, expectedDescriptionText)
      .setValueAndWait(overlayTitle, expectedTitle)
      .clearValue(overlayPhoneNumberInput)
      .setValueAndWait(overlayPhoneNumberInput, createUuid())

    if (browser.globals.fileUploadEnabled) {
      browser
        .setValueAndWait('input[type="file"]', browser.globals.dummy.filePath)
        .waitForElementClickable(imageDeleteButton)
    }

    browser.click(overlaySendButton).waitForElementNotPresent(overlaySendButton)

    // We are now in the ticket detail view!
    browser.assert.urlContains('/service-center/ticket/')

    browser.perform(() => {
      // Check the category, title and content.
      browser
        .waitForElementClickable('[data-e2e^=ticket-category-]')
        .assert.containsText(ticketTitle, expectedTitle)
      browser.assert.containsText(ticketContent, expectedDescriptionText)

      // Check the uploaded file attached to the ticket.
      if (browser.globals.fileUploadEnabled) {
        browser.expect.element(file(browser.globals.dummy.fileName)).to.be
          .present
      }

      // Add a new text comment and check it.
      const textMessage = createUuid()
      browser
        .setValueAndWait(commentTextarea, textMessage)
        .click(sendComment)
        .waitForElementClickable(comment(textMessage))

      if (browser.globals.fileUploadEnabled) {
        // Add a file comment without text and check it.
        browser
          .setValueAndWait('input[type="file"]', browser.globals.dummy.filePath)
          .waitForElementClickable(messageFile(browser.globals.dummy.fileName))
          .click(sendComment)
          .waitForElementClickable(comment(browser.globals.dummy.fileName))

        // Add a file comment with text and check it.
        const anotherMessage = createUuid()
        browser
          .refresh() // Otherwise the input is not reachable again...
          .waitForElementClickable(sendComment)
          .setValueAndWait(commentTextarea, anotherMessage)
          .setValueAndWait('input[type="file"]', browser.globals.dummy.filePath)
          .waitForElementClickable(messageFile(browser.globals.dummy.fileName))
          .click(sendComment)
          .waitForElementClickable(comment(browser.globals.dummy.fileName))
          .waitForElementClickable(comment(anotherMessage))
      }

      // Mark the ticket as resolved, reopen it and check that you can send
      // messages again.
      browser
        .click(resolveTicket)
        .waitForElementClickable(reopenTicket)
        .expect.element(reopenTicketFromActions).to.be.visible
      browser
        .click(reopenTicket)
        .waitForElementClickable(resolveTicket)
        .waitForElementClickable(sendComment)
    })

    browser.end()
  },
}
