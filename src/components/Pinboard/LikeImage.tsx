import React, { Component } from 'react'
import { View, ProfileImage, Text } from '@allthings/elements'
import { css } from 'glamor'

const maxProfileDisplay = 4

const imageStyle = (index: number) =>
  css({
    border: '1px solid #fff',
    borderRadius: '50%',
    position: 'relative',
    marginLeft: '-6px',
    height: '20px',
    width: '20px',
    zIndex: maxProfileDisplay - index,
  })

export interface ILike {
  _embedded?: {
    profileImage: {
      files: {
        thumb: { url: string }
      }
    }
  }
  id: string
  profileImage: string
}

interface IProps {
  index: number
  likedByUser: boolean
  likedUsers: ReadonlyArray<ILike>
  likes: number
  onClick: OnClick
  othersLikeText: (others: number) => void
  viewerProfileImage: string
  viewerId: string
  welcomeText?: (likes: number) => void
}

export default class LikeImage extends Component<IProps> {
  displayImages = (
    images: ReadonlyArray<{
      readonly id: string
      readonly profileImage: string
    }>,
  ) =>
    images.map(({ id, profileImage }, index) => (
      <ProfileImage
        {...imageStyle(index)}
        key={id}
        image={profileImage}
        size="xs"
      />
    ))

  render() {
    const {
      index,
      likedByUser,
      likedUsers = [],
      likes,
      onClick,
      othersLikeText,
      viewerProfileImage,
      viewerId,
      welcomeText,
    } = this.props
    const likedList = likedUsers.slice()
    const findUser = likedUsers.findIndex(user => user.id === viewerId)
    const userExists = findUser === 0 || (findUser && findUser > -1) || false

    // if viewer didn't/did like the post, but is/isn't included in likedUsers array
    likedByUser !== userExists
      ? // if viewer likes the post, but is not in likedUsers array yet, push viewer to array
        likedByUser && !userExists
        ? likedList.push({
            id: viewerId,
            profileImage: viewerProfileImage,
          })
        : // else if viewer hasn't liked post, but is in likedUsers array, remove from array
        !likedByUser && userExists
        ? likedList.splice(findUser, 1)
        : likedList
      : // else, if likedByUser === userExists
        likedList
    const likedUserPics = likedList
      .slice(0, maxProfileDisplay)
      .map(({ id, profileImage }) => ({
        id,
        profileImage,
      }))
    const numberOfOthers = likes - maxProfileDisplay
    const textSize = welcomeText ? 's' : 'xs'

    return (
      <View
        alignV="center"
        direction="row"
        data-e2e={`pinboard-new-post-${index}-likes-${likes}`}
        onClick={onClick}
        {...css({ cursor: 'pointer', marginLeft: '12px', zIndex: 1 })}
      >
        {this.displayImages(likedUserPics)}
        <Text size={textSize} color="#626262" style={{ paddingLeft: 4 }}>
          {numberOfOthers > 0 && othersLikeText(numberOfOthers)}
          {// in grave accents to add a space between the 2 strings
          welcomeText && ` ${welcomeText(likes)}`}
        </Text>
      </View>
    )
  }
}
