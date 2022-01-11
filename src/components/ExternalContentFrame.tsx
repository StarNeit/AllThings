import React from 'react'
import { css } from 'glamor'
import { View, SimpleLayout, ListSpinner } from '@allthings/elements'
import { AppTitle } from 'containers/App'
import Microapp from 'components/Microapp'
import { MicroApps } from 'enums'
import { connect } from 'react-redux'
import getExternalMicroAppURL from 'utils/getExternalMicroAppURL'
import BigTitleBar from './TitleBar/BigTitleBar'

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

interface IProps extends Partial<MicroAppProps> {
  appId: string
  embeddedLayout: boolean
  hostname: string
  locale: string
  microAppId?: string
  microAppType: MicroApps
}

class ExternalContentFrame extends React.Component<IProps> {
  static defaultProps = {
    microAppType: MicroApps.EXTERNAL_CONTENT,
  }

  state = {
    isIframeLoaded: false,
  }

  onIframeLoad = () => this.setState({ isIframeLoaded: true })

  render() {
    const { locale, url, label, navigationHidden } = this.props
    const { isIframeLoaded } = this.state

    return (
      <Microapp>
        <SimpleLayout padded={'horizontal'}>
          {!navigationHidden && (
            <>
              <AppTitle>{label}</AppTitle>
              <BigTitleBar title={label[locale]} />
            </>
          )}
          {/* TODO: Adapt padding for embeddedLayout and iPhoneX (aka add paddingTop!) */}
          <View {...STYLES.iframeHolder}>
            {!isIframeLoaded && (
              <View {...STYLES.spinnerContainer}>
                <ListSpinner {...STYLES.spinner} />
              </View>
            )}
            <iframe
              onLoad={this.onIframeLoad}
              src={this.getURL(url)}
              data-e2e={`external-content-iframe-${
                isIframeLoaded ? 'ready' : 'loading'
              }`}
              {...STYLES.iframe(isIframeLoaded)}
            />
          </View>
        </SimpleLayout>
      </Microapp>
    )
  }

  private getURL = (url: string): string => {
    return getExternalMicroAppURL({
      appId: this.props.appId,
      hostname: this.props.hostname,
      url,
    })
  }
}

const mapStateToProps = ({ app }: IReduxState) => ({
  appId: app.config.appID,
  embeddedLayout: app.embeddedLayout,
  hostname: app.hostname,
  locale: app.locale,
})

export default connect(mapStateToProps)(ExternalContentFrame)
