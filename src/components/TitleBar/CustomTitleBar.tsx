import React from 'react'
import { TitleBar } from '@allthings/elements'
import { ITitleBarProps } from '@allthings/elements/TitleBar'
import { useTheme } from '@allthings/elements/Theme'

interface IProps extends ITitleBarProps {
  children?: React.ReactNode
}

const CustomTitleBar = ({ children, ...props }: IProps) => {
  const { theme } = useTheme()
  return (
    <TitleBar {...props} color={theme.background}>
      {children}
    </TitleBar>
  )
}

export default CustomTitleBar
