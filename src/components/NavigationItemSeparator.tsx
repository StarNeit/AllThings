import React from 'react'
import { css } from 'glamor'
import { alpha } from '@allthings/colors'

import { Line, View } from '@allthings/elements'
import { useTheme } from '@allthings/elements/Theme/Theme'

const item = css({
  padding: '5px 10px',
})

const NavigationItemSeparator = () => {
  const { theme } = useTheme()
  return (
    <View direction="row" alignV="center" {...item}>
      <Line color={alpha(theme.contrast, 0.1)} />
    </View>
  )
}

export default NavigationItemSeparator
