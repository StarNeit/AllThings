import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'
import CustomLogo from 'components/CustomLogo'

interface IProps {
  color: string
  customLogoUrl: string
  iconColor: string
}

const CustomLogoButton = ({ color, customLogoUrl, iconColor }: IProps) => (
  <View
    alignH="center"
    alignV="center"
    direction="row"
    {...css({
      backgroundColor: color,
      borderRadius: 2,
      height: 50,
      width: 50,
      [createMQ('mobile')]: {
        height: 40,
        width: 40,
      },
    })}
  >
    <CustomLogo color={iconColor} url={customLogoUrl} />
  </View>
)

export default CustomLogoButton
