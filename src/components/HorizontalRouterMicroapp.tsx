import React, { PropsWithChildren } from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'

const microapp = css({
  // Firefox/Edge need this otherwise title/app bars are not fixed at top/bottom
  height: 0,
  flex: 'auto',
})

const HorizontalRouterMicroapp = ({ children }: PropsWithChildren<{}>) => (
  <View flex="flex" direction="column" {...microapp}>
    {children}
  </View>
)

export default HorizontalRouterMicroapp
