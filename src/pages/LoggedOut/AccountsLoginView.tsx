import { ColorPalette } from '@allthings/colors'
import { Button, Spacer, Spinner, Text, View } from '@allthings/elements'
import { Locale } from 'enums'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { css } from 'glamor'

const DEFAULT_PADDING_PX = 10

interface IProps {
  config: IReduxState['app']['config']
  isLoggingIn: boolean
  locale: Locale
  onClick?: OnClick
  signup?: boolean
}

const AccountsLoginView: React.FC<IProps & RouteComponentProps> = ({
  config,
  history,
  isLoggingIn,
  locale,
}) => {
  const handleAccountsLogin = (signup = false) => {
    history.push(`/login-redirect${signup ? '?signup=true' : ''}`)
    return false
  }

  return isLoggingIn ? (
    <View alignH="center" alignV="center" direction="row">
      <Spinner size={20} color={ColorPalette.blue} />
      <Spacer width={DEFAULT_PADDING_PX} />
      <FormattedMessage
        defaultMessage="Hold on..."
        description="Button label for button starting the accounts login when it's pending (shouldn't be too long!)"
        id="login-accounts.button-pending"
      />
    </View>
  ) : (
    <View direction="column" alignH="center" alignV="center">
      <View
        alignH="center"
        alignV="center"
        direction="row"
        {...css({ width: '100%' })}
      >
        <Button
          backgroundColor={ColorPalette.blue}
          data-e2e-active-locale={locale}
          data-e2e="login-accounts-button"
          disabled={isLoggingIn}
          onClick={() => handleAccountsLogin(false)}
          style={{ width: '100%' }}
        >
          <FormattedMessage
            defaultMessage="Login"
            description="Button label for button starting the accounts login"
            id="login-accounts.login-button"
          />
        </Button>
        <Spacer width={DEFAULT_PADDING_PX} />
        <Button
          backgroundColor={ColorPalette.white}
          data-e2e="register-accounts-button"
          disabled={isLoggingIn}
          onClick={() => handleAccountsLogin(true)}
          secondary
          style={{
            border: `1px solid ${ColorPalette.blue}`,
            width: '100%',
          }}
        >
          <Text color={ColorPalette.blue}>
            <FormattedMessage
              defaultMessage="Register"
              description="Button label for button starting the accounts login"
              id="login-accounts.signup-button"
            />
          </Text>
        </Button>
      </View>
      {config?.loginMessage?.[locale] && (
        <Text
          color={ColorPalette.greyIntense}
          data-e2e="login-message"
          {...css({ paddingTop: DEFAULT_PADDING_PX })}
        >
          {config.loginMessage[locale]}
        </Text>
      )}
    </View>
  )
}

export default connect((state: IReduxState) => ({
  config: state.app.config,
  isLoggingIn: state.authentication && state.authentication.isLoggingIn,
  locale: state.app.locale,
}))(withRouter(AccountsLoginView))
