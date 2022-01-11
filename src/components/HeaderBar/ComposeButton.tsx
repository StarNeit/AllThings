import React from 'react'
import { ColorPalette } from '@allthings/colors'
import ComposeIcon from '@allthings/react-ionicons/lib/ComposeIcon'

interface IProps {
  onComposeButtonClick: () => void
}

class ComposeButton extends React.Component<IProps> {
  render() {
    return (
      <button
        className="chooserButton"
        onClick={this.props.onComposeButtonClick}
        data-e2e="compose-button"
      >
        <ComposeIcon
          style={{ fill: ColorPalette.lightGreyIntense, width: 24, height: 24 }}
        />
        <span className="chooserButton-label">Compose</span>
      </button>
    )
  }
}

export default ComposeButton
