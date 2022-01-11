import React from 'react'
import TitleBarBackButton from './TitleBarBackButton'
import { navigateToMyFlat } from 'utils/sendNativeEvent'
import { connect } from 'react-redux'
import { css } from 'glamor'

interface IProps {
  accessToken: string
  embeddedLayout: boolean
  overlap?: boolean
}

const style = (overlap: boolean) =>
  overlap ? { position: 'fixed', top: '25px', zIndex: 2 } : {}

const TitleBarMyFlatButton = ({
  accessToken,
  embeddedLayout,
  overlap,
  ...props
}: IProps) =>
  embeddedLayout && (
    <TitleBarBackButton
      onClick={() => navigateToMyFlat(accessToken)}
      {...css(style(overlap))}
      {...props}
    />
  )

export default connect(({ app, authentication }: IReduxState) => ({
  accessToken: authentication.accessToken,
  embeddedLayout: app.embeddedLayout,
}))(TitleBarMyFlatButton)
