import React from 'react'
import { FormattedMessage } from 'react-intl'
import { View, Button, Text } from '@allthings/elements'
import BookingFailureIcon from './BookingFailureIcon'
import styles from './BookingStyles'

interface IProps {
  restartDatePickerProcess: () => void
  redFlags: boolean
}

const BookingFailure = ({ restartDatePickerProcess, redFlags }: IProps) => (
  <View
    direction="column"
    alignV="center"
    alignH="space-around"
    {...styles.mainContainer}
  >
    <View flex="flex" direction="column" alignV="center" alignH="space-around">
      <Text
        size="xl"
        color="secondary"
        strong
        align="center"
        {...styles.paddingTop}
      >
        <FormattedMessage
          id="booking.failure.sorry"
          description="Something went wrong."
          defaultMessage="Something went wrong."
        />
      </Text>
      <Text
        size="xl"
        color="secondary"
        strong
        align="center"
        {...styles.paddingBot}
      >
        <FormattedMessage
          id="booking.failure.sorry-2"
          description="Please try again."
          defaultMessage="Please try again."
        />
      </Text>
      <BookingFailureIcon />
      <Text align="center" color="grey" {...styles.padding}>
        {redFlags ? (
          <FormattedMessage
            id="booking.failure.sorry-4"
            description="Although we received your payment, there was an error creating your booking. Please contact support for a recharge!"
            defaultMessage="Although we received your payment, there was an error creating your booking. Please contact support for a recharge!"
          />
        ) : (
          <FormattedMessage
            id="booking.failure.sorry-3"
            description="An error occurred during your booking. Please try it again"
            defaultMessage="An error occurred during your booking. Please try it again"
          />
        )}
      </Text>
      <Button
        data-e2e="booking-restart-button"
        onClick={restartDatePickerProcess}
      >
        <Text strong align="center" color="textOnBackground">
          <FormattedMessage
            id="booking.failure.restart-process"
            description="Restart the booking process"
            defaultMessage="Restart the booking process"
          />
        </Text>
      </Button>
    </View>
  </View>
)

export default BookingFailure
