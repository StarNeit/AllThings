import React, { PropsWithChildren } from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { View } from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'

const content = css({
  alignSelf: 'center',
  borderRadius: '2px',
  backgroundColor: ColorPalette.whiteIntense,
  marginBottom: '20px',
  maxWidth: '280px',
  padding: '12px',
  width: '100%',
  boxShadow: '0px 0px 14px 0px rgba(0,0,0,0.1)',
  [createMQ('tablet', 'desktop')]: {
    maxWidth: '350px',
  },
})

interface IProps {
  style?: object
}

const Box = ({ children, ...props }: PropsWithChildren<IProps>) => (
  <View {...css(content)} {...props}>
    {children}
  </View>
)

export default Box
