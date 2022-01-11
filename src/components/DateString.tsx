import { defineMessages } from 'react-intl'
import { isToday, isYesterday } from 'utils/date'

const messages = defineMessages({
  today: {
    id: 'datetime.today',
    description: 'Dates when they are "today"',
    defaultMessage: 'Today, {time}',
  },
  yesterday: {
    id: 'yesterday',
    description: 'Dates that are "yesterday"',
    defaultMessage: 'Yesterday, {time}',
  },
  datetime: {
    id: 'datetime.string',
    description: 'Formatted dateTime string',
    defaultMessage: '{dateString}',
  },
})

export function localizeDate(date: Date, intl: InjectedIntl) {
  let dateString
  const time = intl.formatTime(date, {
    hour: 'numeric',
    minute: 'numeric',
  })

  if (isToday(date)) {
    dateString = intl.formatMessage(messages.today, { time })
  } else if (isYesterday(date)) {
    dateString = intl.formatMessage(messages.yesterday, { time })
  } else {
    dateString = intl.formatTime(date, {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
  }

  return intl.formatMessage(messages.datetime, { dateString, time })
}
