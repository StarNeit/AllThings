import React from 'react'

interface IProps {
  isValid?: boolean
  position: 'top' | 'bottom'
  timestamp?: number
}

interface IState {
  timestamp?: number
  visible?: boolean
}

export default class InputError extends React.PureComponent<IProps, IState> {
  static defaultProps = {
    position: 'top',
  }

  state = {
    timestamp: Date.now(),
    visible: true,
  }

  componentDidUpdate() {
    const { isValid, timestamp } = this.props

    if (!isValid && timestamp > this.state.timestamp) {
      this.setState({ visible: true, timestamp: this.props.timestamp })
    }
  }

  handleClick = () =>
    this.setState({
      timestamp: this.state.timestamp,
      visible: false,
    })

  render() {
    if (!this.state.visible) {
      return null
    }

    const { position, children, isValid, timestamp, ...props } = this.props
    const pos = position === 'bottom' ? 'below' : ''
    const classes = `formGroup-item-tooltip formGroup-item-tooltip-error ${pos} flipInX`

    return (
      <div
        className={classes}
        data-e2e="input-error-hint"
        onClick={this.handleClick}
        {...props}
      >
        <i className="formGroup-item-tooltip-arrow" />
        <div>{children}</div>
      </div>
    )
  }
}
