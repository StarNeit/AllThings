import React from 'react'

class ButtonGroup extends React.Component<{}> {
  render() {
    return (
      <div className="mainOverlay-bar-buttonGroup-pullRight">
        {this.props.children}
      </div>
    )
  }
}

export default ButtonGroup
