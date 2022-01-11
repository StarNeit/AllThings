import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import { NAVIGATION_WIDTH } from './Navigation'

const app = css({
  maxWidth: 882,
  height: '100%',
  minHeight: '100%',
  width: `calc(100% - ${NAVIGATION_WIDTH}px)`,
  boxShadow: '0px 0px 15px rgba(0,0,0,0.3)',
})

export default class AppLayout extends React.PureComponent {
  render() {
    const { children } = this.props

    return (
      <View direction="column" flex="flex" {...app}>
        {children}
      </View>
    )
  }
}
