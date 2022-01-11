import { ColorPalette } from '@allthings/colors'
import {
  confirm as confirmWithUser,
  Pill,
  Text,
  View,
} from '@allthings/elements'
import { sendSuccess } from '@allthings/elements/NotificationBubbleManager'
import { ITheme } from '@allthings/elements/ThemeProvider'
import { localizeDate } from 'components/DateString'
import ImageGalleryOverlay from 'components/ImageGalleryOverlay'
import InfiniteLoadingBar from 'components/InfiniteLoadingBar'
import Overlay from 'components/Overlay'
import { css } from 'glamor'
import find from 'lodash-es/find'
import get from 'lodash-es/get'
import React from 'react'
import { Gateway } from 'react-gateway'
import { defineMessages, injectIntl, MessageDescriptor } from 'react-intl'
import { connect } from 'react-redux'
import { dateFromISO8601 } from 'utils/date'
import getUserOrganizationName from 'utils/getUserOrganizationName'
import NoOp from 'utils/noop'
import onlyImages from 'utils/onlyImages'
import sendNativeEvent from 'utils/sendNativeEvent'
import { withTheme } from 'utils/withTheme'
import {
  Post,
  PostAuthor,
  PostCommentButton,
  PostContent,
  PostEditor,
  PostFooter,
  PostImageAttachments,
  PostInfo,
  PostLikeButton,
  PostOverlayMenu,
  PostReporter,
  PostSpacer,
  PostText,
} from './'
import getNativeName, { Language } from './Language'

const i18n = defineMessages({
  cancelButtonLabel: {
    id: 'pinboard.confirm-cancel-button',
    description: 'Cancel button label for "are sure you want to delete post?"',
    defaultMessage: 'Cancel',
  },
  acceptButtonLabel: {
    id: 'pinboard.accept-cancel-button',
    description: 'Accept button label for "are sure you want to delete post?"',
    defaultMessage: 'Yes',
  },
  othersLikeLabel: {
    id: 'pinboard.plus-x-others',
    description: 'Text if more than 4 people like a post',
    defaultMessage: '+ {otherLikes, plural, one {1 other} other {# others} }',
  },
  commentsLabel: {
    id: 'pinboard.comments-label',
    description: 'Shows how many comments a post has',
    defaultMessage: '{comments, plural, one {1 Comment} other {# Comments}}',
  },
  attachmentsLabel: {
    id: 'pinboard.attachments-label',
    description: 'Shows how many attachments a post has',
    defaultMessage:
      '{attachments, plural, one {1 Attachment} other {# Attachments}}',
  },
  likeButtonLabel: {
    id: 'pinboard-post-actions.like',
    description: 'Label of the like button.',
    defaultMessage: 'Like',
  },
  commentButtonLabel: {
    id: 'pinboard-post-actions.comment',
    description: 'Label of the comment button',
    defaultMessage: 'Comments',
  },
  notPublishedYet: {
    id: 'pinboard-post.not-published',
    description: 'Info text, when a post is not published yet.',
    defaultMessage: 'Not published yet',
  },
  moreImages: {
    id: 'pinboard-post.more-images',
    description: 'Info text, for more available images',
    defaultMessage:
      '{images, plural, one {one image more} other {# more images}}',
  },
  deletePost: {
    id: 'pinboard-post.delete',
    description: 'Text for button that deletes a post',
    defaultMessage: 'Delete',
  },
  deletePostConfirm: {
    id: 'pinboard-post.delete-confirmation',
    description: 'Confirmation question if user tries to delete a post',
    defaultMessage: 'Are you sure you like to delete the post?',
  },
  changePost: {
    id: 'pinboard-post.change',
    description: 'Text for button that edits a post',
    defaultMessage: 'Edit',
  },
  confirmCancelEdit: {
    id: 'pinboard-post.confirm-cancel-edit',
    description: 'Question that is asked, if s.o. cancels the post edit',
    defaultMessage: 'Discard unsaved changes?',
  },
  reportPost: {
    id: 'pinboard-post.report',
    description: 'Text for button that reports a post',
    defaultMessage: 'Report',
  },
  muteUser: {
    id: 'pinboard-post.mute-user',
    description: 'Text for button that will allow to mute a user',
    defaultMessage: 'Mute {name}',
  },
  userMuted: {
    id: 'pinboard-post.mute-user-success',
    description: 'Success bubble when a user is muted',
    defaultMessage: 'Muted {name}',
  },
  userMutedFailed: {
    id: 'pinboard-post.mute-user-failed',
    description: 'Error message when user could not be muted',
    defaultMessage: 'Could not mute {name}',
  },
  importantMessagePill: {
    id: 'pinboard-post.important-post',
    description: 'Message indicating that the post is marked as important',
    defaultMessage: 'Important message',
  },
})

