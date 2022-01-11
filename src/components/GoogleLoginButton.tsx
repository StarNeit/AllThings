import React from 'react'
import { FormattedMessage } from 'react-intl'
import { css } from 'glamor'
import { View } from '@allthings/elements'

import OAuthButtonIcon from './OAuthButtonIcon'
import LoginButton from 'components/LoginButton'
import TwoStates from 'components/TwoStates'
import NoOp from 'utils/noop'

const twoStatesItem = css({
  height: '35px',
})

const getGoogleUrl = () =>
  'https://accounts.google.com/o/oauth2/auth?scope=email%20profile&client_id=' +
  '330035088223-ub1qm9l4gqpvqmjfut6kgdu8edvjdqnu.apps.googleusercontent.com' +
  '&redirect_uri=' +
  encodeURI(
    window.location.protocol +
      '//' +
      window.location.hostname +
      '/login?provider=google',
  ) +
  '&response_type=token'

const isWebViewSafari = () =>
  typeof navigator !== 'undefined' && (navigator as any).standalone

interface IProps {
  onClick: OnClick
  pending: boolean
}

const GoogleLoginButton = ({ onClick = NoOp, pending }: IProps) => {
  const handleGoogleLogin = (e: MouseEvent) => {
    e.preventDefault()

    // Skip the redirection if the output of the onClick method is falsy.
    if (!onClick(e)) {
      return false
    }

    window.location.href = getGoogleUrl()

    return false
  }

  const renderButton = (handleClick: OnClick) => (
    <LoginButton
      flavour="google"
      onClick={handleClick}
      style={{
        height: '40px',
        margin: 0,
        overflow: 'hidden',
        padding: '4px 8px',
      }}
    >
      <OAuthButtonIcon type="social-google" />
      <TwoStates active={pending ? 0 : 1} style={{ marginLeft: '30px' }}>
        <View
          alignH="center"
          alignV="center"
          direction="row"
          {...twoStatesItem}
        >
          <FormattedMessage
            id="login.google-button-pending"
            description="Button label for the social-login button when it's pending (shouldn't be too long!)"
            defaultMessage="Hold on..."
          />
        </View>
        <View
          alignH="center"
          alignV="center"
          data-e2e="login-google-button-label"
          direction="row"
          {...twoStatesItem}
        >
          Google
        </View>
      </TwoStates>
    </LoginButton>
  )

  // For safari mobile standalone we need to open a browser,
  // because google doesnt allow safari standalone as a user agent any more.
  return isWebViewSafari() ? (
    <a href={getGoogleUrl()} target="_blank" rel="noopener">
      {renderButton(onClick)}
    </a>
  ) : (
    renderButton(handleGoogleLogin)
  )
}

export default GoogleLoginButton
