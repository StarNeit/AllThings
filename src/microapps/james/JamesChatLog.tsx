import React from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { FormattedRelativeTime } from 'react-intl'
import { Text, ChatBubble, View } from '@allthings/elements'
import SanitizedHtml from 'components/SanitizedHtml'
import { getStaticImage } from 'utils/getStaticImage'
import { IMessage } from '.'

interface IProps {
  config: MicroAppProps
  finished: boolean
  messages: ReadonlyArray<IMessage>
  triggerClose: () => void
  user: {
    email?: string
    profileImage?: any
    username?: string
  }
}

class James extends React.Component<IProps> {
  innerContainer: HTMLDivElement = null

  outerContainer: HTMLDivElement = null

  componentDidUpdate(prevProps: IProps) {
    if (this.props.messages.length > prevProps.messages.length) {
      // it may occur that the content is just filled in after scrolling.
      // deferring this to the next tick solves that.
      setTimeout(() => {
        this.outerContainer.scrollTop = this.outerContainer.scrollHeight
        this.innerContainer.scrollTop = this.innerContainer.scrollHeight
      }, 0)
    }
  }

  setOuterContainerRef = (container: HTMLDivElement) =>
    (this.outerContainer = container)

  setInnerContainerRef = (container: HTMLDivElement) =>
    (this.innerContainer = container)

  handleBackToOverview = () => {
    this.props.triggerClose && this.props.triggerClose()
  }

  renderMessage = (message: IMessage, id: number) => {
    const { isFromUser, date, text } = message
    const { user, config } = this.props

    return (
      <ChatBubble
        key={id}
        date={<FormattedRelativeTime value={(date as unknown) as number} />}
        text={<SanitizedHtml config={{ ADD_ATTR: ['target'] }} html={text} />}
        userName={isFromUser ? user.username : 'Concierge'}
        userImage={
          isFromUser ? user.profileImage : getStaticImage('concierge.svg')
        }
        direction={isFromUser ? 'right' : 'left'}
        background={isFromUser ? '#fff' : config.color}
      />
    )
  }

  renderFinishedMessage() {
    const style = css({
      ':hover': {
        cursor: 'pointer',
      },
    })

    return (
      <View alignV="center" direction="column" style={{ margin: 50 }}>
        <Text block color={ColorPalette.text.primary}>
          Das Gespräch wurde beendet.
        </Text>
        <Text
          onClick={this.handleBackToOverview}
          block
          color={ColorPalette.text.primary}
          {...style}
        >
          <Text style={{ textDecoration: 'underline' }} block={false}>
            Zurück zur Übersicht
          </Text>
          .
        </Text>
      </View>
    )
  }

  render() {
    const contentStyle = css({
      background: '#f3f5f7',
      overflowY: 'auto',
    })

    // Firefox treats the outer container as scroll container whereas Chrome takes the inner container
    // So a ref is set to both, and both will set to a specific scrollTop (see `componentDidUpdate`)
    return (
      <View
        {...contentStyle}
        // @todo this microapp is not used anymore, so supress error until deletion
        // @ts-ignore
        onRef={this.setOuterContainerRef}
        flex="grow"
        direction="column"
      >
        <View flex="grow" alignH="end" direction="column">
          <div ref={this.setInnerContainerRef} style={{ overflowY: 'auto' }}>
            {this.props.messages.map(this.renderMessage)}
            {this.props.finished ? this.renderFinishedMessage() : null}
          </div>
        </View>
      </View>
    )
  }
}

export default James
