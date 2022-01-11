import {
  NotificationBubble,
  NotificationBubbleManager,
  ThemeProvider,
} from '@allthings/elements'
import Mixpanel from 'components/Analytics/Mixpanel'
import AppMaintenancePage from 'pages/AppMaintenancePage'
import EmbeddedLayout from 'pages/EmbeddedLayout'
import LoggedInLayout from 'pages/LoggedInLayout'
import LoggedOutLayout from 'pages/LoggedOutLayout'
import ProjectSetupPage from 'pages/ProjectSetupPage'
import React from 'react'
import { GatewayDest, GatewayProvider } from 'react-gateway'
import { Helmet } from 'react-helmet'
import { RouteComponentProps } from 'react-router'
import logBrowserError from 'utils/logBrowserError'
import { getTheme } from 'utils/themes'

const APPLE_SIZES = ['120x120', '152x152', '167x167', '180x180']

const SHOW_NATIVE_INSTALL_BANNER_APP_IDS = [
  '575027e58178f56a008b4568', // app.dev.allthings.me / app.staging.allthings.me
  '5a002755c1663b5c008b4c59', // office.allthings.app
  '5a79a14937dc86004e030f14', // Kunzareal
]

interface IProps {
  analytics?: {
    appID: string
    user: IUser
    userId?: string
  }
  appID?: string
  appName?: string
  checkedIn?: boolean

  configError?: number
  connected?: boolean
  favIcon?: string
  loggedIn?: boolean
  onRequestAccessToken: () => void
  pinboardColor?: string
  sessionReady?: boolean
  status?: 'error' | 'ok'
  theme?: string
  // Wether to use the embedded layout or not.
  // The embedded layout only shows the content, with no menus.
  useEmbeddedLayout?: boolean
}

class RootLayout extends React.PureComponent<IProps & RouteComponentProps> {
  intervalId: number = null

  async componentDidMount() {
    this.intervalId = window.setInterval(this.props.onRequestAccessToken, 1000)
  }

  componentDidCatch(error: Error, info: any) {
    // tslint:disable:no-console
    console.error(error)
    info && console.info(info)
    // tslint:enable:no-console
    logBrowserError(error)
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId)
  }

  apps: readonly unknown[] = []

  reloadPage = () => {
    location && location.reload()
  }

  renderProjectSetupPage = () => (
    <ProjectSetupPage onLogoClick={this.reloadPage} />
  )

  renderMaintenancePage = () => (
    <AppMaintenancePage onLogoClick={this.reloadPage} />
  )

  renderContent = () => {
    if (this.props.status === 'error') {
      if (this.props.configError === 404) {
        return this.renderProjectSetupPage()
      } else {
        return this.renderMaintenancePage()
      }
    } else if (this.props.sessionReady) {
      const Layout =
        this.props.loggedIn && this.props.checkedIn
          ? this.props.useEmbeddedLayout
            ? EmbeddedLayout
            : LoggedInLayout
          : LoggedOutLayout

      return <Layout>{this.props.children}</Layout>
    } else {
      return null
    }
  }

  renderLinks = () => {
    const { favIcon: href } = this.props
    const links: Array<{
      rel: string
      href: string
      sizes?: string
      type?: string
    }> = [
      // Default.
      {
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
        href,
      },
      // Android add to homescreen recommanded image format.
      // https://developer.chrome.com/multidevice/android/installtohomescreen
      {
        rel: 'icon',
        sizes: '192x192',
        type: 'image/png',
        href,
      },
      // Apple add to homescreen recommanded image formats.
      // https://developer.apple.com/ios/human-interface-guidelines/graphics/app-icon/
      ...APPLE_SIZES.map(sizes => ({
        rel: 'apple-touch-icon',
        sizes,
        type: 'image/png',
        href,
      })),
    ]

    if (this.shouldShowInstallBanner()) {
      // Google Web App Manifest
      // Shows the Google Play Store install prompt on Android
      // https://developers.google.com/web/fundamentals/web-app-manifest/
      links.push({
        rel: 'manifest',
        href: `${process.env.CDN_HOST_URL_PREFIX || ''}/static/manifest.json`,
      })
    }

    links.push({
      rel: 'manifest',
      href: '/manifest',
    })

    return links.map(link => (
      <link key={`${link.rel}-${link.sizes}`} {...link} />
    ))
  }

  renderMeta = () => {
    const { appName, favIcon } = this.props
    const meta: Array<{ name: string; content: string }> = [
      { name: 'application-name', content: appName },
      { name: 'apple-mobile-web-app-title', content: appName },
    ]

    if (favIcon) {
      meta.push({ name: 'msapplication-TileImage', content: favIcon })
    }

    if (this.shouldShowInstallBanner()) {
      // iOS Install Banner trigger
      // https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html
      // We should maybe pass the current route to it?
      meta.push({
        name: 'apple-itunes-app',
        content: 'app-id=1326113666',
      })
    }

    return meta.map(m => (
      <meta key={m.name} name={m.name} content={m.content} />
    ))
  }

  renderBubble = (props: any) => {
    // We don't know the active microapp on this level right now.
    // Since notifications are only used in pinboard right now,
    // the primary color is set to the pinboard color.
    return (
      <ThemeProvider theme={{ primary: this.props.pinboardColor }}>
        <NotificationBubble data-e2e="notification-bubble" {...props} />
      </ThemeProvider>
    )
  }

  render() {
    const chosenTheme = this.props.theme || 'dark'
    const theme = getTheme(chosenTheme)

    return (
      <ThemeProvider theme={theme}>
        <GatewayProvider>
          <NotificationBubbleManager
            style={{ height: '100%' }}
            renderBubble={this.renderBubble}
          >
            <Mixpanel {...this.props.analytics} />
            <Helmet defaultTitle={this.props.appName || 'Allthings'}>
              {this.renderLinks()}
              {this.renderMeta()}
            </Helmet>
            {this.renderContent()}
            <GatewayDest name="root" />
          </NotificationBubbleManager>
        </GatewayProvider>
      </ThemeProvider>
    )
  }

  private shouldShowInstallBanner = (): boolean => {
    const { appID, useEmbeddedLayout } = this.props
    return (
      appID &&
      !useEmbeddedLayout &&
      SHOW_NATIVE_INSTALL_BANNER_APP_IDS.indexOf(appID) > -1
    )
  }
}

export default RootLayout
