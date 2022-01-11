import { ColorPalette } from '@allthings/colors'
import { View, Text } from '@allthings/elements'
import ArrowRightCIcon from '@allthings/react-ionicons/lib/ArrowRightCIcon'
import { css } from 'glamor'
import React from 'react'

const styles = {
  container: css({
    padding: '12px',
    paddingBottom: 0,
  }),
  icon: (trend: 'up' | 'down') => {
    const properties = {
      // Defaults
      angle: 0,
      color: 'lightGrey',
      // Up
      ...(trend === 'up' && {
        angle: -45,
        color: 'error',
      }),
      // Down
      ...(trend === 'down' && {
        angle: 45,
        color: 'success',
      }),
    }

    return css({
      fill: trend
        ? ColorPalette.state[properties.color]
        : ColorPalette[properties.color],
      transform: `rotate(${properties.angle}deg)`,
    })
  },
  unit: css({
    fontSize: '30px!important',
  }),
}

const iconSize = { height: 30, width: 30 }

const indicator = (trend: number) => (
  <ArrowRightCIcon
    {...iconSize}
    {...styles.icon(!isNaN(trend) ? (trend > 0 ? 'up' : 'down') : null)}
  />
)

interface ITrendProps {
  readonly energyData: ReadonlyArray<any>
  readonly formatMessage: (message: string) => string
  readonly unit: 'cubicMeter' | 'kilowattPerHour'
}

export default function Trend({
  energyData,
  formatMessage,
  unit,
}: ITrendProps): JSX.Element {
  const positiveData = energyData.map(d => d.total)
  const [ultimate, penultimate] = positiveData.reverse()
  // Store the trend's sign as +/- Infinity.
  const trend = (ultimate - penultimate) * Infinity

  return (
    <View direction="row" alignV="center" {...styles.container}>
      {indicator(trend)}
      <Text {...styles.unit}>{`${ultimate} ${formatMessage(unit)}`}</Text>
    </View>
  )
}
