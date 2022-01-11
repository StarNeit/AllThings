import reduce from 'lodash-es/reduce'
import memoize from 'lodash-es/memoize'
import isBefore from 'date-fns/isBefore'
import isAfter from 'date-fns/isAfter'
import isSameDay from 'date-fns/isSameDay'
import isEqual from 'date-fns/isEqual'
import startOfWeek from 'date-fns/startOfWeek'
import startOfMonth from 'date-fns/startOfMonth'
import getDay from 'date-fns/getDay'
import {
  dateFromISO8601,
  injectHourMinuteIntoDate,
  endOfQuarterHour,
  startOfQuarterHour,
  addQuarterHours,
  subQuarterHours,
  isSameQuarterHour,
} from 'utils/date'
import startOfHour from 'date-fns/startOfHour'
import addHours from 'date-fns/addHours'
import subHours from 'date-fns/subHours'
import endOfHour from 'date-fns/endOfHour'
import isSameHour from 'date-fns/isSameHour'
export const AVAILABLES_FETCH_SIZE = 42
export const BOOKING_FUTURE_IN_DAYS = 42
export const MAX_BOOKABLE_SLOTS_FOR_A_PICKER = 96
export const MAX_AVAILABLES_LENGTH_SIZE = 42

import { IAvailability, ITime } from '.'

const days = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

/**
 * Transforms object of shape { monday: [], tuesday: [] ... } to
 * a dayOfWeek representation of the days like: { 1: [], 2: [] ... }
 * @param availableTimeSlots
 * @returns {*}
 */
export const transformAvailibilities = memoize(availableTimeSlots =>
  reduce(
    availableTimeSlots,
    (result, value, key) => {
      result[days.indexOf(key)] = value
      return result
    },
    {},
  ),
)

export const thereIsABlockerBetweenTheSelectedRangeAndThisSlot = ({
  slot,
  selectedTimeSlots,
  availableTimeSlots,
  availables,
  slotType,
  availablesUpdatedAt,
}: {
  slot: Date
  availableTimeSlots: IndexSignature<
    ReadonlyArray<{ from: string; to: string }>
  >
  selectedTimeSlots: ReadonlyArray<Date>
  availables: readonly IAvailability[]
  slotType: string
  availablesUpdatedAt: number
}) => {
  const endOfSlotFunction =
    slotType === 'quarterHour' ? endOfQuarterHour : endOfHour
  const startOfSlotFunction =
    slotType === 'quarterHour' ? startOfQuarterHour : startOfHour

  const addRangeFunction =
    slotType === 'quarterHour' ? addQuarterHours : addHours
  const subtractRangeFunction =
    slotType === 'quarterHour' ? subQuarterHours : subHours
  const isSameSlotFunction =
    slotType === 'quarterHour' ? isSameQuarterHour : isSameHour

  const [firstSlot] = selectedTimeSlots
  if (
    !checkAvailability({
      availableTimeSlots,
      availables,
      isSameSlotFunction,
      slot,
      endOfSlotFunction,
      startOfSlotFunction,
      availablesUpdatedAt,
    })
  ) {
    return true
  }
  if (isBefore(slot, firstSlot)) {
    let i = 0
    let currentSlot = slot
    while (i <= MAX_BOOKABLE_SLOTS_FOR_A_PICKER) {
      currentSlot = addRangeFunction(slot, i)
      if (isSameSlotFunction(currentSlot, firstSlot)) {
        return false
      } else if (
        !checkAvailability({
          availableTimeSlots,
          availables,
          isSameSlotFunction,
          slot: currentSlot,
          endOfSlotFunction,
          startOfSlotFunction,
          availablesUpdatedAt,
        })
      ) {
        return true
      }
      i++
    }
    return true
  } else if (isBefore(firstSlot, slot)) {
    let i = 0
    let currentSlot = slot
    while (i <= MAX_BOOKABLE_SLOTS_FOR_A_PICKER) {
      currentSlot = subtractRangeFunction(slot, i)
      if (isSameSlotFunction(currentSlot, firstSlot)) {
        return false
      } else if (
        !checkAvailability({
          availableTimeSlots,
          availables,
          isSameSlotFunction,
          slot: currentSlot,
          endOfSlotFunction,
          startOfSlotFunction,
          availablesUpdatedAt,
        })
      ) {
        return true
      }
      i++
    }
    return true
  } else {
    // clicked on the already selected slots
    return false
  }
}

