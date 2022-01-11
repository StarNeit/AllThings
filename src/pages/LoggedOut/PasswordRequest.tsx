import React from 'react'
import { push } from 'connected-react-router'
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import get from 'lodash-es/get'

import { Form } from 'containers/Form'
import Link from 'components/Link'
import { CookieChecker } from 'containers/NoCookies'
import { Text } from '@allthings/elements'
import EmailInput from 'components/Form/EmailInput'
import FormGroup from 'components/Form/FormGroup'
import FormGroupItem from 'components/Form/FormGroupItem'
import InputError from 'components/Form/InputError'
import Recaptcha from 'components/Recaptcha'
import LoginButton from 'components/LoginButton'
import withMixpanel from 'containers/withMixpanel'
import { IApiRequest, IApiResponse } from 'store/api'
import WithAppIntro from '../AppIntroContainer'

interface IProps {
  form: object
  mixpanel: (eventName: string, trackInformation?: object) => void
}

const messages = defineMessages({
  email: {
    id: 'password-reset-request.wrong-email',
    description: 'The error message when the user enters wrong email',
    defaultMessage: "The email you've entered cannot be found. Please retry!",
  },
  unknown: {
    id: 'password-reset-request.unknown-reason',
    description:
      'The error message when the reset-request fails for unknown reason',
    defaultMessage:
      'Something when wrong during the passwort reset. Please retry!',
  },
})

interface IState {
  readonly error: IApiResponse
}

class PasswordRequest extends React.PureComponent<
  IProps & InjectedIntlProps & DispatchProp,
  IState
> {
  name = 'password-reset-request'

  state: IState = { error: null }

  handleSubmit = () => this.setState({ error: undefined })

  handleSuccess = () => this.props.dispatch(push('/password/reset'))

  handleError = (error: IApiResponse) => this.setState({ error })

  buildRequest = ({
    email,
    recaptcha,
  }: {
    email: string
    recaptcha: string
  }): IApiRequest => {
    return {
      method: 'POST',
      path: 'auth/password-reset-request',
      requiresCsrf: true,
      clientID: true,
      entity: {
        email,
        recaptcha,
      },
    }
  }

  renderError = (error: IApiResponse) =>
    error && (
      <InputError data-e2e="password-request-wrong-email">
        {this.renderErrorMessage(error.entity)}
      </InputError>
    )

  renderErrorMessage = (entity: IndexSignature) => {
    const messageKey =
      entity.errors && entity.errors.email ? 'email' : 'unknown'
    const message = this.props.intl.formatMessage(messages[messageKey])
    this.props.mixpanel('accounts.error', {
      error_message: message,
      error_key: messages[messageKey].id,
    })
    return message
  }

  render() {
    const { error } = this.state
    return (
      <WithAppIntro>
        <CookieChecker />
        <Text align="center" size="giant" {...css({ marginTop: '12px' })}>
          <FormattedMessage
            id="password-reset-request.title"
            description="The title for the reset request page"
            defaultMessage="Forgot password?"
          />
        </Text>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          size="m"
          {...css({ marginTop: '18px' })}
        >
          <FormattedMessage
            id="password-reset-request.info"
            description="Description how to reset the password"
            defaultMessage="To reset your password, please enter your email and hit the reset button"
          />
        </Text>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          size="m"
          {...css({ margin: '12px 0 18px 0' })}
        >
          <FormattedMessage
            id="password-reset-request.notice"
            description="Notice for the password request page"
            defaultMessage="Tip: Also check your spam folder for the mail"
          />
        </Text>
        <Form
          name={this.name}
          onSubmit={this.handleSubmit}
          onSuccess={this.handleSuccess}
          onError={this.handleError}
          request={this.buildRequest}
          validateConstraints={{
            email: {
              ...EmailInput.validationRules,
            },
          }}
        >
          <FormGroup>
            {this.renderError(error)}
            <FormGroupItem>
              <EmailInput
                name="email"
                data-e2e="password-reset-request-email"
                style={{ backgroundColor: ColorPalette.white }}
              />
            </FormGroupItem>
          </FormGroup>
          {get(this, 'state.error.entity.errors.captcha') && <Recaptcha />}
          <LoginButton data-e2e="password-request-button" type="submit">
            <FormattedMessage
              id="password-reset-request.submit-button"
              description="Button label for the submit button"
              defaultMessage="Reset"
            />
          </LoginButton>
        </Form>
        <Link to="/login" data-e2e="signup-cancel">
          <Text
            align="center"
            color={ColorPalette.blue}
            size="m"
            strong
            {...css({ cursor: 'pointer', marginTop: '12px' })}
          >
            <FormattedMessage
              id="password-reset-request.cancel-link"
              description="Label of the cancel link on the password-reset-request view"
              defaultMessage="Return to login"
            />
          </Text>
        </Link>
      </WithAppIntro>
    )
  }
}

export default connect((state: IReduxState) => ({
  form: state.form['password-reset-request'] || {},
}))(withMixpanel(injectIntl(PasswordRequest)))
