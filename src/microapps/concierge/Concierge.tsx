import React from 'react'

import ExternalContentFrame from 'components/ExternalContentFrame'
import { MicroApps } from '../../enums'

/**
 * This is currently just a simplified copy of the external content microapp
 * using the configured url to be displayed in an iframe.
 * Might be adjusted in the future when we have configuration settings for
 * microapps in the api.
 */

interface IProps {
  config: MicroAppProps
}

export default function Concierge({
  config: {
    color,
    label,
    navigationHidden,
    _embedded: {
      type: { type },
    },
    url,
  },
}: IProps) {
  return (
    <ExternalContentFrame
      color={color}
      microAppType={MicroApps.CONCIERGE}
      label={label}
      navigationHidden={navigationHidden}
      type={type}
      url={url}
    />
  )
}