const allUnselectedSlotsBetween = ({
  firstSlot,
  lastSlot,
  isSameSlotFunction,
  addRangeFunction,
  availableTimeSlots,
  availables,
  endOfSlotFunction,
  startOfSlotFunction,
  availablesUpdatedAt,
}: {
  firstSlot: Date
  lastSlot: Date
  isSameSlotFunction: (date1: Date, date2: Date) => boolean
  addRangeFunction: (date: Date, i: number) => Date
  availableTimeSlots: IndexSignature<
    ReadonlyArray<{ from: string; to: string }>
  >
  availables: readonly IAvailability[]
  endOfSlotFunction: (date: Date) => Date
  startOfSlotFunction: (date: Date) => Date
  availablesUpdatedAt: number
}) => {
  const slots = []
  let currentSlot = firstSlot
  let i = 0
  while (i++ <= MAX_BOOKABLE_SLOTS_FOR_A_PICKER) {
    currentSlot = addRangeFunction(firstSlot, i)
    if (isSameSlotFunction(currentSlot, lastSlot)) {
      return slots
    }
    if (
      checkAvailability({
        availableTimeSlots,
        availables,
        isSameSlotFunction,
        slot: currentSlot,
        endOfSlotFunction,
        startOfSlotFunction,
        availablesUpdatedAt,
      })
    ) {
      slots.push(currentSlot)
    }
  }
  return slots
}

export const allUnselectedSlotsBetweenSelectedRangeAndThisSlot = ({
  slot,
  selectedTimeSlots,
  isSameSlotFunction,
  addRangeFunction,
  availableTimeSlots,
  availables,
  endOfSlotFunction,
  startOfSlotFunction,
  availablesUpdatedAt,
}: {
  availableTimeSlots: IndexSignature<
    ReadonlyArray<{ from: string; to: string }>
  >
  availables: readonly IAvailability[]
  isSameSlotFunction: (date1: Date, date2: Date) => boolean
  slot: Date
  endOfSlotFunction: (date: Date) => Date
  startOfSlotFunction: (date: Date) => Date
  availablesUpdatedAt: number
  selectedTimeSlots: readonly Date[]
  addRangeFunction: (date: Date, i: number) => Date
}) => {
  const lastSelected = selectedTimeSlots[selectedTimeSlots.length - 1]
  if (!selectedTimeSlots.length || isSameSlotFunction(slot, lastSelected)) {
    return []
  }
  if (isBefore(slot, lastSelected)) {
    return allUnselectedSlotsBetween({
      availableTimeSlots,
      availables,
      endOfSlotFunction,
      startOfSlotFunction,
      firstSlot: slot,
      lastSlot: lastSelected,
      isSameSlotFunction,
      addRangeFunction,
      availablesUpdatedAt,
    })
  } else {
    return allUnselectedSlotsBetween({
      availableTimeSlots,
      availables,
      endOfSlotFunction,
      startOfSlotFunction,
      firstSlot: lastSelected,
      lastSlot: slot,
      isSameSlotFunction,
      addRangeFunction,
      availablesUpdatedAt,
    })
  }
}

export const keepOnlyEarlierSlotsThanClickedSlot = ({
  clickedSlot,
  isFirstSlotRemoved,
  isSameSlotFunction,
}: {
  clickedSlot: Date
  isFirstSlotRemoved: boolean
  isSameSlotFunction: (date1: Date, date2: Date) => boolean
}) => (alreadySelectedSlot: Date) =>
  !isSameSlotFunction(alreadySelectedSlot, clickedSlot) &&
  (isFirstSlotRemoved || !isBefore(clickedSlot, alreadySelectedSlot))

export const isBooked = ({
  availables,
  slotType,
  slot,
}: {
  availables: readonly IAvailability[]
  slotType: string
  slot: Date
}) => {
  const availabilityObject =
    availables &&
    availables.find(available =>
      isSameDay(new Date(dateFromISO8601(available.date)), slot),
    )
  if (!availabilityObject) {
    return false
  } else {
    return availabilityObject.bookedTimes.some(booked => {
      return slotType === 'quarterHour'
        ? isSameQuarterHour(injectHourMinuteIntoDate(booked.from, slot), slot)
        : isSameHour(injectHourMinuteIntoDate(booked.from, slot), slot)
    })
  }
}

