import React, { FunctionComponent } from 'react'
import querystring from 'querystring'

import ExternalContentFrame from 'components/ExternalContentFrame'

const EXTERNAL_MICROAPP_TYPES = ['external', 'internal']

interface IProps {
  config: MicroAppProps
}

const ExternalContent: FunctionComponent<IProps> = ({
  config: {
    _embedded: {
      type: { type: typeOfType },
    },
    color,
    label,
    navigationHidden,
    state,
    url,
    type: microAppType,
    id,
  },
}) => {
  const stateParameter = state ? `&${querystring.stringify({ state })}` : ''
  const frameUrl = EXTERNAL_MICROAPP_TYPES.includes(typeOfType)
    ? url + stateParameter
    : url

  return (
    <ExternalContentFrame
      color={color}
      label={label}
      microAppId={id}
      microAppType={microAppType}
      navigationHidden={navigationHidden}
      state={state}
      url={frameUrl}
    />
  )
}

export default ExternalContent
