import React from 'react'
import { View, Text } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import { connect } from 'react-redux'
import { css } from 'glamor'
import get from 'lodash-es/get'
import {
  PostForm,
  PostContent,
  PostFooter,
  GreetingPost,
} from 'components/Pinboard'
import SendButton from 'components/SendButton'
import CommentBox from 'components/CommentBox'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { ScrollWizardPage } from 'components/ScrollWizard'
import withMixpanel from 'containers/withMixpanel'
import ActionButton from 'components/Action/ActionButton'

const messages = defineMessages({
  sendButtonLabel: {
    id: 'pinboard.send-button-label',
    description: 'Button label for the send button',
    defaultMessage: 'Send',
  },
})

const styles = {
  container: css({
    width: '100%',
    '@media (min-width:481px)': {
      maxWidth: 320,
    },
    '> *': {
      margin: '10px 0',
    },
  }),
}

interface IProps {
  isActive?: boolean
  mixpanel: (eventName: string) => void
  onFinish: (message: string) => unknown
  profileImage?: string
  username: string
}

class WriteWelcomeText extends React.Component<IProps & InjectedIntlProps> {
  state = {
    welcomeText: '',
  }

  componentDidUpdate(prevProps: IProps) {
    if (!prevProps.isActive && this.props.isActive) {
      this.props.mixpanel('onboarding page welcome text')
    }
  }

  handleWelcomeTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ welcomeText: e.target.value })
  handlePostClick = () => {
    this.props.mixpanel('onboarding finished with text')
    return this.props.onFinish(this.state.welcomeText)
  }
  handleForwardWithoutTextClick = () => {
    this.props.mixpanel('onboarding finished without text')
    return this.props.onFinish('')
  }

  render() {
    const { formatMessage } = this.props.intl
    const { username, profileImage } = this.props
    return (
      <ScrollWizardPage flex="noshrink">
        <View alignH="center" direction="column" {...styles.container}>
          <Text
            strong
            size="xl"
            align="center"
            data-e2e="onboarding-writewelcome-write-welcome-text"
          >
            <FormattedMessage
              id="onboarding.write-welcome-text.write-welcome-text"
              description="Asking the user to write a welcome text"
              defaultMessage="Write a Welcome Notice!"
            />
          </Text>
          <View>
            <GreetingPost imageUrl={profileImage} username={username}>
              <Text
                italic
                color={ColorPalette.text.secondary}
                size="s"
                autoBreak
              >
                {this.state.welcomeText.trim()}
              </Text>
            </GreetingPost>
          </View>
          <PostForm>
            <PostContent>
              <CommentBox
                location="onboarding-write-welcome"
                onChange={this.handleWelcomeTextChange}
                profileImage={profileImage}
                value={this.state.welcomeText}
              />
            </PostContent>
            <PostFooter>
              <SendButton
                data-e2e="onboarding-send-welcome-text-button"
                onClick={this.handlePostClick}
                text={formatMessage(messages.sendButtonLabel)}
              />
            </PostFooter>
          </PostForm>
          <ActionButton
            backgroundColor={ColorPalette.none}
            color={ColorPalette.text.secondary}
            action={this.handleForwardWithoutTextClick}
            data-e2e="onboarding-writewelcome-forward-without-text-button"
          >
            <Text align="center" size="s">
              <FormattedMessage
                id="onboarding.write-welcome-text.send-without-text"
                description="The user choses not to give a greeting text."
                defaultMessage="Send without greeting message"
              />
            </Text>
          </ActionButton>
        </View>
      </ScrollWizardPage>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  username: get(state, 'authentication.user.username'),
  profileImage: get(
    state,
    'authentication.user.profileImage._embedded.files.medium.url',
  ),
})

export default connect(mapStateToProps)(
  withMixpanel(injectIntl(WriteWelcomeText)),
)
