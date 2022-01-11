import { Button, Text, View } from '@allthings/elements'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import BookingWaitingIcon from './BookingWaitingIcon'
import styles from './BookingStyles'
import Link from 'components/Link'

const PaymentStarter = ({
  targetUrl,
  onPaymentStart,
}: {
  targetUrl: string
  onPaymentStart: () => void
}) => (
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
          id="payment-starter.payment-process"
          description="Payment Process"
          defaultMessage="Payment Process"
        />
      </Text>
      <BookingWaitingIcon />
      <Text align="center" color="grey" {...styles.padding}>
        <FormattedMessage
          id="payment-starter.external-service-notice"
          description="Our payment process is done by an external service provider."
          defaultMessage="Our payment process is done by an external service provider."
        />
      </Text>

      <Text align="center" color="grey" {...styles.padding}>
        <FormattedMessage
          id="payment-starter.external-service-notice-2"
          description="Click the button below to be redirected to our payment provider."
          defaultMessage="Click the button below to be redirected to our payment provider."
        />
      </Text>

      <Link to={targetUrl}>
        <Button
          onClick={() => {
            onPaymentStart()
          }}
        >
          <FormattedMessage
            id="payment-starter.start-payment"
            description="Starts the payment"
            defaultMessage="Start the payment process"
          />
        </Button>
      </Link>
    </View>
  </View>
)

export default connect(
  (
    { app: { embeddedLayout, hostname } }: any,
    ownProps: { paymentSessionId: string; stripePublishableKey: string },
  ) => {
    const url = `/stripe-redirect?sessionId=${ownProps.paymentSessionId}&apiKey=${ownProps.stripePublishableKey}`

    return {
      /** We want to open Stripe page in a browser window on native, and
       * `open-external-link` on native requires absolute URL to be provided
       */
      targetUrl: embeddedLayout ? `https://${hostname}${url}` : url,
    }
  },
)(PaymentStarter)
