import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import Image from 'components/Image'

const styles = {
  image: css({
    height: '100%',
    width: '100%',
  }),
  background: css({
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    height: '100%',
    width: '100%',
  }),
}

const isObjectFitSupported =
  typeof window !== 'undefined' &&
  (window as any).CSS &&
  (window as any).CSS.supports &&
  (window as any).CSS.supports('object-fit', 'cover')

interface IProps {
  alt?: string
  draggable?: boolean
  fit?: 'cover' | 'contain'
  onClick?: OnClick
  src: string
}

const FittedImage = ({ fit = 'cover', src, alt, ...props }: IProps) =>
  isObjectFitSupported ? (
    <Image
      alt={alt}
      src={src}
      {...css(styles.image, { objectFit: fit })}
      {...props}
    />
  ) : (
    <View
      title={alt}
      {...css(styles.background, {
        backgroundImage: `url(${src})`,
        backgroundSize: fit,
      })}
      {...props}
    />
  )

export default FittedImage
