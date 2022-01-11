import React from 'react'
import { css } from 'glamor'
import { View, Text } from '@allthings/elements'
import NoOp from 'utils/noop'

const style = css({
  borderRadius: 30,
  background: '#fff',
  width: '60%',
  padding: 12,
  ':hover': {
    cursor: 'pointer',
  },
})

interface IProps {
  onClick?: OnClick
  count: number
  text: (count: number) => string
}

export default function ShowNewPostsButton({
  text,
  count,
  onClick = NoOp,
}: IProps) {
  return (
    <View
      onClick={onClick}
      direction="row"
      alignH="center"
      alignV="center"
      {...style}
    >
      <Text strong size="s" color="#626262">
        {text(count)}
      </Text>
    </View>
  )
}
