import { Text, View } from '@allthings/elements'
import React from 'react'
import { FormattedMessage } from 'react-intl'

export const NoCraftspeopleHint = () => (
  <View alignH="space-around" alignV="center" direction="column" flex="flex">
    <Text
      align="center"
      color="secondaryText"
      data-e2e="no-craftspeople-text"
      size="xl"
      strong
    >
      <FormattedMessage
        defaultMessage="There are no craftspeople assigned to your building."
        description="When there are no craftspeople, display this message"
        id="craftspeople.placeholder"
      />
    </Text>
  </View>
)
