import React from 'react'
import { FormattedMessage } from 'react-intl'
import { css } from 'glamor'
import { View } from '@allthings/elements'

import OAuthButtonIcon from './OAuthButtonIcon'
import TwoStates from 'components/TwoStates'
import LoginButton from 'components/LoginButton'
import NoOp from 'utils/noop'

const twoStatesItem = css({
  height: '35px',
})

interface IProps {
  onClick: OnClick
  pending: boolean
}

const FacebookLoginButton = ({ onClick = NoOp, pending }: IProps) => {
  const handleFacebookLogin = (e: React.MouseEvent) => {
    e.preventDefault()

    // Skip the redirection if the output of the onClick method is falsy.
    if (!onClick(e)) {
      return false
    }

    window.location.href =
      'https://www.facebook.com/dialog/oauth?scope=email&client_id=' +
      '1133859079980005' +
      '&redirect_uri=' +
      encodeURI(
        window.location.protocol +
          '//' +
          window.location.hostname +
          '/login?provider=facebook',
      ) +
      '&response_type=token'

    return false
  }

  return (
    <LoginButton
      flavour="facebook"
      onClick={handleFacebookLogin}
      style={{
        height: '40px',
        margin: 0,
        overflow: 'hidden',
        padding: '4px 8px',
      }}
    >
      <OAuthButtonIcon type="social-facebook" />
      <TwoStates active={pending ? 0 : 1} style={{ marginLeft: '30px' }}>
        <View
          alignH="center"
          alignV="center"
          direction="row"
          {...twoStatesItem}
        >
          <FormattedMessage
            id="login.fb-button-pending"
            description="Button label for the social-login button when it's pending (shouldn't be too long!)"
            defaultMessage="Hold on..."
          />
        </View>
        <View
          alignH="center"
          alignV="center"
          data-e2e="login-facebook-button-label"
          direction="row"
          {...twoStatesItem}
        >
          Facebook
        </View>
      </TwoStates>
    </LoginButton>
  )
}

export default FacebookLoginButton
