import React from 'react'
import { css, keyframes } from 'glamor'

interface IProps {
  backgroundColor: string
  loaderColor: string
  width?: number
  height?: number
  loaderWidth?: number
}

export default function InfiniteLoadingBar({
  backgroundColor,
  loaderColor,
  width = 100,
  height = 6,
  loaderWidth = 10,
}: IProps) {
  const bounce = keyframes('bounce', {
    '0%': {
      transform: 'translateX(0)',
    },
    '50%': {
      transform: `translateX(${width - loaderWidth}px)`,
    },
  })

  const style = css({
    height,
    width,
    backgroundColor,
    position: 'relative',
    ':before': {
      content: `''`,
      height,
      width: loaderWidth,
      position: 'absolute',
      left: 0,
      backgroundColor: loaderColor,
      animation: `${bounce} 4s infinite ease-in-out`,
    },
  })

  return <div {...style} />
}
