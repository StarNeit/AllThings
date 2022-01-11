import { IconType } from '@allthings/elements/Icon'
import React from 'react'
import { matchPath, RouteComponentProps, withRouter } from 'react-router'
import NavigationItem from 'components/NavigationItem'
import { customIconMap } from '.'

const DEFAULT_ICON = 'tile-filled'

interface IProps {
  behavior?: string
  children: string
  color?: string
  customLogoUrl?: string
  icon?: string
  iconColor?: string
  id: string
  onClick: OnClick
  order?: number
  textColor?: string
  type: string
  url?: string
}

class ServiceChooserItem extends React.PureComponent<
  IProps & RouteComponentProps
> {
  getUrl() {
    const { behavior, id, type, url } = this.props
    /*
     * TODO: the first two mappings should be removed as soon as
     * all the old apps are upgraded, this should be set in the configuration.
     */
    const microappType = ['internal', 'external'].includes(behavior)
      ? 'external-content'
      : type
    switch (microappType) {
      case 'community-articles':
        return '/pinboard'
      case 'helpdesk':
        return '/service-center'
      case 'external-link':
        return url
      case 'external-content':
        return `/${microappType}/${id}`
      case 'project':
        return '/information'
      default:
        return `/${microappType}`
    }
  }

  hasCustomIcon = (type: string) => customIconMap[type]

  shouldOpenInNewWindow() {
    const { type, url } = this.props

    if (!url) {
      return false
    }

    const allowedProtocols = ['http', 'https', 'whatsapp']
    const proto = url.match(/^([^:]+):/)

    return (
      type === 'external-link' &&
      proto &&
      allowedProtocols.indexOf(proto[1]) > -1
    )
  }

  handleClick = () =>
    this.props.onClick({
      url: this.getUrl(),
      openInNewWindow: this.shouldOpenInNewWindow(),
    })

  render() {
    const {
      type,
      color,
      customLogoUrl,
      icon,
      iconColor,
      textColor,
      location,
      children,
    } = this.props
    const active = !!matchPath(location.pathname, {
      path: this.getUrl(),
      exact: false,
    })

    return (
      <NavigationItem
        active={active}
        color={color}
        customLogoUrl={this.hasCustomIcon(type) || customLogoUrl}
        data-e2e={`service-chooser-microapp-${type}-${
          active ? 'active' : 'inactive'
        }`}
        icon={(icon || DEFAULT_ICON) as IconType}
        iconColor={iconColor}
        onClick={this.handleClick}
        textColor={textColor}
      >
        {children}
      </NavigationItem>
    )
  }
}

export default withRouter(ServiceChooserItem)
