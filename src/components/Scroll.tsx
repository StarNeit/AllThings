import React from 'react'
import NoOp from 'utils/noop'

const TOLERANCE = 75

interface IProps {
  onScrollEnd: () => void
  onScrollStart: () => void
  children: React.ReactNodeArray
  style?: object
}

interface IState {
  scrollable: Element
  triggerStart: boolean
  triggerEnd: boolean
}

class Scroll extends React.Component<IProps, IState> {
  static defaultProps = {
    onScrollEnd: NoOp,
    onScrollStart: NoOp,
  }

  state: IState = {
    scrollable: null,
    triggerStart: true,
    triggerEnd: true,
  }

  handleScroll = (e: React.UIEvent) => {
    e.preventDefault()

    if (this.state.scrollable) {
      if (this.props.onScrollEnd) {
        const { scrollable, triggerEnd } = this.state

        if (
          scrollable.scrollTop + scrollable.clientHeight + TOLERANCE >
          scrollable.scrollHeight
        ) {
          if (triggerEnd) {
            this.props.onScrollEnd()
            this.setState({ triggerEnd: false })
          }
        } else {
          this.setState({ triggerEnd: true })
        }
      }

      if (this.props.onScrollStart) {
        const { scrollable, triggerStart } = this.state

        if (scrollable.scrollTop < TOLERANCE) {
          if (triggerStart) {
            this.props.onScrollStart()
            this.setState({ triggerStart: false })
          }
        } else {
          this.setState({ triggerStart: true })
        }
      }
    }
  }

  setScrollable = (scrollable: Element) => {
    this.setState({ scrollable })
  }

  render() {
    const {
      children,
      onScrollEnd,
      onScrollStart,
      style,
      ...otherProps
    } = this.props

    return (
      <div
        {...otherProps}
        ref={this.setScrollable}
        onScroll={this.handleScroll}
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          ...style,
        }}
      >
        {children}
      </div>
    )
  }
}

export default Scroll
