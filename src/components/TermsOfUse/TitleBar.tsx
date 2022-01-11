import React from 'react'
import { View, Icon, Text } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import NoOp from 'utils/noop'
import { MARGIN } from './'
import { calculateHeightOfNativeApp } from 'utils/guessBrowser'

const calculateHeight = (isNativeApp: boolean) =>
  isNativeApp ? calculateHeightOfNativeApp() : 0

const styles = (loggedIn: boolean, isNativeApp: boolean) => ({
  titleBar: css({
    background: ColorPalette.lightBlueIntense,
    borderRadius: loggedIn ? 0 : `${MARGIN / 2}px ${MARGIN / 2}px 0 0`,
    cursor: loggedIn ? 'auto' : 'pointer',
    height: `${MARGIN * (loggedIn ? 5 : 4) + calculateHeight(isNativeApp)}px`,
  }),
  titleBarItems: css({
    margin: `${MARGIN}px`,
    paddingTop: `${calculateHeight(isNativeApp)}px`,
  }),
})

interface IProps {
  isNativeApp?: boolean
  loggedIn?: boolean
  onClick: OnClick
  title: string
}

export const TitleBar = ({
  isNativeApp = false,
  loggedIn = false,
  onClick = NoOp,
  title,
}: IProps) => {
  const { titleBar, titleBarItems } = styles(loggedIn, isNativeApp)
  return (
    <View
      alignH="space-between"
      alignV="center"
      direction="row"
      onClick={loggedIn ? NoOp : onClick}
      {...titleBar}
    >
      <Text color={ColorPalette.white} size="l" strong {...titleBarItems}>
        {title}
      </Text>
      {!loggedIn && (
        <Icon
          color={ColorPalette.white}
          name="remove-light-filled"
          size="xs"
          {...titleBarItems}
        />
      )}
    </View>
  )
}
