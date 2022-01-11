import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PinboardActions from 'store/actions/pinboard'
import { defineMessages, injectIntl } from 'react-intl'
import { push } from 'connected-react-router'
import FlipMoveIEWrapper from 'components/FlipMoveIEWrapper'
import get from 'lodash-es/get'
import { AppTitle } from 'containers/App'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { View, SimpleLayout, Spinner, Text } from '@allthings/elements'
import {
  CommentLoaderButton,
  FeedPost,
  Post,
  PostAttachment,
  PostCommentForm,
  PostSpacer,
} from 'components/Pinboard'
import PostComment from './PostComment'
import { localizeDate } from 'components/DateString'
import { dateFromISO8601 } from 'utils/date'
import sendNativeEvent from 'utils/sendNativeEvent'
import { COMMENT_FOLD_TRAILING_COUNT } from 'microapps/pinboard/global'
import Link from 'components/Link'
import { RouteComponentProps } from 'react-router'
import { IComment, IPostTranslation } from '.'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const messages = defineMessages({
  commentButtonLabel: {
    id: 'pinboard-post-detail.comment-button-label',
    description:
      'The label of the comment button of the detail view of pinboard.',
    defaultMessage: 'Send',
  },
  commentsTitle: {
    id: 'pinboard-post-detail.comments-title',
    description:
      'The title of the comments section in the detail view of posts',
    defaultMessage:
      '{comments, plural, =0 {Write a comment!} one {1 Comment} other {# Comments} }',
  },
  attachmentsTitle: {
    id: 'pinboard-post-detail.attachments-title',
    description:
      'The title of the attachments section in the detail view of posts',
    defaultMessage:
      '{attachments, plural, one {1 Attachment} other {# Attachments} }',
  },
  loadComments: {
    id: 'pinboard-post-detail.load-other-comments',
    description:
      'The label of the button that loads more comments from the API',
    defaultMessage:
      '{comments, plural, one {Show one more comment} other {Show more comments (# remaining)}}',
  },
})

const animations: FlipMoveAnimations = {
  commentsAppear: {
    from: { opacity: '0', transform: 'translateX(-100%)' },
    to: { opacity: '1', transform: 'translateX(0%)' },
  },
  commentsLeave: 'fade',
}

