import React from 'react'
import { FormattedMessage } from 'react-intl'
import { View, Text } from '@allthings/elements'
import { css } from 'glamor'
import startOfDay from 'date-fns/startOfDay'
import { addQuarterHours } from 'utils/date'
import memoize from 'lodash/memoize'

interface IProps {
  day: Date
  renderQuarterHour: (
    value: Date,
    index: number,
    array: ReadonlyArray<Date>,
  ) => void
}

class QuarterHourPickerDay extends React.Component<IProps> {
  getSlotArray = memoize(
    day =>
      new Array(96)
        .fill(startOfDay(day), 0, 96)
        .map((qh, i) => addQuarterHours(qh, i))
        .filter((qh: any) => !!qh),
    day => `${day.getTime()}`,
  )

  render() {
    const quarterHours = this.getSlotArray(this.props.day).map(
      this.props.renderQuarterHour,
    )

    return (
      <View fill alignH="center" alignV="stretch" direction="column">
        {quarterHours.length > 0 ? (
          quarterHours
        ) : (
          <View {...css({ paddingTop: '20px' })}>
            <Text color="gray" align="center">
              <FormattedMessage
                id="booking.hour-picker.no-quarter-hours-to-show"
                description="No available quarter-hours to show"
                defaultMessage="No available quarter-hours to show"
              />
            </Text>
          </View>
        )}
      </View>
    )
  }
}

export default QuarterHourPickerDay
