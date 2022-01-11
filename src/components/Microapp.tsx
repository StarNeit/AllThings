import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'

const microapp = css({
  // Firefox/Edge need this otherwise title/app bars are not fixed at top/bottom
  minHeight: 0,
  backgroundColor: ColorPalette.background.bright,
})

interface IProps {
  children: React.ReactNodeArray | React.ReactElement<any>
  style?: object
}

const Microapp = ({ children, ...restProps }: IProps) => (
  <View direction="column" flex="flex" {...microapp} {...restProps}>
    {children}
  </View>
)

export default Microapp
