import React, { PropsWithChildren } from 'react'
import { css, keyframes } from 'glamor'
import { Relative } from '@allthings/elements'

const bounceInDown = keyframes({
  '0%': {
    opacity: '0',
    transform: 'translate3d(0, -100%, 0)',
  },
  '60%': {
    opacity: '1',
  },
  '100%': {
    transform: 'translate3d(0, 0, 0)',
  },
})

const animations = {
  bounceInDown: { animation: `${bounceInDown} 0.42s` },
}

const OverlayWindow = ({ children, ...props }: PropsWithChildren<{}>) => (
  <Relative
    flex="flex"
    alignV="stretch"
    direction="column"
    style={{
      maxWidth: 430,
      maxHeight: 736,
      width: '100%',
      background: '#FFF',
    }}
    {...css(animations.bounceInDown, {
      // IE hack to make the whole thing visible!
      '@media all and (min-width: 880px)': {
        flex: 'auto',
        // height: 736,
        height: '100vh',
      },
    })}
    {...props}
  >
    {children}
  </Relative>
)

export default OverlayWindow
