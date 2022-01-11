import { Icon, Text } from '@allthings/elements'
import addDays from 'date-fns/addDays'
import differenceInDays from 'date-fns/differenceInDays'
import getDay from 'date-fns/getDay'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import startOfDay from 'date-fns/startOfDay'
import subDays from 'date-fns/subDays'
import { css } from 'glamor'
import React from 'react'
import ReactCalendar from 'react-calendar'
import { FormattedDate } from 'react-intl'
import { connect } from 'react-redux'
import { adjustFrontendTimeToApiTime, dateFromISO8601 } from 'utils/date'
import { IAvailability, TimeUnit } from '.'
import { BOOKING_FUTURE_IN_DAYS, transformAvailibilities } from './Utils'

interface IProps {
  availables: ReadonlyArray<IAvailability>
  availableTimeSlots: IndexSignature
  initialDay: Date
  isLoading: boolean
  onChange: (object: { start: Date; end: Date; slots: number }) => void
  onDateChange: (date: Date) => void
  type: TimeUnit
  calendarLocale: string
}

interface IState {
  selectedDays: Date[]
  maxDay: Date
  minDay: Date
  dateRangeSelectionStarted: boolean
}

class BookingDayNightPicker extends React.Component<IProps, IState> {
  state: IState = {
    selectedDays: [this.props.initialDay, this.props.initialDay],
    maxDay: null,
    minDay: new Date(),
    dateRangeSelectionStarted: !!this.props.initialDay,
  }

  componentDidUpdate() {
    const { selectedDays } = this.state
    const start = selectedDays[0]
    const end = selectedDays[1]
    start &&
      end &&
      this.props.onChange({
        start,
        end,
        slots: differenceInDays(end, start) + 1,
      })
    const { minDay, maxDay } = this.recalculateMinMaxDaysDuringRangeSelection(
      this.props.initialDay,
    )
    if (
      ((minDay !== this.state.minDay &&
        !isSameDay(minDay, this.state.minDay)) ||
        (maxDay !== this.state.maxDay &&
          !isSameDay(maxDay, this.state.maxDay))) &&
      isSameDay(this.state.selectedDays[0], this.props.initialDay) &&
      isSameDay(this.state.selectedDays[1], this.props.initialDay)
    ) {
      this.setState({ minDay, maxDay })
    }
  }

  recalculateMinMaxDaysDuringRangeSelection = (day: Date) => {
    let i = 0
    let maxDay = day
    let minDay = day
    while (i < BOOKING_FUTURE_IN_DAYS) {
      // I want i to be the old value here, so don't just switch to i++
      maxDay = addDays(day, i)
      if (!this.isAvailable(maxDay)) {
        break
      }
      i = i + 1
      if (i === BOOKING_FUTURE_IN_DAYS) {
        maxDay = null
        break
      }
    }
    i = 0
    while (i < BOOKING_FUTURE_IN_DAYS) {
      // I want i to be the old value here, so don't just switch to i++
      minDay = subDays(day, i)
      if (
        !this.isAvailable(minDay) ||
        isBefore(minDay, new Date()) ||
        isSameDay(new Date(), minDay)
      ) {
        break
      }
      i = i + 1
    }
    return { minDay, maxDay }
  }

  getDefaultMinMaxDays = () => ({ maxDay: null as Date, minDay: new Date() })

  handleClickDay = (day: Date) => {
    const { dateRangeSelectionStarted, selectedDays } = this.state
    if (!(isSameDay(day, selectedDays[0]) && isSameDay(day, selectedDays[1]))) {
      // we are either selecting a range or not, but we just clicked on a day which negates it
      const reallyDateRangeSelectionStarted = !dateRangeSelectionStarted
      if (reallyDateRangeSelectionStarted) {
        const {
          minDay,
          maxDay,
        } = this.recalculateMinMaxDaysDuringRangeSelection(day)
        this.setState(state => ({
          dateRangeSelectionStarted: isSameDay(day, state.selectedDays[0])
            ? true
            : !state.dateRangeSelectionStarted,
          maxDay,
          minDay,
          selectedDays: [startOfDay(day), startOfDay(day)],
        }))
      } else {
        const { minDay, maxDay } = this.getDefaultMinMaxDays()
        this.setState(state => ({
          dateRangeSelectionStarted: !state.dateRangeSelectionStarted,
          maxDay,
          minDay,
          selectedDays: isBefore(state.selectedDays[0], startOfDay(day))
            ? [state.selectedDays[0], startOfDay(day)]
            : [startOfDay(day), state.selectedDays[0]],
        }))
      }
    }
  }

