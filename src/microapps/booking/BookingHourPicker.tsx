import React from 'react'
import addHours from 'date-fns/addHours'
import isBefore from 'date-fns/isBefore'
import isSameHour from 'date-fns/isSameHour'
import startOfHour from 'date-fns/startOfHour'
import endOfHour from 'date-fns/endOfHour'
import differenceInHours from 'date-fns/differenceInHours'
import { IAvailability } from '.'
import uniqBy from 'lodash/uniqBy'
import {
  allUnselectedSlotsBetweenSelectedRangeAndThisSlot,
  keepOnlyEarlierSlotsThanClickedSlot,
  checkAvailability,
  getSlotsBetweenIfAllFreeOrNothing,
} from './Utils'
import SlotPicker from './SlotPicker'
import { connect } from 'react-redux'

const byDate = (a: Date, b: Date) => (a as any) - (b as any)

interface IProps {
  availables: ReadonlyArray<IAvailability>
  availableTimeSlots: IndexSignature<
    ReadonlyArray<{ from: string; to: string }>
  >
  initialDay: Date
  isLoading: boolean
  onDateChange: (date: Date) => void
  onChange: (arg: { start: Date; end: Date; slots: number }) => void
  preferredBookingRange: {
    date: Date
    timeFrom: string
    timeTo: string
  }
  availablesUpdatedAt: number
}

interface IState {
  selectedTimeSlots: ReadonlyArray<Date>
}

class BookingHourPicker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const {
      preferredBookingRange: { date, timeFrom, timeTo },
      availableTimeSlots,
      availables,
      availablesUpdatedAt,
    } = this.props
    this.state = {
      selectedTimeSlots:
        date && timeFrom && timeTo
          ? getSlotsBetweenIfAllFreeOrNothing({
              date,
              timeFrom: timeFrom || '00:00',
              timeTo: timeTo || '23:59',
              addRangeFunction: addHours,
              availableTimeSlots,
              availables,
              isSameSlotFunction: isSameHour,
              endOfSlotFunction: endOfHour,
              startOfSlotFunction: startOfHour,
              availablesUpdatedAt,
            })
          : [],
    }
  }

  componentDidMount() {
    if (this.props.preferredBookingRange.date) {
      this.onChange(this.state.selectedTimeSlots)
    }
  }

  onChange(selectedTimeSlots: readonly Date[]) {
    const start = selectedTimeSlots[0]
    const endDate = selectedTimeSlots[selectedTimeSlots.length - 1]
    const end = startOfHour(addHours(endDate, 1))

    this.props.onChange({
      start,
      end,
      slots: end && start ? differenceInHours(end, start) : 0,
    })
  }

  handleSelect = (date: Date) => {
    const { selectedTimeSlots } = this.state
    const { availableTimeSlots, availables, availablesUpdatedAt } = this.props
    const newDates = selectedTimeSlots.filter(
      quarterHour => quarterHour.getTime() !== date.getTime(),
    )
    if (newDates.length === selectedTimeSlots.length) {
      // if the user clicked on a field that is not selected so far, the lengths will be different
      const newselectedTimeSlots = uniqBy(
        selectedTimeSlots
          .concat(date)
          .concat(
            // also add those days that are in between the range
            allUnselectedSlotsBetweenSelectedRangeAndThisSlot({
              availableTimeSlots,
              availables,
              endOfSlotFunction: endOfHour,
              startOfSlotFunction: startOfHour,
              slot: date,
              selectedTimeSlots,
              isSameSlotFunction: isSameHour,
              addRangeFunction: addHours,
              availablesUpdatedAt,
            }),
          )
          .sort(byDate),
        date2 => date2.toString(),
      )
      this.setState({
        selectedTimeSlots: newselectedTimeSlots,
      })
      this.onChange(newselectedTimeSlots)
    } else {
      const isFirstSlotRemoved =
        selectedTimeSlots.filter(alreadySelectedSlot =>
          isBefore(alreadySelectedSlot, date),
        ).length === 0
      const newselectedTimeSlots = selectedTimeSlots
        .filter(
          keepOnlyEarlierSlotsThanClickedSlot({
            clickedSlot: date,
            isFirstSlotRemoved,
            isSameSlotFunction: isSameHour,
          }),
        )
        .sort(byDate)
      this.setState({
        selectedTimeSlots: newselectedTimeSlots,
      })
      this.onChange(newselectedTimeSlots)
    }
  }

  onDayChange = (newDay: Date) => {
    this.setState({ selectedTimeSlots: [] })
    this.props.onDateChange(newDay)
  }

  isAvailable = (slot: Date) => {
    const { availableTimeSlots, availables, availablesUpdatedAt } = this.props

    return checkAvailability({
      availableTimeSlots,
      availables,
      isSameSlotFunction: isSameHour,
      slot,
      endOfSlotFunction: endOfHour,
      startOfSlotFunction: startOfHour,
      availablesUpdatedAt,
    })
  }

  render() {
    return (
      <SlotPicker
        availables={this.props.availables}
        availableTimeSlots={this.props.availableTimeSlots}
        isAvailable={this.isAvailable}
        selected={this.state.selectedTimeSlots}
        onSelect={this.handleSelect}
        onDayChange={this.onDayChange}
        initialDay={this.props.initialDay}
        isLoading={this.props.isLoading}
        slotType="hour"
      />
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  availablesUpdatedAt: state.booking.availablesUpdatedAt,
})

export default connect(mapStateToProps)(BookingHourPicker)
