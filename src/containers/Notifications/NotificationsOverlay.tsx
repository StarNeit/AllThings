import React from 'react'
import notifications from 'store/actions/notifications'
import NotificationList from './NotificationList'
import NotificationListItem from './NotificationListItem'
import Overlay from 'components/Overlay'
import {
  Bar,
  BarTitle,
  CloseButton,
  ButtonGroup,
  Button,
} from 'components/OverlayTitle'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { FormattedMessage } from 'react-intl'
import NoOp from 'utils/noop'
import { Gateway } from 'react-gateway'
import OverlayBox from 'components/OverlayBox'
import { css } from 'glamor'

const containerStyle = css({
  '@media (max-width: 1024px)': {
    background: 'rgba(0,0,0,0.8)',
  },
})

type Props = ReturnType<typeof mapStateToProps> & {
  onRequestClose: () => void
}

class NotificationsOverlay extends React.Component<Props & DispatchProp> {
  handleClickShowMore = () => {
    const { dispatch } = this.props
    const { page } = this.props.notifications
    dispatch(notifications.getNextPage(page + 1))
  }

  handleNotificationsItemClick = (route: string, id: string) => {
    this.props.dispatch(notifications.setRead(id))
    this.props.dispatch(push(route))
    this.props.onRequestClose()
  }

  markAllNotificationsRead = () => {
    this.props.dispatch(notifications.setAllRead())
    this.props.onRequestClose()
  }

  handleScrollEnd = () => {
    const { page, pages } = this.props.notifications
    if (page < pages) {
      this.handleClickShowMore()
    }
  }

  renderNotificationListItems = (items: Props['notifications']['items']) => {
    const copyItems = { ...items }
    const id = 'welcome-notification'
    const noNotifications = Object.keys(items).length === 0

    // Add welcome notification if notifications are empty.
    if (noNotifications) {
      copyItems[id] = ({
        key: id,
        type: id,
        objectID: '',
        id,
        read: false,
        _embedded: {
          author: {
            username: 'qipp',
          },
        },
      } as unknown) as INotification
    }

    return Object.keys(copyItems).map(key => (
      <NotificationListItem
        notification={copyItems[key] as INotification}
        key={copyItems[key].id}
        onClick={!noNotifications ? this.handleNotificationsItemClick : NoOp}
        microAppsThemes={this.props.microAppsThemes}
      />
    ))
  }

  render() {
    const {
      notifications: { items },
    } = this.props

    return (
      <Gateway into="root">
        <Overlay
          backgroundColor="transparent"
          containerStyle={containerStyle}
          onBackgroundClick={this.props.onRequestClose}
        >
          <OverlayBox left={20}>
            <Bar>
              <BarTitle icon="notification">
                <FormattedMessage
                  id="notifications-overlay.title"
                  description="Title of the notifications overlay"
                  defaultMessage="Notifications"
                />
              </BarTitle>
              <ButtonGroup>
                <CloseButton onClick={this.props.onRequestClose} />
              </ButtonGroup>
            </Bar>
            <NotificationList onScrollEnd={this.handleScrollEnd}>
              {this.renderNotificationListItems(items)}
            </NotificationList>
            <Bar>
              <ButtonGroup>
                <Button
                  onClick={this.markAllNotificationsRead}
                  data-e2e="mark-all-notifications-read"
                >
                  <FormattedMessage
                    id="notifications-overlay.mark-all-button"
                    description="Label of the notifications overlay button that marks all notifications as read."
                    defaultMessage="Mark all as read"
                  />
                </Button>
              </ButtonGroup>
            </Bar>
          </OverlayBox>
        </Overlay>
      </Gateway>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  notifications: state.notifications,
  microAppsThemes: state.theme.microApps,
})
export default connect(mapStateToProps)(NotificationsOverlay)
