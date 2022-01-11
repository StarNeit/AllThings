'use strict'

const passWelcomeCard = browser => {
  const welcomeMessage = '[data-e2e=onboarding-welcome-message]'
  const welcomeText = '[data-e2e=onboarding-welcome-new-onboarder-text]'
  const progressFromWelcomeButton =
    '[data-e2e=onboarding-progress-from-welcome-button]'
  browser
    .waitForElementClickable(welcomeMessage)
    .waitForElementClickable(welcomeText)
    .waitForElementClickable(progressFromWelcomeButton)
    .click(progressFromWelcomeButton)
}

const writeWelcomeTextFinishTest = browser => {
  const writeWelcomeText =
    '[data-e2e=onboarding-writewelcome-write-welcome-text]'
  const newPost = '[data-e2e=pinboard-new-post]'
  const writeWelcomeTextField =
    '[data-e2e=onboarding-write-welcome-contribution]'
  const sendPostButton = '[data-e2e=onboarding-send-welcome-text-button]'
  const pinboardNewPostText = '[data-e2e=pinboard-new-post-text]'
  return browser
    .waitForElementClickable(writeWelcomeText)
    .waitForElementClickable(writeWelcomeTextField)
    .clearValue(writeWelcomeTextField)
    .setValueAndWait(writeWelcomeTextField, 'Luke Skywalker is onboarded')
    .waitForElementClickable(sendPostButton)
    .click(sendPostButton)
    .waitForElementClickable(newPost)
    .waitForElementClickable(pinboardNewPostText)
    .assert.containsText(pinboardNewPostText, 'Luke Skywalker is onboarded')
}

module.exports = {
  tags: ['onboarding'],
  'Skip onboarding, see new post created': browser => {
    const newPost = '[data-e2e=pinboard-new-post]'
    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    browser.page.onboarding().skipOnboarding()
    browser.waitForElementClickable(newPost)
    browser.end()
  },
  'Skip picture, skip text': browser => {
    const showUsYourLooksText =
      '[data-e2e=onboarding-showface-show-us-your-looks-text]'
    const continueWithoutImageButton =
      '[data-e2e=onboarding-showface-continue-without-image-button]'
    const writeWelcomeText =
      '[data-e2e=onboarding-writewelcome-write-welcome-text]'
    const forwardWithoutMessageButton =
      '[data-e2e=onboarding-writewelcome-forward-without-text-button]'
    const newPost = '[data-e2e=pinboard-new-post]'
    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    passWelcomeCard(browser)
    browser
      .waitForElementClickable(showUsYourLooksText)
      .waitForElementClickable(continueWithoutImageButton)
      .click(continueWithoutImageButton)
      .waitForElementClickable(writeWelcomeText)
      .waitForElementClickable(forwardWithoutMessageButton)
      .click(forwardWithoutMessageButton)
    browser.waitForElementClickable(newPost)
    browser.end()
  },
  'Skip picture, add text': browser => {
    const showUsYourLooksText =
      '[data-e2e=onboarding-showface-show-us-your-looks-text]'
    const continueWithoutImageButton =
      '[data-e2e=onboarding-showface-continue-without-image-button]'
    const writeWelcomeText =
      '[data-e2e=onboarding-writewelcome-write-welcome-text]'
    const newPost = '[data-e2e=pinboard-new-post]'
    const writeWelcomeTextField =
      '[data-e2e=onboarding-write-welcome-contribution]'
    const sendPostButton = '[data-e2e=onboarding-send-welcome-text-button]'
    const pinboardNewPostText = '[data-e2e=pinboard-new-post-text]'
    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    passWelcomeCard(browser)
    browser
      .waitForElementClickable(showUsYourLooksText)
      .waitForElementClickable(continueWithoutImageButton)
      .click(continueWithoutImageButton)
      .waitForElementClickable(writeWelcomeText)
      .waitForElementClickable(writeWelcomeTextField)
      .clearValue(writeWelcomeTextField)
      .setValueAndWait(writeWelcomeTextField, 'Luke Skywalker is onboarded')
      .waitForElementClickable(sendPostButton)
      .click(sendPostButton)
      .waitForElementClickable(newPost)
      .waitForElementClickable(pinboardNewPostText)
      .assert.containsText(pinboardNewPostText, 'Luke Skywalker is onboarded')
    browser.end()
  },
  'Add picture, add text': browser => {
    const showUsYourLooksText =
      '[data-e2e=onboarding-showface-show-us-your-looks-text]'
    const selectImageButton =
      '[data-e2e=onboarding-showface-select-image-button]'
    const looksGreatText =
      '[data-e2e=onboarding-setupyourface-looks-great-text]'
    const setupFaceContinueButton =
      '[data-e2e=onboarding-setupyourface-continue-button]'
    if (browser.globals.fileUploadEnabled) {
      browser.page
        .signup()
        .navigate()
        .signupRandomUser()
      passWelcomeCard(browser)
      browser
        .waitForElementClickable(showUsYourLooksText)
        .waitForElementClickable(selectImageButton)
      browser.setValueAndWait(
        'input[type="file"]',
        browser.globals.dummy.filePath,
      )
      browser
        .waitForElementClickable(looksGreatText)
        .waitForElementClickable(setupFaceContinueButton)
        .click(setupFaceContinueButton)
      writeWelcomeTextFinishTest(browser)
    }
    browser.end()
  },
  'skip onboarding': browser => {
    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    browser.page.onboarding().skipOnboarding()
    browser.end()
  },
}
