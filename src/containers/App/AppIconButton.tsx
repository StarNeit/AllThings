// tslint:disable-next-line:no-implicit-dependencies
import { getIconSize, IProps as IconProps } from 'components/Icon'
import React from 'react'
import AppIcon from './AppIcon'

interface IProps {
  readonly background: string
  readonly size: IconProps['size']
  readonly style: object
}

class AppIconButton extends React.PureComponent<IProps> {
  public static readonly defaultProps: Partial<IProps> = {
    background: null,
  }

  public render(): JSX.Element {
    const iconSize = getIconSize(this.props.size)

    return (
      <AppIcon
        {...this.props}
        style={{
          ...this.props.style,
          background: this.props.background,
          height: iconSize,
          padding: Math.max((iconSize - 30) / 2, 0),
          width: iconSize,
        }}
      />
    )
  }
}

export default AppIconButton
