import React, { PropsWithChildren } from 'react'
import { css, keyframes } from 'glamor'
import { Relative } from '@allthings/elements'

const bounceInDown = keyframes({
  '0%': {
    opacity: '0',
    transform: 'translate3d(0, -10%, 0)',
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

const OverlayBox = ({
  children,
  left,
  ...props
}: PropsWithChildren<{ left: number }>) => (
  <Relative
    flex="flex"
    alignV="stretch"
    direction="column"
    {...css(animations.bounceInDown, {
      border: '1px solid black',
      width: '100%',
      background: '#000',
      '@media (min-width: 1025px)': {
        left,
        top: 115,
        maxWidth: 430,
        maxHeight: 736,
        width: 366,
        height: 'auto',
        minHeight: 'auto',
        position: 'absolute',
      },
    })}
    {...props}
  >
    {children}
  </Relative>
)

export default OverlayBox
