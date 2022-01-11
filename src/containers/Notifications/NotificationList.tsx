import React from 'react'
import Scroll from 'components/Scroll'

interface IProps {
  children: React.ReactNodeArray
  onScrollEnd: () => void
}

class NotificationList extends React.Component<IProps> {
  render() {
    return (
      <div className="notificationList" style={{ maxHeight: '40vh' }}>
        <Scroll
          style={{ maxHeight: '40vh' }}
          onScrollEnd={this.props.onScrollEnd}
        >
          {this.props.children}
        </Scroll>
      </div>
    )
  }
}

export default NotificationList
