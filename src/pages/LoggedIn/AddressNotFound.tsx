import { ColorPalette } from '@allthings/colors'
import { Text, View } from '@allthings/elements'
import { css } from 'glamor'
import React, { useEffect } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import RegistrationScreensTemplate from './RegistrationScreensTemplate'
import withMixpanel from 'containers/withMixpanel'

const styles = {
  sentences: css({ marginTop: '20px' }),
}

const messages = defineMessages({
  title: {
    id: 'access-code-request-response.cant-find-address',
    description: 'Could not find address message',
    defaultMessage:
      'We unforunately could not find an app matching your address.',
  },
  text: {
    id: 'access-code-request-response.contact-support',
    description: 'Tells user to contact support',
    defaultMessage:
      'Please try another code or contact our support at support@allthings.me.',
  },
  header: {
    id: 'access-code-request-response.no-address',
    description: 'No address found header',
    defaultMessage: 'Could not find address',
  },
  button: {
    id: 'access-code-request-response.choose-another-address',
    description: 'Button to go back to request check in page',
    defaultMessage: 'Change address',
  },
})

interface IProps {
  address: string
  mixpanel: (eventName: string, trackInformation?: any) => void
  onButtonClick: () => void
  placeId: string
}

const AddressNotFound: React.FC<IProps & InjectedIntlProps> = ({
  address,
  intl,
  mixpanel,
  onButtonClick,
  placeId,
}) => {
  const { formatMessage } = intl

  useEffect(
    () =>
      mixpanel('cir.address.error', {
        address_string: address,
        error_key: 'access-code-request-response.cant-find-address',
        error_message: formatMessage(messages.title),
        google_places_id: placeId,
      }),
    [address, placeId],
  )

  return (
    <RegistrationScreensTemplate
      button={formatMessage(messages.button)}
      content={
        <View>
          <Text
            align="center"
            color={ColorPalette.greyIntense}
            size="m"
            {...styles.sentences}
          >
            {formatMessage(messages.title)}
          </Text>
          <Text
            align="center"
            color={ColorPalette.greyIntense}
            size="m"
            {...styles.sentences}
          >
            {formatMessage(messages.text)}
          </Text>
        </View>
      }
      data-e2e="request-access-address-not-found"
      header={formatMessage(messages.header)}
      onButtonClick={onButtonClick}
    />
  )
}

export default withMixpanel(injectIntl(AddressNotFound))
