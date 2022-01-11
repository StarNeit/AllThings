import React, { PropsWithChildren } from 'react'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import {
  Post,
  PostFooter,
  PostGreetingHeader,
  PostGreetingContent,
  PostLikeButton,
  PostSpacer,
} from 'components/Pinboard'
import { View, Text } from '@allthings/elements'
import { css } from 'glamor'
import LikeImage from './LikeImage'
import { ILike as LikeProps } from './LikeImage'

const messages = defineMessages({
  greetUserButton: {
    id: 'pinboard.greetingpost.welcome-button',
    description: 'A button saying welcome the onboarded user',
    defaultMessage: 'Welcome {username}',
  },
  othersLikeLabel: {
    id: 'pinboard.plus-x-others',
    description: 'Text if more than 4 people like a post',
    defaultMessage: '+ {otherLikes, plural, one {1 other} other {# others} }',
  },
  sendingWelcome: {
    id: 'pinboard.sending-welcome',
    description: 'Text shown when users like welcome posts',
    defaultMessage:
      '{totalLikes, plural, one {is} other {are} } sending a friendly welcome',
  },
})

const styles = {
  childrenContainer: css({
    marginBottom: '20px',
    marginTop: '20px',
  }),
}

interface IProps {
  'data-e2e'?: string
  disableSocialMedia?: boolean
  goToLikedUserList?: (id: string) => void
  id?: string
  imageUrl: string
  index?: number
  isLiked?: boolean
  likeCount?: number
  likeList?: ReadonlyArray<LikeProps>
  onDislike?: (id: string) => void
  onLike?: (id: string) => void
  onProfileImageClick?: (id: string) => void
  userId?: string
  username: string
  viewerId?: string
  viewerProfileImage?: string
}

class GreetingPost extends React.Component<
  PropsWithChildren<IProps & InjectedIntlProps>
> {
  handleLikeButton = () => {
    const { id, isLiked, onDislike, onLike } = this.props
    isLiked ? onDislike(id) : onLike(id)
  }

  handleGoToLikedUsers = () => this.props.goToLikedUserList(this.props.id)

  onProfileImageClick = () => this.props.onProfileImageClick(this.props.userId)

  translateOthersText = (likes: number) =>
    this.props.intl.formatMessage(messages.othersLikeLabel, {
      otherLikes: likes,
    })

  translateWelcomeText = (likes: number) =>
    this.props.intl.formatMessage(messages.sendingWelcome, {
      totalLikes: likes,
    })

  render() {
    const {
      children,
      disableSocialMedia,
      imageUrl,
      index,
      intl: { formatMessage },
      isLiked,
      likeCount,
      likeList,
      onDislike,
      onLike,
      onProfileImageClick,
      username,
      viewerProfileImage,
      viewerId,
    } = this.props
    const likedUsers =
      likeList &&
      likeList.map(({ id, _embedded: { profileImage } }) => ({
        id,
        profileImage: profileImage ? profileImage.files.thumb.url : undefined,
      }))

    return (
      <View data-e2e={this.props['data-e2e']}>
        <Post>
          <PostGreetingHeader
            image={imageUrl}
            onProfileImageClick={
              onProfileImageClick && this.onProfileImageClick
            }
          />
          <PostGreetingContent>
            <View direction="row" alignV="center" alignH="center">
              <Text size="l">
                <FormattedMessage
                  id="pinboard.greetingpost.generic-welcome-2-comma"
                  description="Generic welcome to new onboarders (part 2)"
                  defaultMessage="{username} is new in the neighbourhood, "
                  values={{ username }}
                />
              </Text>
            </View>
            <View {...styles.childrenContainer}>{children}</View>
            <View direction="row" alignH="center" alignV="center">
              {likeCount > 0 && !disableSocialMedia && (
                <LikeImage
                  index={index}
                  likedByUser={isLiked}
                  likedUsers={likedUsers}
                  likes={likeCount}
                  onClick={this.handleGoToLikedUsers}
                  othersLikeText={this.translateOthersText}
                  viewerProfileImage={viewerProfileImage}
                  viewerId={viewerId}
                  welcomeText={this.translateWelcomeText}
                />
              )}
            </View>
          </PostGreetingContent>
          {onLike && onDislike && (
            <PostFooter>
              <PostLikeButton
                onClick={this.handleLikeButton}
                index={index}
                liked={isLiked}
                text={formatMessage(messages.greetUserButton, { username })}
              />
            </PostFooter>
          )}
        </Post>
        <PostSpacer />
      </View>
    )
  }
}

export default injectIntl(GreetingPost, { forwardRef: true })
