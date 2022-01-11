import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'

const style = css({
  width: '100%',
  background: 'white',
  boxShadow: '2px 2px 2px rgba(230, 230, 230, 0.5)',
})

interface IProps {
  children: React.ReactNode
  containerStyle: object
}

export default function PostCard({
  children,
  containerStyle,
  ...props
}: IProps) {
  return (
    <View {...css(style, containerStyle)} {...props}>
      {children}
    </View>
  )
}
