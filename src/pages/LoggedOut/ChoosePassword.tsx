import React from 'react'
import { connect, DispatchProp } from 'react-redux'
import withRequest, { IWithRequest } from 'containers/withRequest'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { View, Form, Text } from '@allthings/elements'
import { TermsAndDataPrivacy } from 'components/SignUp'
import { DoublePasswordInputElementsForm } from 'components/Form'
import getDataProtectionURL from 'utils/getDataProtectionURL'
import get from 'lodash-es/get'
import Recaptcha from 'components/Recaptcha'
import { TwoStatesLoginButton } from 'pages/LoggedOut'
import ErrorMessage from 'components/ErrorMessage'
import { push } from 'connected-react-router'
import WithAppIntro from 'pages/AppIntroContainer'
import { RouteComponentProps } from 'react-router'
import { Locale } from 'enums'
import { ThemeProvider } from '@allthings/elements'

const FALLBACK_LOCALE = Locale.en_US

const messages = defineMessages({
  info: {
    id: 'choose-password.info',
    description:
      'The info for setting the new password when user is registered by someone else',
    defaultMessage: 'Please set a password for your new account.',
  },
  password: {
    id: 'choose-password.password',
    description: 'Placeholder for the password input field',
    defaultMessage: 'Password',
  },
  passwordConfirm: {
    id: 'choose-password.password-confirm',
    description: 'Placeholder for the password confirmation input field',
    defaultMessage: 'Password confirmation',
  },
  buttonTextInactive: {
    id: 'login.login-button-pending',
    description: "Button label for the login button when it's pending",
    defaultMessage: 'Hang in tight...',
  },
  buttonTextActive: {
    id: 'login.login-button',
    description: 'Button label for the login button',
    defaultMessage: 'Login',
  },
  serverError: {
    id: 'choose-password.server-error',
    description:
      'When user gets invited throug cockpit by admin, but because of a server error they cant be logged in with the provided token.',
    defaultMessage:
      'Uh oh... Something went wrong... Unfortunately we could not log you in with this method. Please try again later or contact the administrator you got this invitation from.',
  },
  termsAndDataPrivacyError: {
    id: 'signup.terms-and-data-privacy-error',
    description: 'Terms of use and data privacy error in the signup form',
    defaultMessage:
      'Please accept the terms of use and the data protection conditions.',
  },
})

interface IProps {
  country: string
  locale?: Locale
}

interface IState {
  readonly dataProtection: boolean
  readonly dataProtectionURL: string
  readonly termsOfUse: boolean
  readonly pending: boolean
  readonly errorMessage: string
}

class ChoosePassword extends React.PureComponent<
  IProps &
    InjectedIntlProps &
    RouteComponentProps<{ token: string }> &
    DispatchProp &
    IWithRequest,
  IState
> {
  state: IState = {
    dataProtection: false,
    dataProtectionURL: null,
    termsOfUse: false,
    pending: false,
    errorMessage: null,
  }

  async componentDidMount() {
    const { country, locale } = this.props
    const dataProtectionURL = await getDataProtectionURL({
      country,
      locale,
      localeFallback: FALLBACK_LOCALE,
    })
    this.setState({ dataProtectionURL })
  }

  onSubmit = async (_: unknown, data: any) => {
    const {
      intl: { formatMessage },
      createRequest,
      match: {
        params: { token },
      },
      dispatch,
    } = this.props
    const { dataProtection, termsOfUse } = this.state
    if (!dataProtection || !termsOfUse) {
      this.setState({
        errorMessage: formatMessage(messages.termsAndDataPrivacyError),
      })
      return
    }
    this.setState({ pending: true })
    const {
      status: { code },
    } = await createRequest({
      method: 'POST',
      path: `auth/password-reset/${token}`,
      clientID: true,

      entity: {
        plainPassword: data.password,
        recaptcha: data.recaptcha,
      },
    })
    if (code === 200) {
      dispatch(push('/login-redirect'))
    } else {
      this.setState({
        pending: false,
        errorMessage: formatMessage(messages.serverError),
      })
    }
  }

  handleDataProtection = () =>
    this.setState({ dataProtection: !this.state.dataProtection })
  handleTermsOfUse = () => this.setState({ termsOfUse: !this.state.termsOfUse })
  dismissErrorMessage = () => this.setState({ errorMessage: null })

  render() {
    const {
      intl: { formatMessage },
      locale,
    } = this.props
    const {
      dataProtection,
      termsOfUse,
      dataProtectionURL,
      pending,
      errorMessage,
    } = this.state
    return (
      <WithAppIntro>
        <ThemeProvider theme={{ primary: ColorPalette.lightBlueIntense }}>
          <Text
            align="center"
            color={ColorPalette.text.secondary}
            size="giant"
            strong
            {...css({ marginTop: '12px' })}
          >
            <FormattedMessage
              id="choose-password.title"
              description="The title for setting the password"
              defaultMessage="Choose password!"
            />
          </Text>
          {!errorMessage && (
            <Text
              align="center"
              color={ColorPalette.greyIntense}
              {...css({ margin: '18px 0px 12px 0px' })}
            >
              {formatMessage(messages.info)}
            </Text>
          )}
          {errorMessage && (
            <ErrorMessage
              data-e2e="select-password-error-message"
              onClick={this.dismissErrorMessage}
              {...css({ margin: '30px 0' })}
            >
              {errorMessage}
            </ErrorMessage>
          )}
          <Form onSubmit={this.onSubmit}>
            <DoublePasswordInputElementsForm
              placeholder={formatMessage(messages.password)}
              repeatPlaceholder={formatMessage(messages.passwordConfirm)}
              containerStyle={{
                border: `1px solid ${ColorPalette.lightGreyIntense}`,
              }}
            />
            <TermsAndDataPrivacy
              dataProtectionURL={dataProtectionURL}
              dataProtection={dataProtection}
              termsOfUse={termsOfUse}
              onDataProtection={this.handleDataProtection}
              onTermsOfUse={this.handleTermsOfUse}
            />
            {get(this, 'state.error.entity.errors.captcha') && <Recaptcha />}
            <View
              direction="column"
              alignH="center"
              {...css({ backgroundColor: ColorPalette.lightGreyIntense })}
            >
              <TwoStatesLoginButton
                locale={locale}
                pending={!!pending}
                activeText={formatMessage(messages.buttonTextActive)}
                inactiveText={formatMessage(messages.buttonTextInactive)}
              />
            </View>
          </Form>
        </ThemeProvider>
      </WithAppIntro>
    )
  }
}

const mapStateToProps = ({
  app: {
    config: { country },
    locale,
  },
  authentication: { isCheckedIn },
}: IReduxState) => ({
  country: country.toLowerCase(),
  locale,
  isCheckedIn,
})

export default connect(mapStateToProps)(withRequest(injectIntl(ChoosePassword)))
