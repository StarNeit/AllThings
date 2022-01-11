import React from 'react'
import { View, Text, Icon } from '@allthings/elements'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { FormattedMessage } from 'react-intl'

const TicketEmptyMessage = () => (
  <View
    flex="grow"
    direction="column"
    alignV="center"
    alignH="space-around"
    {...css({
      background: ColorPalette.whiteIntense,
    })}
  >
    <View
      flex="grow"
      direction="column"
      alignV="center"
      alignH="space-around"
      {...css({
        maxWidth: 320,
        maxHeight: 500,
      })}
    >
      <Text size="xl" color="secondaryText" strong align="center">
        <FormattedMessage
          id="service-center-detail.no-messages-title"
          description="The title of no messages yet in service center detail view"
          defaultMessage="No messages yet"
        />
      </Text>
      <View
        {...css({
          border: '10px solid #fff',
          borderRadius: '50%',
          padding: 35,
          boxShadow: '0 0 14px 0 rgba(0,0,0,0.05)',
        })}
      >
        <Icon
          name="chat-filled"
          size={100}
          color={alpha(ColorPalette.grey, 0.25)}
        />
      </View>
      <Text align="center" color="grey">
        <FormattedMessage
          id="service-center-detail.no-messages-text"
          description="The describing text of no messages yet in service center detail view"
          defaultMessage="We will get in touch with you as soon as possible"
        />
      </Text>
    </View>
  </View>
)

export default TicketEmptyMessage
