import React from 'react'
import { css } from 'glamor'
import { alpha } from '@allthings/colors'
import { View, CountIndicator, Icon, Relative } from '@allthings/elements'
import { useTheme } from '@allthings/elements/Theme'
import { IconType } from '@allthings/elements/Icon'

const item = (backgroundColor: string) =>
  css({
    borderRight: '1px solid rgba(126, 140, 141, 0.2)',
    marginRight: '-1px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor,
    },
  })

interface IProps {
  /* The name of the icon that should display */
  icon: IconType
  /* Callback when the items gets clicked */
  onClick?: OnClick
  /* Show a number with the icon */
  count?: number
}

const NavigationDesktopBarItem = ({
  icon,
  onClick,
  count = 0,
  ...props
}: IProps) => {
  const { theme } = useTheme()
  const color = theme.primary
  const textColor = theme.contrast
  return (
    <View
      onClick={onClick}
      flex="flex"
      direction="column"
      alignV="center"
      alignH="center"
      {...item(alpha(color, 1))}
      {...props}
    >
      <Relative>
        <Icon name={icon} color={textColor} size="s" />
        {count > 0 && (
          <CountIndicator
            top="-10"
            left="12"
            count={count}
            data-e2e="new-notifications"
          />
        )}
      </Relative>
    </View>
  )
}

export default NavigationDesktopBarItem
