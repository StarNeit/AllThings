import { Icon, Relative, Text, View } from '@allthings/elements'
import React from 'react'
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl'
import { adjustApiTimeToFrontendTime, dateFromISO8601 } from 'utils/date'
import { BookingStatuses, IBooking } from '.'
import AssetListItem from './AssetListItem'
import { messages as sharedMessages } from './messages'
import TimeInterval from './TimeInterval'

const iconMap = {
  confirmed: 'check-filled',
  unconfirmed: 'sand-glass-filled',
  declined: 'remove-light-filled',
  canceled: 'remove-light-filled',
  'cancellation-requested': 'sand-glass-filled',
} as const

interface IProps {
  booking: IBooking
  onBookingClick: OnClick
  active: boolean
}

class BookingListItem extends React.Component<IProps & InjectedIntlProps> {
  handleClick = () => this.props.onBookingClick(this.props.booking.id)

  render() {
    const { active, booking, intl } = this.props

    return (
      <AssetListItem
        active={active}
        key={booking.id}
        asset={booking._embedded.asset}
        onClick={this.handleClick}
      >
        <View direction="column">
          <Text size="xl" strong color="primary">
            {booking._embedded.asset.priceOnRequest ? (
              intl.formatMessage(sharedMessages.priceOnRequest)
            ) : booking.grossTotal ? (
              <FormattedNumber
                style="currency"
                value={booking.grossTotal}
                currency={booking._embedded.asset.currency}
              />
            ) : (
              <FormattedMessage
                id="booking-overlay.asset-is-free"
                description="display free if asset has no fees"
                defaultMessage="free"
              />
            )}
          </Text>
          <View direction="row" alignV="start" alignH="start">
            {booking.status in iconMap && (
              <Relative top={-3}>
                <Icon size={10} color="grey" name={iconMap[booking.status]} />
              </Relative>
            )}
            <View style={{ paddingLeft: 5 }}>
              <Text
                size="s"
                strong
                color="grey"
                lineThrough={
                  booking.status === BookingStatuses.CANCELED ||
                  booking.status === BookingStatuses.CANCELLATION_REQUESTED ||
                  booking.status === BookingStatuses.DECLINED
                }
              >
                <TimeInterval
                  size="s"
                  dateFrom={adjustApiTimeToFrontendTime(
                    dateFromISO8601(booking.dateFrom),
                  )}
                  dateTo={adjustApiTimeToFrontendTime(
                    dateFromISO8601(booking.dateTo),
                  )}
                  type={booking._embedded.asset.timeSlotUnit}
                />
              </Text>
            </View>
          </View>
        </View>
      </AssetListItem>
    )
  }
}

export default injectIntl(BookingListItem)
