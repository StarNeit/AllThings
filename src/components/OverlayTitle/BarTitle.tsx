import React from 'react'
import { ColorPalette } from '@allthings/colors'
import AndroidNotificationsIcon from '@allthings/react-ionicons/lib/AndroidNotificationsIcon'
import ComposeIcon from '@allthings/react-ionicons/lib/ComposeIcon'
import { Text } from '@allthings/elements'

interface IProps {
  icon?: string | React.ReactElement
}

class BarTitle extends React.Component<IProps> {
  getIcon(icon: string) {
    const svgStyles = { fill: ColorPalette.white, width: 24, height: 24 }

    return icon === 'notification' ? (
      <AndroidNotificationsIcon {...svgStyles} />
    ) : (
      <ComposeIcon {...svgStyles} />
    )
  }

  render() {
    return (
      <div className="mainOverlay-bar-title">
        {typeof this.props.icon === 'string'
          ? this.getIcon(this.props.icon)
          : this.props.icon}
        <Text className="mainOverlay-bar-title-label" color="textOnBackground">
          {this.props.children}
        </Text>
      </div>
    )
  }
}

export default BarTitle
