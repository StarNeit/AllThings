import { between } from 'utils/math'
import { ColorPalette } from '@allthings/colors'
import {
  confirm as confirmWithUser,
  ExpandingTextarea,
  Text,
  View,
} from '@allthings/elements'
import { css } from 'glamor'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import React from 'react'
import PostButton from '../FlexButton'
import PostFooter from './PostFooter'

const styles = {
  greyBackground: css({
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 4,
  }),
  wrapper: css({
    position: 'absolute',
    left: 0,
    width: '100%',
    zIndex: 5,
    background: '#fff',
  }),
  innerWrapper: css({ padding: 15 }),
}

const messages = defineMessages({
  abortText: {
    id: 'pinboard.edit-post-abort-button-label-mod',
    description: 'Button label for the aborting of editing post',
    defaultMessage: 'Cancel',
  },
  saveEditText: {
    id: 'pinboard.edit-post-send-button-label-mod',
    description: 'Button label for editing a post',
    defaultMessage: 'Save',
  },
  yesExitEdit: {
    id: 'pinboard.edit-post-exit-edit',
    description: 'Button label to confirm exit editing post',
    defaultMessage: 'Yes',
  },
})

interface IProps {
  initialText?: string
  confirmText: string
  onSave: (text: string) => void
  onRequestClose?: () => void
  index: number
}

interface IState {
  text: string
}

class PostEditor extends React.Component<
  IProps & WrappedComponentProps,
  IState
> {
  state = {
    text: this.props.initialText,
  }

  fixedElementRef = React.createRef<HTMLDivElement>()
  textareaWrapperRef = React.createRef<HTMLDivElement>()

  componentDidMount() {
    this.addClickEvent()
    // prevent touchmove to prevent scrolling on iOS safari when in edit mode
    // position fixed (styles.greyBackground) doesn't behave as expected
    this.fixedElementRef.current.ontouchmove = event => event.preventDefault()
  }

  componentWillUnmount() {
    this.removeClickEvent()
  }

  addClickEvent = () => {
    document.addEventListener('touchend', this.handleClick)
    document.addEventListener('click', this.handleClick)
  }

  removeClickEvent = () => {
    document.removeEventListener('touchend', this.handleClick)
    document.removeEventListener('click', this.handleClick)
  }

  getBoundaries = (node: HTMLElement) => {
    const { bottom, left, right, top } = node.getBoundingClientRect()
    return [bottom, left, right, top]
  }

  handleClick = async (event: MouseEvent) => {
    const { formatMessage } = this.props.intl
    const { clientX, clientY, pageX, pageY } = event
    const [textBottom, textLeft, textRight, textTop] = this.getBoundaries(
      this.textareaWrapperRef.current,
    )
    const [fixedBottom, fixedLeft, fixedRight, fixedTop] = this.getBoundaries(
      this.fixedElementRef.current,
    )
    // clientX for desktop, pageX for mobile
    const xAxis = clientX || pageX
    const yAxis = clientY || pageY

    const clickIsOutsideTextArea =
      !between(yAxis, textTop, textBottom) ||
      !between(xAxis, textLeft, textRight)
    const clickIsInsideFixedDiv =
      between(yAxis, fixedTop, fixedBottom) &&
      between(xAxis, fixedLeft, fixedRight)

    if (clickIsOutsideTextArea && clickIsInsideFixedDiv) {
      const customization = {
        acceptButtonLabel: formatMessage(messages.yesExitEdit),
        cancelButtonLabel: formatMessage(messages.abortText),
        message: this.props.confirmText,
      }
      const userIsCertain = await confirmWithUser(customization)

      this.removeClickEvent()

      if (userIsCertain) {
        event.stopPropagation()
        this.triggerClose()
      } else {
        this.addClickEvent()
      }
    }

    return false
  }

  triggerClose = () => this.props.onRequestClose && this.props.onRequestClose()

  handleSave = () => this.props.onSave(this.state.text)

  handleChange = ({
    target: { value: text },
  }: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({ text })

  render() {
    const { index } = this.props
    const { formatMessage } = this.props.intl

    return (
      <>
        <View {...styles.greyBackground} ref={this.fixedElementRef} />
        <View {...styles.wrapper} ref={this.textareaWrapperRef}>
          <View {...styles.innerWrapper}>
            <ExpandingTextarea
              data-e2e={`pinboard-edit-${index}-content`}
              value={this.state.text}
              onChange={this.handleChange}
              style={{ padding: 0, color: '#333' }}
              autoFocus
            />
          </View>
          <PostFooter>
            <PostButton
              onClick={this.triggerClose}
              data-e2e={`pinboard-edit-${
                typeof index !== 'undefined' ? index : 'detail'
              }-cancel`}
            >
              <Text size="m" color={ColorPalette.text.secondary}>
                {formatMessage(messages.abortText)}
              </Text>
            </PostButton>
            <PostButton
              onClick={this.handleSave}
              data-e2e={`pinboard-edit-${index}-save`}
            >
              <Text size="m" color={ColorPalette.text.secondary}>
                {formatMessage(messages.saveEditText)}
              </Text>
            </PostButton>
          </PostFooter>
        </View>
      </>
    )
  }
}

export default injectIntl(PostEditor)
