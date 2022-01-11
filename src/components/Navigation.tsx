import React, { useEffect, useState } from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import { createMQ } from '@allthings/elements/Responsive'
import { useTheme } from '@allthings/elements/Theme'

export const NAVIGATION_WIDTH = 285

// @TODO: What about `withTransition` (second arg)?
const navigation = (active: boolean, _: unknown, background: string) =>
  css({
    WebkitOverflowScrolling: 'touch',
    width: NAVIGATION_WIDTH,
    color: '#fff',
    overflow: 'auto',
    overflowX: 'hidden',
    background,
    height: '100%',
    borderRight: '1px solid rgba(0,0,0,0.05)',
    [createMQ('mobile', 'tablet')]: {
      position: 'absolute',
      width: 'calc(100vw - 60px)',
      top: 0,
      boxShadow: `${active ? '0px 0px 25px rgba(0,0,0,0.8)' : 'none'}`,
      zIndex: 3,
      transform: `translate3d(${active ? 0 : 'calc(-100vw + 60px)'}, 0, 0)`,
      // Due to an IE10-11 bug we have to use this since it also affects Mobile
      // Windows Phones with IE -> https://stackoverflow.com/questions/21142923/ie-10-11-css-transitions-with-calc-do-not-work
      msTransform: active
        ? 'translateX(0)'
        : 'translateX(-100vw) translateX(60px)',
    },
    [createMQ('tablet')]: {
      width: NAVIGATION_WIDTH,
      transform: `translate3d(${active ? 0 : -NAVIGATION_WIDTH}px, 0, 0)`,
    },
  })

interface IProps {
  active: boolean
  children: React.ReactNode
}

const Navigation = ({ active, children }: IProps) => {
  const [withTransition, setWithTransition] = useState(active)
  const { theme } = useTheme()

  useEffect(() => {
    setWithTransition(true)
  }, [active])

  const handleTransitionEnd = () => {
    setWithTransition(false)
  }

  return (
    <View
      direction="column"
      alignV="stretch"
      {...navigation(active, withTransition, theme.primary)}
      style={{ transition: withTransition && '.35s ease-in-out' }}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </View>
  )
}

export default Navigation
