import React from 'react'
import Overlay from 'components/Overlay'
import { ColorPalette } from '@allthings/colors'
import { ScrollWizard } from 'components/ScrollWizard'
import OnboardingWelcome from './OnboardingWelcome'
import ShowYourFace from './OnboardingShowYourFace'
import SetupYourFace from './OnboardingSetupYourFace'
import ProgressDots from './ProgressDots'
import WriteWelcomeText from './OnboardingWriteWelcomeText'
import { View } from '@allthings/elements'
import { css } from 'glamor'
import NoOp from 'utils/noop'
import { FileWithPreview } from 'utils/filePreviews'

interface IProps {
  onFinish?: (welcomeText: any) => unknown
  welcomeMessagesDisabled?: boolean
}

interface IState {
  page: number
  profileImage: FileWithPreview
}

class OnboardingOverlay extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    onFinish: NoOp,
  }

  state: IState = {
    page: 0,
    profileImage: null,
  }

  handleAdvance = () => this.setState(({ page }) => ({ page: page + 1 }))
  handleBack = () => this.setState(({ page }) => ({ page: page - 1 }))
  handleProfileImage = (profileImage: FileWithPreview) => {
    this.setState(() => ({ profileImage }))
    this.handleAdvance()
  }
  handleAdvanceTwo = () => this.setState(({ page }) => ({ page: page + 2 }))

  render() {
    const { onFinish, welcomeMessagesDisabled, ...props } = this.props
    return (
      <Overlay
        alignV="stretch"
        backgroundColor={ColorPalette.whiteIntense}
        containerStyle={{
          overflow: 'auto',
        }}
        data-e2e="onboarding-overlay"
        direction="row"
        {...props}
      >
        <View
          direction="column"
          alignV="center"
          alignH="center"
          {...css({ width: '100%', overflow: 'hidden' })}
        >
          <ScrollWizard
            page={this.state.page}
            containerStyle={{ width: '100%' }}
          >
            <OnboardingWelcome
              onAdvance={this.handleAdvance}
              onFinish={onFinish}
            />
            <ShowYourFace
              onProfileImage={this.handleProfileImage}
              onSkipScreen={
                welcomeMessagesDisabled ? onFinish : this.handleAdvanceTwo
              }
            />
            <SetupYourFace
              onAdvance={
                welcomeMessagesDisabled ? onFinish : this.handleAdvance
              }
              image={this.state.profileImage}
            />
            {!this.props.welcomeMessagesDisabled && (
              <WriteWelcomeText onFinish={onFinish} />
            )}
          </ScrollWizard>
          <View style={{ margin: 10 }}>
            <ProgressDots
              value={this.state.page}
              max={welcomeMessagesDisabled ? 3 : 4}
            />
          </View>
        </View>
      </Overlay>
    )
  }
}

export default OnboardingOverlay
