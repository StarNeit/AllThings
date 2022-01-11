import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'

interface IProps {
  height?: number
  background?: string
}

export default function PostSpacer({ height = 10, background }: IProps) {
  return <View {...css({ width: '100%', height, background })} />
}
