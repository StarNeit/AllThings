import React from 'react'
import { css } from 'glamor'
import { FormattedMessage } from 'react-intl'
import { ColorPalette, alpha } from '@allthings/colors'
import AppActions from 'store/actions/app'
import { connect } from 'react-redux'

const styles = {
  container: css({
    zIndex: 2000,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'fixed',
    margin: 'auto',
    width: '23em',
    padding: '1em',
    boxShadow: `0 0 0 1px ${alpha(ColorPalette.white, 0.15)}, 0 0 1em ${alpha(
      ColorPalette.lightGreyIntense,
      0.3,
    )}`,
    maxWidth: '100%',
    background: ColorPalette.lightGrey,
    color: ColorPalette.text,
    border: `1px solid ${ColorPalette.grey}`,
    borderBottom: 'none',
    borderRadius: '3px 3px 0 0',
    paddingLeft: '2.5em',
  }),

  bubble: css({
    background: ColorPalette.state.error,
    display: 'block',
    borderRadius: '50%',
    marginRight: '2px',
    content: ' ',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '1em',
    margin: 'auto',
    height: '0.9em',
    width: '0.9em',
  }),
}

interface IProps {
  connected: boolean
}

class DisconnectStatus extends React.Component<IProps & DispatchProp> {
  componentDidMount() {
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  }

  updateOnlineStatus = () => {
    this.props.dispatch(AppActions.setConnected(navigator.onLine))
  }

  render() {
    return !this.props.connected ? (
      <div {...styles.container}>
        <div {...styles.bubble} />
        <FormattedMessage
          id="disconnected.status-message"
          description="Message when the user is offline and therefore not use the app"
          defaultMessage="No connection. Waiting to get back online..."
        />
      </div>
    ) : null
  }
}

export default connect((state: IReduxState) => ({
  connected: state.app.connected,
}))(DisconnectStatus)
