'use strict'

/*
 * Information
 */

module.exports = {
  tags: ['information'],
  'Check information pages': browser => {
    // topic view
    const topic = '[data-e2e=information-topic]'
    const topicItems = '[data-e2e*=information-topic-item-]'

    // article view
    const articleTopicTitle = '[data-e2e=information-article-topic-title]'
    const articleItems = '[data-e2e*=information-article-item-]'

    // detail view
    const detailText = '[data-e2e=information-detail-text]'
    const detailBackButton = '[data-e2e=information-detail-back]'

    const informationMenuItem =
      '[data-e2e=service-chooser-microapp-project-inactive]'

    // change locale setting to en_US first to be sure there will be articles.
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.url(`${browser.launchUrl}/settings`)

    browser.page
      .settings()
      .navigate()
      .changeLanguage('en_US')

    browser.click(informationMenuItem)

    browser.assert.urlEquals(`${browser.launchUrl}/information`)

    let topicKey
    let articleId

    browser.waitForElementClickable(topic).expect.element(topicItems).to.be
      .present
    browser
      .getAttribute(`${topicItems}:nth-of-type(1)`, 'data-e2e', attr => {
        topicKey = attr.value.replace('information-topic-item-', '')
      })
      .click(`${topicItems}:nth-of-type(1)`)

    // use `perform()` so that `topicKey` is filled with the correct value
    browser.perform(() => {
      browser
        .waitForElementClickable(articleTopicTitle)
        .assert.urlEquals(`${browser.launchUrl}/information/topic/${topicKey}`)
        .assert.attributeEquals(articleTopicTitle, 'data-e2e-title', topicKey)
        .expect.element(articleItems).to.be.present
      browser
        .getAttribute(`${articleItems}:nth-of-type(1)`, 'data-e2e', attr => {
          articleId = attr.value.split('-').pop()
        })
        .click(`${articleItems}:nth-of-type(1)`)
    })

    browser.perform(() => {
      browser
        .waitForElementClickable(detailText)
        .assert.urlEquals(
          `${browser.launchUrl}/information/topic/about-the-app/${articleId}`,
        )
        .assert.attributeEquals(detailBackButton, 'data-e2e-back-key', topicKey)
    })

    browser.end()
  },
  'Check information detail files': browser => {
    const attachmentList = '[data-e2e=information-detail-attachment-list]'
    const detailText = '[data-e2e=information-detail-text]'

    browser
      .url(
        `${browser.launchUrl}/information/article/${browser.globals.information.articleId}`,
      )
      .page.login()
      .login(browser.globals.user.email, browser.globals.user.password)
    browser.waitForElementClickable(detailText)
    browser.assert.urlEquals(
      `${browser.launchUrl}/information/topic/my-flat/${browser.globals.information.articleId}`,
    )

    browser
      .waitForElementClickable(attachmentList)
      .waitForElementClickable(`${attachmentList} li`)

    browser.end()
  },
}
