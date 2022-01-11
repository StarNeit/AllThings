import AndroidClipboardIcon from '@allthings/react-ionicons/lib/AndroidClipboardIcon'
import AndroidHomeIcon from '@allthings/react-ionicons/lib/AndroidHomeIcon'
import AndroidOpenIcon from '@allthings/react-ionicons/lib/AndroidOpenIcon'
import AndroidSettingsIcon from '@allthings/react-ionicons/lib/AndroidSettingsIcon'
import AndroidShareAltIcon from '@allthings/react-ionicons/lib/AndroidShareAltIcon'
import AndroidShareIcon from '@allthings/react-ionicons/lib/AndroidShareIcon'
import BagIcon from '@allthings/react-ionicons/lib/BagIcon'
import ClipboardIcon from '@allthings/react-ionicons/lib/ClipboardIcon'
import FlashIcon from '@allthings/react-ionicons/lib/FlashIcon'
import IosPaperOutlineIcon from '@allthings/react-ionicons/lib/IosPaperOutlineIcon'
import PeopleOutlineIcon from '@allthings/react-ionicons/lib/IosPeopleOutlineIcon'
import WandIcon from '@allthings/react-ionicons/lib/WandIcon'
// tslint:disable-next-line:no-implicit-dependencies
import { Icon, IProps as IconProps } from 'components/Icon'
import React from 'react'
import { MicroApps } from 'enums'

const iconMap = {
  archilogic: AndroidOpenIcon,
  clipboard: BagIcon,
  'community-articles': AndroidClipboardIcon,
  consumption: FlashIcon,
  documents: AndroidHomeIcon,
  'e-concierge': WandIcon,
  'external-content': AndroidOpenIcon,
  'external-link': AndroidShareIcon,
  helpdesk: ClipboardIcon,
  marketplace: BagIcon,
  'my-contracts': AndroidHomeIcon,
  project: IosPaperOutlineIcon,
  settings: AndroidSettingsIcon,
  sharing: AndroidShareAltIcon,
  unit: AndroidHomeIcon,
  'who-is-who': PeopleOutlineIcon,
}

interface IProps extends IconProps {
  readonly children?: any
  readonly microApp?: MicroApps
  readonly style: object
}

function AppIcon(props: IProps): JSX.Element {
  const { microApp, ...iconProps } = props
  const AppIconMapped = iconMap[microApp]

  return (
    <Icon {...iconProps}>
      <AppIconMapped />
    </Icon>
  )
}

export default AppIcon
