import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import FittedImage from 'components/FittedImage'
import NoOp from 'utils/noop'

const styles = {
  wrapper: css({
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    // Get square sized View: http://www.mademyday.de/css-height-equals-width-with-pure-css.html
    ':before': {
      content: `""`,
      display: 'block',
      paddingTop: '100%',
      pointerEvents: 'none',
    },
  }),
  content: css({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'hidden',
    ':before': {
      content: `""`,
      border: '1px solid rgba(0, 0, 0, 0.1)',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  }),
  image: css({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }),
}

export interface IProps {
  children?: React.ReactNode
  image: string
  onClick?: OnClick
  size: number
}

export default function SquareFittedImage({
  children,
  image,
  onClick = NoOp,
  size,
}: IProps) {
  return (
    <View
      onClick={onClick}
      {...css(styles.wrapper, { height: size, width: size })}
    >
      <View {...styles.content}>
        <FittedImage src={image} />
        {children}
      </View>
    </View>
  )
}
