import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router'
import auth from 'store/actions/authentication'

interface IProps {
  redirectAfterLogin: (referrer: string) => void
  referrer?: string
}

const RedirectAfterAuth: React.FunctionComponent<IProps> = ({
  referrer = null,
  redirectAfterLogin,
}) => {
  useEffect(() => {
    referrer && redirectAfterLogin(referrer)
  }, [referrer, redirectAfterLogin])

  return <Route path="*" match render={() => null} />
}

export default connect(
  null,
  (dispatch: FunctionalDispatch) => ({
    redirectAfterLogin: (redirectTo: string) =>
      dispatch(auth.redirectAfterLogin(redirectTo)),
  }),
)(RedirectAfterAuth)
