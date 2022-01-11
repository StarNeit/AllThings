import { View, Text, Icon } from '@allthings/elements'
import { IconType } from '@allthings/elements/Icon'
import cx from 'classnames'
import { css } from 'glamor'
import React from 'react'
import { ConfigId } from './ComposeOverlayItems'

export interface IConfig {
  icon: IconType
  id: ConfigId
  onClick: OnClick
  style: string
  title: () => React.ReactNode
  type: string
}

interface IProps {
  config: IConfig
  disabled: boolean
  microAppsThemes: object
  onClick: (config: IConfig) => void
}

class ComposeOverlayItem extends React.Component<IProps> {
  handleClick = () => {
    if (!this.props.disabled) {
      this.props.onClick(this.props.config)
    }
  }

  render() {
    const { config, disabled, microAppsThemes } = this.props
    const itemClasses = cx('createList-list-button', `theme-${config.style}`)
    const e2eType =
      config.style === 'support' && config.type === 'sharing'
        ? 'services'
        : config.type

    return (
      !disabled && (
        <li className="createList-list-item">
          <div
            className={itemClasses}
            onClick={this.handleClick}
            data-e2e={`new-${e2eType}-item`}
          >
            <View
              alignH="center"
              alignV="center"
              direction="column"
              {...css({
                width: 50,
                height: 50,
                marginRight: 14,
                background: microAppsThemes[config.type],
              })}
            >
              <Icon name={config.icon} size="m" color="white" />
            </View>
            <Text className="createList-list-button-label">
              {this.props.config.title()}
            </Text>
          </div>
        </li>
      )
    )
  }
}

export default ComposeOverlayItem
