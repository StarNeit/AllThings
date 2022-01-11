import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { Text } from '@allthings/elements'
import { TimeSlotType } from '.'

const i18n = defineMessages({
  day: {
    id: 'booking.per-day',
    description: 'Booking costs per day',
    defaultMessage: '/day',
  },
  night: {
    id: 'booking.per-night',
    description: 'Booking costs per night',
    defaultMessage: '/night',
  },
  hour: {
    id: 'booking.per-hour',
    description: 'Booking costs per day',
    defaultMessage: '/hour',
  },
  'quarter-hour': {
    id: 'booking.per-quarter-hour',
    description: 'Booking costs per 1/4 hour',
    defaultMessage: '/quarter hour',
  },
  base: {
    id: 'booking.asset.base-fee',
    description: 'base fee of a bookable asset',
    defaultMessage: 'base fee',
  },
  baseParentheses: {
    id: 'booking.asset-list',
    description: 'Base fee',
    defaultMessage: '(base fee)',
  },
})

interface IProps {
  timeSlot: TimeSlotType
}

class TimeSlot extends React.Component<IProps & InjectedIntlProps & any> {
  render() {
    const { timeSlot, intl, ...props } = this.props
    return (
      <Text {...props}>
        {i18n[timeSlot] && intl.formatMessage(i18n[timeSlot])}
      </Text>
    )
  }
}

export default injectIntl(TimeSlot)
