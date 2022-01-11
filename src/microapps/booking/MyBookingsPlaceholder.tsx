import React from 'react'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'
import { FormattedMessage } from 'react-intl'

import { Text, Icon } from '@allthings/elements'
import View, { IViewProps } from '@allthings/elements/View'

type MyBookingsPlaceholderType = () => React.ReactElement<IViewProps>

// The ugly flex hacks are necessary for IE 11 🙀.
const MyBookingsPlaceholder: MyBookingsPlaceholderType = () => (
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
          id="booking.my-bookings-placeholder.my-bookings"
          description="My Bookings"
          defaultMessage="My Bookings"
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
          name="calendar-check"
          size={100}
          color={alpha(ColorPalette.grey, 0.25)}
        />
      </View>
      <Text align="center" color="secondaryText">
        <FormattedMessage
          id="booking.my-bookings-placeholder.check-status"
          description="Here you can check the status of your bookings."
          defaultMessage="Here you can check the status of your bookings."
        />
      </Text>

      <Text strong align="center" color="secondaryText">
        <FormattedMessage
          id="booking.my-bookings-placeholder.manage-bookings-message"
          description="Have an overview and manage your existing bookings directly from here."
          defaultMessage="Have an overview and manage your existing bookings directly from here."
        />
      </Text>
    </View>
  </View>
)

export default MyBookingsPlaceholder
