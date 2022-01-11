import React from 'react'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { Text, View } from '@allthings/elements'
import { colorCode } from '@allthings/elements/utils/propTypes/color'

const item = (color: string) =>
  css({
    cursor: 'pointer',
    padding: '15px 20px',
    ':hover': {
      backgroundColor: color,
    },
  })

interface IProps {
  active?: boolean
  children: object | string
  // @TODO: should use https://github.com/allthings/elements/blob/master/src/propTypes/color.js#L4-L10
  // but the current implementation is useless... till we get it in TS.
  color: string
  onClick: OnClick
  textColor: string
}

const NavigationTextItem = ({
  active,
  children,
  color = 'transparent',
  onClick,
  textColor,
  ...props
}: IProps) => (
  <View
    {...item(alpha(ColorPalette.black, 0.05))}
    alignV="center"
    direction="row"
    onClick={onClick}
    {...props}
  >
    <Text color={colorCode(active ? color : textColor)} size="s">
      {children}
    </Text>
  </View>
)

export default NavigationTextItem
