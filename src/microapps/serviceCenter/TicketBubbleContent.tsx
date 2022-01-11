import React from 'react'
import { IExtendedConversationMessage, MARGIN } from '.'
import { Text, View } from '@allthings/elements'
import { alpha, ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { FormattedMessage } from 'react-intl'

interface IProps {
  item: IExtendedConversationMessage
}

const TicketBubbleContent = ({ item }: IProps) => (
  <View direction="column" alignH="start" alignV="start">
    <Text
      color={alpha(ColorPalette.lightBlack, 0.7)}
      data-e2e="ticket-title"
      size="xl"
      strong
    >
      {item.title}
    </Text>
    <Text
      color={ColorPalette.greyIntense}
      data-e2e={`ticket-category-${item.categoryId}`}
      size="s"
      {...css({ marginBottom: MARGIN })}
    >
      <FormattedMessage
        defaultMessage="Category: {category}"
        description="The category of the ticket displayed as a first message"
        id="service-center.detail.ticket-category"
        values={{ category: <strong>{item.categoryName}</strong> }}
      />
    </Text>
    <Text data-e2e="ticket-content">{item.content}</Text>
  </View>
)

export default TicketBubbleContent
