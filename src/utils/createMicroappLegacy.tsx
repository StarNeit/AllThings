import React from 'react'
import { connect } from 'react-redux'
import find from 'lodash-es/find'
import createMicroapp from './createMicroapp'

const createMicroappLegacy = (
  name: string,
  Microapp: React.ComponentType<unknown>,
) => {
  const themedMicroapp = createMicroapp(Microapp)

  return connect((state: IReduxState) => ({
    config: find(state.app.microApps, { type: name }) || {},
  }))(themedMicroapp)
}

export default createMicroappLegacy
