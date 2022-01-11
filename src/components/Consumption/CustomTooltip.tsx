import { alpha, ColorPalette } from '@allthings/colors'
import { View, Text } from '@allthings/elements'
import { css } from 'glamor'
import React from 'react'

const styles = {
  color: (value: string) =>
    css({
      color: value,
    }),
  container: css({
    backgroundColor: ColorPalette.white,
    border: `1px solid ${alpha(ColorPalette.lightGrey, 0.5)}`,
    boxShadow: '2px 2px 2px rgba(230, 230, 230, 0.5)',
  }),
  data: (last: boolean) =>
    css({
      padding: '12px',
      paddingBottom: last ? '12px' : 0,
    }),
  header: css({
    borderBottom: `1px solid ${ColorPalette.lightGrey}`,
  }),
  title: css({
    padding: '12px',
  }),
  year: css({
    color: ColorPalette.text.gray,
  }),
}

interface ICustomTooltipProps {
  readonly formatMessage: (message: string) => string
  readonly getMonth: (name: string, long: boolean) => string
  readonly payload?: ReadonlyArray<any>
  readonly unit: string
}

export default function CustomTooltip({
  formatMessage,
  getMonth,
  payload,
  unit,
}: ICustomTooltipProps): JSX.Element {
  const month = payload[0] && getMonth(payload[0].payload.monthNumber, true)
  const year = payload[0] && payload[0].payload.year
  const getColor = (i: number) => payload[i] && payload[i].color
  const getUnitValue = (i: number) =>
    payload[i] && `${payload[i].value} ${formatMessage(unit)}`
  const average = getUnitValue(1)
  const total = getUnitValue(0)

  return (
    <View {...styles.container} direction="column" alignH="center">
      <View {...styles.header}>
        <Text {...styles.title}>
          {month} <span {...styles.year}>({year})</span>
        </Text>
      </View>
      <View {...styles.data(!average)}>
        <Text size="m">
          {formatMessage('total')}:{' '}
          <span {...styles.color(getColor(0))}>{total}</span>
        </Text>
      </View>
      {average && (
        <View {...styles.data(true)}>
          <Text size="m">
            {formatMessage('average')}:{' '}
            <span {...styles.color(getColor(1))}>{average}</span>
          </Text>
        </View>
      )}
    </View>
  )
}
