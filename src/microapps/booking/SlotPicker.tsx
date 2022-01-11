import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import parseISO from 'date-fns/parseISO'
import { List, Icon, Text, Calendar } from '@allthings/elements'
import { isSameQuarterHour, endOfQuarterHour } from 'utils/date'
import BookingPickerSkeletonItem from './BookingPickerSkeletonItem'
import QuarterHour from './QuarterHour'
import Hour from './Hour'
import {
  thereIsABlockerBetweenTheSelectedRangeAndThisSlot,
  isBooked,
} from './Utils'
import { IAvailability } from '.'
import find from 'lodash/find'
import get from 'lodash/get'
import endOfMonth from 'date-fns/endOfMonth'
import subMonths from 'date-fns/subMonths'
import { css } from 'glamor'
import { FormattedDate } from 'react-intl'
import memoize from 'lodash/memoize'
import isSameHour from 'date-fns/isSameHour'
import QuarterHourPickerDay from './QuarterHourPickerDay'
import HourPickerDay from './HourPickerDay'
import endOfHour from 'date-fns/endOfHour'

interface IProps {
  initialDay: Date
  isAvailable?: (day: Date) => boolean
  isLoading: boolean
  onDayChange?: (day: Date) => void
  onSelect: (day: Date) => void
  selected: ReadonlyArray<Date>
  calendarLocale: string
  availables: ReadonlyArray<IAvailability>
  availablesUpdatedAt: number
  availableTimeSlots: IndexSignature<
    ReadonlyArray<{ from: string; to: string }>
  >
  slotType: string
}

interface IState {
  day: Date
  monthOpenInCalendar: Date
  alreadyScrolledToPreselected: boolean
}

class SlotPicker extends React.Component<IProps, IState> {
  static defaultProps = {
    isAvailable: () => true,
    onDayChange: () => true,
    initialDay: new Date(),
  }
  scrollToThisSlot = React.createRef<HTMLDivElement>()

  constructor(props: IProps) {
    super(props)
    this.state = {
      monthOpenInCalendar: props.initialDay,
      day: props.initialDay,
      alreadyScrolledToPreselected: false,
    }
  }

  componentDidMount() {
    if (
      this.scrollToThisSlot.current &&
      !this.state.alreadyScrolledToPreselected
    ) {
      this.scrollToThisSlot.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      this.setState({ alreadyScrolledToPreselected: true })
    }
  }

  slotIsInThePast = memoize(
    slot =>
      this.props.slotType === 'quarterHour'
        ? isBefore(endOfQuarterHour(new Date(slot)), new Date())
        : isBefore(endOfHour(new Date(slot)), new Date()),
    slot => `${slot.getTime()}`,
  )

  isAvailable = memoize(
    slot => this.props.isAvailable(new Date(slot)) === true,
    slot => `${slot.getTime()}${get(this, 'props.availablesUpdatedAt')}`,
  )

  handleDayClick = (day: Date) => {
    this.props.onDayChange(day)
    this.setState({
      day,
      monthOpenInCalendar: day,
    })
  }

  isUnselectable = memoize(
    slot => {
      const {
        selected,
        availableTimeSlots,
        availables,
        slotType,
        availablesUpdatedAt,
      } = this.props

      return (
        !this.isAvailable(slot) ||
        (selected.length > 0 &&
          thereIsABlockerBetweenTheSelectedRangeAndThisSlot({
            availableTimeSlots,
            availables,
            slot,
            selectedTimeSlots: selected,
            slotType,
            availablesUpdatedAt,
          }))
      )
    },
    slot =>
      `${slot.getTime()}${get(this, 'props.availablesUpdatedAt')}${get(
        this,
        'props.selected[0]',
      ) && get(this, 'props.selected[0]').getTime()}`,
  )

  isBooked = memoize(
    slot =>
      isBooked({
        slot: new Date(slot),
        slotType: this.props.slotType,
        availables: this.props.availables,
      }),
    slot => `${slot.getTime()}${get(this, 'props.availablesUpdatedAt')}`,
  )

