import React from 'react'
import { css } from 'glamor'
import startOfISOWeek from 'date-fns/startOfISOWeek'
import lastDayOfISOWeek from 'date-fns/lastDayOfISOWeek'
import getDayOfYear from 'date-fns/getDayOfYear'
import addWeeks from 'date-fns/addWeeks'
import subWeeks from 'date-fns/subWeeks'
import subDays from 'date-fns/subDays'
import endOfDay from 'date-fns/endOfDay'
import addDays from 'date-fns/addDays'
import isBefore from 'date-fns/isBefore'
import isSameDay from 'date-fns/isSameDay'
import isSameWeek from 'date-fns/isSameWeek'
import endOfWeek from 'date-fns/endOfWeek'
import startOfWeek from 'date-fns/startOfWeek'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { Text, List, ListItem, Icon, View } from '@allthings/elements'
import BookingPickerSkeletonItem from './BookingPickerSkeletonItem'
import Week from './Week'
import Day from './Day'

const MAX_BOOKABLE_DAYS = 365

const isPrevOrNext = (day1: Date, day2: Date) =>
  isSameDay(day1, day2) ||
  isSameDay(day1, addDays(day2, 1)) ||
  isSameDay(day1, subDays(day2, 1))

interface IProps {
  isAvailable?: (day: Date) => boolean
  isLoading: boolean
  onSelect: (clickedDay: Date) => void
  onWeekChange?: (date: Date) => void
  selected: ReadonlyArray<Date>
}

class NightPicker extends React.Component<IProps> {
  static defaultProps = {
    isAvailable: () => true,
    onWeekChange: () => true,
  }

  state = {
    date: new Date(),
  }

  notAvailableNotLastOfSelected = (day: Date) =>
    !this.props.isAvailable(day) && !this.isLastOfSelected(day)

  isCheckoutDayAndNotCheckin = (day: Date) =>
    this.isLastOfSelected(day) && this.props.selected.length !== 1

  getLastOfSelected = () => this.props.selected[this.props.selected.length - 1]

  isLastOfSelected = (day: Date) =>
    this.props.selected.length !== 0 && isSameDay(this.getLastOfSelected(), day)

  isFirstOfSelected = (day: Date) =>
    this.props.selected.length !== 0 && isSameDay(this.props.selected[0], day)

  isOneDayAfterLastSelected = (day: Date) =>
    this.isLastOfSelected(subDays(day, 1))

  previousDayNotAvailable = (day: Date) =>
    !this.props.isAvailable(subDays(day, 1))

  isNextDayOfLastSelectedAvailable = (day: Date) => {
    const availableAndSelectedDays = this.props.selected.filter(d =>
      this.props.isAvailable(d),
    )
    const lastSelectedAndAvailable =
      availableAndSelectedDays.length !== 0
        ? availableAndSelectedDays[availableAndSelectedDays.length - 1]
        : null
    return isSameDay(addDays(lastSelectedAndAvailable, 1), day)
  }

  cannotBeCheckoutDay = (day: Date) =>
    !this.props.isAvailable(day) && !this.isNextDayOfLastSelectedAvailable(day)

  availableAfterTheLastPossibleAndSelectedCheckoutDay = (day: Date) =>
    this.props.isAvailable(day) &&
    this.isOneDayAfterLastSelected(day) &&
    this.previousDayNotAvailable(day)

  yesterdayOrEarlier = (day: Date) => isBefore(endOfDay(day), new Date())

  isNotCloseToASelected = (day: Date) =>
    this.props.selected.filter(date => isPrevOrNext(date, day)).length === 0

  someAreSelectedButThisDayIsNotCloseToThem = (day: Date) =>
    this.props.selected.length !== 0 && this.isNotCloseToASelected(day)

  thereIsABlockerBetweenTheSelectedRangeAndThisDay = (day: Date) => {
    const checkInDay = this.props.selected[0]
    if (!this.props.isAvailable(day)) {
      return true
    }
    if (isBefore(day, checkInDay)) {
      let i = 0
      let currentDay = day
      while (i <= MAX_BOOKABLE_DAYS) {
        currentDay = addDays(day, i)
        if (isSameDay(currentDay, checkInDay)) {
          return false
        } else if (!this.props.isAvailable(currentDay)) {
          return true
        }
        i++
      }
      return true
    } else if (isBefore(checkInDay, day)) {
      let i = 0
      let currentDay = day
      while (i <= MAX_BOOKABLE_DAYS) {
        currentDay = subDays(day, i)
        if (isSameDay(currentDay, checkInDay)) {
          return false
        } else if (!this.props.isAvailable(currentDay)) {
          return true
        }
        i++
      }
      return true
    } else {
      // clicked on the island
      return false
    }
  }

  possibleOnlyForCheckout = (day: Date) =>
    !this.thereIsABlockerBetweenTheSelectedRangeAndThisDay(subDays(day, 1)) &&
    !this.props.isAvailable(day)

  notSelectableNothingSelectedYet = (day: Date) =>
    !this.props.isAvailable(day) || this.yesterdayOrEarlier(day)

  notSelectableSomeAlreadySelected = (day: Date) =>
    !this.possibleOnlyForCheckout(day) &&
    (this.thereIsABlockerBetweenTheSelectedRangeAndThisDay(day) ||
      this.yesterdayOrEarlier(day))

