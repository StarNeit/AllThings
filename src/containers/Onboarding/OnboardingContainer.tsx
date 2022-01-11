import React from 'react'
import { TransitionGroup } from 'react-transition-group'
import FadeScaleOutTransition from 'components/Transitions/FadeScaleOutTransition'
import { connect } from 'react-redux'
import get from 'lodash-es/get'
import PinboardActions from 'store/actions/pinboard'
import { dateFromISO8601 } from 'utils/date'
import Auth from 'store/actions/authentication'
import { lazyLoadComponent } from 'utils/LazyRoutes'

// Keep using the original props instead of any.
const OnboardingOverlay = lazyLoadComponent(() => import('./OnboardingOverlay'))

interface IProps {
  createWelcomePost: (message: string) => void
  initialShowOnboarding: boolean
  setOnboardingFinished: () => void
  welcomeMessagesDisabled?: boolean
}

class OnboardingContainer extends React.PureComponent<IProps> {
  static defaultProps = {
    welcomeMessagesDisabled: false,
  }

  state = {
    showOnboarding: this.props.initialShowOnboarding,
  }

  onboardingCompleted = false

  handleOnboardingComplete = (welcomeText: string) => {
    if (!this.onboardingCompleted) {
      this.onboardingCompleted = true
      this.props.setOnboardingFinished()
      this.setState({ showOnboarding: false })
      if (!this.props.welcomeMessagesDisabled) {
        return this.props.createWelcomePost(welcomeText)
      } else {
        return true
      }
    } else {
      return true
    }
  }

  render() {
    const { showOnboarding } = this.state
    const { welcomeMessagesDisabled } = this.props

    return (
      <TransitionGroup>
        {showOnboarding && (
          <FadeScaleOutTransition unmountOnExit timeout={1500} key="Overlay">
            <OnboardingOverlay
              key="Overlay"
              onFinish={this.handleOnboardingComplete}
              welcomeMessagesDisabled={welcomeMessagesDisabled}
            />
          </FadeScaleOutTransition>
        )}
      </TransitionGroup>
    )
  }
}

const mapStateToProps = ({
  app,
  header,
  authentication,
  notifications,
}: IReduxState) => ({
  initialShowOnboarding:
    get(app, 'config.segment', 'residential') === 'residential' &&
    !get(authentication, 'user.properties.onboardingFinished', false) &&
    new Date(dateFromISO8601(authentication.user.createdAt)) >
      new Date('2017-07-17T00:00:00.000Z'),
  isChooserVisible: header.serviceChooserVisible,
  locale: app.locale,
  microApps: app.microApps,
  notificationCount: notifications.unreadCount,
  welcomeMessagesDisabled: app.config.welcomeMessagesDisabled,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  createWelcomePost: (welcomeText: string) =>
    dispatch(PinboardActions.createWelcomePost(welcomeText)),
  setOnboardingFinished: () => dispatch(Auth.setOnboardingFinished()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnboardingContainer)
