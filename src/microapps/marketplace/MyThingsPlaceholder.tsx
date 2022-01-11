import React from 'react'
import { css } from 'glamor'
import { View, Button, Text, Icon } from '@allthings/elements'
import { alpha, ColorPalette } from '@allthings/colors'
import { FormattedMessage } from 'react-intl'
import ThingOverlayToggle from './ThingOverlay/ThingOverlayToggle'

// The ugly flex hacks are necessary for IE 11 🙀.
const MyThingsPlaceholder = () => (
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
          id="marketplace.my-things-placeholder"
          description="Sell something now"
          defaultMessage="Sell something now"
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
          name="bank-notes"
          size={100}
          color={alpha(ColorPalette.grey, 0.25)}
        />
      </View>
      <Text align="center" color="secondaryText">
        <FormattedMessage
          id="marketplace.my-things-placeholder-text"
          description="Here you can check the status of your bookings."
          defaultMessage="Start selling things you dont need anymore."
        />
      </Text>
      <ThingOverlayToggle type="for-sale">
        {({ open }) => (
          <Button onClick={open}>
            <Text color="textOnBackground">
              <FormattedMessage
                id="marketplace.add-button"
                description="Engaging button to add something to marketplace place"
                defaultMessage="Sell something"
              />
            </Text>
          </Button>
        )}
      </ThingOverlayToggle>

      <Text strong align="center" color="secondaryText">
        <FormattedMessage
          id="marketplace.my-things-placeholder-engage"
          description="Have an overview and manage your existing bookings directly from here."
          defaultMessage="Nothing to sell? Think again! There is always something."
        />
      </Text>
    </View>
  </View>
)

export default MyThingsPlaceholder
