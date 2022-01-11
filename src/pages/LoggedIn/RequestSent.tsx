import { ColorPalette } from '@allthings/colors'
import { Text, View } from '@allthings/elements'
import { css } from 'glamor'
import React from 'react'
import { defineMessages } from 'react-intl'
import RegistrationScreensTemplate from './RegistrationScreensTemplate'

const styles = {
  sentences: css({ marginTop: '20px' }),
}

const translations = defineMessages({
  a: {
    id: 'access-code-request-response.thank-you',
    description: 'Thanks for your request',
    defaultMessage: 'Thank you for your request.',
  },
  b: {
    id: 'access-code-request-response.will-get-back',
    description: "Tells user that we'll get back to them",
    defaultMessage:
      'We have forwarded your request and our team will get back to you soon.',
  },
  c: {
    id: 'access-code-request-response.will-reply-via-email',
    description: 'Tells user they will get a reply via email',
    defaultMessage:
      'You will receive a notification via email as soon as your request has been checked.',
  },
  header: {
    id: 'access-code-request-response.request-sent',
    description: 'Header for successful response',
    defaultMessage: 'Request Sent',
  },
  button: {
    id: 'access-code-request-response.change-request',
    description: 'Cancel button of request sent success page',
    defaultMessage: 'Change Request',
  },
})

const RequestSent = ({
  formatMessage,
  onButtonClick,
}: {
  formatMessage: InjectedIntl['formatMessage']
  onButtonClick: () => void
}) => (
  <RegistrationScreensTemplate
    button={formatMessage(translations.button)}
    content={
      <View>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          size="m"
          {...styles.sentences}
        >
          {formatMessage(translations.a)}
        </Text>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          size="m"
          {...styles.sentences}
        >
          {formatMessage(translations.b)}
        </Text>
        <Text
          align="center"
          color={ColorPalette.greyIntense}
          size="m"
          {...styles.sentences}
        >
          {formatMessage(translations.c)}
        </Text>
      </View>
    }
    data-e2e="request-access-request-sent"
    header={formatMessage(translations.header)}
    onButtonClick={onButtonClick}
  />
)

export default RequestSent
