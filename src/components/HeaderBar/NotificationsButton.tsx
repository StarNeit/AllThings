import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import AndroidNotificationsIcon from '@allthings/react-ionicons/lib/AndroidNotificationsIcon'

interface IProps {
  onNotificationsButtonClick: () => void
  showUnread: boolean
}

class NotificationsButton extends React.Component<IProps> {
  renderNotificationsIcon() {
    return this.props.showUnread ? (
      <span
        className="chooserButton-notification-icon"
        data-e2e="new-notifications"
      />
    ) : null
  }

  render() {
    return (
      <button
        className="chooserButton chooserButton-notification chooserButton-notification-some"
        onClick={this.props.onNotificationsButtonClick}
        data-e2e="notifications-button"
      >
        {this.renderNotificationsIcon()}
        <AndroidNotificationsIcon
          style={{ fill: ColorPalette.lightGreyIntense, width: 24, height: 24 }}
        />
        <span className="chooserButton-label">
          <FormattedMessage
            id="notifications-button.chooser-button-label"
            description="Message that indicates new notifications"
            defaultMessage="New notifications"
          />
        </span>
      </button>
    )
  }
}

export default NotificationsButton
