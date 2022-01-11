import { ColorPalette } from '@allthings/colors'
import { View, Text, Icon } from '@allthings/elements'
import { IconType } from '@allthings/elements/Icon'
import CustomLogo from 'components/CustomLogo'
import { MicroApps } from 'enums'
import React, { FunctionComponent, ReactNode } from 'react'
import { connect } from 'react-redux'

const DEFAULT_ICON = 'tile-filled'

interface IProps {
  children: ReactNode
  customLogoUrl?: string
  icon?: IconType
  onClick?: OnClick
  microAppType?: MicroApps
  microAppId?: string
}

const TitleBarLabel: FunctionComponent<IProps> = ({
  onClick,
  customLogoUrl,
  icon,
  microAppType,
  children,
}) => (
  <a className="appbar-title" onClick={onClick}>
    {microAppType && (
      <View style={{ marginRight: 10 }}>
        {customLogoUrl ? (
          <CustomLogo url={customLogoUrl} color="white" />
        ) : (
          <Icon name={icon} size="s" color="white" />
        )}
      </View>
    )}
    <Text className="appbar-title-label" color={ColorPalette.white} strong>
      {children}
    </Text>
  </a>
)

const mapStateToProps = ({ app }: IReduxState, props: IProps) => {
  const matchingMicroApp = props.microAppId
    ? app.microApps.find(({ id }) => id === props.microAppId)
    : app.microApps.find(({ type }) => type === props.microAppType)

  return {
    customLogoUrl: props.microAppType && matchingMicroApp?.customLogo,
    icon: (props.microAppType && matchingMicroApp?.icon) ?? DEFAULT_ICON,
  }
}

export default connect(mapStateToProps)(TitleBarLabel)