const loadingContainerStyle = css({
  background: '#fff',
  width: '100%',
  height: 200,
  border: '1px solid rgba(0,0,0,.1)',
})

type Files = ReadonlyArray<IFile>

interface ILike {
  id: string
}

interface IEmbedded {
  likes: ReadonlyArray<ILike>
  files: Files
  user: IAPIUser
}

interface IMeta {
  likedByUser: boolean
}

interface ITranslation {
  content: string
  locale: string
}

interface IProps {
  _embedded: IEmbedded
  _meta: IMeta
  'data-e2e': string
  accessToken: string
  availableLanguages: ReadonlyArray<string>
  category: string
  color: string
  commentCount: number
  currentLanguage: string
  defaultLocale: string
  disableSocialMedia: boolean
  embeddedLayout: boolean
  files: Files
  goToLikedUserList: (id: string) => void
  handleReport: (id: string, reason: string) => void
  id: string
  index: number
  isUploadingFiles: boolean
  isHtmlPost: boolean
  likeCount: number
  location: string
  onAttachmentsClick: (id: string) => void
  onChange: (id: string, text: string) => void
  onCommentButton: OnClick
  onMuteUser: (viewerId: string, userId: string, id: string) => ApiResponse
  onDateClick: (id: string) => void
  onDelete: (id: string) => void
  onDislike: (id: string) => void
  onLike: (id: string) => void
  onUserClick: (id: string) => void
  postId: string
  published: boolean
  publishedFrom: string
  reportPostStatus: string
  setCurrentLanguage: (id: string, locale: string) => void
  translations: ReadonlyArray<ITranslation>
  viewerId: string
  viewerLocale: string
  viewerProfileImage: string
  theme: ITheme
}

interface IState {
  editMode: boolean
  languageMode: boolean
  reportMode: boolean
  showImageGallery: boolean
  showMenu: boolean
}

class FeedPost extends React.PureComponent<IProps & InjectedIntlProps, IState> {
  static defaultProps = {
    onAttachmentsClick: NoOp,
    onCommentButton: NoOp,
    onCommentsClick: NoOp,
    onDateClick: NoOp,
    onDislike: NoOp,
    onLike: NoOp,
  }

  state = {
    editMode: false,
    languageMode: false,
    reportMode: false,
    showImageGallery: false,
    showMenu: false,
  }

  closePostMenu = () =>
    this.setState({ editMode: false, showMenu: false, reportMode: false })

  formatMessage = (message: MessageDescriptor, options = {}) =>
    this.props.intl.formatMessage(message, options)

  getDefaultContent = () =>
    find(this.props.translations, {
      locale: this.props.defaultLocale,
    }).content

  getImages = () =>
    this.props._embedded.files
      .filter(onlyImages)
      .map(file => get(file, 'files.big') || get(file, 'files.medium'))

  handleImageClick = (images: NonEmptyImageArray) => {
    if (!this.props.embeddedLayout) {
      this.setState(() => ({ showImageGallery: true }))
    } else {
      sendNativeEvent(this.props.accessToken, {
        name: 'open-image-gallery',
        data: images,
      })
    }
  }

