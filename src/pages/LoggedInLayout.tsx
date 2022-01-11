import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash-es/get'
import { RouteComponentProps, withRouter } from 'react-router'
import { push } from 'connected-react-router'
import { View, Responsive } from '@allthings/elements'
import NotificationsOverlay, {
  NotificationsFetch,
} from 'containers/Notifications'
import ServiceChooser from 'components/ServiceChooser'
import DisconnectStatus from 'containers/DisconnectStatus'
import NotificationActions from 'store/actions/notifications'
import AppBar from 'components/AppBar'
import AppLayout from 'components/AppLayout'
import MicroappLayout from 'components/MicroappLayout'
import OnboardingContainer from 'containers/Onboarding/OnboardingContainer'
import OverlayToggle from 'components/OverlayToggle'
import ComposeOverlay from 'containers/ComposeOverlay'
import { getStaticImage } from 'utils/getStaticImage'
import loadImage from 'utils/loadImage'
import { Locale } from 'enums'

interface IProps {
  appSubTitle?: string
  appTitle?: string
  authentication: object
  backgroundImage?: string
  children: React.ReactElement<any>
  closedOverlay?: string
  country: string
  goTo: (path: string) => void
  isChooserVisible: boolean
  locale: Locale
  microApps: ReadonlyArray<MicroAppProps>
  notificationCount: number
  refreshNotifications: () => void
  welcomeMessagesDisabled?: boolean
}

interface IState {
  serviceChooserOpen: boolean
}

class LoggedIn extends React.Component<IProps & RouteComponentProps, IState> {
  state = {
    serviceChooserOpen: false,
  }

  async componentDidMount() {
    const backgroundImageUrl = this.props.backgroundImage
      ? this.props.backgroundImage
      : getStaticImage('city-background.png')

    try {
      const img = await loadImage(backgroundImageUrl)
      document.body.style.backgroundImage = `url(${img.src})`
    } catch (e) {
      document.body.style.backgroundImage = `url(${backgroundImageUrl})`
    }

    if (this.props.backgroundImage) {
      document.body.style.backgroundPosition = 'center center'
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundAttachment = 'fixed'
    }
  }

  toggleServiceChooser = () =>
    this.setState(({ serviceChooserOpen }) => ({
      serviceChooserOpen: !serviceChooserOpen,
    }))

  hideServiceChooser = () =>
    this.setState({
      serviceChooserOpen: false,
    })

  handleChooseService = ({
    openInNewWindow,
    url,
  }: {
    openInNewWindow: boolean
    url: string
  }) => {
    if (openInNewWindow) {
      window.open(url)
    } else {
      this.props.history.push(url)
    }
    this.toggleServiceChooser()
  }

  handleGoTo = (path: string) => {
    this.props.goTo(path)
    this.toggleServiceChooser()
  }

  handleLogoutClick = () => this.props.goTo('logout')

  handleNotificationFetch = () => this.props.refreshNotifications()

  render() {
    const {
      appSubTitle,
      appTitle,
      children,
      country,
      locale,
      microApps,
      notificationCount,
    } = this.props
    const { serviceChooserOpen } = this.state

    return (
      <OverlayToggle overlay={NotificationsOverlay}>
        {({ open: openNotifications }) => (
          <OverlayToggle overlay={ComposeOverlay}>
            {({ open: openCompose }) => (
              <View style={{ height: '100%' }} direction="row">
                <OnboardingContainer />
                <ServiceChooser
                  chooserVisible={serviceChooserOpen}
                  country={country}
                  locale={locale}
                  microApps={microApps}
                  onChooseService={this.handleChooseService}
                  onGoTo={this.handleGoTo}
                  onLogoutClick={this.handleLogoutClick}
                  subTitle={appSubTitle}
                  title={appTitle}
                  unreadCount={notificationCount}
                />
                <AppLayout>
                  <MicroappLayout active={serviceChooserOpen}>
                    {children}
                    <Responsive mobile tablet>
                      <AppBar
                        data-e2e="service-chooser-opener"
                        notificationCount={notificationCount}
                        onBellClick={openNotifications}
                        onPlusClick={openCompose}
                        onTileClick={this.toggleServiceChooser}
                        showClose={serviceChooserOpen}
                      />
                    </Responsive>
                  </MicroappLayout>
                </AppLayout>
                <NotificationsFetch onFetch={this.handleNotificationFetch} />
                <DisconnectStatus />
              </View>
            )}
          </OverlayToggle>
        )}
      </OverlayToggle>
    )
  }
}

const mapStateToProps = ({
  app,
  header,
  authentication,
  notifications,
}: IReduxState) => ({
  appSubTitle: get(app, 'config.usePropertyNameAsSubtitle', false)
    ? authentication.user.property.name
    : app.config.appSubTitle,
  appTitle: get(app, 'config.appTitle', app.config.appName),
  authentication,
  backgroundImage:
    app.config.backgroundImageURLs && app.config.backgroundImageURLs.original,
  country: app.config.country.toLowerCase(),
  isChooserVisible: header.serviceChooserVisible,
  locale: app.locale,
  microApps: app.microApps,
  notificationCount: notifications.unreadCount,
  welcomeMessagesDisabled: app.config.welcomeMessagesDisabled,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goTo: (path: string) => dispatch(push(`/${path}`)),
  refreshNotifications: () => dispatch(NotificationActions.refreshAll()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(LoggedIn))
