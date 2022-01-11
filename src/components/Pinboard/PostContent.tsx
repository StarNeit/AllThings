import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'

const style = css({
  // for Firefox: maxWidth needed, or else PostAuthor flex
  // does not behave correctly. Relates to APP-2877
  maxWidth: '100vw',
  padding: 15,
  position: 'relative',
})

interface IProps {
  children: React.ReactNode
  onClick?: OnClick
}

export default function PostContent({ children, onClick }: IProps) {
  return (
    <View {...style} onClick={onClick}>
      {children}
    </View>
  )
}