  handleImageGalleryClose = () =>
    this.setState(() => ({ showImageGallery: false }))

  handleChange = (text: string) => {
    this.setState({ editMode: false })
    this.props.onChange(this.props.id, text)
  }

  handleLikeButton = () =>
    this.props._meta.likedByUser
      ? this.props.onDislike(this.props.id)
      : this.props.onLike(this.props.id)

  handleEditMode = () =>
    this.setState({ editMode: true, showMenu: false, reportMode: false })

  handleReportMode = () =>
    this.setState({ editMode: false, showMenu: false, reportMode: true })

  handleLanguageMode = () =>
    this.setState({ showMenu: true, languageMode: true })

  handleDelete = async () => {
    this.setState(() => ({ showMenu: false }))

    const customization = {
      acceptButtonLabel: this.formatMessage(i18n.acceptButtonLabel),
      cancelButtonLabel: this.formatMessage(i18n.cancelButtonLabel),
      message: this.formatMessage(i18n.deletePostConfirm),
    }
    const userIsCertain = await confirmWithUser(customization)

    if (userIsCertain) {
      this.props.onDelete(this.props.id)
    }
  }

  handleUserClick = () =>
    !this.props._embedded.user.deleted &&
    this.props.onUserClick(this.props._embedded.user.id)

  handleCommentsClick = () => this.props.onCommentButton(this.props.id)

  handleDateClick = () => this.props.onDateClick(this.props.id)

  handleLikedUserList = () => this.props.goToLikedUserList(this.props.id)

  handleMuteUser = async () => {
    this.toggleMenu()
    const res = await this.props.onMuteUser(
      this.props.viewerId,
      this.props._embedded.user.id,
      this.props.id,
    )

    if (res.status.code > 199 && res.status.code < 300) {
      sendSuccess(
        this.formatMessage(i18n.userMuted, {
          name: this.props._embedded.user.username,
        }),
      )
    } else {
      sendSuccess(
        this.formatMessage(i18n.userMutedFailed, {
          name: this.props._embedded.user.username,
        }),
      )
    }
  }

  handleAttachmentsClick = () => this.props.onAttachmentsClick(this.props.id)

  switchToLanguage = (currentLanguage: string) =>
    this.props.setCurrentLanguage(this.props.id, currentLanguage)

  toggleMenu = () =>
    this.setState(({ showMenu }) => ({
      languageMode: false,
      showMenu: !showMenu,
    }))

  translateMoreImageText = (images: number) =>
    this.formatMessage(i18n.moreImages, { images })

  translateCommentsText = (comments: number) =>
    this.formatMessage(i18n.commentsLabel, { comments })

  translateAttachmentsText = (attachments: number) =>
    this.formatMessage(i18n.attachmentsLabel, { attachments })

  translateOthersText = (likes: number) =>
    this.formatMessage(i18n.othersLikeLabel, { otherLikes: likes })

  renderOwnPostMenuContent = () => {
    const { index, location = '' } = this.props

    return (
      <PostOverlayMenu onRequestClose={this.toggleMenu}>
        <Text
          size="m"
          key="edit"
          color={ColorPalette.text.secondary}
          onClick={this.handleEditMode}
          data-e2e={`pinboard${location}-new-post-${index}-actions-edit`}
        >
          {this.formatMessage(i18n.changePost)}
        </Text>
        <Text
          size="m"
          key="delete"
          color={ColorPalette.redIntense}
          onClick={this.handleDelete}
          data-e2e={`pinboard${location}-new-post-${index}-actions-delete`}
        >
          {this.formatMessage(i18n.deletePost)}
        </Text>
      </PostOverlayMenu>
    )
  }

