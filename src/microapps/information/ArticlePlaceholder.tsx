import React from 'react'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { Text, Icon, View } from '@allthings/elements'
import { FormattedMessage } from 'react-intl'

// The ugly flex hacks are necessary for IE 11 🙀.
const MyBookingsPlaceholder = () => (
  <View
    flex="flex"
    direction="column"
    alignV="center"
    alignH="space-around"
    {...css({
      background: ColorPalette.whiteIntense,
      flex: '1 0 100%!important',
    })}
  >
    <View
      flex="flex"
      direction="column"
      alignV="center"
      alignH="space-around"
      {...css({ flex: '1 0 100%!important', maxWidth: 320, maxHeight: 500 })}
    >
      <Text size="xl" color="secondaryText" strong align="center">
        <FormattedMessage
          id="articles.placeholder-title"
          description="The title of the placeholder for the desktop, if no article has been chosen."
          defaultMessage="Read on!"
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
          name="file-document"
          size={100}
          color={alpha(ColorPalette.grey, 0.25)}
        />
      </View>
      <Text strong align="center" color="secondaryText">
        <FormattedMessage
          id="articles.placeholder-text"
          description="The text of the placeholder for the desktop, if no article has been chosen."
          defaultMessage="Choose something from the left side!"
        />
      </Text>
    </View>
  </View>
)

export default MyBookingsPlaceholder
