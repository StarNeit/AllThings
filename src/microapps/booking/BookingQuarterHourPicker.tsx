import React from 'react'
import {
  isSameQuarterHour,
  addQuarterHours,
  startOfQuarterHour,
  endOfQuarterHour,
  differenceInQuarterHours,
} from 'utils/date'
import isBefore from 'date-fns/isBefore'
import {
  allUnselectedSlotsBetweenSelectedRangeAndThisSlot,
  keepOnlyEarlierSlotsThanClickedSlot,
  checkAvailability,
  getSlotsBetweenIfAllFreeOrNothing,
} from './Utils'
import { IAvailability } from '.'
import uniqBy from 'lodash/uniqBy'
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
  onChange: (bookablePeriod: { start: Date; end: Date; slots: number }) => void
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

class BookingQuarterHourPicker extends React.Component<IProps, IState> {
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
              addRangeFunction: addQuarterHours,
              availableTimeSlots,
              availables,
              isSameSlotFunction: isSameQuarterHour,
              endOfSlotFunction: endOfQuarterHour,
              startOfSlotFunction: startOfQuarterHour,
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

  onChange = (selectedTimeSlots: readonly Date[]) => {
    const start = selectedTimeSlots[0]
    const endDate = selectedTimeSlots[selectedTimeSlots.length - 1]
    const end = startOfQuarterHour(addQuarterHours(endDate, 1))

    this.props.onChange({
      start,
      end,
      slots: end && start ? differenceInQuarterHours(end, start) : 0,
    })
  }

  handleSelect = (date: Date) => {
    const { selectedTimeSlots } = this.state
    const { availableTimeSlots, availables, availablesUpdatedAt } = this.props
    const newDates = selectedTimeSlots.filter(
      quarterHour => quarterHour.getTime() !== date.getTime(),
    )
    if (newDates.length === selectedTimeSlots.length) {
      const newselectedTimeSlots = uniqBy(
        selectedTimeSlots
          .concat(date)
          .concat(
            allUnselectedSlotsBetweenSelectedRangeAndThisSlot({
              availableTimeSlots,
              availables,
              endOfSlotFunction: endOfQuarterHour,
              startOfSlotFunction: startOfQuarterHour,
              slot: date,
              selectedTimeSlots,
              isSameSlotFunction: isSameQuarterHour,
              addRangeFunction: addQuarterHours,
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
        selectedTimeSlots.filter(alreadySelectedQuarterHour =>
          isBefore(alreadySelectedQuarterHour, date),
        ).length === 0
      const newselectedTimeSlots = selectedTimeSlots
        .filter(
          keepOnlyEarlierSlotsThanClickedSlot({
            clickedSlot: date,
            isFirstSlotRemoved,
            isSameSlotFunction: isSameQuarterHour,
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
      isSameSlotFunction: isSameQuarterHour,
      slot,
      endOfSlotFunction: endOfQuarterHour,
      startOfSlotFunction: startOfQuarterHour,
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
        slotType="quarterHour"
      />
    )
  }
}
const mapStateToProps = (state: IReduxState) => ({
  availablesUpdatedAt: state.booking.availablesUpdatedAt,
})

export default connect(mapStateToProps)(BookingQuarterHourPicker)
