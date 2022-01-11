import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

const COOKIE_NAME = 'cookie_checker'
const NO_COOKIES_ROUTE = '/no-cookies'

interface IProps {
  callback?: () => void
}

class CookieChecker extends React.Component<IProps & RouteComponentProps> {
  componentDidMount() {
    this.launchBrowserTest()
  }

  async checkCookies() {
    const response = await fetch('/cookie-monster', { credentials: 'include' })
    const { pathname } = this.props.location

    if (response.status === 400) {
      this.redirectTo(NO_COOKIES_ROUTE)

      // Execute the callback if propagated down.
      this.props.callback && this.props.callback()
    }

    if (response.status === 200 || response.status === 304) {
      this.removeDummyCookie()

      if (pathname === NO_COOKIES_ROUTE) {
        this.redirectTo('/')
      }
    }
  }

  launchBrowserTest() {
    // Set a cookie on the client-side.
    this.setDummyCookie()
    // Use the server endpoint to get the status of cookies.
    this.checkCookies()
  }

  redirectTo(path: string) {
    this.props.history.push(path)
  }

  removeDummyCookie() {
    window.document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`
  }

  setDummyCookie() {
    window.document.cookie = `${COOKIE_NAME}=true; path=/;`
  }

  render() {
    return null as React.Component
  }
}

export default withRouter(CookieChecker)
