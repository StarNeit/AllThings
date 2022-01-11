import React from 'react'
import Logo from 'components/Logo'
import { Text, View } from '@allthings/elements'
import { color, lightness } from 'kewler'
import { useTheme } from '@allthings/elements/Theme'

interface IProps {
  /* The text to show beside the logo (App title) */
  title: string
  /* The text underneath the title, if existing (App subtitle) */
  subTitle?: string
  /* The logo to show, will be rendered in size of 36px */
  logo?: string
}

const NavigationHeader = ({ title, subTitle }: IProps) => {
  const { theme } = useTheme()
  const backgroundColor = color(theme.primary, lightness(-8))
  const titleColor = theme.contrast
  const subTitleColor = color(theme.contrast, lightness(-20))

  return (
    <View
      style={{ height: 65, padding: '0 18px', backgroundColor }}
      direction="row"
      alignV="center"
    >
      <Logo
        size={30}
        color={titleColor}
        style={{ maxHeight: '29px', maxWidth: '65px', flexShrink: 0 }}
      />
      <View
        style={{
          width: 1,
          height: 20,
          backgroundColor: titleColor,
          opacity: 0.25,
          margin: 10,
        }}
      />
      <View direction="column">
        <Text size="l" color={titleColor} strong>
          {title}
        </Text>
        {subTitle && (
          <Text size="s" color={color(subTitleColor, lightness(-20))}>
            {subTitle}
          </Text>
        )}
      </View>
    </View>
  )
}

export default NavigationHeader
