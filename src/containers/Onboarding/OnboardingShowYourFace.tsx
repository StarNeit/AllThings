import React from 'react'
import { View, Button, Text } from '@allthings/elements'
import { FormattedMessage } from 'react-intl'
import OnboardingCameraIcon from './OnboardingCameraIcon'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import FileChooser from 'components/FileChooser'
import { ScrollWizardPage } from 'components/ScrollWizard'
import withMixpanel from 'containers/withMixpanel'
import { FileWithPreview } from 'utils/filePreviews'

const styles = {
  container: css({
    maxWidth: 250,
    '> *': {
      margin: '10px 0',
    },
  }),
}

interface IProps {
  isActive?: boolean
  mixpanel: (eventName: string) => void
  onProfileImage: (image: FileWithPreview) => void
  onSkipScreen: (welcomeText?: string) => void
}

interface IState {
  disableSkip: boolean
}

class OnboardingShowYourFace extends React.Component<IProps, IState> {
  state = {
    disableSkip: false,
  }

  componentDidUpdate(prevProps: IProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.props.mixpanel('onboarding page upload avatar')
    }
  }

  handleChoose = (images: FileWithPreview[]) => {
    const image = images.pop()
    this.props.onProfileImage(image)
    this.props.mixpanel('onboarding uploaded avatar')
  }

  handleSkipScreen = () => {
    // APP-2106 - disable the button to prevent multiple welcome messages
    if (!this.state.disableSkip) {
      this.setState({ disableSkip: true })
      this.props.onSkipScreen()
      this.props.mixpanel('onboarding skipped upload avatar')
    }
  }

  render() {
    return (
      <ScrollWizardPage flex="noshrink">
        <View alignH="center">
          <FileChooser onChoose={this.handleChoose}>
            {openFileChooser => (
              <View alignH="center" direction="column" {...styles.container}>
                <Text
                  strong
                  size="xl"
                  align="center"
                  data-e2e="onboarding-showface-show-us-your-looks-text"
                >
                  <FormattedMessage
                    id="onboarding.show-your-face.title"
                    description="Title"
                    defaultMessage="Show us your looks"
                  />
                </Text>
                <View onClick={openFileChooser}>
                  <OnboardingCameraIcon />
                </View>

                <Text align="center">
                  <FormattedMessage
                    id="onboarding.show-your-face.subtext"
                    description=""
                    defaultMessage="With a profile image you can show everyone your best side!"
                  />
                </Text>

                <Button
                  backgroundColor={ColorPalette.darkBlueIntense}
                  color={ColorPalette.white}
                  onClick={openFileChooser}
                  data-e2e="onboarding-showface-select-image-button"
                >
                  <Text strong color={ColorPalette.white}>
                    <FormattedMessage
                      id="onboarding.show-your-face.choose-button"
                      description="Text of the button to choose the image"
                      defaultMessage="Choose image"
                    />
                  </Text>
                </Button>

                <Button
                  backgroundColor={ColorPalette.none}
                  color={ColorPalette.text.secondary}
                  onClick={this.handleSkipScreen}
                  data-e2e="onboarding-showface-continue-without-image-button"
                  disabled={this.state.disableSkip}
                >
                  <Text size="s">
                    <FormattedMessage
                      id="onboarding.show-your-face.skip"
                      description="Continue without image"
                      defaultMessage="Continue without image"
                    />
                  </Text>
                </Button>
              </View>
            )}
          </FileChooser>
        </View>
      </ScrollWizardPage>
    )
  }
}

export default withMixpanel(OnboardingShowYourFace)