function notImage(file: IFile) {
  return file.type.indexOf('image') === -1
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & { pending: boolean }

type RouterProps = RouteComponentProps<{ id: string }>

class PostDetail extends PureComponent<
  Props & InjectedIntlProps & RouterProps
> {
  elFormo: HTMLFormElement = null

  input: HTMLInputElement = null

  componentDidMount() {
    this.props.onOpenPost(this.props.match.params.id)
  }

  componentDidUpdate(prevProps: Props & RouterProps) {
    const comments = this.props.comments[this.props.match.params.id] || false
    if (!(comments && comments.pending) && prevProps.pending && this.elFormo) {
      const el: any = ReactDOM.findDOMNode(this.elFormo)
      el && el.scrollIntoView(false)
    }

    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.onOpenPost(this.props.match.params.id)
    }
  }

  getAttachmentUrls = () =>
    this.props.posts[this.props.match.params.id]._embedded.files.filter(
      notImage,
    )

  setInput = (input: HTMLInputElement) => {
    this.input = input
  }

  handleCommentButton = () => {
    this.input.focus()
    this.input.scrollIntoView()
  }

  handleCommentSend = (comment: string) =>
    comment.trim() &&
    this.props.onCommentSend(this.props.match.params.id, comment)

  handleElFormo = (el: HTMLFormElement) => (this.elFormo = el)

  handleProfileFromDetail = (uid: string) => {
    const { embeddedLayout, accessToken, user } = this.props
    if (embeddedLayout && uid === user.id) {
      sendNativeEvent(accessToken, {
        name: 'tab-change',
        data: 'my-profile',
      })
    } else {
      this.props.goToProfileFromDetail(this.props.match.params.id, uid)
    }
  }

  renderPost = () => {
    const { app, comments, pinboard, posts, user } = this.props
    const postId = this.props.match.params.id
    const totalComment = comments[postId] ? comments[postId].total : 0
    const post = posts[postId]
    const availableLanguages = post.translations.map(
      (t: IPostTranslation) => t.locale,
    )
    const isUploadingFiles = pinboard.uploadingFilesPosts.indexOf(postId) > -1
    const viewerProfileImage =
      user.profileImage && user.profileImage.files.thumb.url

    return (
      <FeedPost
        availableLanguages={availableLanguages}
        color={app.color}
        currentLanguage={post.defaultLocale}
        defaultLocale={post.defaultLocale}
        goToLikedUserList={this.props.goToLikedUserList}
        handleReport={this.props.reportPost}
        intl={this.props.intl}
        isUploading={isUploadingFiles}
        key={post.id}
        location="-detail"
        onChange={this.props.handleChange}
        onCommentButton={this.handleCommentButton}
        onCommentsClick={this.handleCommentButton}
        onMuteUser={this.props.onMuteUser as any}
        onDelete={this.props.onDelete}
        onDislike={this.props.onDislike}
        onLike={this.props.onLike}
        onUserClick={this.handleProfileFromDetail}
        postId={post.id}
        reportPostStatus={this.props.reportPostStatuses[post.id]}
        setCurrentLanguage={this.props.setCurrentLanguage}
        viewerId={user.id}
        viewerLocale={user.locale}
        viewerProfileImage={viewerProfileImage}
        {...(post as any)}
        /* commentCount should come after spreading `post`, to always have the live count */
        commentCount={totalComment}
      />
    )
  }

  renderComment = (comment: IComment, index: number) => {
    const { intl, reportComment, user, pinboard } = this.props
    const { id, content, createdAt, _embedded } = comment
    return (
      <PostComment
        key={id}
        text={content}
        date={localizeDate(dateFromISO8601(createdAt), intl)}
        onAuthorClick={this.handleProfileFromDetail}
        user={_embedded.user}
        index={index}
        viewerId={user.id}
        reportCommentStatus={pinboard.reportCommentStatuses[id]}
        handleReport={reportComment as any}
        commentId={id}
      />
    )
  }

  renderComments = (comments: PagedData<IComment>) => {
    const { items, total } = comments
    const post = this.props.posts[this.props.match.params.id]
    if (comments) {
      const commentComponents = items.map(this.renderComment)
      if (items.length > 1 && total > items.length) {
        // Insert a comment loader if not all comments are displayed yet
        commentComponents.splice(
          COMMENT_FOLD_TRAILING_COUNT,
          0,
          <CommentLoaderButton
            key={`fetchmorecomments-${post.id}`}
            postId={post.id}
            onClick={this.props.fetchMoreComments}
            data-e2e="commentloader"
          >
            {this.props.intl.formatMessage(messages.loadComments, {
              comments: total - items.length,
            })}
          </CommentLoaderButton>,
        )
      }
      return commentComponents
    }
    return null
  }

  renderAttachment = ({
    id,
    originalFilename,
    files: {
      original: { url: fileUrl },
    },
  }: IFile) => (
    <Link
      to={fileUrl}
      key={originalFilename}
      name={originalFilename}
      setLastLocation
      target="_blank"
    >
      <Post key={id}>
        <PostAttachment name={originalFilename} url={fileUrl} />
        <PostSpacer background="#e7ecee" height={1} />
      </Post>
    </Link>
  )

  renderAttachments = () => {
    const attachments = this.getAttachmentUrls()

    return attachments.length === 0 ? null : (
      <View>
        <Text
          size="l"
          strong
          color="rgba(98, 98, 98, .4)"
          style={{ marginLeft: 15 }}
        >
          {this.props.intl.formatMessage(messages.attachmentsTitle, {
            attachments: attachments.length,
          })}
        </Text>
        <PostSpacer />
        {attachments.map(this.renderAttachment)}
        <PostSpacer />
      </View>
    )
  }

  render() {
    const {
      app,
      comments: allPostsComments,
      posts,
      user,
      goToPinboard,
    } = this.props
    const postId = this.props.match.params.id
    const post = posts[postId]
    const comments = allPostsComments[postId] || (false as any)
    const totalCommentCount = comments.total

    return (
      <HorizontalRouterMicroapp>
        <AppTitle>{app.label}</AppTitle>
        <GenericBackTitleBar onBack={goToPinboard} />
        {post ? (
          <SimpleLayout padded="horizontal">
            {this.renderPost()}
            {this.renderAttachments()}
            {!post.disableSocialMedia &&
              (comments ? (
                <React.Fragment>
                  <Text
                    size="l"
                    strong
                    color="rgba(98, 98, 98, .4)"
                    style={{ marginLeft: 15 }}
                    data-e2e={`pinboard-detail-comments`}
                  >
                    {this.props.intl.formatMessage(messages.commentsTitle, {
                      comments: totalCommentCount,
                    })}
                  </Text>
                  <PostSpacer />
                  <FlipMoveIEWrapper
                    duration={350}
                    enterAnimation={animations.commentsAppear}
                    leaveAnimation={animations.commentsLeave}
                  >
                    {this.renderComments(comments)}
                  </FlipMoveIEWrapper>
                  <PostSpacer />
                  <PostCommentForm
                    ref={this.handleElFormo as any}
                    data-e2e="post-detail-form"
                    onCommentSend={this.handleCommentSend}
                    onInput={this.setInput}
                    profileImage={get(user, 'profileImage.files.thumb.url')}
                    sending={comments.pending}
                    goToOwnProfile={this.handleProfileFromDetail}
                    user={user}
                  />
                </React.Fragment>
              ) : (
                <View style={{ marginTop: '20px', textAlign: 'center' }}>
                  <Spinner />
                </View>
              ))}
          </SimpleLayout>
        ) : (
          <SimpleLayout />
        )}
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = ({ app, authentication, pinboard }: IReduxState) => ({
  accessToken: authentication.accessToken,
  app: app.microApps.find(micro => micro.type === 'community-articles'),
  comments: pinboard.comments,
  embeddedLayout: app.embeddedLayout,
  pinboard,
  posts: pinboard.posts,
  reportPostStatuses: pinboard.reportPostStatuses,
  user: authentication.user,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  fetchMoreComments: (_: unknown, postId: string) =>
    dispatch(PinboardActions.fetchMoreComments(postId)),
  handleChange: (id: string, content: string) =>
    dispatch(PinboardActions.changePostText(id, content)),
  handleUserClick: (id: string) => dispatch(push(`/pinboard/profile/${id}`)),
  goToPinboard: () => dispatch(push('/pinboard')),
  goToProfileFromDetail: (id: string, uid: string) =>
    dispatch(push(`/pinboard/post/${id}/profile/${uid}`)),
  goToLikedUserList: (id: string) =>
    dispatch(push(`/pinboard/post/${id}/likes`)),
  goToOwnProfile: (id: string) => dispatch(push(`/pinboard/profile/${id}`)),
  onCommentSend: (postId: string, comment: string) =>
    dispatch(PinboardActions.addComment(postId, comment)),
  onDelete: (id: string) => {
    dispatch(push(`/pinboard`))
    dispatch(PinboardActions.deletePost(id))
  },
  onDislike: (id: string) => dispatch(PinboardActions.unlikePost(id)),
  onLike: (id: string) => dispatch(PinboardActions.likePost(id)),
  onMuteUser: (userId: string, mutedUserId: string, postId: string) =>
    dispatch(PinboardActions.muteUser(userId, mutedUserId, postId)),
  onOpenPost: (id: string) => dispatch(PinboardActions.showPostDetail(id)),
  reportComment: (commentId: string, reason: string) =>
    dispatch(PinboardActions.reportComment(commentId, reason)),
  reportPost: (postId: string, reason: string) =>
    dispatch(PinboardActions.reportPost(postId, reason)),
  setCurrentLanguage: (id: string, language: string) =>
    dispatch(PinboardActions.setPostCurrentLanguage(id, language)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(PostDetail))
