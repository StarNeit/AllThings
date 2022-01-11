import React from 'react'
import { useTheme } from '@allthings/elements/Theme'

// @todo remove this eventually and only use `Theme` component or `useTheme` hook
export const withTheme = (
  mapThemeToProps: (
    theme: ITheme,
    props?: IndexSignature,
  ) => IndexSignature = undefined,
) => <P extends { theme: ITheme }>(
  Component: React.ComponentType<P>,
): React.ComponentType<Omit<P, 'theme'>> => props => {
  const { theme } = useTheme()
  const themeProps = !mapThemeToProps
    ? { theme }
    : (mapThemeToProps(theme, props) as any)

  return <Component {...props} {...themeProps} />
}
