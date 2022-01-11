'use strict'

/*
 * Pinboard
 */

module.exports = {
  tags: ['pinboard'],
  'Check pinboard': browser => {
    const contribution = '[data-e2e=pinboard-contribution]'
    const contributionAvatar = '[data-e2e=pinboard-contribution-avatar]'
    const contributionVisibility = '[data-e2e=pinboard-contribution-visibility]'
    const contributionFirstImage = '[data-e2e=file-upload-image-0]'
    const contributionSecondImage = '[data-e2e=file-upload-image-1]'
    const contributionSend = '[data-e2e=pinboard-contribution-send]'
    const newPost = '[data-e2e=pinboard-new-post]'
    const newPostFittedImage = '[data-e2e=pinboard-new-post-fitted-image]'
    const newPostImageMoreLabel =
      '[data-e2e=pinboard-new-post-more-images-label]'
    const newPostActions = detail =>
      `[data-e2e=pinboard-new-post-${detail ? 'detail' : 0}-actions]`
    const newPostActionsEdit = '[data-e2e=pinboard-new-post-0-actions-edit]'
    const newPostActionsDelete = '[data-e2e=pinboard-new-post-0-actions-delete]'
    const newPostAuthor = detail =>
      `[data-e2e=pinboard-new-post-${detail ? 'detail' : 0}-author]`
    const newPostAvatar = detail =>
      `[data-e2e=pinboard-new-post-${detail ? 'detail' : 0}-avatar]`
    const newPostDate = detail =>
      `[data-e2e=pinboard-new-post-${detail ? 'detail' : 0}-date]`
    const newPostComment = (detail, isNew) =>
      `[data-e2e=pinboard-new-post-${isNew ? 'new-' : ''}${
        detail ? 'detail' : 0
      }-comment]`
    const newPostContent = detail =>
      `[data-e2e=pinboard-new-post-${detail ? 'detail' : 0}-content]`
    const newPostLike = detail =>
      `[data-e2e=pinboard-${detail ? 'detail-' : ''}new-post-${
        detail ? 'detail' : 'new-0'
      }-like]`
    const newPostLiked = detail =>
      `[data-e2e=pinboard-${detail ? 'detail-' : ''}new-post-${
        detail ? 'detail' : 0
      }-liked]`
    const newPostLikes = likes =>
      `[data-e2e=pinboard-new-post-0-likes-${likes}]`
    const detailContributionAvatar =
      '[data-e2e=pinboard-detail-contribution-avatar]'
    const detailContributionSend = '[data-e2e=detail-contribution-send]'
    const profileAvatar = '[data-e2e=pinboard-profile-avatar]'
    const profileBack = '[data-e2e=back-button]'
    const profileUsername = '[data-e2e=pinboard-profile-username]'
    const profileActions = '[data-e2e=user-profile-settings-more-icon]'
    const profileActionsSettings = '[data-e2e=user-profile-settings-settings]'
    const uuid = browser.globals.uuid()
    const commentUuid = browser.globals.uuid()
    const editUuid = browser.globals.uuid()
    const comment = '[data-e2e=pinboard-detail-contribution]'
    const newComment = '[data-e2e=pinboard-detail-new-comment-text-0]'
    const newCommentAvatar = '[data-e2e=pinboard-detail-new-comment-0-avatar]'
    const newCommentUsername =
      '[data-e2e=pinboard-detail-new-comment-0-username]'
    const newCommentDate = '[data-e2e=pinboard-detail-new-comment-0-date]'
    const comments = '[data-e2e=pinboard-detail-comments]'
    const detailBack = '[data-e2e=back-button]'
    const editContent = '[data-e2e=pinboard-edit-0-content]'
    const editCancel = '[data-e2e=pinboard-edit-0-cancel]'
    const editSave = '[data-e2e=pinboard-edit-0-save]'
    const imageGalleryNextButton = '[data-e2e=image-gallery-next-button]'
    const imageGalleryPreviousButton =
      '[data-e2e=image-gallery-previous-button]'
    const imageOverlayFirstImage = '[data-e2e=image-overlay-image-0]'
    const imageOverlaySecondImage = '[data-e2e=image-overlay-image-1]'
    const imageGalleryClosebutton = '[data-e2e=image-overlay-close]'
    const alertDialogConfirm = '[data-e2e=alert-dialog-confirm]'

    /*
     * Perform login first.
     */
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    /*
     * Create a new post.
     */
    browser
      .waitForElementClickable(contribution)
      .expect.element(contributionAvatar).to.be.visible
    browser.expect.element(contributionVisibility).to.be.visible
    browser.setValueAndWait(contribution, uuid)
    if (browser.globals.fileUploadEnabled) {
      browser
        .setValueAndWait('input[type="file"]', browser.globals.dummy.filePath)
        .waitForElementClickable(contributionFirstImage)
      browser
        .setValueAndWait('input[type="file"]', browser.globals.dummy2.filePath)
        .waitForElementClickable(contributionSecondImage)
    }
    browser
      .click(contributionSend)
      .waitForElementClickable(newPost)
      .expect.element(newPostContent())
      .text.to.equal(uuid)
    browser.expect.element(newPostAvatar()).to.be.visible
    browser.expect.element(newPostAuthor()).to.be.visible
    browser.expect.element(newPostDate()).to.be.visible
    browser.expect.element(newPostActions()).to.be.visible
    browser.expect.element(newPostLike()).to.be.visible
    browser.expect.element(newPostComment(false, true)).to.be.visible
    browser.assert.urlContains(`${browser.launchUrl}/pinboard`)

    /*
     * Check user profile
     */
    browser.click(newPostAvatar()).waitForElementClickable(profileAvatar)
    browser.expect.element(profileUsername).to.be.visible
    browser.assert.urlContains(`${browser.launchUrl}/pinboard/profile/`)
    browser
      .click(profileActions)
      .waitForElementClickable(profileActionsSettings)
      .click(profileAvatar)
      .waitForElementNotPresent(profileActionsSettings)
      .click(profileBack)
      .waitForElementClickable(contribution)
    browser.assert.urlEquals(`${browser.launchUrl}/pinboard`)

    /*
     * Check Image Overlay for multiple images
     */
    browser.expect.element(newPostImageMoreLabel).to.be.visible
    browser
      .waitForElementClickable(newPostFittedImage)
      .click(newPostFittedImage)
    browser.expect.element(imageOverlayFirstImage).to.be.visible
    browser
      .waitForElementClickable(imageGalleryNextButton)
      .click(imageGalleryNextButton)
    browser.expect.element(imageOverlaySecondImage).to.be.visible
    browser
      .waitForElementClickable(imageGalleryPreviousButton)
      .click(imageGalleryPreviousButton)
    browser.expect.element(imageOverlayFirstImage).to.be.visible
    browser.click(imageGalleryClosebutton)

    browser.assert.urlEquals(`${browser.launchUrl}/pinboard`)

    // TODO: enhance background fetching of posts
    // which currently leads to duplicate indexes.
    browser
      .url(`${browser.launchUrl}/pinboard/`) // Fix for the aforementioned issue.
      .waitForElementClickable(newPostComment(false, false))

    /*
     * Post detail view.
     */
    browser.click(newPostComment()).waitForElementClickable(newPostAvatar(true))
    browser.assert.urlContains(`${browser.launchUrl}/pinboard/post/`)
    browser.expect.element(newPostAuthor(true)).to.be.visible
    browser.expect.element(newPostDate(true)).to.be.visible
    browser.expect.element(newPostActions(true)).to.be.visible
    browser.expect.element(newPostLike(true)).to.be.visible
    browser.expect.element(newPostComment(true)).to.be.visible
    browser.expect.element(detailContributionAvatar).to.be.visible
    // Add a comment and check it.
    browser
      .setValueAndWait(comment, commentUuid)
      .click(detailContributionSend)
      .waitForElementClickable(newComment)
      .getText(newComment, c => {
        browser.assert.ok(c.value === commentUuid)
      })
      .getText(comments, c => {
        browser.assert.ok(c.value.split(' ')[0] === '1')
      })
    browser.expect.element(newCommentAvatar).to.be.visible
    browser.expect.element(newCommentDate).to.be.visible
    browser.expect.element(newCommentUsername).to.be.visible
    // Like the post and go back to the feed to check it.
    browser
      .waitForElementClickable(newPostLike(true))
      .click(newPostLike(true))
      .waitForElementClickable(newPostLiked(true))
      .click(detailBack)
      .waitForElementClickable(contribution)
    browser.assert.urlEquals(`${browser.launchUrl}/pinboard`)
    browser
      .url(`${browser.launchUrl}/pinboard/`) // Fix for the aforementioned issue.
      .waitForElementClickable(newPostLikes(1))
    // Unlike it from the feed.
    browser
      .waitForElementClickable(newPostLiked())
      .click(newPostLiked())
      .url(`${browser.launchUrl}/pinboard/`)
      .waitForElementClickable(newPostActions())
    browser.expect.element(newPostLikes(1)).to.be.not.present

    /*
     * Edit post.
     */
    browser
      .waitForElementClickable(newPostActions())
      .click(newPostActions())
      .waitForElementClickable(newPostActionsEdit)
      .click(newPostActionsEdit)
      .waitForElementClickable(editContent)
      .click(editCancel)
      .waitForElementClickable(newPostActions())
      .click(newPostActions())
      .waitForElementClickable(newPostActionsEdit)
      .click(newPostActionsEdit)
      .waitForElementClickable(editContent)
      .clearValue(editContent)
      .setValueAndWait(editContent, editUuid)
      .waitForElementClickable(editSave)
      .click(editSave)
      .waitForElementClickable(newPostContent())
      .getText(newPostContent(), c => {
        browser.assert.ok(c.value === editUuid)
      })

    /*
     * Delete post.
     * Safari driver always dismiss alert box, so the post won't be deleted!
     */
    browser
      .waitForElementClickable(newPostActions())
      .click(newPostActions())
      .waitForElementClickable(newPostActionsDelete)
      .click(newPostActionsDelete)
      .click(alertDialogConfirm)
      .waitForElementNotPresent(newPostActions())

    browser.end()
  },

  'Check non existing user profile': browser => {
    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    browser
      .url(`${browser.launchUrl}/pinboard/profile/does-not-exist`)
      .waitForElementVisible('[data-e2e=user-error-page]')

    browser.end()
  },

  'Add comments to the post': browser => {
    const firstPostCommentButton = '[data-e2e=pinboard-new-post-new-0-comment]'
    const form = '[data-e2e=post-detail-form]'
    const formInput = '[data-e2e=pinboard-detail-contribution]'
    const nthComment = nth =>
      `[data-e2e=pinboard-detail-new-comment-text-${nth}]`
    const contribution = '[data-e2e=pinboard-contribution]'
    const detailContributionSend = '[data-e2e=detail-contribution-send]'
    const uuid = browser.globals.uuid()
    const contributionSend = '[data-e2e=pinboard-contribution-send]'
    const newPost = '[data-e2e=pinboard-new-post]'

    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    browser
      .waitForElementClickable(contribution)
      .setValueAndWait(contribution, uuid)
      .click(contributionSend)
      .waitForElementClickable(newPost)
      .click(firstPostCommentButton)
      .waitForElementClickable(form)

    browser.expect.element(nthComment(0)).to.not.be.present
    browser.perform((browser, done) => {
      for (let i = 0; i < 15; i++) {
        browser.setValue(formInput, i).click(detailContributionSend)
        browser.waitForElementClickable(nthComment(i))
      }
      done()
    })
    browser.end()
  },

  'Fetch comments page-wise': browser => {
    const firstPostCommentButton = '[data-e2e=pinboard-new-post-0-comment]'
    const nthComment = nth =>
      `[data-e2e=pinboard-detail-new-comment-text-${nth}]`
    const commentloader = '[data-e2e=commentloader]'

    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    browser
      .waitForElementClickable(firstPostCommentButton)
      .click(firstPostCommentButton)
      .waitForElementClickable(nthComment(3))
      .waitForElementClickable(commentloader)
      .click(commentloader)
      .waitForElementClickable(nthComment(13))
      .waitForElementClickable(commentloader)
      .click(commentloader)
      .waitForElementClickable(nthComment(14))
      .waitForElementNotPresent(commentloader)

    browser.end()
  },

  'report post': browser => {
    const optionsButtonTripleDots = '[data-e2e=pinboard-new-post-0-actions]'
    const openReportOverlayButton =
      '[data-e2e=pinboard-new-post-0-actions-report]'
    const reportPostButton = '[data-e2e=pinboard-edit-0-report]'
    const postReportedSuccessText =
      '[data-e2e=pinboard-edit-0-post-reported-successfully]'
    const cancelButton = '[data-e2e=pinboard-edit-0-cancel]'

    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    browser.page.onboarding().skipOnboarding()

    browser
      .waitForElementClickable(optionsButtonTripleDots)
      .click(optionsButtonTripleDots)
      .waitForElementClickable(openReportOverlayButton)
      .click(openReportOverlayButton)
      .waitForElementClickable(reportPostButton)
      .click(reportPostButton)
      .waitForElementClickable(postReportedSuccessText)
      .waitForElementClickable(cancelButton)
      .click(cancelButton)

    browser.end()
  },

  'report post from details view': browser => {
    const commentButton = '[data-e2e=pinboard-new-post-1-comment]'
    const optionsButtonTripleDots =
      '[data-e2e=pinboard-new-post-detail-actions]'
    const openReportOverlayButton =
      '[data-e2e=pinboard-detail-new-post-detail-actions-report]'
    const reportPostButton = '[data-e2e=pinboard-edit-detail-report]'
    const postAlreadyReportedText =
      '[data-e2e=pinboard-edit-detail-post-reported-successfully]'
    const cancelButton = '[data-e2e=pinboard-edit-detail-cancel]'

    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    browser.page.onboarding().skipOnboarding()

    browser
      .waitForElementClickable(commentButton)
      .click(commentButton)
      .waitForElementClickable(optionsButtonTripleDots)
      .click(optionsButtonTripleDots)
      .waitForElementClickable(openReportOverlayButton)
      .click(openReportOverlayButton)
      .waitForElementClickable(reportPostButton)
      .click(reportPostButton)
      .waitForElementClickable(postAlreadyReportedText)
      .waitForElementClickable(cancelButton)
      .click(cancelButton)

    browser.end()
  },

  'report comment': browser => {
    const commentButton = '[data-e2e=pinboard-new-post-2-comment]'
    const optionsButtonTripleDots = '[data-e2e=pinboard-new-post-0-actions]'
    const openReportOverlayButton =
      '[data-e2e=pinboard-new-post-0-actions-report]'
    const reportPostButton = '[data-e2e=pinboard-edit-0-report]'
    const postReportedSuccessText =
      '[data-e2e=pinboard-edit-0-post-reported-successfully]'
    const cancelButton = '[data-e2e=pinboard-edit-0-cancel]'

    browser.page
      .signup()
      .navigate()
      .signupRandomUser()
    browser.page.onboarding().skipOnboarding()

    browser
      .waitForElementClickable(commentButton)
      .click(commentButton)
      .waitForElementClickable(optionsButtonTripleDots)
      .click(optionsButtonTripleDots)
      .waitForElementClickable(openReportOverlayButton)
      .click(openReportOverlayButton)
      .waitForElementClickable(reportPostButton)
      .click(reportPostButton)
      .waitForElementClickable(postReportedSuccessText)
      .waitForElementClickable(cancelButton)
      .click(cancelButton)

    browser.end()
  },

  'mute user': browser => {
    const optionsButtonTripleDots = '[data-e2e=pinboard-new-post-0-actions]'
    const muteAction = '[data-e2e=pinboard-new-post-0-actions-mute]'
    const successBubble = '[data-e2e=notification-bubble]'
    const contribution = '[data-e2e=pinboard-contribution]'
    const contributionSend = '[data-e2e=pinboard-contribution-send]'
    const newPost = '[data-e2e=pinboard-new-post]'
    const uuid = browser.globals.uuid()

    browser.page
      .login()
      .navigate()
      .login(browser.globals.user.email, browser.globals.user.password)

    browser
      .waitForElementClickable(contribution)
      .setValueAndWait(contribution, uuid)
      .click(contributionSend)
      .waitForElementClickable(newPost)

    browser.page
      .logout()
      .navigate()
      .logout()

    browser.page
      .login()
      .navigate()
      .login(browser.globals.user2.email, browser.globals.user2.password)

    browser
      .waitForElementVisible(optionsButtonTripleDots)
      .click(optionsButtonTripleDots)
      .waitForElementVisible(muteAction)
      .click(muteAction)
      .waitForElementVisible(successBubble)

    browser.end()
  },
}
