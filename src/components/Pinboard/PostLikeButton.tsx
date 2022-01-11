import React from 'react'
import { css } from 'glamor'
import { View, Icon, ResourceProvider, Text } from '@allthings/elements'
import PostButton from 'components/FlexButton'

const styles = {
  icon: css({
    paddingRight: 7,
    paddingTop: 2,
  }),
}

interface IProps {
  index: number
  isNew?: boolean
  liked: boolean
  location?: string
  onClick: OnClick
  text: string
}

export default function PostLikeButton({
  index,
  isNew = false,
  liked,
  location,
  onClick,
  text,
}: IProps) {
  const indexOrDetail = typeof index === 'undefined' ? 'detail' : index
  const locationIsDetail = location === '-detail' ? '-detail' : ''

  return (
    <ResourceProvider>
      <PostButton onClick={onClick}>
        <View alignH="center" alignV="center" direction="row">
          {liked ? (
            <Icon
              name="heart-filled"
              data-e2e={`pinboard${locationIsDetail}-new-post${
                isNew && indexOrDetail !== 'detail' ? '-new' : ''
              }-${indexOrDetail}-liked`}
              size="s"
              color="#d30000"
              {...css(styles.icon)}
            />
          ) : (
            <Icon
              name="heart"
              data-e2e={`pinboard${locationIsDetail}-new-post${
                isNew && indexOrDetail !== 'detail' ? '-new' : ''
              }-${indexOrDetail}-like`}
              size="s"
              color="#7e8c8d"
              {...styles.icon}
            />
          )}
          <Text size="s" strong color="#626262">
            {text}
          </Text>
        </View>
      </PostButton>
    </ResourceProvider>
  )
}
