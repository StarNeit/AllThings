import React from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import { CardButton, Text, Theme } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'

interface IProps {
  archived: boolean
  onClick: () => void
}

const BookAgainButton = ({ archived, onClick }: IProps & InjectedIntlProps) => (
  <Theme>
    {({ theme }: { theme: ITheme }) => (
      <CardButton
        backgroundColor={
          !archived ? theme.primary : ColorPalette.lightGreyIntense
        }
        onClick={!archived && onClick}
        {...css({ ':hover': archived && { cursor: 'not-allowed' } })}
      >
        <Text size="m" color="white" strong>
          {!archived ? (
            <FormattedMessage
              id="booking.booking-book-again"
              description="Title of the button to book this item again in booking detail screen"
              defaultMessage="Book this again"
            />
          ) : (
            <FormattedMessage
              id="booking.booking-not available"
              description="Title of the button to book this item again in booking detail screen when the asset is archived"
              defaultMessage="Not available"
            />
          )}
        </Text>
      </CardButton>
    )}
  </Theme>
)

export default injectIntl(BookAgainButton)
