import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router'

interface IProps {
  checkedIn?: boolean
  loggedIn?: boolean
  mustBeCheckedIn?: boolean
}

const PrivateRoute = ({
  component: Component,
  render,
  mustBeCheckedIn = true,
  checkedIn,
  loggedIn,
  location,
  noReferrer = false,
  path,
  ...rest
}: IProps & any) => (
  <Route
    {...rest}
    render={props =>
      loggedIn && (checkedIn || !mustBeCheckedIn) ? (
        render ? (
          render(props)
        ) : (
          <Component {...props} />
        )
      ) : (
        <Redirect
          to={{
            pathname: loggedIn
              ? '/check-in'
              : path === '/logout'
              ? '/'
              : '/login-redirect',
            search:
              !noReferrer &&
              `?referrer=${encodeURIComponent(
                `${props.location.pathname}${props.location.search}`,
              )}`,
          }}
        />
      )
    }
  />
)

export default connect((state: IReduxState) => ({
  checkedIn: state.authentication.isCheckedIn,
  loggedIn: state.authentication.loggedIn,
}))(PrivateRoute)
