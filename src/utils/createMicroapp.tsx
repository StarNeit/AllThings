import React from 'react'
import { ThemeProvider } from '@allthings/elements'
import { RouteComponentProps, withRouter } from 'react-router'

export type ProvidedProps = { readonly config?: { color: string } } & Partial<
  RouteComponentProps
>

const createMicroapp = <P extends ProvidedProps>(
  Microapp: React.ComponentType<P>,
) => (props: P) => (
  <ThemeProvider theme={{ primary: props.config.color }}>
    <Microapp {...props} />
  </ThemeProvider>
)

export default (Microapp: React.ComponentType<ProvidedProps>) =>
  withRouter(createMicroapp(Microapp))
