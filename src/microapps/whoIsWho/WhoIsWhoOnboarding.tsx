import React, { Component } from 'react'
import { ColorPalette } from '@allthings/colors'
import { SimpleLayout, Text, Button, Card, Inset } from '@allthings/elements'
import { AppTitle } from 'containers/App'
import Microapp from 'components/Microapp'
import { css } from 'glamor'
import { defineMessages, injectIntl } from 'react-intl'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from 'enums'

const i18n = defineMessages({
  greeting: {
    id: 'who-is-who.onboarding.greeting',
    description: 'The user greeting',
    defaultMessage: 'Hello {username}!',
  },
  additionalGreeting: {
    id: 'who-is-who.onboarding.additional-greeting',
    description: 'The text underneath the greeting',
    defaultMessage: 'We want to get to know you.',
  },
  infoText: {
    id: 'who-is-who.onboarding.info-text',
    description: 'The info text for the user',
    defaultMessage:
      'To view other profiles, you need to activate your profile first.',
  },
  activateProfile: {
    id: 'who-is-who.onboarding.activate-profile-button',
    description: 'Activation button',
    defaultMessage: 'Activate profile',
  },
  privacyText: {
    id: 'who-is-who.onboarding.privacy-text',
    description: 'Information text about what will be publicly visible',
    defaultMessage:
      'What will be publicly available? Your name, your profile picture and in which building you are located.',
  },
})

const styles = {
  container: css({
    padding: '20px 30px',
    '> *': {
      textAlign: 'center',
      margin: '15px 0',
    },
  }),
}

interface IProps {
  config: MicroAppProps
  onButtonPress: OnClick
  username: string
}

class WhoIsWhoOnboarding extends Component<IProps & InjectedIntlProps> {
  renderCard() {
    const {
      intl: { formatMessage },
      username,
    } = this.props

    return (
      <Card
        direction="column"
        alignV="center"
        alignH="center"
        {...styles.container}
      >
        <Text
          size="xl"
          strong
          color={ColorPalette.text.primary}
          {...css({ maxWidth: 220 })}
        >
          {formatMessage(i18n.greeting, { username })}
        </Text>
        <Text size="m" color={ColorPalette.text.secondary}>
          {formatMessage(i18n.additionalGreeting)}
        </Text>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="133"
          height="94"
          viewBox="0 0 133 94"
        >
          <g fill="none" fillRule="evenodd" stroke="#070400" strokeWidth="1.5">
            <path d="M25.226 26.34c6.754-.452 11.89-6.268 11.523-13.047-.367-6.78-6.1-12.003-12.863-11.72h-.345c-6.739-.235-12.423 4.989-12.778 11.743-.355 6.753 4.75 12.547 11.476 13.025h2.987zM111.1 26.34c6.755-.452 11.89-6.268 11.523-13.047-.366-6.78-6.1-12.003-12.862-11.72h-.345c-6.739-.235-12.423 4.989-12.778 11.743-.355 6.753 4.75 12.547 11.476 13.025h2.987zM68.642 46.27c8.535-1.016 14.82-8.501 14.365-17.11-.455-8.609-7.493-15.386-16.088-15.491h-.46c-8.594.105-15.632 6.882-16.087 15.491-.455 8.609 5.83 16.094 14.365 17.11h3.905z" />
            <path d="M87.861 92.85a7.876 7.876 0 0 0 5.635-2.412 7.923 7.923 0 0 0 2.214-5.73c0-3.494-.23-6.527-.23-9.868-.012-15.126-11.747-27.637-26.8-28.57h-3.829c-15.052.933-26.788 13.444-26.8 28.57 0 3.34 0 6.374-.23 9.869a7.923 7.923 0 0 0 2.215 5.73 7.876 7.876 0 0 0 5.634 2.41h42.191z" />
            <path
              strokeLinecap="round"
              d="M45.632 48.037c-.02-11.503-8.958-21.006-20.406-21.696h-2.987c-11.448.69-20.386 10.193-20.406 21.696 0 4.262-.268 20.39-.268 26.189 0 9.945 7.083 6.604 7.083 6.604s.191 3.84.536 7.373a5.06 5.06 0 0 0 5.13 4.647h19.143M99.73 92.85h19.717a4.638 4.638 0 0 0 4.632-4.186c.383-3.84.613-7.68.613-7.68s7.083 3.34 7.083-6.605c0-5.798-.268-21.926-.268-26.189 0-11.518-8.943-21.043-20.406-21.734h-2.987c-11.463.69-20.406 10.216-20.406 21.734"
            />
          </g>
        </svg>

        <Text
          size="m"
          color={ColorPalette.text.secondary}
          {...css({ maxWidth: 220 })}
        >
          {formatMessage(i18n.infoText)}
        </Text>
        <Button
          onClick={this.props.onButtonPress}
          data-e2e="who-is-who-enable-profile-button"
        >
          <Text size="m" color="textOnBackground">
            {formatMessage(i18n.activateProfile)}
          </Text>
        </Button>
        <Text
          size="s"
          color={ColorPalette.text.gray}
          {...css({ maxWidth: 220 })}
        >
          {formatMessage(i18n.privacyText)}
        </Text>
      </Card>
    )
  }

  render() {
    const { config } = this.props

    return (
      <Microapp>
        <AppTitle>{config.label}</AppTitle>
        <SimpleLayout padded="horizontal">
          <MicroappBigTitleBar type={MicroApps.WHO_IS_WHO} />
          <Inset vertical={true} />
          {this.renderCard()}
        </SimpleLayout>
      </Microapp>
    )
  }
}

export default injectIntl(WhoIsWhoOnboarding)
