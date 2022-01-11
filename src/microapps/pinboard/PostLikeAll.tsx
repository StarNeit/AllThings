import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import PagedDataProvider from 'containers/PagedDataProvider'
import {
  Button,
  GroupedCardList,
  ListSpinner,
  SimpleLayout,
  View,
} from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import get from 'lodash-es/get'
import UserListItem from 'components/WhoIsWho/UserListItem'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { defineMessages, injectIntl } from 'react-intl'
import sendNativeEvent from 'utils/sendNativeEvent'
import find from 'lodash-es/find'

const LIMIT_TO_LOAD_LIKERS = 10
import { RouteComponentProps } from 'react-router'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const i18n = defineMessages({
  likeLabel: {
    id: 'pinboard.like-others-label',
    description: 'Text to show how many likes a post has',
    defaultMessage:
      '{likes, plural, one {One person likes} other {# persons like}} this',
  },
  personalLikeLabel: {
    id: 'pinboard.like-personal-label',
    description: 'Text if viewer has liked a post',
    defaultMessage:
      'You {likes, plural, =0 {like} one {and 1 other likes} other {and # others like} } this',
  },
  loadMoreLikesButtonLabel: {
    id: 'pinboard.load-more-likes-label',
    description: 'Text displayed on Button',
    defaultMessage: 'Load More',
  },
})

interface ILike {
  deleted: boolean
  id: string
  profileImage?: string
  username: string
  _embedded: { profileImage?: string }
}

type Props = ReturnType<typeof mapStateToProps>

type RouterProps = RouteComponentProps<{ id: string; postId: string }>

class PostLikeAll extends Component<
  Props &
    ReturnType<typeof mapDispatchToProps> &
    InjectedIntlProps &
    RouterProps
> {
  handleUserClick = (id: string) => {
    const { embeddedLayout, authentication } = this.props
    if (embeddedLayout && id === authentication.user.id) {
      sendNativeEvent(authentication.accessToken, {
        name: 'tab-change',
        data: 'my-profile',
      })
    } else {
      this.props.onClickUser(id)
    }
  }

  createUserListItem = ({
    deleted,
    id: userId,
    profileImage,
    username,
    _embedded: { profileImage: embeddedProfileImage },
  }: ILike) => (
    <UserListItem
      deleted={deleted}
      id={userId}
      key={userId}
      name={username}
      onClick={this.handleUserClick}
      profileImage={
        profileImage
          ? get(embeddedProfileImage, '_embedded.files.medium.url')
          : null
      }
    />
  )

  renderProfiles = (pages: ReadonlyArray<ReadonlyArray<ILike>>) => {
    const {
      _meta: { likedByUser },
      likeCount,
    } = this.props.post
    const userList = pages.map(page =>
      page.map(user => this.createUserListItem(user)),
    )
    const likeText = likedByUser ? i18n.personalLikeLabel : i18n.likeLabel

    return (
      <GroupedCardList
        title={this.props.intl.formatMessage(likeText, {
          likes: likeCount - (likedByUser ? 1 : 0),
        })}
      >
        {userList}
      </GroupedCardList>
    )
  }
  renderLoading = () => (
    <SimpleLayout padded backgroundColor={ColorPalette.background.light}>
      <View direction="row" alignH="center">
        <ListSpinner />
      </View>
    </SimpleLayout>
  )

  render() {
    const {
      url: currentEndpoint,
      params: { id: postId },
    } = this.props.match
    const currentUrl = currentEndpoint.split('/')
    const postIdAfterPinboard = currentUrl[2] === postId
    const previousUrl = currentUrl
      .slice()
      .splice(0, currentUrl.length - (postIdAfterPinboard ? 2 : 1))

    return (
      <HorizontalRouterMicroapp>
        <GenericBackTitleBar
          onBack={() => this.props.goBack(previousUrl.join('/'))}
          data-e2e="pinboard-detail-back"
        />
        <PagedDataProvider
          path={`/api/v1/community-articles/${postId}/likes`}
          params={{ limit: LIMIT_TO_LOAD_LIKERS }}
        >
          {({ loading, pages, fetchNext, hasNextPage }) => (
            <SimpleLayout onScrollEnd={fetchNext}>
              {this.props.post && this.renderProfiles(pages)}
              {!loading && this.props.post && hasNextPage && (
                <Button onClick={fetchNext}>
                  {this.props.intl.formatMessage(i18n.loadMoreLikesButtonLabel)}
                </Button>
              )}
              {loading && <ListSpinner />}
            </SimpleLayout>
          )}
        </PagedDataProvider>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = (
  { app, authentication, pinboard }: IReduxState,
  props: RouterProps,
) => ({
  authentication,
  embeddedLayout: app.embeddedLayout,
  profileIsPublic: authentication.user.publicProfile,
  post: find(pinboard.posts, { id: props.match.params.id }),
  posts: pinboard.posts,
})

const mapDispatchToProps = (
  dispatch: FunctionalDispatch,
  props: RouterProps,
) => ({
  onClickUser: (uid: string) => dispatch(push(`${props.match.url}/${uid}`)),
  goBack: (previousURL: string) => dispatch(push(previousURL)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(PostLikeAll))
