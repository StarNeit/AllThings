import {
  TitleBarBackButton,
  TitleBarButton,
  TitleBarButtonGroup,
  TitleBarLabel,
} from 'components/TitleBar' // tslint:disable-line:no-implicit-dependencies
// tslint:disable-next-line:no-implicit-dependencies
import Localized from 'containers/Localized'
import { css } from 'glamor'
import React from 'react'
import { MicroApps } from 'enums'

interface ITitleBarProps {
  readonly detail?: string
  readonly label: object
  readonly modelDisplayName?: string
  readonly onClick: (e: React.MouseEvent) => void
}

export default function TitleBar({
  detail,
  label,
  modelDisplayName,
  onClick,
}: ITitleBarProps): JSX.Element {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClick(e)
    return false
  }
  return detail ? (
    <div {...css({ display: 'flex', width: '100%' })}>
      <TitleBarBackButton
        onClick={handleClick}
        data-e2e="archilogic-show-back"
      />
      <TitleBarButtonGroup direction="right">
        <TitleBarButton label={modelDisplayName} />
      </TitleBarButtonGroup>
    </div>
  ) : (
    <TitleBarLabel microAppType={MicroApps.ARCHILOGIC}>
      <Localized messages={label} />
    </TitleBarLabel>
  )
}
