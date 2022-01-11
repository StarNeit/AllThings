import React from 'react'
import { View, Button, Text } from '@allthings/elements'
import { FormattedMessage } from 'react-intl'
import { FileWithPath } from 'react-dropzone'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import ProfileImageEditor from 'components/ProfileImageEditor'
import { ScrollWizardPage } from 'components/ScrollWizard'
import { connect } from 'react-redux'
import auth from 'store/actions/authentication'
import withMixpanel from 'containers/withMixpanel'

const styles = {
  container: css({
    maxWidth: 250,
    '> *': {
      margin: '10px 0',
    },
  }),
}

interface IProps {
  image?: FileWithPath
  isActive?: boolean
  mixpanel: (eventName: string) => void
  onAdvance: (welcomeText?: string) => void
  updateAvatar: (blob: Blob, name: string) => void
}

class OnboardingSetupYourFace extends React.Component<IProps> {
  editor: ProfileImageEditor = null

  componentDidUpdate(prevProps: IProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.props.mixpanel('onboarding page setup avatar')
    }
  }

  setEditor = (editor: ProfileImageEditor) => (this.editor = editor)

  updateAvatar = (blob: Blob, name?: string) => {
    this.props.updateAvatar(blob, name)
  }

  handleButtonClick = () => {
    this.editor && this.editor.getImage(this.updateAvatar)
    this.props.onAdvance()
  }

  render() {
    const { image } = this.props
    return (
      <ScrollWizardPage flex="noshrink">
        <View alignH="center" direction="column" {...styles.container}>
          <Text
            strong
            size="xl"
            align="center"
            data-e2e="onboarding-setupyourface-looks-great-text"
          >
            <FormattedMessage
              id="onboarding.setup-your-face.title"
              description="Title"
              defaultMessage="Looks great"
            />
          </Text>
          <ProfileImageEditor ref={this.setEditor} profileImage={image}>
            {openFileDialog => (
              <>
                <Text align="center">
                  <FormattedMessage
                    id="onboarding.setup-your-face.subtext"
                    description="Description text, that the user can move around the image to adjust it"
                    defaultMessage="You can drag the image around to make it look perfect."
                  />
                </Text>

                <Button
                  backgroundColor={ColorPalette.darkBlueIntense}
                  color={ColorPalette.white}
                  onClick={this.handleButtonClick}
                  data-e2e="onboarding-setupyourface-continue-button"
                >
                  <Text strong color={ColorPalette.white}>
                    <FormattedMessage
                      id="onboarding.setup-your-face.continue-button"
                      description="Go to the next page of onboarding"
                      defaultMessage="Continue"
                    />
                  </Text>
                </Button>
                <Button
                  backgroundColor={ColorPalette.none}
                  color={ColorPalette.text.secondary}
                  onClick={openFileDialog}
                >
                  <Text size="s">
                    <FormattedMessage
                      id="onboarding.setup-your-face.choose-another-image"
                      description="Text of choosing another image"
                      defaultMessage="Change image"
                    />
                  </Text>
                </Button>
              </>
            )}
          </ProfileImageEditor>
        </View>
      </ScrollWizardPage>
    )
  }
}

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  updateAvatar: (blob: Blob, name: string) => {
    dispatch(auth.updateAvatar(blob, name))
  },
})

export default connect(
  null,
  mapDispatchToProps,
)(withMixpanel(OnboardingSetupYourFace))
