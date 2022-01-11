import React from 'react'
import { css } from 'glamor'
import { FormattedMessage } from 'react-intl'
import { View, Button, Text, Spacer } from '@allthings/elements'
import BookingSuccessIcon from './BookingSuccessIcon'
import { IAsset } from '.'
import { ColorPalette } from '@allthings/colors'
import styles from './BookingStyles'

interface IProps {
  asset: IAsset
  goToMyBookings: () => void
  onClickBookAgain: () => void
  onClickAddToCalendar: () => void
}

const BookingSuccess = ({
  asset: { accessControlUiUrl, requiresApproval },
  goToMyBookings,
  onClickBookAgain,
  onClickAddToCalendar,
}: IProps) => (
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
          id="booking.success.congrats"
          description="Congratulations!"
          defaultMessage="Congratulations!"
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
          id="booking.success.congrats-2"
          description="We have received your booking"
          defaultMessage="We have received your booking"
        />
      </Text>
      <BookingSuccessIcon requiresApproval={requiresApproval} />
      {requiresApproval && (
        <Text align="center" color="grey" {...styles.padding}>
          <FormattedMessage
            id="booking.success.needs-approval"
            description="Remember your booking needs to be approved. We will notify you about that"
            defaultMessage="Remember your booking needs to be approved. We will notify you about that"
          />
        </Text>
      )}
      {!requiresApproval && (
        <Text align="center" color="grey" {...styles.padding}>
          <FormattedMessage
            id="booking.success.no-needs-approval"
            description="Your booking has been approved."
            defaultMessage="Your booking has been approved."
          />
        </Text>
      )}
      <View direction="column" {...css({ width: '40%' })}>
        {accessControlUiUrl && !requiresApproval ? (
          <FormattedMessage
            id="booking-overlay.visit-booking-access-center"
            description="Visit booking access control center"
            defaultMessage="Manage Access"
          >
            {message => <Button onClick={goToMyBookings}>{message}</Button>}
          </FormattedMessage>
        ) : (
          <FormattedMessage
            id="booking-overlay.visit-booking"
            description="Visit booking"
            defaultMessage="Visit booking"
          >
            {message => <Button onClick={goToMyBookings}>{message}</Button>}
          </FormattedMessage>
        )}
        <Spacer />
        <FormattedMessage
          id="booking-overlay.book-again"
          description="Book again"
          defaultMessage="Book again"
        >
          {message => (
            <Button
              secondary
              color={ColorPalette.text.primary}
              data-e2e="booking-success-button"
              onClick={onClickBookAgain}
            >
              {message}
            </Button>
          )}
        </FormattedMessage>
        <Spacer />

        <FormattedMessage
          id="booking-overlay.add-to-calendar"
          description="Link to add the booking to a calendar"
          defaultMessage="Add to calendar"
        >
          {message => (
            <Button
              secondary
              color={ColorPalette.text.primary}
              data-e2e="booking-add-to-calendar-button"
              onClick={onClickAddToCalendar}
            >
              {message}
            </Button>
          )}
        </FormattedMessage>
      </View>
    </View>
  </View>
)

export default BookingSuccess
