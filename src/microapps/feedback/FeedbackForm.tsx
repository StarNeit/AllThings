import React, { Component } from 'react'
import { connect } from 'react-redux'
import { css, keyframes, Rule } from 'glamor'
import { defineMessages, injectIntl } from 'react-intl'
import fetch from 'cross-fetch'
import { push } from 'connected-react-router'

import { Button, ExpandingTextarea, Form, Text } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import ErrorMessage from 'components/ErrorMessage'
import { SendIcon } from 'components/Icons'
import { createMQ } from '@allthings/elements/Responsive'

const messages = defineMessages({
  errorMessage: {
    id: 'feedback.error-message',
    description: 'Error message if ticket was not created successfully.',
    defaultMessage:
      'Uh oh, something went wrong. Please try again or e-mail us at ',
  },
  placeholder: {
    id: 'feedback.comment-placeholder',
    description: 'Placeholder for comment text area',
    defaultMessage: 'We look forward to your feedback',
  },
  sendForm: {
    id: 'feedback.send-form',
    description: 'Send (the form)',
    defaultMessage: 'Send',
  },
})

const fly = keyframes({
  '0%': { transform: 'translateY(1px)' },
  '20%': {
    transform: 'translateX(120px) translateY(1px) scale(.8) rotate(20deg)',
    opacity: '0',
  },
  '50%': { opacity: '0' },
  '60%': {
    opacity: '0',
    transform: 'translateX(0) translateY(1px) rotate(0) scale(0)',
  },
  '100%': { opacity: '1', transform: 'scale(1) translateY(1px)' },
})

const bouncing = keyframes({
  '10%, 90%': { transform: 'translate3d(0, -1px, 0)' },
  '20%, 80%': { transform: 'translate3d(0, 2px, 0)' },
  '30%, 50%, 70%': { transform: 'translate3d(0, -4px, 0)' },
  '40%, 60%': { transform: 'transform: translate3d(0, 4px, 0)' },
})

const styles = {
  errorMessage: css({
    margin: '0px 0px 10px',
    [createMQ('mobile')]: {
      margin: '0 15px 15px',
    },
  }),
  plane: (sendingRequest: boolean, animation: Rule) =>
    css(
      css({
        paddingLeft: 8,
        fill: '#fff',
        transform: 'translateY(1px)',
        transition: '100ms ease-in-out',
      }),
      animation,
      sendingRequest
        ? css({
            fill: '#fff',
          })
        : null,
    ),
  sendButton: css({ width: '100%', height: '50px' }),
  sendIcon: css({
    paddingLeft: 8,
    fill: '#fff',
    transform: 'translateY(1px)',
    transition: '100ms ease-in-out',
  }),
  sendIconActive: css({
    fill: '#fff',
  }),
  text: css({
    transition: '100ms ease-in-out',
  }),
  textArea: css({ minHeight: '150px', paddingTop: '15px' }),
}
const animations = {
  bouncing: { animation: `${bouncing} 0.82s linear 0s infinite both` },
  flyPlane: { animation: `${fly} 2s cubic-bezier(0,0,1,-0.59)` },
}

interface IProps {
  appName: string
  showSuccess: () => void
  user: {
    email?: string
    username: string
  }
}

class FeedbackForm extends Component<IProps & InjectedIntlProps> {
  state = {
    finishedSending: false,
    inputValue: false,
    sendingRequest: false,
    error: false,
  }

  makeItFly = (doThis: () => void) =>
    this.setState({ sendingRequest: false, finishedSending: true }, () =>
      setTimeout(() => doThis(), 500),
    )

  handleErrorClick = () => this.setState({ error: false })

  handleSubmit = async (
    _: unknown,
    { comment }: { readonly comment: string },
  ) => {
    this.setState({ sendingRequest: true })

    const {
      appName,
      intl: { formatMessage },
      showSuccess,
      user: { email, username: name },
    } = this.props

    const request = {
      requester: {
        name,
        email,
      },
      subject: `[App Feedback] ${appName}, ${name}`,
      comment: { body: comment },
    }

    const postFeedback = await fetch(
      'https://qipp.zendesk.com/api/v2/requests.json',
      {
        method: 'POST',
        body: JSON.stringify({ request }),
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      },
    )

    postFeedback.status === 201
      ? this.makeItFly(showSuccess)
      : this.setState({
          error: formatMessage(messages.errorMessage),
          sendingRequest: false,
        })
  }

  setValue = (input: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ inputValue: input.target.value })

  render() {
    const { formatMessage } = this.props.intl
    const { error, finishedSending, inputValue, sendingRequest } = this.state
    const animation = sendingRequest
      ? animations.bouncing
      : finishedSending
      ? animations.flyPlane
      : null

    return (
      <Form onSubmit={this.handleSubmit}>
        {error && (
          <ErrorMessage {...styles.errorMessage}>
            <Text color={ColorPalette.white}>
              {`${error} `}
              <a href="mailto:support@allthings.me">
                <Text block={false} color={ColorPalette.white} underline>
                  support@allthings.me
                </Text>
              </a>
            </Text>
          </ErrorMessage>
        )}
        <ExpandingTextarea
          name="comment"
          onChange={this.setValue}
          placeholder={formatMessage(messages.placeholder)}
          type="text"
          {...styles.textArea}
        />
        <Button disabled={!inputValue} type="submit" {...styles.sendButton}>
          <Text size="l" color={ColorPalette.white}>
            {formatMessage(messages.sendForm)}
            <SendIcon
              width={28}
              height={14}
              {...styles.plane(sendingRequest, animation)}
            />
          </Text>
        </Button>
      </Form>
    )
  }
}

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goToFeedbackError: () => dispatch(push(`/feedback/error`)),
  goToFeedbackSuccess: () => dispatch(push(`/feedback/success`)),
})

const mapStateToProps = ({ app, authentication }: IReduxState) => ({
  user: authentication.user,
  appName: app.config.appName,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(injectIntl(FeedbackForm))
