import React from 'react'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import queryString from 'query-string'
import Auth from 'store/actions/authentication'
import {
  getAuthorizationUrlAndState,
  saveOAuthState,
} from 'utils/accountsOAuth'
import { LandingPage } from '.'

interface IProps {
  clientId: string
  hostname: string
  userLoggedInBefore: boolean
}

const mapStateToProps = (state: IReduxState) => ({
  clientId: state.app.config.clientID,
  hostname: state.app.hostname,
  userLoggedInBefore: state.app.userLoggedInBefore,
})

const AccountsLoginRedirect: React.FC<
  IProps & RouteComponentProps & DispatchProp
> = ({ hostname, clientId, dispatch }) => {
  useEffect(() => {
    dispatch(Auth.loggingIn())

    const { referrer, signup } = queryString.parse(window.location.search)

    const isSignup =
      !!signup || (referrer && referrer.includes('check-in')) || false

    const { url, state } = getAuthorizationUrlAndState({
      clientId,
      hostname,
      isSignup,
    })

    saveOAuthState(state, referrer || '/')

    window.location.href = url
  }, [])

  return <LandingPage />
}

export default withRouter(connect(mapStateToProps)(AccountsLoginRedirect))