export const checkAvailability = memoize(
  ({
    availableTimeSlots,
    availables,
    isSameSlotFunction,
    slot,
    endOfSlotFunction,
    startOfSlotFunction,
  }: {
    availableTimeSlots: IndexSignature<
      ReadonlyArray<{ from: string; to: string }>
    >
    availables: readonly IAvailability[]
    isSameSlotFunction: (date1: Date, date2: Date) => boolean
    slot: Date
    endOfSlotFunction: (date: Date) => Date
    startOfSlotFunction: (date: Date) => Date
    availablesUpdatedAt: number
  }) => {
    const availabilityObject = availables.find(available =>
      isSameDay(new Date(dateFromISO8601(available.date)), slot),
    )
    if (!availabilityObject) {
      return false
    } else {
      if (
        availabilityObject.blockedTimes.some(blocked =>
          isSameSlotFunction(
            injectHourMinuteIntoDate(blocked.from, slot),
            slot,
          ),
        )
      ) {
        return false
      }
      if (
        availabilityObject.bookedTimes.some(booked => {
          return isSameSlotFunction(
            injectHourMinuteIntoDate(booked.from, slot),
            slot,
          )
        })
      ) {
        return false
      }
      if (
        availabilityObject.availableTimes.some(available =>
          isSameSlotFunction(
            injectHourMinuteIntoDate(available.from, slot),
            slot,
          ),
        )
      ) {
        return true
      }
    }
    const timeslots = transformAvailibilities(availableTimeSlots)
    const dayOfWeek = getDay(slot)
    return timeslots[dayOfWeek].some((interval: ITime) => {
      const fromDate = injectHourMinuteIntoDate(interval.from, slot)
      const toDate = injectHourMinuteIntoDate(interval.to, slot)

      return (
        (isBefore(endOfSlotFunction(slot), toDate) ||
          isEqual(endOfSlotFunction(slot), toDate)) &&
        (isAfter(startOfSlotFunction(slot), fromDate) ||
          isEqual(startOfSlotFunction(slot), fromDate))
      )
    })
  },
  ({ slot, availablesUpdatedAt }) => `${slot.getTime()}${availablesUpdatedAt}`,
)

export const getSlotsBetweenIfAllFreeOrNothing = ({
  timeFrom = '00:00',
  timeTo = '00:00',
  addRangeFunction,
  date,
  availableTimeSlots,
  availables,
  isSameSlotFunction,
  endOfSlotFunction,
  startOfSlotFunction,
  availablesUpdatedAt,
}: {
  timeFrom: string
  timeTo: string
  addRangeFunction: (date: Date, i: number) => Date
  date: Date
  availableTimeSlots: IndexSignature<
    ReadonlyArray<{ from: string; to: string }>
  >
  availables: readonly IAvailability[]
  isSameSlotFunction: (date1: Date, date2: Date) => boolean
  endOfSlotFunction: (date: Date) => Date
  startOfSlotFunction: (date: Date) => Date
  availablesUpdatedAt: number
}) => {
  const slots = []
  let i = 0
  let currentDate = startOfSlotFunction(
    injectHourMinuteIntoDate(timeFrom, date),
  )
  while (
    isBefore(
      currentDate,
      startOfSlotFunction(injectHourMinuteIntoDate(timeTo, date)),
    )
  ) {
    if (
      !checkAvailability({
        availableTimeSlots,
        availables,
        isSameSlotFunction,
        slot: currentDate,
        endOfSlotFunction,
        startOfSlotFunction,
        availablesUpdatedAt,
      } as any)
    ) {
      return []
    }
    slots.push(currentDate)
    currentDate = addRangeFunction(currentDate, 1)
    i = i + 1
  }
  return slots
}

export const getFirstDayOfVisibleCalendarMonth = (date: Date) => {
  const firstDay = startOfMonth(date)
  if (getDay(firstDay) === 0) {
    return firstDay
  } else {
    return startOfWeek(firstDay)
  }
}

