import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import get from 'lodash-es/get'
import { Form } from 'containers/Form'
import Link from 'components/Link'
import { Text } from '@allthings/elements'
import DoublePasswordInput, {
  ValidationRules as DoublePasswordInputValidationRules,
} from 'components/Form/DoublePasswordInput'
import FormGroup from 'components/Form/FormGroup'
import FormGroupItem from 'components/Form/FormGroupItem'
import InputError from 'components/Form/InputError'
import TextInput from 'components/Form/TextInput'
import Recaptcha from 'components/Recaptcha'
import { TwoStatesLoginButton } from 'pages/LoggedOut'
import withMixpanel from 'containers/withMixpanel'
import { push } from 'connected-react-router'
import WithAppIntro from '../AppIntroContainer'
import { RouteComponentProps } from 'react-router'
import { IApiRequest, IApiResponse } from 'store/api'

const messages = defineMessages({
  token: {
    id: 'password-reset.wrong-token',
    description: 'Error when the user enters a wrong password token',
    defaultMessage: 'Your password token is invalid or has expired.',
  },
  unknown: {
    id: 'password-reset.unknown-error',
    description:
      'The error message when resetting the password fails for unknown reason',
    defaultMessage: 'Something went wrong. Please retry!',
  },
  info: {
    id: 'password-reset.info',
    description: 'The info for setting the new password',
    defaultMessage:
      'Enter the reset token you received via email and set your new password.',
  },
  infoWithToken: {
    id: 'password-reset.info-with-token',
    description:
      'The info for setting the new password if the token is already passed.',
    defaultMessage: 'Enter your new password and hit the save button.',
  },
  tip: {
    id: 'password-reset.tip',
    description: 'The tip for setting the new password',
    defaultMessage: 'Also check your spam folder',
  },
  tipWithToken: {
    id: 'password-reset.tip-with-token',
    description:
      'The tip for setting the new password when the token is already passed',
    defaultMessage: 'Tip: Choose a password that is save and easy to remember',
  },
  tokenPlaceholder: {
    id: 'password-reset.token-field-placeholder',
    description: 'The placeholder for the token field',
    defaultMessage: 'Token',
  },
  passwordPlaceholder: {
    id: 'password-reset.password-field-placeholder',
    description: 'The placeholder for the password field',
    defaultMessage: 'Password',
  },
  passwordRepeatPlaceholder: {
    id: 'password-reset.password-repeat-field-placeholder',
    description: 'The placeholder for the password-repeat field',
    defaultMessage: 'Repeat password',
  },
  buttonTextInactive: {
    id: 'password-reset.submit-button-pending',
    description: 'Label for the reset button pending state',
    defaultMessage: 'Setting it back...',
  },
  buttonTextActive: {
    id: 'password-reset.submit-button',
    description: 'Button label for the submit button',
    defaultMessage: 'Set password',
  },
})

interface IProps {
  form: {
    status: string
  }
  message?: string
  mixpanel: (eventName: string, trackInformation?: object) => void
  status?: string
}

interface IState {
  readonly error: IApiResponse
}

class PasswordReset extends React.PureComponent<
  IProps &
    DispatchProp &
    InjectedIntlProps &
    RouteComponentProps<{ token: string }>,
  IState
