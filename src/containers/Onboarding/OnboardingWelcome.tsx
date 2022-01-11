import React from 'react'
import { View, Text, Button } from '@allthings/elements'
import { FormattedMessage, injectIntl } from 'react-intl'
import OnboardingHouseIcon from './OnboardingHouseIcon'
import { ColorPalette } from '@allthings/colors'
import { connect } from 'react-redux'
import { css } from 'glamor'
import { ScrollWizardPage } from 'components/ScrollWizard'
import withMixpanel, { IInjectedMixpanelProps } from 'containers/withMixpanel'
import ActionButton from 'components/Action/ActionButton'

const styles = {
  container: css({
    maxWidth: 250,
    '> *': {
      margin: '7px 0',
    },
  }),
}

interface IProps {
  isActive?: boolean
  onAdvance: () => void
  onFinish: (message: string) => unknown
  username: string
}

class OnboardingWelcome extends React.PureComponent<
  IProps & InjectedIntlProps & IInjectedMixpanelProps
> {
  componentDidMount() {
    if (this.props.isActive) {
      this.props.mixpanel('onboarding started')
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.props.mixpanel('onboarding started')
    }
  }

  handleSkip = () => {
    this.props.mixpanel('onboarding skipped')
    return this.props.onFinish('')
  }

  render() {
    const { username, onAdvance } = this.props
    return (
      <ScrollWizardPage flex="noshrink">
        <View alignH="center" direction="column" {...styles.container}>
          <Text
            strong
            size="xl"
            align="center"
            data-e2e="onboarding-welcome-message"
          >
            <FormattedMessage
              id="onboarding.welcome.hello"
              description="Greeting the user with their name"
              defaultMessage="Hello {username}!"
              values={{ username }}
            />
          </Text>
          <OnboardingHouseIcon />
          <Text align="center" data-e2e="onboarding-welcome-new-onboarder-text">
            <FormattedMessage
              id="onboarding.welcome.subtext"
              description="Text underneath the welcome image"
              defaultMessage="Nice that you are here!"
            />
          </Text>
          <Text align="center">
            <FormattedMessage
              id="onboarding.welcome.subtext2"
              description="Text underneath the first subtext"
              defaultMessage="You are now part of your digital neighborhood."
            />
          </Text>

          <Button
            backgroundColor={ColorPalette.darkBlueIntense}
            data-e2e="onboarding-progress-from-welcome-button"
            color={ColorPalette.white}
            onClick={onAdvance}
          >
            <Text strong color={ColorPalette.white}>
              <FormattedMessage
                id="onboarding.welcome.continue-button"
                description="Continue button which takes the user to the next onboarding page"
                defaultMessage="Let's go"
              />
            </Text>
          </Button>
          <ActionButton
            action={this.handleSkip}
            backgroundColor={ColorPalette.none}
            color={ColorPalette.text.secondary}
            data-e2e="onboarding-skip-onboarding-button"
          >
            <Text align="center" size="s">
              <FormattedMessage
                id="onboarding.welcome.skip"
                description="Text for skipping the onboarding"
                defaultMessage="Skip"
              />
            </Text>
          </ActionButton>
        </View>
      </ScrollWizardPage>
    )
  }
}

// injectIntl should be outside to have the onboarding language on the user's own language, and not his browser's (very edge case)
// https://github.com/yahoo/react-intl/issues/371
export default withMixpanel(
  injectIntl(
    connect((state: IReduxState) => ({
      username: state.authentication.user.username,
    }))(OnboardingWelcome),
  ),
)
