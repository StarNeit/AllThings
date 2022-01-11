import { css, keyframes } from 'glamor'
import { Icon, Text, Theme } from '@allthings/elements'
import React from 'react'
import FlexButton from 'components/FlexButton'
import { ColorPalette } from '@allthings/colors'

const PADDING = 8 // px

const fly = keyframes({
  '0%': { transform: 'translateY(1px)' },
  '20%': {
    transform: 'translateX(120px) translateY(1px) scale(.8) rotate(20deg)',
    opacity: '0',
  },
  '50%': { opacity: '0' },
  '60%': {
    opacity: '0',
    transform: 'translateX(0) translateY(1px) rotate(0) scale(0)',
  },
  '100%': { opacity: '1', transform: 'scale(1) translateY(1px)' },
})

const bouncing = keyframes({
  '10%, 90%': { transform: 'translate3d(0, -1px, 0)' },
  '20%, 80%': { transform: 'translate3d(0, 2px, 0)' },
  '30%, 50%, 70%': { transform: 'translate3d(0, -4px, 0)' },
  '40%, 60%': { transform: 'transform: translate3d(0, 4px, 0)' },
})

const styles = {
  text: css({
    padding: PADDING,
    transition: '100ms ease-in-out',
  }),
  sendIcon: css({
    marginRight: PADDING,
    transform: 'translateY(1px)',
    transition: '100ms ease-in-out',
  }),
  sendButton: css({
    backgroundColor: 'transparent',
    height: '100%',
    padding: PADDING,
    transition: '175ms ease-in-out',
  }),
}
const animations = {
  bouncing: { animation: `${bouncing} 0.82s linear 0s infinite both` },
  flyPlane: { animation: `${fly} 2s cubic-bezier(0,0,1,-0.59)` },
}

interface IProps {
  'data-e2e'?: string
  active?: boolean
  location?: string
  onClick?: OnClick
  sending?: boolean
  text?: string
}

export default class PostSendButton extends React.Component<IProps> {
  static propTypes = {}

  state = { finishedSending: false }

  componentDidUpdate(prevProps: IProps) {
    prevProps.sending &&
      !this.props.sending &&
      this.setState({ finishedSending: true })
  }

  handleClick = (event: React.SyntheticEvent) => this.props.onClick(event)

  render() {
    const animation = this.props.sending
      ? animations.bouncing
      : this.state.finishedSending
      ? animations.flyPlane
      : null

    return (
      <Theme>
        {({ theme }: { theme: ITheme }) => (
          <FlexButton
            data-e2e={
              this.props['data-e2e']
                ? this.props['data-e2e']
                : `${this.props.location}-contribution-send`
            }
            onClick={this.handleClick}
            {...css(
              styles.sendButton,
              this.props.sending ? { pointerEvents: 'none' } : null,
            )}
          >
            {this.props.text && (
              <Text color="#626262" size="s" strong {...css(styles.text)}>
                {this.props.text}
              </Text>
            )}
            <Icon
              name={this.props.active ? 'send-filled' : 'send'}
              color={
                this.props.active
                  ? theme.primary
                  : ColorPalette.lightGreyIntense
              }
              size="s"
              {...css(styles.sendIcon, animation)}
            />
          </FlexButton>
        )}
      </Theme>
    )
  }
}
