import React, { ReactNode } from 'react'
import { MicroApps } from '../../enums'
import { useSelector } from 'react-redux'
import BigTitleBar, { IBigTitleBarProps } from 'components/TitleBar/BigTitleBar'
import { getLocalized } from 'containers/Localized'
import { navigateToMyFlat } from 'utils/sendNativeEvent'

interface IProps extends Omit<IBigTitleBarProps, 'title'> {
  subTitle?: ReactNode
  type: MicroApps
}

export const appLabelSelector = (type: MicroApps) => (state: IReduxState) =>
  getLocalized(
    state.app.microApps.find(app => app.type === type).label,
    state.app.locale,
  )

const MicroappBigTitleBar = ({ type, ...props }: IProps) => {
  const microAppLabel = useSelector(appLabelSelector(type))
  const isEmbeddedLayout = useSelector(
    (state: IReduxState) => state.app.embeddedLayout,
  )
  const accessToken = useSelector(
    (state: IReduxState) => state.authentication.accessToken,
  )

  const showBackButton =
    isEmbeddedLayout &&
    type !== MicroApps.PINBOARD &&
    type !== MicroApps.HELPDESK

  return (
    <BigTitleBar
      title={microAppLabel}
      showBackButton={showBackButton}
      onBackButtonClick={() => navigateToMyFlat(accessToken)}
      {...props}
    />
  )
}

export default MicroappBigTitleBar
