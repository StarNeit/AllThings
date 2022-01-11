import React, { Component } from 'react'
import { css } from 'glamor'
import { defineMessages, injectIntl } from 'react-intl'

import { FeedbackSuccessIcon } from 'components/Icons'
import { Text, View } from '@allthings/elements'

const { feedbackReceived, thanks, willGetBack } = defineMessages({
  feedbackReceived: {
    id: 'booking.success.feedback-received',
    description: 'Your feedback has been sent',
    defaultMessage: 'Your feedback has been sent',
  },
  thanks: {
    id: 'feedback.success.thanks',
    description: 'Thank you!',
    defaultMessage: 'Thank you!',
  },
  willGetBack: {
    id: 'feedback.error.will-get-back',
    description: 'We will get back to you',
    defaultMessage:
      'We will get back to you shortly at the registered e-mail address',
  },
})

const styles = {
  paddingTop: css({
    paddingTop: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
  }),
  paddingBot: css({
    paddingBottom: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
  }),
  padding: css({
    paddingTop: '2vh',
    paddingBottom: '10vh',
    paddingLeft: '50px',
    paddingRight: '50px',
    // IE hack! Otherwise text goes wild...
    '@media all and (min-width: 880px)': {
      maxWidth: 430,
    },
  }),
  mainContainer: css({
    height: 500,
    width: '100%',
  }),
  secondaryConstainer: css({ maxWidth: 320, maxHeight: 500, width: 320 }),
}

interface IProps {
  goToFeedbackForm?: () => void
}

class FeedbackSuccess extends Component<IProps & InjectedIntlProps> {
  render() {
    const { formatMessage } = this.props.intl

    return (
      <View
        direction="column"
        alignV="center"
        alignH="space-around"
        {...styles.mainContainer}
      >
        <View
          flex="flex"
          direction="column"
          alignV="center"
          alignH="space-around"
        >
          <Text
            size="xl"
            color="secondary"
            strong
            align="center"
            {...styles.paddingTop}
          >
            {formatMessage(thanks)}
          </Text>
          <Text
            size="xl"
            color="secondary"
            strong
            align="center"
            {...styles.paddingBot}
          >
            {formatMessage(feedbackReceived)}
          </Text>
          <FeedbackSuccessIcon />
          <Text align="center" color="grey" {...styles.padding}>
            {formatMessage(willGetBack)}
          </Text>
        </View>
      </View>
    )
  }
}

export default injectIntl(FeedbackSuccess)
