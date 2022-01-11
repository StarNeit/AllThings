import React, { PropsWithChildren } from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'

const HEIGHT = 80 // px

const Header = ({ children }: PropsWithChildren<{}>) => (
  <View
    direction="row"
    alignH="center"
    alignV="center"
    {...css({ height: `${HEIGHT}px` })}
  >
    {children}
  </View>
)

export default Header
