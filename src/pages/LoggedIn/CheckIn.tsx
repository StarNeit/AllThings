import { gql } from 'apollo-boost'
import React, { Fragment } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { connect } from 'react-redux'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import { css, keyframes } from 'glamor'
import { Button, Form, Input, Spinner, Text, View } from '@allthings/elements'
import qs from 'query-string'
import { RouteComponentProps, Redirect } from 'react-router'
import withRequest, { IWithRequest } from 'containers/withRequest'
import App from 'store/actions/app'
import Auth from 'store/actions/authentication'
import Link from 'components/Link'
import AnimatedBorder, { STATUS } from './AnimatedBorder'
import ErrorMessage from 'components/ErrorMessage'
import withMixpanel from 'containers/withMixpanel'
import WithAppIntro from '../AppIntroContainer'

const messages = defineMessages({
  anEmailWasSent: {
    id: 'check-in.check-email-hint',
    description: 'Hint above input',
    defaultMessage: 'An e-mail with a code should have been sent beforehand.',
  },
  cancelButton: {
    id: 'check-in.cancel-link',
    description: 'Label of the cancel link',
    defaultMessage: 'Cancel',
  },
  currentlyBeingCheckedIn: {
    id: 'check-in.auto-checkin',
    description: 'Text if the user is automatically checked in',
    defaultMessage: "You're currently being checked in",
  },
  dontHaveCode: {
    id: 'check-in.dont-have-code',
    description: 'Button label to move to address lookup',
    defaultMessage: "I don't have a code",
  },
  mainHeader: {
    id: 'check-in.code-label',
    description: 'The label for the code-field on check-in',
    defaultMessage: 'Insert your activation-code.',
  },
  registrationCodePlaceholder: {
    id: 'checkin.registrationcode-placeholder',
    description: 'Placeholder for the registration code field in checkin',
    defaultMessage: 'Registration code',
  },
  sendButton: {
    id: 'check-in.submit-button',
    description: 'Button label for the submit button',
    defaultMessage: 'Send',
  },
  400: {
    id: 'check-in.wrong-code',
    description: 'The error message when the user enters wrong code',
    defaultMessage: 'The code you’ve entered is invalid. Please retry!',
  },
  // for unknown errors
  418: {
    id: 'check-in.unknown-error',
    description: 'The error message when the check-in fails for unknown reason',
    defaultMessage: 'Something when wrong during the check-in. Please retry!',
  },
  429: {
    id: 'check-in.too-many-attempts-error',
    description:
      'The error message when user has tried too many times in a minute',
    defaultMessage:
      'Too many attempts were made. Please wait one minute and try again!',
  },
})

const ANIMATION_DURATION = 2000

const blink = keyframes('blink', { '50%': { borderColor: '#fff' } })

interface IState {
  attempts: number
  autoCheckin: boolean
  code: string
  errorStatus: number
  loading: boolean
  status: string
}

interface IProps extends RouteComponentProps {
  accessToken: string
  appId: string
  checkin: {
    message?: string
    status?: string
  }
  isCheckedIn: boolean
  mixpanel: (eventName: string, trackInformation?: object) => void
  userId: string
  canRequestCheckin: boolean
  redirectToAfterCheckin?: string
}

class CheckIn extends React.PureComponent<
  WithApolloClient<
    IProps &
      DispatchProp &
      WrappedComponentProps &
      RouteComponentProps &
      IWithRequest
  >,
  IState
