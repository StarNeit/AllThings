import React from 'react'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { FormattedMessage } from 'react-intl'
import { View, Icon, Text } from '@allthings/elements'

// The ugly flex hacks are necessary for IE 11 🙀.
const ChooseCategoryScreen = () => (
  <View
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
      {...css({
        flex: '1 0 100%!important',
        maxWidth: 320,
        maxHeight: 500,
      })}
    >
      <Text size="xl" color="secondaryText" strong align="center">
        <FormattedMessage
          id="booking.empty-booking-screen.choose-category"
          description="Choose a Category"
          defaultMessage="Choose a Category"
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
          name="list-bullets-filled"
          size={100}
          color={alpha(ColorPalette.grey, 0.25)}
        />
      </View>
      <Text align="center" color="grey">
        <FormattedMessage
          id="booking.empty-booking-screen.text-one"
          description="You can see some categories on the left"
          defaultMessage="You can see some categories on the left"
        />
      </Text>
      <Text strong align="center" color="grey">
        <FormattedMessage
          id="booking.empty-booking-screen.text-two"
          description="Choose one of the categories and browse through the available assets."
          defaultMessage="Choose one of the categories and browse through the available assets."
        />
      </Text>
    </View>
  </View>
)

export default ChooseCategoryScreen
