import { Text } from '@allthings/elements'
import withRequest, { IWithRequest } from 'containers/withRequest'
import queryString from 'query-string'
import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { extractCookie } from 'utils/cookie'
import { replace } from 'connected-react-router'
import { RouteComponentProps } from 'react-router-dom'
import { PaymentStatus } from 'enums'
import qs from 'query-string'

interface IProps {
  navigate: (assetId: string, state?: IndexSignature) => void
}

const PaymentOutcome = (props: IProps & IWithRequest & RouteComponentProps) => {
  const [hasError, setHasError] = React.useState(false)
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>(null)

  const updatePaymentStatusAndContinue = async (
    sessionId: string,
    key: string,
    status: PaymentStatus,
  ) => {
    const response = await props.createRequest({
      method: 'POST',
      path: `api/v1/unsecured-payments/${sessionId}`,
      entity: {
        key,
      },
    })

    const returnTo = extractCookie(document.cookie, sessionId)

    if (returnTo) {
      const params = qs.stringify({
        paymentSessionId: sessionId,
        stripePublishableKey: key,
        paymentStatus: status,
        ...(status === PaymentStatus.SUCCESS
          ? {
              entityId: response.entity.paidObject.objectId,
            }
          : {}),
      })

      props.navigate(`${returnTo}?${params}`)
    } else {
      window.close()
    }
  }

  React.useEffect(() => {
    const { session_id: sessionId, key, status } = queryString.parse(
      props.location.search,
    )

    if (!(status && sessionId && key)) {
      setHasError(true)
      return
    }

    setPaymentStatus(status as PaymentStatus)

    updatePaymentStatusAndContinue(sessionId, key, status as PaymentStatus)
  }, [])

  if (!hasError && !paymentStatus) {
    return null
  }

  if (paymentStatus === PaymentStatus.SUCCESS) {
    return (
      <Text>
        <FormattedMessage
          id="payment-outcome.success"
          description="Payment succeeded, you can now close this tab"
          defaultMessage="Payment succeeded, you can now close this tab"
        />
      </Text>
    )
  }

  return (
    <Text>
      <FormattedMessage
        id="payment-outcome.failure"
        description="An error occurred, you can now close this tab"
        defaultMessage="An error occurred, you can now close this tab"
      />
    </Text>
  )
}

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  navigate: (pathname: string, state?: IndexSignature) =>
    dispatch(replace({ pathname, state })),
})

export default withRequest(connect(null, mapDispatchToProps)(PaymentOutcome))
