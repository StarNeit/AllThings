import React from 'react'
import { css } from 'glamor'
import { View, ProfileImage } from '@allthings/elements'

const styles = {
  wrapper: css({
    marginTop: 25,
    transform: 'translateY(-50%)',
  }),
  image: css({
    borderRadius: '50%',
    background: '#fff',
    border: '5px solid #fff',
  }),
}

interface IProps {
  image: string
  onProfileImageClick?: OnClick
}

export default function PostGreetingHeader({
  image,
  onProfileImageClick,
}: IProps) {
  return (
    <View alignH="center" direction="row" {...styles.wrapper}>
      <View {...styles.image}>
        <ProfileImage size="m" image={image} onClick={onProfileImageClick} />
      </View>
    </View>
  )
}
