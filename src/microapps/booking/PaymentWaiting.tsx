import { ColorPalette } from '@allthings/colors'
import { View, Button, Spacer, Text } from '@allthings/elements'
import withRequest, { IWithRequest } from 'containers/withRequest'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { PaymentStatus } from '../../enums'
import styles from './BookingStyles'
import BookingWaitingIcon from './BookingWaitingIcon'

const POLLING_INTERVAL = 1500

interface IProps {
  onStatusChange: (booking: any, status: PaymentStatus) => void
  paymentStatus: PaymentStatus
  paymentSessionId: string
  stripePublishableKey: string
  onBack: () => void
}

const PaymentWaiting = (props: IProps & IWithRequest) => {
  const checkPayment = async () => {
    const response = await props.createRequest({
      method: 'GET',
      path: `api/v1/payments/${props.paymentSessionId}`,
      params: {
        polling: true,
      },
    })
    const paymentStatus = response.entity.outcome || PaymentStatus.FAILURE
    if (paymentStatus !== props.paymentStatus) {
      props.onStatusChange(response.entity.paidObject.objectId, paymentStatus)
    }
  }

  React.useEffect(() => {
    const intervalId = setInterval(checkPayment, POLLING_INTERVAL)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <View
      direction="column"
      alignV="center"
      alignH="space-around"
      {...styles.mainContainer}
    >
      <View
        flex="flex"
        direction="column"
        alignV="center"
        alignH="space-around"
      >
        <Text
          size="xl"
          color="secondary"
          strong
          align="center"
          {...styles.paddingTop}
        >
          <FormattedMessage
            id="payment-waiting.waiting-title"
            description="Waiting for payment"
            defaultMessage="Waiting for payment"
          />
        </Text>
        <BookingWaitingIcon />
        <Text align="center" color="grey" {...styles.padding}>
          <FormattedMessage
            id="payment-waiting.waiting-text"
            description="We're right now waiting for your payment. Click here to restart the payment process."
            defaultMessage="We're right now waiting for your payment. {clickHere} to restart the payment process."
            values={{
              clickHere: (
                <Link
                  to={`/stripe-redirect?sessionId=${props.paymentSessionId}&apiKey=${props.stripePublishableKey}`}
                  target="_blank"
                >
                  <FormattedMessage
                    id="payment-waiting.click-here"
                    description="Click here to restart the payment process"
                    defaultMessage="Click here"
                  />
                </Link>
              ),
            }}
          />
        </Text>

        <Spacer />
        <Button
          secondary
          color={ColorPalette.text.primary}
          onClick={props.onBack}
        >
          <FormattedMessage
            id="payment-waiting.back"
            description="Back"
            defaultMessage="Back"
          />
        </Button>
      </View>
    </View>
  )
}

export default withRequest(PaymentWaiting)
