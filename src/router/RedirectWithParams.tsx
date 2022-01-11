import React from 'react'
import {
  Route,
  Redirect,
  RedirectProps,
  RouteComponentProps,
} from 'react-router'
import * as pathToRegexp from 'path-to-regexp'

interface IProps extends Pick<RedirectProps, 'exact' | 'from' | 'push'> {
  to: string
}

const RedirectWithParams = ({ exact, from, push, to }: IProps) => {
  const pathTo = pathToRegexp.compile(to)
  return (
    <Route
      exact={exact}
      path={from}
      component={({ match: { params } }: RouteComponentProps) => (
        <Redirect to={pathTo(params)} push={push} />
      )}
    />
  )
}

export default RedirectWithParams
