import React from 'react'
import addHours from 'date-fns/addHours'
import { FormattedMessage } from 'react-intl'
import { View, Text } from '@allthings/elements'
import { css } from 'glamor'
import startOfDay from 'date-fns/startOfDay'
import memoize from 'lodash/memoize'

interface IProps {
  day: Date
  renderHour: (value: Date, index: number, array: ReadonlyArray<Date>) => void
}

class HourPickerDay extends React.Component<IProps> {
  getSlotArray = memoize(
    day =>
      new Array(24)
        .fill(startOfDay(day), 0, 24)
        .map((h, i) => addHours(h, i))
        .filter((h: any) => !!h),
    day => `${day.getTime()}`,
  )

  render() {
    const hours = this.getSlotArray(this.props.day).map(this.props.renderHour)

    return (
      <View fill alignH="center" alignV="stretch" direction="column">
        {hours.length > 0 ? (
          hours
        ) : (
          <View {...css({ paddingTop: '20px' })}>
            <Text color="gray" align="center">
              <FormattedMessage
                id="booking.hour-picker.no-hours-to-show"
                description="No available hours to show"
                defaultMessage="No available hours to show"
              />
            </Text>
          </View>
        )}
      </View>
    )
  }
}

export default HourPickerDay
