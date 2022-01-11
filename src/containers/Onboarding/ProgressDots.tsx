import React from 'react'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'

const grey = alpha(ColorPalette.greyIntense, 50)
const lightGrey = alpha(ColorPalette.lightGreyIntense, 50)

const styles = {
  circle: css({
    width: 12,
    height: 12,
    borderRadius: '50%',
    margin: '0 3px',
    background: `radial-gradient(ellipse at center, ${grey} 0%, ${grey} 35%, ${lightGrey} 38%, ${lightGrey} 100%)`,
    backgroundSize: '200% 200%',
    backgroundPosition: '-50%',
    transition: '.5s ease-in-out 50ms', // add 50ms delay for more natural push
  }),
  active: css({
    backgroundPositionX: '-150%',
  }),
  passed: css({
    backgroundPositionX: '-250%',
  }),
  upcoming: css({
    background: 'none',
    border: `1px solid ${lightGrey}`,
  }),
}

interface IProps {
  max: number
  value: number
}

const ProgressDots = ({ value, max, ...props }: IProps) => (
  <View direction="row" {...props}>
    {Array.from({ length: max }, (_, i) => (
      <View
        key={i}
        {...css(
          styles.circle,
          i === value && styles.active,
          i < value && styles.passed,
          i > value && styles.upcoming,
        )}
      />
    ))}
  </View>
)

export default ProgressDots
