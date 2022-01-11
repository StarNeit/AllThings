import { Gateway } from 'react-gateway'
import React from 'react'
import withRequest, { IWithRequest } from 'containers/withRequest'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'
import {
  PhoneInput,
  Form,
  TextInput,
  SquareIconButton,
  Inset,
  Text,
  FloatingButton,
} from '@allthings/elements'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import { sendSuccess } from '@allthings/elements/NotificationBubbleManager'
import ErrorMessage from 'components/ErrorMessage'
import { CustomTitleBar } from 'components/TitleBar'
import { withTheme } from 'utils/withTheme'
import { ITheme } from '@allthings/elements/ThemeProvider'

const messages = defineMessages({
  emailPhoneNumber: {
    id: 'marketplace-contact-owner.email-phone-number',
    description:
      'The phone number text injected in the sent email by the contact overlay of marketplace.',
    defaultMessage: 'Phone number',
  },
  inquiryPlaceholder: {
    id: 'marketplace-contact-owner.inquiry-placeholder',
    description:
      'The placeholder for the inquiry of the contact overlay of marketplace.',
    defaultMessage: 'Ask about the product',
  },
  phoneNumberPlaceholder: {
    id: 'marketplace-contact-owner.phone-number-placeholder',
    description:
      'The placeholder for the phone number of the contact overlay of marketplace.',
    defaultMessage: 'Your phone number',
  },
  sendButton: {
    id: 'marketplace-contact-owner.send',
    description:
      'The label of the send button of the contact overlay of marketplace.',
    defaultMessage: 'Send',
  },
  title: {
    id: 'marketplace-contact-owner.title',
    description: 'The title of the contact overlay of marketplace.',
    defaultMessage: 'Contact {owner}',
  },
  successMessage: {
    id: 'marketplace-contact-owner.success',
    description: 'The message in the bubble when the mail was send',
    defaultMessage: 'Your message was send',
  },
  errorMessage: {
    id: 'marketplace-contact-owner.error',
    description: 'The message if something goes wrong with sending the message',
    defaultMessage: 'Your message could not get send!',
  },
})

interface IProps {
  appId: string
  thingId: string
  theme: ITheme
  onRequestClose: () => void
  email: string
  contactUsername: string
  phoneNumber?: string
  triggerClose?: () => void
}

interface IState {
  isSubmitting: boolean
  phoneNumber?: string
  error: boolean
}
class ContactOverlay extends React.PureComponent<
  IProps & InjectedIntlProps & IWithRequest,
  IState
> {
  state: IState = {
    isSubmitting: false,
    phoneNumber: null,
    error: false,
  }

  handleSubmit = async (
    _: unknown,
    {
      phoneNumber,
      message,
    }: { readonly phoneNumber: string; readonly message: string },
  ) => {
    this.setState({ error: false })
    try {
      const { appId, email, thingId, intl } = this.props
      const contact = phoneNumber
        ? `\r\n${intl.formatMessage(messages.emailPhoneNumber)}: ${phoneNumber}`
        : ''

      const response = await this.props.createRequest({
        method: 'POST',
        path: `api/v1/things/${thingId}/messages`,
        entity: {
          appId,
          email,
          message: `${message} \r\n ${contact}`,
          type: 'default',
        },
      })
      if (response.status.code === 201) {
        this.props.onRequestClose()
        sendSuccess(intl.formatMessage(messages.successMessage))
      } else {
        throw new Error('Unexpected return')
      }
    } catch (e) {
      this.setState({ error: true })
    }
  }

  renderError = () => {
    if (!this.state.error) {
      return null
    }

    return (
      <Inset horizontal vertical>
        <ErrorMessage>
          {this.props.intl.formatMessage(messages.errorMessage)}
        </ErrorMessage>
      </Inset>
    )
  }

  renderBar = () => {
    const { intl } = this.props

    return (
      <CustomTitleBar alignH="space-between">
        <Inset horizontal>
          <Text strong>
            {intl.formatMessage(messages.title, {
              owner: this.props.contactUsername,
            })}
          </Text>
        </Inset>
        <SquareIconButton
          icon="remove-light-filled"
          iconSize="xs"
          onClick={this.props.onRequestClose}
        />
      </CustomTitleBar>
    )
  }

  renderContent = () => {
    const { intl, phoneNumber } = this.props
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderBar()}
        {this.renderError()}
        <TextInput
          data-e2e="marketplace-overlay-inquiry"
          name="message"
          lines={4}
          maxLength={255}
          placeholder={intl.formatMessage(messages.inquiryPlaceholder)}
        />
        <PhoneInput
          data-e2e="marketplace-overlay-phone-number"
          name="phoneNumber"
          placeholder={intl.formatMessage(messages.phoneNumberPlaceholder)}
          label={intl.formatMessage(messages.phoneNumberPlaceholder)}
          defaultValue={phoneNumber}
        />

        <FloatingButton
          data-e2e="marketplace-overlay-submit"
          type="submit"
          disabled={this.state.isSubmitting}
          color="primary"
        >
          <Text strong color="white">
            {intl.formatMessage(messages.sendButton)}
          </Text>
        </FloatingButton>
      </Form>
    )
  }

  render() {
    return (
      <Gateway into="root">
        <Overlay
          theme={this.props.theme}
          direction="row"
          alignH="center"
          alignV="stretch"
          onBackgroundClick={this.props.onRequestClose}
        >
          <OverlayWindow>{this.renderContent()}</OverlayWindow>
        </Overlay>
      </Gateway>
    )
  }
}

export default connect((state: IReduxState) => ({
  appId: state.app.config.appID,
  email: state.authentication.user.email,
  phoneNumber: state.authentication.user.phoneNumber,
}))(withRequest(withTheme()(injectIntl(ContactOverlay))))
