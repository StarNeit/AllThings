import React from 'react'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { View, ListItem, ProfileImage, Text } from '@allthings/elements'
import Username from '../User/Username'

interface IProps {
  additional?: string
  deleted: boolean
  id: string
  name: string
  onClick: (id: string, name?: string) => void
  profileImage: string
}

class UserListItem extends React.Component<IProps> {
  handleClick = () => {
    const { deleted, id, name, onClick } = this.props
    !deleted && onClick(id, name)
  }

  render() {
    const { additional, deleted, name, profileImage } = this.props

    return (
      <ListItem
        data-e2e={this.props['data-e2e']}
        onClick={this.handleClick}
        {...css({ padding: 14 })}
      >
        <ProfileImage image={profileImage} size="m" />
        <View direction="column" alignH="center" {...css({ marginLeft: 14 })}>
          <Text strong color={ColorPalette.text.secondary}>
            <Username username={name} deleted={deleted} />
          </Text>
          <Text size="s" color={ColorPalette.text.secondary}>
            {additional}
          </Text>
        </View>
      </ListItem>
    )
  }
}

export default UserListItem