  renderOthersPostMenuContent = () => {
    const { _embedded, index, location = '' } = this.props
    const id = typeof index === 'undefined' ? 'detail' : index
    const { username, type } = _embedded.user
    const adminPost = type === 'customer'

    return (
      <PostOverlayMenu onRequestClose={this.toggleMenu}>
        <Text
          size="m"
          key="report"
          color={ColorPalette.text.primary}
          onClick={this.handleReportMode}
          data-e2e={`pinboard${location}-new-post-${id}-actions-report`}
        >
          {this.formatMessage(i18n.reportPost)}
        </Text>
        {!adminPost && (
          <Text
            size="m"
            key="mute"
            color={ColorPalette.text.primary}
            onClick={this.handleMuteUser}
            data-e2e={`pinboard${location}-new-post-${id}-actions-mute`}
          >
            {this.formatMessage(i18n.muteUser, {
              name: username,
            })}
          </Text>
        )}
      </PostOverlayMenu>
    )
  }

  renderMenu = () => {
    const {
      _embedded: {
        user: { id },
      },
      viewerId,
    } = this.props
    const { showMenu, languageMode } = this.state

    if (!showMenu) {
      return null
    }

    if (languageMode) {
      return this.renderLanguageMenuContent()
    } else {
      return viewerId === id
        ? this.renderOwnPostMenuContent()
        : this.renderOthersPostMenuContent()
    }
  }

  getCurrentLanguage = () => {
    if (this.props.currentLanguage) {
      return this.props.currentLanguage
    } else {
      return find(this.props.translations, {
        locale: this.props.viewerLocale,
      })
        ? this.props.viewerLocale
        : this.props.defaultLocale
    }
  }

  renderEditor = (index: number) => (
    <PostEditor
      confirmText={this.formatMessage(i18n.confirmCancelEdit)}
      index={index}
      initialText={this.getDefaultContent()}
      onRequestClose={this.closePostMenu}
      onSave={this.handleChange}
    />
  )

  handleSwitchToLanguage = (value: string) => {
    this.switchToLanguage(value)
    this.toggleMenu()
  }

  renderLanguageMenuContent = () => {
    const { availableLanguages, index } = this.props

    return (
      <PostOverlayMenu onRequestClose={this.toggleMenu}>
        {availableLanguages.map(l => (
          <Language
            index={index}
            key={l}
            onClick={this.handleSwitchToLanguage}
            isActive={l === this.getCurrentLanguage()}
            locale={l}
          />
        ))}
      </PostOverlayMenu>
    )
  }

  renderReporter = (index: number, postId: string) => (
    <Gateway into="root">
      <Overlay
        direction="row"
        alignH="center"
        alignV="center"
        theme={this.props.theme}
        {...css({ padding: 10 })}
      >
        <PostReporter
          index={index}
          onRequestClose={this.closePostMenu}
          onReport={this.props.handleReport}
          reportPostStatus={this.props.reportPostStatus}
          postId={postId}
        />
      </Overlay>
    </Gateway>
  )

  renderText = (index: number) => {
    // For the detail view!
    const normalizedIndex = typeof index === 'undefined' ? 0 : index
    const initiallyCollapsed = typeof index !== 'undefined' // don't collapse on detail view
    const { category, isHtmlPost, location = '', translations } = this.props
    const translation = find(translations, {
      locale: this.getCurrentLanguage(),
    })

    return (
      <div {...css({ clear: 'both' })}>
        {category === 'admin-messages' && (
          <Pill
            label={this.formatMessage(i18n.importantMessagePill)}
            {...css({ float: 'right', margin: '0 0 10px 10px' })}
          />
        )}
        <PostText
          autoBreak={!isHtmlPost}
          data-e2e={`pinboard${location}-new-post-${normalizedIndex}-content`}
          disableHyperlinks={isHtmlPost}
          initiallyCollapsed={initiallyCollapsed}
        >
          {translation ? translation.content : this.getDefaultContent()}
        </PostText>
      </div>
    )
  }