  isUnselectable = (day: Date) =>
    this.props.selected.length === 0
      ? this.notSelectableNothingSelectedYet(day)
      : this.notSelectableSomeAlreadySelected(day)

  handlePrevWeekButton = () => {
    const prevWeek = subWeeks(this.state.date, 1)
    this.props.onWeekChange(prevWeek)
    this.setState({ date: prevWeek })
  }

  handleNextWeekButton = () => {
    const nextWeek = addWeeks(this.state.date, 1)
    this.props.onWeekChange(nextWeek)
    this.setState({ date: nextWeek })
  }

  hasNoBlockerBetweenCheckinDayAndNextWeek = () =>
    !this.thereIsABlockerBetweenTheSelectedRangeAndThisDay(
      addDays(endOfWeek(this.state.date), 1), // without adding a day it is saturday, which is not our end of the week
    )

  checkinDayEarlierThanThisWeek = () =>
    isBefore(this.props.selected[0], addDays(startOfWeek(this.state.date), 1)) // without adding a day it is sunday, which is not our start of the week

  renderDay = (day: Date, index: number) => {
    const { selected, isLoading, onSelect } = this.props

    if (isLoading) {
      return <BookingPickerSkeletonItem key={getDayOfYear(day)} />
    }
    return (
      <Day
        onSelect={onSelect}
        disabled={this.isUnselectable(day)}
        checked={selected.filter(date => isSameDay(date, day)).length > 0}
        key={getDayOfYear(day)}
        day={day}
        data-e2e={`booking-day-${index}`}
      >
        {this.notAvailableNotLastOfSelected(day) &&
          (selected.length && this.possibleOnlyForCheckout(day) ? (
            <Text color="grey" block={false} size="xs">
              &nbsp;
              <FormattedMessage
                id="booking.day-picker.only-checkout-available"
                description="Available only for check out"
                defaultMessage="Available only for check out"
              />
            </Text>
          ) : (
            <Text color="grey" block={false} size="xs">
              &nbsp;
              <FormattedMessage
                id="booking.day-picker.not-available"
                description="Not available"
                defaultMessage="Not Available"
              />
            </Text>
          ))}
        {this.isFirstOfSelected(day) && (
          <Text color="grey" block={false} size="xs">
            &nbsp;
            <FormattedMessage
              id="booking.day-picker.check-in-day"
              description="Check In Day"
              defaultMessage="Check In Day"
            />
          </Text>
        )}
        {this.isCheckoutDayAndNotCheckin(day) && (
          <Text color="grey" block={false} size="xs">
            &nbsp;
            <FormattedMessage
              id="booking.day-picker.check-out-day"
              description="Check Out Day"
              defaultMessage="Check Out Day"
            />
          </Text>
        )}
      </Day>
    )
  }

  disableBackButtonCheckinAlreadySelected = () =>
    !this.checkinDayEarlierThanThisWeek() ||
    isSameWeek(this.state.date, new Date(), {
      weekStartsOn: 1,
    })

  render() {
    const disableBackButtonCheckinAlreadySelected = this.disableBackButtonCheckinAlreadySelected()
    const disableNextButton = !this.hasNoBlockerBetweenCheckinDayAndNextWeek()
    return (
      <List>
        <ListItem>
          <View
            flex="flex"
            direction="row"
            alignH="space-between"
            alignV="center"
          >
            {this.props.selected.length === 0 ? (
              <Icon
                size="xs"
                name="arrow-left-filled"
                color="greyIntense"
                onClick={this.handlePrevWeekButton}
                {...css({
                  visibility:
                    isSameWeek(this.state.date, new Date(), {
                      weekStartsOn: 1,
                    }) && 'hidden',
                })}
              />
            ) : (
              <Icon
                size="xs"
                name="arrow-left-filled"
                color={'greyIntense'}
                onClick={
                  disableBackButtonCheckinAlreadySelected
                    ? undefined
                    : this.handlePrevWeekButton
                }
                {...css({
                  visibility:
                    disableBackButtonCheckinAlreadySelected && 'hidden',
                })}
              />
            )}
            <Text size="xl" strong color="secondary">
              <FormattedDate
                day="2-digit"
                month="short"
                year="2-digit"
                value={startOfISOWeek(this.state.date)}
              />
              {' - '}
              <FormattedDate
                day="2-digit"
                month="short"
                year="2-digit"
                value={lastDayOfISOWeek(this.state.date)}
              />
            </Text>
            {this.props.selected.length === 0 ? (
              <Icon
                size="xs"
                name="arrow-right-filled"
                color="greyIntense"
                onClick={this.handleNextWeekButton}
              />
            ) : (
              <Icon
                size="xs"
                name="arrow-right-filled"
                color="greyIntense"
                onClick={
                  disableNextButton ? undefined : this.handleNextWeekButton
                }
                {...css({
                  visibility: disableNextButton && 'hidden',
                })}
              />
            )}
          </View>
        </ListItem>
        <Week
          week={startOfISOWeek(this.state.date)}
          renderDay={this.renderDay}
        />
      </List>
    )
  }
}

export default NightPicker
