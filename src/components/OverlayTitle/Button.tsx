import React from 'react'
import NoOp from 'utils/noop'

interface IProps {
  children: React.ReactElement<IProps>
  onClick: OnClick
}

class Button extends React.Component<IProps> {
  static defaultProps = {
    onClick: NoOp,
  }

  render() {
    return (
      <button
        className="mainOverlay-bar-button"
        onClick={this.props.onClick}
        {...this.props}
      >
        <span className="mainOverlay-bar-button-label">
          {this.props.children}
        </span>
      </button>
    )
  }
}

export default Button
