import React from 'react'
import { FormattedDate } from 'react-intl'
import { View, Text } from '@allthings/elements'
import { TimeUnit } from '.'
import { TextSizeType } from '@allthings/elements/Text'

const twoDigitFormat = (typeCondition: boolean) =>
  typeCondition ? '2-digit' : undefined
const numericFormat = (typeCondition: boolean) =>
  typeCondition ? 'numeric' : undefined

interface IProps {
  dateFrom: Date
  dateTo: Date
  size?: TextSizeType
  type: TimeUnit
}

const TimeInterval = ({ dateFrom, dateTo, type, size }: IProps) => {
  const dailyOrNightly = ['day', 'night'].includes(type)
  const quarterlyOrHourly = ['quarter-hour', 'hour'].includes(type)

  return dateTo && dateFrom ? (
    <View>
      <Text color="secondary" strong size={size}>
        <FormattedDate
          day="2-digit"
          month="short"
          year="numeric"
          hour={twoDigitFormat(quarterlyOrHourly)}
          minute={twoDigitFormat(quarterlyOrHourly)}
          value={dateFrom}
        />
        &nbsp;&ndash;&nbsp;
        <FormattedDate
          day={twoDigitFormat(dailyOrNightly)}
          month={dailyOrNightly ? 'short' : undefined}
          year={numericFormat(dailyOrNightly)}
          hour={twoDigitFormat(quarterlyOrHourly)}
          minute={twoDigitFormat(quarterlyOrHourly)}
          value={dateTo}
        />
      </Text>
    </View>
  ) : (
    <View />
  )
}

TimeInterval.defaultProps = {
  size: 'l',
}

export default TimeInterval
