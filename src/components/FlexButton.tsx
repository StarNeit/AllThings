import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import NoOp from 'utils/noop'

const style = css({
  ':hover': {
    cursor: 'pointer',
  },
})

interface IProps {
  children: React.ReactNode
  onClick?: OnClick
}

export default function FlexButton({
  children,
  onClick = NoOp,
  ...props
}: IProps) {
  return (
    <View
      alignH="center"
      alignV="center"
      direction="row"
      flex="flex"
      onClick={onClick}
      {...style}
      {...props}
    >
      {children}
    </View>
  )
}
