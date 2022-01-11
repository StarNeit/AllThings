import NoCookiesPage from 'pages/NoCookiesPage'
import React from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { guessBrowser } from 'utils/guessBrowser'

interface IProps {
  userAgent?: string
}

class NoCookiesContainer extends React.PureComponent<IProps & DispatchProp> {
  handleLogoClick = () => {
    this.props.dispatch(push('/'))
  }

  getBrowserInformation = (browser: string) => {
    const information = {
      ie: {
        image: 'explorer.png',
        name: 'Microsoft Internet Explorer',
        link:
          'https://support.microsoft.com/help/17442/windows-internet-explorer-delete-manage-cookies',
      },
      chrome: {
        image: 'chrome.png',
        name: 'Google Chrome',
        link: 'https://support.google.com/accounts/answer/61416',
      },
      edge: {
        image: 'edge.png',
        name: 'Microsoft Edge',
        link:
          'https://answers.microsoft.com/en-us/windows/forum/apps_windows_10-msedge/edge-how-do-i-enable-cookies/275b58e3-d741-4b21-8042-3059b1902d0e',
      },
      opera: {
        image: 'opera.png',
        name: 'Opera',
        link: 'https://www.opera.com/help/tutorials/security/privacy/',
      },
      safari: {
        image: 'safari.png',
        name: 'Safari',
        link: 'https://support.apple.com/kb/ph21411',
      },
      firefox: {
        image: 'firefox.png',
        name: 'Mozilla Firefox',
        link:
          'https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences',
      },
      unknown: {
        image: 'keks.png',
        name: 'Unknown',
        link: null as unknown,
      },
    }

    return information[browser]
  }

  render() {
    const browser = guessBrowser(this.props.userAgent)
    const browserInfo = this.getBrowserInformation(browser)

    return (
      <NoCookiesPage
        onLogoClick={this.handleLogoClick}
        browserInfo={browserInfo}
      />
    )
  }
}

export default connect((state: IReduxState) => ({
  userAgent: state.app.userAgent,
}))(NoCookiesContainer)
