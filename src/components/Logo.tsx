import React from 'react'
import { connect } from 'react-redux'
import { css } from 'glamor'
import AllthingsLogo from 'components/AllthingsLogo'
import { getStaticImage } from 'utils/getStaticImage'

interface IProps {
  appName: string
  color?: string
  logoURLs?: { small: string }
  onClick?: OnClick
  size?: number
  style?: object
}

class Logo extends React.PureComponent<IProps> {
  static defaultProps = {
    style: {},
  }

  // is this used?
  getLogoPath = (urls: { small: string }) =>
    urls && urls.small ? urls.small : getStaticImage('allthings-logo.svg')

  render() {
    const { appName, color, logoURLs, onClick, style } = this.props

    return logoURLs && logoURLs.small ? (
      <img
        alt={appName}
        src={logoURLs.small}
        data-e2e="service-chooser-opener"
        onClick={onClick}
        {...css({
          cursor: 'pointer',
          maxWidth: '135px',
          maxHeight: '45px',
          width: 'auto',
        })}
        style={style}
      />
    ) : (
      <AllthingsLogo
        color={color}
        data-e2e="service-chooser-opener"
        onClick={onClick}
        style={{
          cursor: 'pointer',
          width: '45px',
          height: '45px',
          maxHeight: '45px',
          maxWidth: '135px',
          ...style,
        }}
      />
    )
  }
}

export default connect((state: IReduxState) => ({
  appName: state.app.config.appName,
  logoURLs: state.app.config.logoURLs,
}))(Logo)
