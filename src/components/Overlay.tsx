import React from 'react'
import { css } from 'glamor'
import { View, ThemeProvider } from '@allthings/elements'
import { IViewProps } from '@allthings/elements/View'

const overlayStyle = (backgroundColor: string) =>
  css({
    width: '100%',
    minHeight: '100%',
    // 90vh because iOS safari doesn't like 100vh together with the keyboard.
    // No side effects have been seen so far.
    maxHeight: '85vh',
    zIndex: 1001,
    background: backgroundColor,
    top: 0,
    left: 0,
    position: 'fixed',
  })

interface IProps extends IViewProps {
  containerStyle?: object
  onBackgroundClick?: () => void
  onClick?: OnClick
  theme?: object
  backgroundColor?: string
}

class Overlay extends React.Component<IProps> {
  static defaultProps = {
    backgroundColor: 'rgba(0,0,0,0.8)',
    onBackgroundClick: (): void => null,
  }

  componentDidMount() {
    this.bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.body.style.overflow = this.bodyOverflow
  }

  bodyOverflow: string = null

  viewRef = React.createRef<HTMLDivElement>()

  handleMouseDown = (e: React.MouseEvent) => {
    if (
      this.viewRef.current &&
      e.target === this.viewRef.current &&
      // only close on left button mouse down
      e.button === 0
    ) {
      this.props.onBackgroundClick()
    }
  }

  render() {
    const {
      children,
      theme,
      onBackgroundClick,
      backgroundColor,
      containerStyle,
      ...props
    } = this.props

    let overlay = (
      <View
        data-e2e="overlay"
        ref={this.viewRef}
        onMouseDown={this.handleMouseDown}
        {...css(
          { cursor: 'auto !important' },
          overlayStyle(backgroundColor),
          containerStyle,
        )}
        {...props}
      >
        {children}
      </View>
    )

    if (theme) {
      overlay = <ThemeProvider theme={theme}>{overlay}</ThemeProvider>
    }

    return overlay
  }
}

export default Overlay
