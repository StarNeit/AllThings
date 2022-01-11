import React, { Component } from 'react'
import { connect } from 'react-redux'
import sendNativeEvent from 'utils/sendNativeEvent'
import { mixpanel } from 'utils/track'

interface IConnectedProps {
  accessToken?: string
  isNative?: boolean
}

export interface IInjectedMixpanelProps {
  mixpanel: (eventName: string, trackInformation?: IndexSignature) => void
}

export default <P extends IInjectedMixpanelProps>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<Omit<P, keyof IInjectedMixpanelProps>> => {
  class ComponentWithMixpanel extends Component<IConnectedProps> {
    sendMixpanelEvent = (
      eventName: string,
      trackInformation?: IndexSignature,
    ) => {
      const { accessToken, isNative } = this.props
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line:no-console
        console.info('mixpanel', eventName, trackInformation)
      }

      if (isNative) {
        sendNativeEvent(accessToken, {
          name: 'mixpanel',
          data: { eventName, trackInformation },
        })
      } else {
        mixpanel(eventName, trackInformation)
      }
    }

    render() {
      const { accessToken, isNative, ...props } = this.props

      return (
        <WrappedComponent mixpanel={this.sendMixpanelEvent} {...(props as P)} />
      )
    }
  }

  return connect((state: IReduxState) => ({
    accessToken: state.authentication.accessToken,
    isNative: state.app.embeddedLayout,
  }))(ComponentWithMixpanel) as any
}