> {
  state: IState = {
    status: null,
    code: qs.parse(this.props.location.search).code || '',
    autoCheckin: !!qs.parse(this.props.location.search).code,
    attempts: 0,
    errorStatus: null,
    loading: true,
  }

  // As the componentDidMount lifecycle is async, we need to be sure that using
  // setState won't occur when the component is unmounted.
  isStateSafe = true

  handleError = (code: number) => {
    this.props.mixpanel('accounts.error', {
      error_message: this.props.intl.formatMessage(messages[code]),
      error_key: messages[code].id,
    })
    this.isStateSafe &&
      this.setState({
        status: null,
        errorStatus: code,
      })
  }

  extractErrorIntoState = (errors: { attempts?: unknown; code?: unknown }) =>
    errors.attempts
      ? this.handleError(429)
      : errors.code
      ? this.handleError(400)
      : this.handleError(418)

  async componentDidMount() {
    const { history, location } = this.props
    const preventRedirect = location.state && location.state.preventRedirect
    const hasCheckInRequest = await this.checkForCheckinRequests()

    // Auto check-in when the code is provided.
    if (this.state.code) {
      const entity = await this.checkIn(this.state.code)
      if (entity.errors) {
        this.extractErrorIntoState(entity.errors)
        this.isStateSafe && this.setState({ autoCheckin: false })
      } else {
        await this.initMicroApps(entity)
      }
    } else if (!preventRedirect && hasCheckInRequest) {
      history.push('/request-code', {
        screen: 'RequestSent',
      })
    } else {
      this.setState({ loading: false })
    }
  }

  componentWillUnmount() {
    this.isStateSafe = false
  }

  checkForCheckinRequests = async (): Promise<boolean> => {
    const { client, userId } = this.props
    try {
      const result = await client.query({
        query: gql`
          query CheckInRequest($userId: ID!) {
            hasCheckinRequest(userId: $userId)
          }
        `,
        variables: {
          userId,
        },
      })

      return result && result.data.hasCheckinRequest
    } catch {
      return false
    }
  }

  checkIn = async (code: string) => {
    const { entity } = await this.props.createRequest({
      method: 'POST',
      path: 'api/v1/check-in',
      entity: {
        code,
        userID: this.props.userId,
        appId: this.props.appId,
      },
    })

    return entity
  }

  handleSubmit = async (_: any, data: { code: string }) => {
    const { code } = data

    this.isStateSafe && this.setState({ status: STATUS.LOADING })

    const entity = await this.checkIn(code)

    if (entity.errors) {
      this.extractErrorIntoState(entity.errors)
      // increase counter to pass in as key to ErrorMessage, re-triggering animation
      this.setState(state => ({ attempts: state.attempts + 1 }))
    } else {
      this.isStateSafe &&
        this.setState({ status: STATUS.SUCCESS, errorStatus: undefined })
      await this.initMicroApps(entity)
    }
  }

  handleBlur = () => this.isStateSafe && this.setState({ status: null })

  goToAddressLookUp = () => this.props.history.push('/request-code')

  initMicroApps = async (entity: {
    _embedded: {
      app: { id: string }
    }
  }) => {
    const {
      _embedded: {
        app: { id },
      },
    } = entity
    // After check-in we need to get the updated list of micro-apps.
    const { accessToken, dispatch } = this.props
    dispatch(App.initMicroApps(id, accessToken))
    setTimeout(() => dispatch(Auth.checkIn(entity)), ANIMATION_DURATION)
  }

  renderForm = () => {
    const { code, attempts, errorStatus, status } = this.state
    const {
      intl: { formatMessage },
      canRequestCheckin,
    } = this.props

    return (
      <Form onSubmit={this.handleSubmit}>
        <View {...css({ margin: '30px 0' })}>
          {errorStatus && (
            <ErrorMessage
              data-e2e={`check-in-error-hint-status-${this.state.errorStatus}`}
              onClick={() =>
                this.isStateSafe && this.setState({ errorStatus: null })
              }
              {...css({
                animation: `${blink} 0.2s 0s 3 ease-in-out`,
                border: `1px ${ColorPalette.redIntense} solid`,
                margin: '30px 0',
              })}
              key={attempts}
            >
              {formatMessage(messages[errorStatus])}
            </ErrorMessage>
          )}
          <AnimatedBorder
            background="#ffffff"
            radius={2}
            status={status as STATUS}
            duration={ANIMATION_DURATION}
          >
            <Input
              style={{
                textAlign: 'center',
                background: 'none',
                outline: 'none',
              }}
              name="code"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                this.isStateSafe && this.setState({ code: e.target.value })
              }
              placeholder={formatMessage(messages.registrationCodePlaceholder)}
              required
              onBlur={this.handleBlur}
              autoFocus={!code}
              data-e2e="check-in-code"
            />
          </AnimatedBorder>
        </View>
        <View {...css({ textAlign: 'center' })}>
          <Button
            backgroundColor={ColorPalette.blue}
            data-e2e="check-in-button"
            type="submit"
            {...css({
              marginTop: '10px',
              width: '80%',
            })}
          >
            {formatMessage(messages.sendButton)}
          </Button>
          {canRequestCheckin && (
            <Button
              secondary
              backgroundColor={ColorPalette.blue}
              data-e2e="no-code-button"
              onClick={this.goToAddressLookUp}
              {...css({
                border: `1px solid ${ColorPalette.blue} !important`,
                marginTop: '10px',
                width: '80%',
              })}
            >
              {formatMessage(messages.dontHaveCode)}
            </Button>
          )}
        </View>
      </Form>
    )
  }

  render() {
    const {
      intl: { formatMessage },
      isCheckedIn,
      redirectToAfterCheckin,
    } = this.props

    return (
      <WithAppIntro>
        {isCheckedIn && <Redirect to={redirectToAfterCheckin} />}
        {this.state.autoCheckin ? (
          <Fragment>
            <Text
              align="center"
              color={ColorPalette.text.secondary}
              size="xl"
              strong
            >
              {this.state.autoCheckin &&
                formatMessage(messages.currentlyBeingCheckedIn)}
            </Text>
            <View direction="row" alignH="center" {...css({ margin: 30 })}>
              <Spinner />
            </View>
          </Fragment>
        ) : this.state.loading ? (
          <View
            direction="row"
            alignH="center"
            alignV="center"
            {...css({ height: '200px' })}
          >
            <Spinner color={ColorPalette.greyIntense} />
          </View>
        ) : (
          <Fragment>
            <Text
              align="center"
              color={ColorPalette.text.secondary}
              size="xl"
              strong
              {...css({ marginTop: '12px' })}
            >
              {formatMessage(messages.mainHeader)}
            </Text>
            <View>
              <Text
                align="center"
                color={ColorPalette.greyIntense}
                size="m"
                {...css({ marginTop: '12px' })}
              >
                {formatMessage(messages.anEmailWasSent)}
              </Text>
            </View>
            {this.renderForm()}
            <Link to="/logout" data-e2e="check-in-cancel">
              <Text
                align="center"
                color={ColorPalette.blue}
                size="m"
                strong
                {...css({ cursor: 'pointer', marginTop: '12px' })}
              >
                {formatMessage(messages.cancelButton)}
              </Text>
            </Link>
          </Fragment>
        )}
      </WithAppIntro>
    )
  }
}

export default connect((state: any, ownProps: IProps) => ({
  accessToken: state.authentication.accessToken,
  canRequestCheckin: state.app.config.segment === 'residential',
  redirectToAfterCheckin:
    qs.parse(ownProps.location.search).referrer ||
    state.authentication.redirectToAfterLogin ||
    '/',
  userId: state.authentication.user.id,
  isCheckedIn: state.authentication.isCheckedIn,
  appId: state.app.config.appID,
}))(withRequest(withMixpanel(injectIntl(withApollo(CheckIn)))))
