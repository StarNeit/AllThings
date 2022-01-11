import React from 'react'
import { View } from '@allthings/elements'
import { color, lightness } from 'kewler'
import { useTheme } from '@allthings/elements/Theme'

interface IProps {
  children: React.ReactNode
}

const NavigationDesktopBar = ({ children }: IProps) => {
  const { theme } = useTheme()
  const backgroundColor = color(theme.primary, lightness(-4))
  return (
    <View
      style={{ height: 50, marginBottom: 5, backgroundColor }}
      direction="row"
      alignV="stretch"
    >
      {children}
    </View>
  )
}

export default NavigationDesktopBar