> {
  name = 'password-reset'
  state: IState = { error: null }

  handleSuccess = () => this.props.dispatch(push('/login-redirect'))

  handleSubmit = () => {
    this.setState({ error: undefined })

    return true
  }

  handleError = (error: IApiResponse) => this.setState({ error })

  buildRequest = ({
    password: plainPassword,
    recaptcha,
    token,
  }: {
    readonly password: string
    readonly recaptcha: string
    readonly token: string
  }): IApiRequest => {
    return {
      method: 'POST',
      path: 'auth/password-reset/' + (this.props.match.params.token || token),
      clientID: true,
      entity: {
        plainPassword,
        recaptcha,
      },
    }
  }

  renderError = ({
    error,
    formatMessage,
  }: {
    error: IApiResponse
    formatMessage: InjectedIntl['formatMessage']
  }) => (
    <InputError data-e2e="password-reset-token-error-hint">
      {this.renderErrorMessage({ error, formatMessage })}
    </InputError>
  )

  shouldRenderTokenField = (params: { readonly token: string }) =>
    !params.token ||
    (this.state &&
      this.state.error &&
      this.state.error.status.code === 404 &&
      params.token)

  renderErrorMessage = ({
    error: { status, token },
    formatMessage,
  }: {
    error: IApiResponse
    formatMessage: InjectedIntl['formatMessage']
  }) => {
    const messageKey = status.code === 404 || token ? 'token' : 'unknown'
    const message = formatMessage(messages[messageKey])
    this.props.mixpanel('accounts.error', {
      error_message: message,
      error_key: messages[messageKey].id,
    })
    return message
  }

  passwordResetInfo = ({
    formatMessage,
    params,
  }: {
    formatMessage: InjectedIntl['formatMessage']
    params: any
  }) => formatMessage(messages[!params.token ? 'info' : 'infoWithToken'])

  passwordResetTip = ({
    formatMessage,
    params,
  }: {
    formatMessage: InjectedIntl['formatMessage']
    params: any
  }) => formatMessage(messages[!params.token ? 'tip' : 'tipWithToken'])

  /*
   * Render the password-token field if the token is not provided in the url OR
   * the api responses with an error and the token is provided in the url
   */
  passwordResetTokenField = ({
    formatMessage,
    params,
  }: {
    formatMessage: InjectedIntl['formatMessage']
    params: any
  }) => (
    <FormGroupItem>
      <TextInput
        data-e2e="password-reset-token"
        name="token"
        placeholder={formatMessage(messages.tokenPlaceholder)}
        value={params.token}
        style={{ backgroundColor: ColorPalette.white }}
      />
    </FormGroupItem>
  )

  render() {
    const {
      form,
      intl: { formatMessage },
      match: { params },
    } = this.props
    const { error } = this.state
    return (
      <WithAppIntro>
        <Text
          align="center"
          color={ColorPalette.text.secondary}
          size="xl"
          strong
          {...css({ marginTop: '12px' })}
        >
          <FormattedMessage
            id="password-reset.title"
            description="The title for setting the new password"
            defaultMessage="Choose a password!"
          />
        </Text>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          {...css({ marginTop: '18px' })}
        >
          {this.passwordResetInfo({ formatMessage, params })}
        </Text>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          {...css({ marginTop: '12px' })}
        >
          {this.passwordResetTip({ formatMessage, params })}
        </Text>
        <Form
          name={this.name}
          onSubmit={this.handleSubmit}
          onSuccess={this.handleSuccess}
          onError={this.handleError}
          request={this.buildRequest}
          validateConstraints={{
            token: {
              length: {
                minimum: 30,
                message: messages.token,
              },
            },
            ...DoublePasswordInputValidationRules,
          }}
          style={{ marginTop: '20px' }}
        >
          <FormGroup>
            {(error || this.shouldRenderTokenField(params)) && (
              <div>
                {error && this.renderError({ error, formatMessage })}
                {this.shouldRenderTokenField(params) &&
                  this.passwordResetTokenField({ formatMessage, params })}
              </div>
            )}
            <FormGroupItem>
              <DoublePasswordInput
                name="password"
                placeholder={formatMessage(messages.passwordPlaceholder)}
                repeatPlaceholder={formatMessage(
                  messages.passwordRepeatPlaceholder,
                )}
                style={{ backgroundColor: ColorPalette.white }}
              />
            </FormGroupItem>
          </FormGroup>
          {get(this, 'state.error.entity.errors.captcha') && <Recaptcha />}
          <TwoStatesLoginButton
            pending={form && form.status === 'pending'}
            dataE2e="password-reset-button"
            activeText={this.props.intl.formatMessage(
              messages.buttonTextActive,
            )}
            inactiveText={this.props.intl.formatMessage(
              messages.buttonTextInactive,
            )}
          />
        </Form>
        <Link to="/login" data-e2e="password-reset-cancel">
          <Text
            align="center"
            color={ColorPalette.blue}
            size="m"
            strong
            {...css({ cursor: 'pointer', marginTop: '12px' })}
          >
            <FormattedMessage
              id="password-reset.cancel-link"
              description="Label of the cancel link on the password-reset view"
              defaultMessage="Return to login"
            />
          </Text>
        </Link>
      </WithAppIntro>
    )
  }
}

export default connect((state: IReduxState) => ({
  form: state.form['password-reset'] || {},
}))(withMixpanel(injectIntl(PasswordReset)))