  checkAssetAvailabilityForThatDay = (day: Date) => {
    const timeslots = transformAvailibilities(this.props.availableTimeSlots)
    const dayOfWeek = getDay(day)
    if (!timeslots[dayOfWeek]) {
      return false
    } else {
      return timeslots[dayOfWeek].length > 0
    }
  }

  isAvailable = (day: Date) => {
    const { availables } = this.props
    const availabilityObject = availables.find(available => {
      return isSameDay(
        new Date(dateFromISO8601(available.date)),
        adjustFrontendTimeToApiTime(day),
      )
    })
    if (!availabilityObject) {
      return this.checkAssetAvailabilityForThatDay(day)
    } else {
      if (availabilityObject.blockedTimes.length > 0) {
        return false
      }
      if (availabilityObject.bookedTimes.length > 0) {
        return false
      }
      if (availabilityObject.availableTimes.length > 0) {
        return this.checkAssetAvailabilityForThatDay(day)
      }
      return this.checkAssetAvailabilityForThatDay(day)
    }
  }

  isAvailableCheckForNightly = (date: Date) => {
    const { dateRangeSelectionStarted, selectedDays, maxDay } = this.state
    const available = this.isAvailable(date)
    if (dateRangeSelectionStarted) {
      // it is selectable for checkout day
      return available || (!available && isSameDay(maxDay, date))
    } else {
      return (
        available ||
        (!available &&
          // if we already selected that day that means it was possible to select it as a checkout day, so dont show this day as blocked
          selectedDays.filter(selectedDay => isSameDay(selectedDay, date))
            .length === 1)
      )
    }
  }

  handleMonthSelect = (date: Date) => {
    const { selectedDays, dateRangeSelectionStarted } = this.state
    const { minDay, maxDay } = dateRangeSelectionStarted
      ? this.recalculateMinMaxDaysDuringRangeSelection(
          !selectedDays[0]
            ? date
            : isBefore(selectedDays[0], date)
            ? date
            : selectedDays[0],
        )
      : this.getDefaultMinMaxDays()
    this.setState({ minDay, maxDay })
    this.props.onDateChange(date)
  }

  render() {
    const { calendarLocale, type } = this.props
    const { selectedDays, minDay, maxDay } = this.state
    return (
      <ReactCalendar
        locale={calendarLocale}
        minDate={minDay}
        maxDate={maxDay}
        tileDisabled={({ date }) =>
          // for all daily assets
          type === 'day'
            ? !this.isAvailable(date)
            : // for nightly, a checkin day can be selected for checkout day
              !this.isAvailableCheckForNightly(date)
        }
        value={selectedDays}
        onChange={(days: Date) => {
          this.setState({
            selectedDays: [startOfDay(days[0]), startOfDay(days[1])],
          })
        }}
        onClickDay={this.handleClickDay}
        onClickMonth={this.handleMonthSelect}
        // @ts-ignore - wrong (stale?) component typings
        onActiveStartDateChange={({
          activeStartDate,
        }: {
          activeStartDate: Date
        }) => {
          this.handleMonthSelect(activeStartDate)
        }}
        minDetail="year"
        next2Label={null}
        prev2Label={null}
        nextLabel={
          <Icon size="xs" name="arrow-right-filled" color="greyIntense" />
        }
        prevLabel={
          <Icon
            size="xs"
            name="arrow-left-filled"
            color="greyIntense"
            {...css({ marginLeft: '12px' })}
          />
        }
        navigationLabel={({ date }: { date: Date }) => (
          <Text size="xl" strong color="primary">
            <FormattedDate value={date} month="long" year="numeric" />
          </Text>
        )}
        selectRange
      />
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  calendarLocale:
    state.app.locale &&
    state.app.locale.split &&
    state.app.locale.split('_').join('-'),
})

export default connect(mapStateToProps)(BookingDayNightPicker)
