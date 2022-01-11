import React, { Fragment } from 'react'
import { css } from 'glamor'
import { View, Icon, ResourceProvider, Text } from '@allthings/elements'
import LikeImage from './LikeImage'
import { ITheme } from '@allthings/elements/ThemeProvider'

const style = {
  cursor: css({
    ':hover': {
      cursor: 'pointer',
    },
  }),
  separator: css({
    borderLeft: '1px solid #efefef',
    marginLeft: 10,
    paddingLeft: 10,
  }),
}

interface ILike {
  id: string
  profileImage: string
}

interface IProps {
  attachments: number
  attachmentsText: (attachments: number) => string
  comments: number
  commentText: (comments: number) => string
  disableSocialMedia: boolean
  goToLikedUserList: () => void
  index: number
  likedByUser: boolean
  likedUsers: ReadonlyArray<ILike>
  likes: number
  likeText?: () => void
  onAttachmentsClick: () => void
  onCommentsClick: () => void
  othersLikeText: (likes: number) => void
  theme?: ITheme
  viewerId: string
  viewerProfileImage: string
}

export default function PostInfo({
  index,
  likeText,
  commentText,
  attachmentsText,
  likes,
  goToLikedUserList,
  comments,
  attachments,
  onAttachmentsClick,
  onCommentsClick,
  disableSocialMedia,
  likedByUser,
  likedUsers,
  othersLikeText,
  viewerId,
  viewerProfileImage,
  ...props
}: IProps) {
  return (
    <View
      direction="row"
      alignH="space-between"
      {...css(
        { padding: 0, marginTop: -5 },
        (likes > 0 || comments > 0 || attachments > 0) && { marginTop: 25 },
      )}
      {...props}
    >
      <ResourceProvider>
        <View direction="row" alignV="center">
          {likes > 0 && !disableSocialMedia && (
            <Fragment>
              <Icon size={15} color="#d30000" name="heart-filled" />
              <LikeImage
                data-e2e={`pinboard-new-post-${index}-likes-${likes}`}
                index={index}
                likedByUser={likedByUser}
                likedUsers={likedUsers}
                likes={likes}
                onClick={goToLikedUserList}
                othersLikeText={othersLikeText}
                viewerProfileImage={viewerProfileImage}
                viewerId={viewerId}
              />
            </Fragment>
          )}
          {comments > 0 && !disableSocialMedia && (
            <View
              direction="row"
              {...(likes > 0 ? style.separator : {})}
              {...style.cursor}
              onClick={onCommentsClick}
            >
              <Icon size={15} color="#7e8c8d" name="comment" />
              <Text size="xs" color="#626262" style={{ paddingLeft: 4 }}>
                {comments}
              </Text>
            </View>
          )}
          {attachments > 0 && (
            <View
              direction="row"
              {...(likes > 0 || comments > 0 ? style.separator : {})}
              {...style.cursor}
              onClick={onAttachmentsClick}
            >
              <Icon size={15} color="#7e8c8d" name="paperclip" />
              <Text size="xs" color="#626262" style={{ paddingLeft: 4 }}>
                {attachments}
              </Text>
            </View>
          )}
        </View>
      </ResourceProvider>
    </View>
  )
}
