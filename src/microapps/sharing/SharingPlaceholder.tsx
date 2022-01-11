import React from 'react'
import { css } from 'glamor'
import { View, Button, Text, Icon } from '@allthings/elements'
import { alpha, ColorPalette } from '@allthings/colors'
import { FormattedMessage } from 'react-intl'
import ThingOverlayToggle from '../marketplace/ThingOverlay/ThingOverlayToggle'

// The ugly flex hacks are necessary for IE 11 🙀.
const SharingPlaceholder = () => (
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
          id="sharing.my-things-placeholder"
          defaultMessage="Sharing is caring"
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
          name="sharetime-filled"
          size={100}
          color={alpha(ColorPalette.grey, 0.25)}
        />
      </View>
      <Text strong align="center" color="secondaryText">
        <FormattedMessage
          id="sharing.my-things-placeholder-text"
          defaultMessage="You can offer a service or things you are willing to share with others."
        />
      </Text>

      <ThingOverlayToggle type="to-give">
        {({ open }) => (
          <Button onClick={open}>
            <Text color="textOnBackground">
              <FormattedMessage
                id="sharing.add-button"
                description="Engaging button to add something to sharing place"
                defaultMessage="Share something"
              />
            </Text>
          </Button>
        )}
      </ThingOverlayToggle>
      <Text align="center" color="secondaryText">
        <FormattedMessage
          id="sharing.my-things-placeholder-engage"
          defaultMessage="Nothing to share? Think again! There is always something."
        />
      </Text>
    </View>
  </View>
)

export default SharingPlaceholder