  bookedOrAvailable = (slot: Date) =>
    this.isBooked(slot) || this.isAvailable(slot)

  renderSlot = (slot: Date, index: number) => {
    const { selected, isLoading, slotType } = this.props

    if (isLoading) {
      return <BookingPickerSkeletonItem key={index} />
    }
    const slotComponent = (
      <Fragment key={slot.toString()}>
        {slotType === 'quarterHour'
          ? isSameQuarterHour(selected[0], slot) && (
              <div ref={this.scrollToThisSlot} />
            )
          : isSameHour(selected[0], slot) && (
              <div ref={this.scrollToThisSlot} />
            )}
        {slotType === 'quarterHour' ? (
          <QuarterHour
            onSelect={this.props.onSelect}
            disabled={!this.isAvailable(slot) || this.isUnselectable(slot)}
            checked={selected.some(date => isSameQuarterHour(date, slot))}
            key={index}
            quarterHour={slot}
            dataE2e={`booking-quarter-hour-${index}`}
          />
        ) : (
          <Hour
            dataE2e={`booking-hour-${index}`}
            onSelect={this.props.onSelect}
            disabled={!this.isAvailable(slot) || this.isUnselectable(slot)}
            checked={selected.some(date => isSameHour(date, slot))}
            key={index}
            hour={slot}
          />
        )}
      </Fragment>
    )

    return this.slotIsInThePast(slot)
      ? null
      : this.bookedOrAvailable(slot)
      ? slotComponent
      : null
  }

  isBlockedDay = memoize(
    date => {
      const { availables } = this.props
      const foundAvailable = find(availables, available =>
        isSameDay(parseISO(available.date.toString()), new Date(date)),
      )
      // if no found available, let it show as unblocked
      // availables are being fetched and blocked days will be blocked soon
      return foundAvailable && !get(foundAvailable, 'availableTimes.length')
    },
    date => `${date.getTime()}${get(this, 'props.availablesUpdatedAt')}`,
  )

  renderSlotPickerDay = () =>
    this.props.slotType === 'quarterHour' ? (
      <QuarterHourPickerDay
        day={this.state.day}
        renderQuarterHour={this.renderSlot}
      />
    ) : (
      <HourPickerDay day={this.state.day} renderHour={this.renderSlot} />
    )

  onClickMonth = (month: Date) => {
    this.setState({ monthOpenInCalendar: month })
    this.props.onDayChange(month)
  }

  navigationLabel = ({ date }: { date: Date }) => (
    <Text size="xl" strong color="primary">
      <FormattedDate value={date} month="long" year="numeric" />
    </Text>
  )

  render() {
    const { day } = this.state
    const { calendarLocale } = this.props
    return (
      <List>
        <Calendar
          minDate={new Date()}
          isBlockedDay={this.isBlockedDay}
          onActiveDateChange={(activeDate: { activeStartDate: Date }) => {
            this.setState({ monthOpenInCalendar: activeDate.activeStartDate })
            this.props.onDayChange(activeDate.activeStartDate)
          }}
          onClickMonth={this.onClickMonth}
          onChange={this.handleDayClick}
          value={day}
          locale={calendarLocale}
          minDetail="year"
          next2Label={null}
          prev2Label={null}
          nextLabel={
            <Icon size="xs" name="arrow-right-filled" color="greyIntense" />
          }
          prevLabel={
            isBefore(
              new Date(),
              endOfMonth(subMonths(this.state.monthOpenInCalendar, 1)),
            ) && (
              <Icon
                size="xs"
                name="arrow-left-filled"
                color="greyIntense"
                {...css({ marginLeft: '12px' })}
              />
            )
          }
          navigationLabel={this.navigationLabel}
        />
        {day && this.renderSlotPickerDay()}
      </List>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  calendarLocale:
    state.app.locale &&
    state.app.locale.split &&
    state.app.locale.split('_').join('-'),
  availablesUpdatedAt: state.booking.availablesUpdatedAt,
})

export default connect(mapStateToProps)(SlotPicker)
