import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import qs from 'query-string'

const SignUpRedirect = ({ location }: RouteComponentProps) => {
  const { code } = qs.parse(location.search)

  return <Redirect to={`/check-in${code ? `?code=${code}` : ''}`} />
}

export default SignUpRedirect
