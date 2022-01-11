import React from 'react'
import withRequest, { IWithRequest } from 'containers/withRequest'
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl'
import {
  CardButton,
  confirm as confirmWithUser,
  Text,
} from '@allthings/elements'
import { BookingStatuses } from 'microapps/booking/index'

const messages = defineMessages({
  requestCancellation: {
    id: 'booking.are-you-sure-2',
    description:
      'Are you sure you want to proceed with the cancellation? Click "OK" to send your request to the booking manager.',
    defaultMessage:
      'Are you sure you want to proceed with the cancellation? Click "OK" to send your request to the booking manager.',
  },
  cancelBooking: {
    id: 'booking.are-you-sure-3',
    description:
      'Are you sure you want to proceed with the cancellation? Click "OK" to cancel your booking immediately.',
    defaultMessage:
      'Are you sure you want to proceed with the cancellation? Click "OK" to cancel your booking immediately.',
  },
  acceptButtonLabel: {
    id: 'booking.okay-cancel-booking-button',
    description: 'Accept label for "Are you sure you want to cancel booking?"',
    defaultMessage: 'OK',
  },
  cancelButtonLabel: {
    id: 'booking.cancel-cancel-booking-button',
    description: 'Cancel label for "Are you sure you want to cancel booking?"',
    defaultMessage: 'Cancel',
  },
})

interface IProps {
  bookingId: string
  needsConfirmation: boolean
  newStatus: BookingStatuses.CANCELED | BookingStatuses.CANCELLATION_REQUESTED
  refetch: () => void
}

class CancelBookingButton extends React.Component<
  IProps & InjectedIntlProps & IWithRequest
> {
  cancelBooking = async () => {
    const { bookingId, createRequest, newStatus, refetch } = this.props

    await createRequest({
      method: 'PATCH',
      path: `api/v1/bookings/${bookingId}`,
      entity: {
        status: newStatus,
      },
    })
    refetch()
  }

  handleClick = async () => {
    const { formatMessage } = this.props.intl
    const { newStatus } = this.props

    const customization = {
      acceptButtonLabel: formatMessage(messages.acceptButtonLabel),
      cancelButtonLabel: formatMessage(messages.cancelButtonLabel),
      message: formatMessage(
        newStatus === 'cancellation-requested'
          ? messages.requestCancellation
          : messages.cancelBooking,
      ),
    }
    const userIsCertain = await confirmWithUser(customization)

    if (userIsCertain) {
      this.cancelBooking()
    }
  }

  render() {
    const { newStatus } = this.props
    return (
      <CardButton onClick={this.handleClick}>
        <Text size="m" strong>
          {newStatus === 'cancellation-requested' ? (
            <FormattedMessage
              id="booking.request-cancel-button"
              description="Label of the button to request cancel a booking"
              defaultMessage="Request cancellation"
            />
          ) : (
            <FormattedMessage
              id="booking.cancel-button"
              description="Label of the button to cancel a booking"
              defaultMessage="Cancel this booking"
            />
          )}
        </Text>
      </CardButton>
    )
  }
}

export default withRequest(injectIntl(CancelBookingButton))
