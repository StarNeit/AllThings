import React from 'react'
import { FormattedMessage } from 'react-intl'

interface IProps {
  handleClick: OnClick
  onDisplay: (element: HTMLAnchorElement) => void
}

class BackToTopButton extends React.PureComponent<IProps> {
  setRef = (element: HTMLAnchorElement) => {
    if (element) {
      this.props.onDisplay(element)
    }
  }

  render() {
    return (
      <a
        onClick={this.props.handleClick}
        ref={this.setRef}
        style={{
          display: 'block',
          padding: '10px',
          textAlign: 'center',
        }}
      >
        <FormattedMessage
          id="app-ui.back-to-top"
          description="Label of the back-to-top button"
          defaultMessage="Back to top"
        />
      </a>
    )
  }
}

export default BackToTopButton
