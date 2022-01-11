import React, { ReactNode } from 'react'
import { Route } from 'react-router'

interface IRender {
  close: () => void
}
interface IProps {
  name: string
  children: (render: IRender) => ReactNode
}

export default ({ name, children }: IProps) => (
  <Route
    render={a => {
      if (a.location.hash === `#${name}`) {
        return children({
          close: () => a.history.push(a.location.pathname),
        })
      } else {
        return null
      }
    }}
  />
)
