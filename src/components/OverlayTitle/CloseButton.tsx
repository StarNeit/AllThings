import React from 'react'
import { alpha } from '@allthings/colors'
import { Button, Icon } from '@allthings/elements'

interface IProps {
  onClick: () => void
}

class CloseButton extends React.Component<IProps> {
  componentDidMount() {
    document.addEventListener('keyup', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyPress)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.which === 27) {
      this.props.onClick()
    }
  }

  render() {
    return (
      <Button
        backgroundColor={alpha('#000000', 0.15)}
        onClick={this.props.onClick}
        data-e2e="cancel-overlay"
      >
        <Icon name="remove-light-filled" size="xs" color="white" />
      </Button>
    )
  }
}

export default CloseButton
