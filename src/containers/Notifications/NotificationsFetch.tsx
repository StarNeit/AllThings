import React from 'react'

interface IProps {
  onFetch: () => void
}

class NotificationsFetch extends React.Component<IProps> {
  componentDidMount() {
    this.props.onFetch()
    this.intervalId = window.setInterval(this.props.onFetch, 30000)
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId)
  }

  intervalId: number = null

  render() {
    return null as React.ReactElement
  }
}
export default NotificationsFetch
