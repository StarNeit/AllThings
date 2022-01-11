import React from 'react'
import { ColorPalette } from '@allthings/colors'

export function getIconSize(size: string) {
  switch (size) {
    case 'xs':
      return 16
    case 's':
      return 28
    case 'l':
      return 60
    default:
    case 'm':
      return 50
  }
}

export interface IProps {
  children?: React.ReactElement<any>
  color?: string
  size?: 'xs' | 's' | 'm' | 'l'
}

export function Icon({
  children,
  color = ColorPalette.white,
  size = 'm',
}: IProps) {
  const iconStyle = {
    fill: color,
    width: getIconSize(size),
    height: getIconSize(size),
  }

  return React.cloneElement(children, { style: iconStyle })
}
