import React, { ReactNode } from 'react'
import { css } from 'glamor'
import {
  Absolute,
  Responsive,
  View,
  Icon,
  Relative,
  Text,
} from '@allthings/elements'
import { ColorPalette, alpha } from '@allthings/colors'

import SquareFittedImage from 'components/SquareFittedImage'

interface IProps {
  id: string | number
  image: string
  onRemove: (id: string | number) => void
  children?: ReactNode
  size: number
}

const RemovableImage = ({ image, onRemove, id, size, ...props }: IProps) => (
  <Relative onClick={() => onRemove(id)} {...props}>
    <SquareFittedImage image={image} size={size} />
    <Responsive mobile tablet>
      <Absolute top={0} right={0}>
        <View
          {...css({ background: alpha(ColorPalette.red, 0.75), padding: 5 })}
          direction="row"
          alignV="center"
          alignH="center"
        >
          <Icon name="trash" color="#fff" size={20} />
        </View>
      </Absolute>
    </Responsive>
    <Responsive desktop>
      <Absolute
        top={0}
        bottom={0}
        right={0}
        left={0}
        direction="row"
        alignH="center"
        alignV="center"
        {...css({
          cursor: 'pointer',
          background: 'rgba(0, 0, 0, 0.5)',
          transition: '.25s',
          opacity: 0,
          ':hover': { opacity: 1 },
        })}
      >
        <Text strong size="xl" color="#fff">
          X
        </Text>
      </Absolute>
    </Responsive>
  </Relative>
)

export default RemovableImage
