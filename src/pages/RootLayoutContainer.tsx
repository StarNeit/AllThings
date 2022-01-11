import React from 'react'
import { connect } from 'react-redux'
import Auth from 'store/actions/authentication'
import RootRouter from './RootRouter'
import { withRouter, RouteComponentProps } from 'react-router'
import RootLayout from './RootLayout'
import { getStaticImage } from 'utils/getStaticImage'
import sendNativeEvent from 'utils/sendNativeEvent'

const ALLTHINGS_LOGO = 'logo192x192.png'

interface IProps {
  /* Wether the access token should be updated or not */
  updateToken: boolean
  useEmbeddedLayout: boolean
  accessToken?: string
}

class RootLayoutContainer extends React.PureComponent<
  IProps & DispatchProp & RouteComponentProps<any>
> {
  unlisten: () => void = null

  componentDidMount() {
    if (this.props.useEmbeddedLayout) {
      this.unlisten = this.props.history.listen(location => {
        if (this.props.location.pathname !== location.pathname) {
          sendNativeEvent(this.props.accessToken, {
            name: 'path-change',
            data: location.pathname,
          })
        }
      })
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten()
    }
  }

  updateAccessToken = () => {
    this.props.updateToken && this.props.dispatch(Auth.refreshToken())
  }

  render() {
    const { dispatch, ...props } = this.props
    return (
      <RootLayout {...props} onRequestAccessToken={this.updateAccessToken}>
        <RootRouter />
      </RootLayout>
    )
  }
}

export default withRouter(
  connect(({ app, authentication }: IReduxState) => ({
    analytics: {
      appID: app.config.appID,
      userId: authentication.loggedIn ? authentication.user.id : undefined,
      user: authentication.user,
    },
    useEmbeddedLayout: app.embeddedLayout,
    accessToken: authentication.accessToken,
    updateToken: !!authentication.accessTokenExpires,
    pinboardColor: app.microApps
      .filter(({ type }: { type: string }) => type === 'community-articles')
      .reduce((_: unknown, val: MicroAppProps) => val.color, null),
    connected: app.connected,
    appName: app.config.appName,
    appID: app.config.appID,
    theme: app.config.theme,
    favIcon:
      // Either use the icon from the config.
      (app.config.iconURLs && app.config.iconURLs['192x192']) ||
      // Or fallback to the Allthings icon.
      getStaticImage(ALLTHINGS_LOGO),
    status: app.status,
    configError: app.configError,
    sessionReady: authentication.sessionReady,
    loggedIn: authentication.loggedIn,
    checkedIn: authentication.isCheckedIn,
  }))(RootLayoutContainer),
)
