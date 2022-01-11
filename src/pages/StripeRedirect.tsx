import queryString from 'query-string'
import React, { Fragment } from 'react'
import Script from 'react-load-script'
import { FormattedMessage } from 'react-intl'
import { Absolute } from '@allthings/elements'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  location: Location
}

interface IState {
  errorMsg: string
}

// global Stripe instance provided via https://js.stripe.com/v3/
declare const Stripe: (
  sessionId: string,
) => {
  redirectToCheckout: ({
    sessionId,
  }: {
    sessionId: string
  }) => Promise<{
    readonly error?: {
      readonly message: string
    }
  }>
}

class StripeRedirect extends React.Component<IProps, IState> {
  getInitialState = (): IState => ({
    errorMsg: null,
  })

  state = this.getInitialState()

  onStripeScriptLoad = async () => {
    const query = queryString.parse(this.props.location.search)
    const stripe = Stripe(query.apiKey)
    const result = await stripe.redirectToCheckout({
      sessionId: query.sessionId,
    })
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `result.error.message`.
    this.setState({
      errorMsg: result.error && result.error.message,
    })
  }

  handleStripeFailed = () => {
    // @TODO: This method was missing... we should should do something here!
  }

  render() {
    return (
      <Fragment>
        <Absolute
          {...css({
            background: ColorPalette.white,
            width: '100%',
            height: '100%',
          })}
          top={0}
          left={0}
        >
          {this.state.errorMsg && (
            <FormattedMessage
              id="stripe-redirect.redirect-fail"
              description="Error message to show when the stripe library fails to load"
              defaultMessage="An error occurred. Retry again later."
            />
          )}
        </Absolute>
        <Script
          url="https://js.stripe.com/v3/"
          onError={this.handleStripeFailed}
          onLoad={this.onStripeScriptLoad}
        />
      </Fragment>
    )
  }
}

export default StripeRedirect
