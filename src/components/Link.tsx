import React from 'react'
import { Link as DOMLink } from 'react-router-dom'
import { ColorPalette } from '@allthings/colors'
import storeLocationIfStandalone from 'utils/storeLastLocation'
import sendNativeEvent from 'utils/sendNativeEvent'
import { connect } from 'react-redux'

interface IProps {
  accessToken: string
  big?: boolean
  className?: string
  embeddedLayout: boolean
  light?: boolean
  name?: string
  stress?: boolean
  setLastLocation?: boolean
  target?: string
  to: string
}

export class Link extends React.PureComponent<
  React.PropsWithChildren<IProps & DispatchProp>
> {
  handleClick = (e: React.MouseEvent) => {
    const { embeddedLayout, name, setLastLocation, to } = this.props
    setLastLocation && storeLocationIfStandalone(name, to)

    /* If we are an in a native environment (embeddedLayout),
       prevent the click event from firing, and instead send a native event.
       We do this to prevent external links from opening in the app. */
    if (embeddedLayout) {
      e.stopPropagation()
      e.preventDefault()
      sendNativeEvent(this.props.accessToken, {
        name: 'open-external-link',
        data: to,
      })
    }
  }

  isExternal = () =>
    typeof this.props.to === 'string' && this.props.to.indexOf('http') === 0

  render() {
    const {
      accessToken,
      dispatch,
      embeddedLayout,
      light,
      big,
      stress,
      setLastLocation,
      to,
      ...restProps
    } = this.props
    const styles = {
      color: light ? ColorPalette.white : 'initial',
      fontSize: big ? 'inherit' : '12px',
      textDecoration: stress ? 'underline' : 'none',
    }

    return this.isExternal() ? (
      /* only the <a> tag lets safari open from a standalone app on a mobile.
      A fix for JIRA APP-1679. reference: https://stackoverflow.com/questions/7930001 */
      <a href={to} onClick={this.handleClick} style={styles} {...restProps}>
        {this.props.children}
      </a>
    ) : (
      <DOMLink {...restProps} style={styles} to={to}>
        {this.props.children}
      </DOMLink>
    )
  }
}

export default connect(({ app, authentication }: IReduxState) => ({
  accessToken: authentication.accessToken,
  embeddedLayout: app.embeddedLayout,
}))(Link)
