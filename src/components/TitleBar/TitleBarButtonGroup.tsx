import React from 'react'

interface IProps {
  direction: 'left' | 'right'
}

export default class TitleBarButtonGroup extends React.Component<IProps> {
  render() {
    const directionClass =
      this.props.direction === 'left'
        ? 'appbar-buttonGroup-pullLeft'
        : 'appbar-buttonGroup-pullRight'

    return <div className={directionClass}>{this.props.children}</div>
  }
}
