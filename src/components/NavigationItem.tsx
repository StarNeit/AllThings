import React from 'react'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { SquareIconButton, Text, View } from '@allthings/elements'
import CustomLogoButton from 'components/CustomLogoButton'
import { colorCode } from '@allthings/elements/utils/propTypes/color'
import { IconType } from '@allthings/elements/Icon'

const styles = {
  outerItem: (active: boolean, color: string) =>
    css({
      cursor: 'pointer',
      backgroundColor: active && color,
      ':hover': {
        backgroundColor: !active && alpha(ColorPalette.black, 0.05),
        '> div:nth-child(2)': {
          color: !active && color,
        },
      },
      margin: '3px 10px',
      // padding: '5px 10px',
      '> div:nth-child(2)': {
        marginLeft: '16px',
      },
      borderRadius: 2,
    }),

  textEllipsis: css({
    marginLeft: 10,
    width: 'calc(100% - 70px)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
}

// @TODO: should use https://github.com/allthings/elements/blob/master/src/propTypes/color.js#L4-L10
// but the current implementation is useless... till we get it in TS.
interface IProps {
  active?: boolean
  children: string
  color: string
  customLogoUrl?: string
  icon: IconType
  iconColor: string
  onClick: OnClick
  textColor: string
}

const NavigationItem = ({
  active,
  children,
  color = 'transparent',
  customLogoUrl,
  icon,
  iconColor,
  textColor,
  ...rest
}: IProps) => (
  <View
    {...styles.outerItem(active, color)}
    alignV="center"
    direction="row"
    {...rest}
  >
    {customLogoUrl ? (
      <CustomLogoButton
        color={colorCode(color)}
        customLogoUrl={customLogoUrl}
        iconColor={colorCode(iconColor)}
      />
    ) : (
      <SquareIconButton
        color={colorCode(color)}
        icon={icon}
        iconColor={colorCode(iconColor)}
      />
    )}
    <Text
      color={active ? colorCode(iconColor) : colorCode(textColor)}
      {...styles.textEllipsis}
    >
      {children}
    </Text>
  </View>
)

export default NavigationItem
