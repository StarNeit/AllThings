import React from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { View } from '@allthings/elements'
import { IViewProps } from '@allthings/elements/View'

interface IProps {
  onClick?: OnClick
}

const ErrorMessage = (props: IProps & IViewProps) => (
  <View
    {...css({
      borderRadius: 2,
      padding: 10,
      background: ColorPalette.redIntense,
      color: 'white',
      textAlign: 'center',
      cursor: props.onClick ? 'pointer' : 'default',
    })}
    {...props}
  />
)

export default ErrorMessage
