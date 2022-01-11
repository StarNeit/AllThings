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
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
    ':before': {
      border: '1px solid rgba(0, 0, 0, 0.1)',
      bottom: 0,
      content: `""`,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  }),
  image: css({
    height: '100%',
    objectFit: 'cover',
    width: '100%',
  }),
}

interface IProps {
  children?: React.ReactNode
  image: string
  imageHeight?: number
  imageWidth?: number
  maxHeight?: string
  minHeight?: string
  onClick?: OnClick
}

export default function RectangleFittedImage({
  children,
  image,
  imageHeight,
  imageWidth,
  maxHeight = '60vh',
  minHeight = '200px',
  onClick = NoOp,
  ...rest
}: IProps) {
  let height = 'auto'

  if (imageWidth && imageHeight) {
    // Reverted ratio * 65vh.
    const ratio = Number(((imageHeight / imageWidth) * 65).toFixed(0))
    height = `${ratio}vh`
  }

  return (
    <View
      onClick={onClick}
      {...css(styles.wrapper, { height, maxHeight, minHeight })}
    >
      <View {...styles.content}>
        <FittedImage src={image} {...rest} />
        {children}
      </View>
    </View>
  )
}
