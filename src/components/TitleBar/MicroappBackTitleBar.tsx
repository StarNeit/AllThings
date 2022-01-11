import React, { MouseEvent } from 'react'
import GenericBackTitleBar from './GenericBackTitleBar'
import { MicroApps } from '../../enums'
import { useSelector } from 'react-redux'
import { appLabelSelector } from 'components/TitleBar/MicroappBigTitleBar'

interface IProps {
  onBack: (event: MouseEvent) => void
  type: MicroApps
}

const MicroappBackTitleBar = ({ onBack, type }: IProps) => {
  const microAppLabel = useSelector(appLabelSelector(type))

  return <GenericBackTitleBar onBack={onBack} backText={microAppLabel} />
}

export default MicroappBackTitleBar