  render() {
    const {
      _embedded,
      _meta: { likedByUser },
      availableLanguages,
      color,
      commentCount,
      disableSocialMedia,
      index,
      likeCount,
      postId,
      published,
      publishedFrom,
      viewerProfileImage,
      viewerId,
    } = this.props
    const { editMode, reportMode, showImageGallery } = this.state
    const publishedFromDate = dateFromISO8601(publishedFrom)
    const profileImage = get(
      _embedded,
      'user._embedded.profileImage._embedded.files.thumb.url',
    )
    const images = this.getImages() as NonEmptyImageArray
    const organization = getUserOrganizationName(_embedded?.user)
    const highlight = organization && { color, text: organization }
    const highlightColor = organization && color
    const e2e = this.props['data-e2e']
    const isNew = e2e !== ''
    const currentLanguage = this.getCurrentLanguage()
    const likedUsers = _embedded.likes.map(like => ({
      id: like.id,
      profileImage: get(
        like,
        '_embedded.profileImage._embedded.files.thumb.url',
      ),
    }))

    return (
      <View data-e2e={e2e}>
        <Post highlightColor={highlightColor}>
          <PostContent>
            <PostAuthor
              author={{
                name: _embedded.user.username,
                deleted: _embedded.user.deleted,
                profileImage,
              }}
              availableLanguages={availableLanguages}
              currentLanguage={currentLanguage}
              currentLanguageIntl={getNativeName(currentLanguage)}
              dateText={
                published
                  ? localizeDate(publishedFromDate, this.props.intl)
                  : this.formatMessage(i18n.notPublishedYet)
              }
              highlight={highlight}
              index={index}
              onAuthorClick={this.handleUserClick}
              onClickMore={this.toggleMenu}
              onDateClick={this.handleDateClick}
              onLanguageClick={this.handleLanguageMode}
              renderMenu={this.renderMenu}
              showMoreIcon
            />
            {editMode || reportMode
              ? editMode
                ? this.renderEditor(index)
                : this.renderReporter(index, postId)
              : this.renderText(index)}
            {showImageGallery && (
              <ImageGalleryOverlay
                onClose={this.handleImageGalleryClose}
                images={this.props._embedded.files.filter(onlyImages)}
              />
            )}
            {images.length > 0 && (
              <PostImageAttachments
                e2e={e2e}
                moreImagesText={this.translateMoreImageText}
                images={images}
                onClick={() => this.handleImageClick(images)}
              />
            )}
            <PostInfo
              attachments={_embedded.files.length - images.length}
              othersLikeText={this.translateOthersText}
              attachmentsText={this.translateAttachmentsText}
              comments={commentCount}
              commentText={this.translateCommentsText}
              disableSocialMedia={disableSocialMedia}
              likedUsers={likedUsers}
              likedByUser={likedByUser}
              likes={likeCount}
              viewerProfileImage={viewerProfileImage}
              viewerId={viewerId}
              index={index}
              goToLikedUserList={this.handleLikedUserList}
              onAttachmentsClick={this.handleAttachmentsClick}
              onCommentsClick={this.handleCommentsClick}
              theme={this.props.theme}
            />
            {this.props.isUploadingFiles && (
              <View
                direction="row"
                alignH="center"
                alignV="center"
                {...loadingContainerStyle}
              >
                <InfiniteLoadingBar
                  loaderColor={color}
                  backgroundColor="#e7ecee"
                />
              </View>
            )}
          </PostContent>
          {!disableSocialMedia && (
            <PostFooter>
              <PostLikeButton
                onClick={this.handleLikeButton}
                index={this.props.index}
                isNew={isNew}
                liked={likedByUser}
                location={this.props.location}
                text={this.formatMessage(i18n.likeButtonLabel)}
              />
              <PostCommentButton
                index={index}
                isNew={isNew}
                onClick={this.handleCommentsClick}
                text={this.formatMessage(i18n.commentButtonLabel)}
              />
            </PostFooter>
          )}
        </Post>
        <PostSpacer />
      </View>
    )
  }
}

export default connect(({ app, authentication }: IReduxState) => ({
  accessToken: authentication.accessToken,
  embeddedLayout: app.embeddedLayout,
}))(withTheme()(injectIntl(FeedPost, { forwardRef: true })))
