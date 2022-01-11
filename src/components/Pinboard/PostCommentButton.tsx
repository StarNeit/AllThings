import { css } from 'glamor'
import { Icon, ResourceProvider, Text, View } from '@allthings/elements'
import React from 'react'
import PostButton from 'components/FlexButton'

const styles = {
  icon: css({
    paddingRight: 7,
    paddingTop: 3,
  }),
}

interface IProps {
  index: number
  isNew: boolean
  onClick?: OnClick
  text: string
}

export default function PostCommentButton({
  index,
  isNew,
  text,
  ...restProps
}: IProps) {
  const indexOrDetail = typeof index === 'undefined' ? 'detail' : index

  return (
    <ResourceProvider>
      <PostButton {...restProps}>
        <View
          alignH="center"
          flex="flex"
          alignV="center"
          direction="row"
          data-e2e={`pinboard-new-post${
            isNew && indexOrDetail !== 'detail' ? '-new' : ''
          }-${indexOrDetail}-comment`}
        >
          <Icon size="s" color="#7e8c8d" name="comment" {...styles.icon} />
          <Text size="s" strong color="#626262">
            {text}
          </Text>
        </View>
      </PostButton>
    </ResourceProvider>
  )
}
