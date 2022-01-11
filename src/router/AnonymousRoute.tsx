import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, RouteProps } from 'react-router'
import qs from 'query-string'

interface IProps extends IPublicProps {
  loggedIn?: boolean
}

const AnonymousRoute = ({
  component: Component,
  render,
  loggedIn,
  redirectToAfterLogin,
  ...rest
}: IProps) => (
  <Route
    {...rest}
    render={props =>
      !loggedIn ? (
        (render && render(props)) || <Component {...props} />
      ) : (
        <Redirect to={redirectToAfterLogin} />
      )
    }
  />
)

interface IPublicProps extends RouteProps {
  component: React.ComponentType<any>
  redirectToAfterLogin?: string
}

export default connect((state: IReduxState, ownProps: IPublicProps) => ({
  loggedIn: state.authentication.loggedIn,
  redirectToAfterLogin:
    ownProps.redirectToAfterLogin ||
    qs.parse(ownProps.location.search).referrer ||
    state.authentication.redirectToAfterLogin ||
    '/',
}))(AnonymousRoute)
