import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'

const style = css({
  width: '100%',
  borderTop: '1px solid #e7ecee',
  '> *': {
    padding: '10px 13px',
    textAlign: 'center',
  },
  '> :not(:last-child)': {
    borderRight: '1px solid #e7ecee',
  },
})

interface IProps {
  children: React.ReactNode
}

export default function PostFooter({ children }: IProps) {
  return (
    <View direction="row" alignV="center" alignH="space-around" {...style}>
      {children}
    </View>
  )
}
