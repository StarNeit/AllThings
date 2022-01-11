import differenceInSeconds from 'date-fns/differenceInSeconds'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import isSameHour from 'date-fns/isSameHour'
import addSeconds from 'date-fns/addSeconds'
import subSeconds from 'date-fns/subSeconds'
import startOfHour from 'date-fns/startOfHour'
import setMinutes from 'date-fns/setMinutes'
import setHours from 'date-fns/setHours'

// returns Date from ISO8601
// f.e. "Fri Jan 01 2016 01:00:00 GMT+0100 (CET)" from "2016-01-01"
export function dateFromISO8601(isoDateString: string) {
  if (isoDateString) {
    const parts = isoDateString.match(/\d+/g) as any
    // tslint:disable:no-bitwise
    const isoTime = Date.UTC(
      parts[0],
      parts[1] - 1,
      parts[2],
      parts[3] | ('00' as any),
      parts[4] | ('00' as any),
      parts[5] | ('00' as any),
    )
    // tslint:enable:no-bitwise

    return new Date(isoTime)
  }

  return new Date()
}

// returns array with ISO8601 values from Date
// f.e. "[2016-01-01, 01:00:00.707Z]" from "Fri Jan 01 2016 01:00:00 GMT+0100 (CET)"
export function ISO8601FromDate(dateObj: Date) {
  if (Object.prototype.toString.call(dateObj) !== '[object Date]') {
    return new Error('Date object expected.')
  }

  if (Date.prototype.toISOString) {
    return dateObj.toISOString().split('T')
  } else {
    const pad = (num: number) => (num < 10 ? '0' + num : num)
    return [
      `${dateObj.getUTCFullYear()}-${pad(dateObj.getUTCMonth() + 1)}-${pad(
        dateObj.getUTCDate(),
      )}`,
      `${pad(dateObj.getUTCHours())}:${pad(dateObj.getUTCMinutes())}:${pad(
        dateObj.getUTCSeconds(),
      )}.${(dateObj.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)}Z`,
    ]
  }
}

export function isToday(date: Date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return new Error('Date object expected.')
  }
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function isYesterday(date: Date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return new Error('Date object expected.')
  }
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export function isAYearAgo(date: Date) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    return new Error('Date object expected.')
  }
  const lastYear = new Date()
  lastYear.setDate(lastYear.getDate() - 365)

  return (
    date.getDate() <= lastYear.getDate() &&
    date.getMonth() <= lastYear.getMonth() &&
    date.getFullYear() <= lastYear.getFullYear()
  )
}

export const isSameQuarterHour = (quarterHour1: Date, quarterHour2: Date) => {
  if (!isSameHour(quarterHour1, quarterHour2)) {
    return false
  }
  const startHour = startOfHour(quarterHour1)
  return (
    Math.floor(differenceInSeconds(quarterHour1, startHour) / 900) ===
    Math.floor(differenceInSeconds(quarterHour2, startHour) / 900)
  )
}

export const startOfQuarterHour = (quarterHour: Date) => {
  const startHour = startOfHour(quarterHour)
  const diff = differenceInSeconds(quarterHour, startHour)
  return addSeconds(startHour, Math.floor(diff / 900) * 900)
}

export const endOfQuarterHour = (quarterHour: Date) => {
  const startHour = startOfHour(quarterHour)
  const diff = differenceInSeconds(quarterHour, startHour)
  return addSeconds(startHour, (Math.floor(diff / 900) + 1) * 900 - 1)
}

export const differenceInQuarterHours = (end: Date, start: Date) => {
  return differenceInMinutes(end, start) / 15
}

export const addQuarterHours = (quarterHour: Date, num: number) =>
  addSeconds(quarterHour, 900 * num)
export const subQuarterHours = (quarterHour: Date, num: number) =>
  subSeconds(quarterHour, 900 * num)

export const adjustApiTimeToFrontendTime = (date: Date) =>
  new Date(date.valueOf() + new Date(date).getTimezoneOffset() * 60000)

export const adjustFrontendTimeToApiTime = (date: Date) =>
  new Date(date.valueOf() - new Date(date).getTimezoneOffset() * 60000)

export const injectHourMinuteIntoDate = (hourMinute: string, date: Date) => {
  const hm = hourMinute.split(':')
  const h = parseInt(hm[0], 10)
  const m = parseInt(hm[1], 10)
  return setHours(setMinutes(date, m), h)
}
