import React from 'react'
import { ColorPalette } from '@allthings/colors'
import { ListItem, ProfileImage, Text, View } from '@allthings/elements'
import { css } from 'glamor'

interface IProps {
  additional: string
  image: string
  onClick: OnClick
  text: string
}

const InviteSomeoneListItem = ({
  text,
  image,
  additional,
  onClick,
}: IProps) => (
  <ListItem {...css({ padding: 14 })} onClick={onClick}>
    <ProfileImage image={image} size="m" />
    <View direction="column" alignH="center" {...css({ marginLeft: 14 })}>
      <Text strong color={ColorPalette.text.secondary}>
        {text}
      </Text>
      <Text size="s" color={ColorPalette.text.secondary}>
        {additional}
      </Text>
    </View>
  </ListItem>
)

export default InviteSomeoneListItem
