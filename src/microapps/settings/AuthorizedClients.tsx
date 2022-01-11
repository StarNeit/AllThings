import { connect } from 'react-redux'
import { css } from 'glamor'
import { push } from 'connected-react-router'
import React from 'react'
import { SimpleLayout, View, ListSpinner } from '@allthings/elements'

import Microapp from 'components/Microapp'
import getServiceHost from 'utils/getServiceHost'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

const STYLES = {
  iframe: (isLoaded: boolean) =>
    css({
      border: 'none',
      display: 'flex',
      height: '100%',
      width: '100%',
      visibility: isLoaded ? 'visible' : 'hidden',
      zIndex: 13,
    }),
  iframeHolder: css({
    height: '100%',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
  }),
  spinner: css({
    marginTop: '10px',
  }),
  spinnerContainer: css({
    height: 0,
  }),
}

interface IProps {
  authorizedClientsUrl: string
  config: MicroAppProps
  navigateToSettings: OnClick
}

class AuthorizedClients extends React.Component<IProps> {
  state = { isIframeLoaded: false }

  onIframeLoad = () => this.setState({ isIframeLoaded: true })

  render() {
    const { authorizedClientsUrl, navigateToSettings } = this.props
    const { isIframeLoaded } = this.state

    return (
      <Microapp>
        <GenericBackTitleBar onBack={navigateToSettings} />
        <SimpleLayout>
          <View {...STYLES.iframeHolder}>
            {!isIframeLoaded && (
              <View {...STYLES.spinnerContainer}>
                <ListSpinner {...STYLES.spinner} />
              </View>
            )}
            <iframe
              data-e2e={`authorized-clients-iframe-${
                isIframeLoaded ? 'ready' : 'loading'
              }`}
              onLoad={this.onIframeLoad}
              src={authorizedClientsUrl}
              {...STYLES.iframe(isIframeLoaded)}
            />
          </View>
        </SimpleLayout>
      </Microapp>
    )
  }
}

const mapStateToProps = ({ app }: IReduxState) => ({
  authorizedClientsUrl: `https://${getServiceHost(
    app.hostname,
    'accounts',
  )}/oauth/authorized-clients`,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  navigateToSettings: () => dispatch(push('/settings')),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizedClients)
