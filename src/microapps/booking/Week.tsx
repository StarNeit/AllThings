import React from 'react'
import { View } from '@allthings/elements'
import startOfISOWeek from 'date-fns/startOfISOWeek'
import addDays from 'date-fns/addDays'

interface IProps {
  renderDay: (value: Date, index: number, array: ReadonlyArray<Date>) => void
  week: Date
}

class Week extends React.Component<IProps> {
  render() {
    return (
      <View alignH="center" alignV="stretch" direction="column">
        {new Array(7)
          .fill(startOfISOWeek(this.props.week), 0, 7)
          .map((day, i) => addDays(day, i))
          .map(this.props.renderDay)}
      </View>
    )
  }
}

export default Week
