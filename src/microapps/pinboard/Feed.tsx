import { ColorPalette } from '@allthings/colors'
import {
  ListSpinner,
  SimpleLayout,
  Text,
  View,
  Inset,
} from '@allthings/elements'
import FlipMoveIEWrapper from 'components/FlipMoveIEWrapper'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import {
  FeedForm,
  FeedPost,
  GreetingPost,
  PostSpacer,
  ShowNewPostsButton,
} from 'components/Pinboard'
import { push } from 'connected-react-router'
import { AppTitle } from 'containers/App'
import { css } from 'glamor'
import get from 'lodash-es/get'
import React, { Fragment, PureComponent } from 'react'
import { FileWithPreview } from 'utils/filePreviews'
import { defineMessages, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import PinboardActions from 'store/actions/pinboard'
import { isIE11 } from 'utils/guessBrowser'
import sendNativeEvent from 'utils/sendNativeEvent'
import { getUsername } from 'utils/username'
import { withTheme } from 'utils/withTheme'
import { IPost } from '.'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from 'enums'

const i18n = defineMessages({
  showMorePosts: {
    id: 'feed.show-more-posts',
    description: 'Text if new posts are ready to get displayed',
    defaultMessage:
      '{posts, plural, one {Show 1 new post} other {Show # new posts} }',
  },
})

const animations: FlipMoveAnimations = {
  commentsAppear: {
    from: { opacity: '0', transform: 'translateX(-100%)' },
  },
  commentsLeave: 'fade',
  postsAppear: 'fade',
  postsLeave: 'fade',
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  MicroAppProps & { theme: ITheme }

class Feed extends PureComponent<
  Props & DispatchProp & InjectedIntlProps & RouteComponentProps
> {
  containerRef = React.createRef<HTMLDivElement>()
  intervalId: number = null

  messageFieldRef: HTMLDivElement = null

  componentDidMount() {
    const { backgroundRefreshFeed, openFeed, posts } = this.props
    !posts.length && openFeed()
    this.intervalId = window.setInterval(() => backgroundRefreshFeed(), 10000)
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId)
  }

  handleScrollEnd = () =>
    this.props.posts.length > 0 && this.props.onScrollEnd()

  handleGoToOwnProfile = (id: string) => {
    const { embeddedLayout, accessToken } = this.props
    if (embeddedLayout) {
      sendNativeEvent(accessToken, {
        name: 'tab-change',
        data: 'my-profile',
      })
    } else {
      this.props.goToOwnProfile(id)
    }
  }

  handleGoToUserProfile = (id: string) => {
    if (id === this.props.viewer.id) {
      this.handleGoToOwnProfile(id)
    } else {
      this.props.goToUserProfile(id)
    }
  }

  setMessageFieldRef = (ref: HTMLDivElement) => {
    this.messageFieldRef = ref
  }

  renderPosts = (posts: ReadonlyArray<IPost>, isNew = false) =>
    posts.map((post, index) => {
      const availableLanguages = post.translations.map(t => t.locale)
      const {
        config,
        goToLikedUserList,
        handleChange,
        onDelete,
        onDislike,
        onLike,
        onMuteUser,
        reportPost,
        setCurrentLanguage,
        showDetailPage,
        theme,
        uploadingFilesPosts,
        viewer,
        welcomeMessagesDisabled,
      } = this.props
      const viewerProfileImage =
        (viewer.profileImage && viewer.profileImage.files.thumb.url) ||
        undefined

      return (
        <View key={post.id}>
          {post.category === 'welcome-message' && !welcomeMessagesDisabled ? (
            <GreetingPost
              data-e2e={isNew ? 'pinboard-new-post' : ''}
              goToLikedUserList={goToLikedUserList}
              id={post.id}
              imageUrl={get(
                post,
                '_embedded.user._embedded.profileImage.files.medium.url',
              )}
              isLiked={post._meta.likedByUser}
              key={post.id}
              likeCount={post.likeCount}
              likeList={post._embedded.likes}
              onDislike={onDislike}
              onLike={onLike}
              onProfileImageClick={this.handleGoToUserProfile}
              userId={post._embedded.user.id}
              username={getUsername(
                get(post, '_embedded.user'),
                this.props.intl.formatMessage,
              )}
              viewerId={viewer.id}
              viewerProfileImage={viewerProfileImage}
            >
              <Text
                italic
                color={ColorPalette.text.secondary}
                size="s"
                autoBreak
                data-e2e={isNew ? 'pinboard-new-post-text' : ''}
              >
                {post.content}
              </Text>
            </GreetingPost>
          ) : post.disableSocialMedia ? (
            <FeedPost
              app={config}
              availableLanguages={availableLanguages}
              color={theme.primary}
              currentLanguage={post.currentLanguage}
              defaultLocale={post.defaultLocale}
              goToLikedUserList={goToLikedUserList}
              handleReport={reportPost}
              index={index}
              key={post.id}
              onAttachmentsClick={showDetailPage}
              onChange={handleChange}
              onDateClick={showDetailPage}
              onDelete={onDelete}
              onMuteUser={onMuteUser as any}
              onUserClick={this.handleGoToUserProfile}
              postId={post.id}
              reportPostStatus={get(
                this,
                `props.reportPostStatuses[${post.id}]`,
              )}
              setCurrentLanguage={setCurrentLanguage}
              viewerId={viewer.id}
              viewerLocale={viewer.locale}
              viewerProfileImage={viewerProfileImage}
              {...(post as any)}
            />
          ) : (
            <FeedPost
              app={config}
              availableLanguages={availableLanguages}
              color={theme.primary}
              currentLanguage={post.currentLanguage}
              data-e2e={isNew ? 'pinboard-new-post' : ''}
              defaultLocale={post.defaultLocale}
              goToLikedUserList={goToLikedUserList}
              handleReport={reportPost}
              index={index}
              isUploadingFiles={uploadingFilesPosts.indexOf(post.id) > -1}
              key={post.id}
              onAttachmentsClick={showDetailPage}
              onChange={handleChange}
              onMuteUser={onMuteUser as any}
              onCommentButton={showDetailPage}
              onCommentsClick={showDetailPage}
              onDateClick={showDetailPage}
              onDelete={onDelete}
              onDislike={onDislike}
              onLike={onLike}
              onUserClick={this.handleGoToUserProfile}
              postId={post.id}
              reportPostStatus={get(
                this,
                `props.reportPostStatuses[${post.id}]`,
              )}
              setCurrentLanguage={setCurrentLanguage}
              viewerId={viewer.id}
              viewerLocale={viewer.locale}
              viewerProfileImage={viewerProfileImage}
              {...(post as any)}
            />
          )}
        </View>
      )
    })

  renderPendingPosts = () =>
    this.props.pendingPosts && (
      <FlipMoveIEWrapper
        duration={350}
        enterAnimation={animations.commentsAppear}
        leaveAnimation={animations.commentsLeave}
        style={{ zIndex: 3 }}
      >
        {this.renderPosts(this.props.pendingPosts, true)}
      </FlipMoveIEWrapper>
    )
  renderFeed = () =>
    this.props.posts && (
      <FlipMoveIEWrapper
        duration={350}
        appearAnimation={animations.postsAppear}
        enterAnimation={animations.postsAppear}
        leaveAnimation={animations.postsLeave}
      >
        {this.renderPosts(this.props.posts)}
      </FlipMoveIEWrapper>
    )

  focusCreatePost = () => {
    this.messageFieldRef && this.messageFieldRef.focus()
    this.containerRef.current.scrollTop = 0
  }

  getPostTranslation = (count: number) =>
    this.props.intl.formatMessage(i18n.showMorePosts, { posts: count })

  renderUpcomingPostsButton = () =>
    this.props.upcomingPosts.length > 0 && (
      <View direction="column" alignV="center">
        <ShowNewPostsButton
          onClick={this.props.onClickMorePosts}
          count={this.props.upcomingPosts.length}
          text={this.getPostTranslation}
        />
        <PostSpacer />
      </View>
    )

  renderContent = () => {
    const {
      app,
      isSendingPost,
      location,
      morePostsAvailable,
      onSendPost,
      viewer,
      visibilityScopes,
    } = this.props

    return (
      <Fragment>
        <AppTitle>{app.label}</AppTitle>
        <SimpleLayout
          onScrollEnd={this.handleScrollEnd}
          ref={this.containerRef}
          padded="horizontal"
        >
          <MicroappBigTitleBar type={MicroApps.PINBOARD} />
          <Inset vertical={true} />
          <FeedForm
            {...css({ marginTop: 10 })}
            goToOwnProfile={this.handleGoToOwnProfile}
            key={location.key}
            autoFocus={this.props.location.hash === '#create'}
            onSend={onSendPost}
            isSending={isSendingPost}
            visibilityScopes={visibilityScopes}
            profileImage={get(viewer, 'profileImage.files.thumb.url')}
            user={viewer}
            onRef={this.setMessageFieldRef}
          />
          <PostSpacer />
          <FlipMoveIEWrapper
            duration={250}
            appearAnimation="fade"
            enterAnimation="fade"
            leaveAnimation="fade"
          >
            {this.renderUpcomingPostsButton()}
          </FlipMoveIEWrapper>
          {this.renderPendingPosts()}
          {this.renderFeed()}
          {morePostsAvailable && <ListSpinner />}
        </SimpleLayout>
      </Fragment>
    )
  }

  isIE11 = isIE11(this.props.userAgent)

  render() {
    const viewStyle = css({
      minHeight: 0,
      height: '100%',
      flex: 'auto',
    })

    return (
      <HorizontalRouterMicroapp>
        {this.isIE11 ? (
          <View {...viewStyle}>{this.renderContent()}</View>
        ) : (
          this.renderContent()
        )}
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = ({ app, authentication, pinboard }: IReduxState) => ({
  accessToken: authentication.accessToken,
  app: app.microApps.find(micro => micro.type === 'community-articles'),
  config: app.config,
  embeddedLayout: app.embeddedLayout,
  isSendingPost: pinboard.isSendingPost,
  morePostsAvailable: pinboard.morePostsAvailable,
  pendingPosts: pinboard.pendingPosts.map(
    (postId: string) => pinboard.posts[postId],
  ),
  posts: pinboard.feed.map((post: string) => pinboard.posts[post]),
  reportPostStatuses: pinboard.reportPostStatuses,
  upcomingPosts: pinboard.upcomingPosts.map(
    (postId: string) => pinboard.posts[postId],
  ),
  uploadingFilesPosts: pinboard.uploadingFilesPosts,
  userAgent: app.userAgent,
  visibilityScopes: pinboard.visibilityScopes,
  viewer: authentication.user,
  welcomeMessagesDisabled: app.config.welcomeMessagesDisabled,
})

const mapDispatchToProps = (
  dispatch: FunctionalDispatch,
  props: RouteComponentProps<{ category: string }>,
) => ({
  backgroundRefreshFeed: () =>
    dispatch(PinboardActions.backgroundRefreshFeed()),
  goToLikedUserList: (id: string) => dispatch(push(`/pinboard/${id}/likes`)),
  goToOwnProfile: (id: string) => dispatch(push(`/pinboard/profile/${id}`)),
  goToUserProfile: (id: string) => dispatch(push(`/pinboard/profile/${id}`)),
  handleChange: (id: string, content: string) =>
    dispatch(PinboardActions.changePostText(id, content)),
  onScrollEnd: () => dispatch(PinboardActions.requestMorePosts()),
  onAssetClick: (id: string) =>
    dispatch(push(`/pinboard/assets/${props.match.params.category}/${id}`)),
  onBackButtonClick: () => dispatch(push('/pinboard')),
  onClickMorePosts: () =>
    dispatch(PinboardActions.pressShowUpcomingButton() as any),
  onDelete: (id: string) => dispatch(PinboardActions.deletePost(id) as any),
  onDislike: (id: string) => dispatch(PinboardActions.unlikePost(id) as any),
  onLike: (id: string) => dispatch(PinboardActions.likePost(id) as any),
  onMuteUser: (userId: string, mutedUserId: string, postId: string) =>
    dispatch(PinboardActions.muteUser(userId, mutedUserId, postId)),
  onSendPost: (
    post: string,
    images: readonly FileWithPreview[],
    channels: string[],
  ) => dispatch(PinboardActions.createPost(post, images, channels)),
  openFeed: () => dispatch(PinboardActions.openFeed()),
  reportPost: (postId: string, reason: string) =>
    dispatch(PinboardActions.reportPost(postId, reason)),
  setCurrentLanguage: (id: string, language: string) =>
    dispatch(PinboardActions.setPostCurrentLanguage(id, language)),
  showDetailPage: (id: string) => dispatch(push(`/pinboard/post/${id}`)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTheme()(injectIntl(Feed)))
