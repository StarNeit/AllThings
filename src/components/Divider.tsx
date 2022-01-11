import React from 'react'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { View, Text } from '@allthings/elements'

interface IProps {
  color?: string
  text?: {
    backgroundColor: string
    value: string
  }
}

const Divider = ({
  color = alpha(ColorPalette.lightGreyIntense, 0.6),
  text,
}: IProps) => (
  <div>
    <hr
      {...css({
        background: color,
        border: 0,
        height: '1px',
        margin: '16px 2px',
      })}
    />
    <View
      direction="row"
      alignH="center"
      alignV="center"
      {...css(text ? { marginTop: '-28px', paddingBottom: '8px' } : {})}
    >
      {text && (
        <Text
          {...css({ padding: '0 8px', backgroundColor: text.backgroundColor })}
        >
          {text.value}
        </Text>
      )}
    </View>
  </div>
)

export default Divider
