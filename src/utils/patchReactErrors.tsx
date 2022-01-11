import React from 'react'
import logBrowserError from './logBrowserError'

/* Taken and modified from https://gist.github.com/Aldredcz/4d63b0a9049b00f54439f8780be7f0d8 */

const statelessComponentsMap = new Map() // original -> monkeypatched stateless functional components cache
const errorPlaceholder = <div />

function logError(Component: React.ComponentType, error: Error) {
  const errorMsg = `Error while rendering component. Check render() method of component '${Component.displayName ||
    Component.name ||
    '[unidentified]'}'.`

  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line:no-console
    console.error(errorMsg, '\n', error)
  }

  logBrowserError(error)
}

function monkeypatchRender(prototype: any) {
  if (prototype && prototype.render && !prototype.render.__handlingErrors) {
    const originalRender = prototype.render

    let thrownOnce = false
    prototype.render = function monkeypatchedRender() {
      try {
        return originalRender.call(this)
      } catch (error) {
        if (!thrownOnce) {
          thrownOnce = true
          logError(prototype.constructor, error)
        }

        return errorPlaceholder
      }
    }

    // flag render method so it's not wrapped multiple times
    prototype.render.__handlingErrors = true
  }
}

const originalCreateElement = React.createElement
;(React as any).createElement = (
  Component: React.ComponentType,
  ...rest: any[]
) => {
  if (typeof Component === 'function') {
    if (typeof Component.prototype.render === 'function') {
      monkeypatchRender(Component.prototype)
    }

    // stateless functional component
    if (!Component.prototype.render) {
      const originalStatelessComponent = Component as React.StatelessComponent
      if (statelessComponentsMap.has(originalStatelessComponent)) {
        // load from cache
        Component = statelessComponentsMap.get(originalStatelessComponent)
      } else {
        Component = (...args) => {
          try {
            return originalStatelessComponent(...args)
          } catch (error) {
            logError(originalStatelessComponent, error)

            return errorPlaceholder
          }
        }

        // copy all properties like propTypes, defaultProps etc.
        Object.assign(Component, originalStatelessComponent)
        // save to cache, so we don't generate new monkeypatched functions every time.
        statelessComponentsMap.set(originalStatelessComponent, Component)
      }
    }
  }

  return originalCreateElement.call(React, Component, ...rest)
}

// allowing hot reload
const originalForceUpdate = React.Component.prototype.forceUpdate
React.Component.prototype.forceUpdate = function monkeypatchedForceUpdate() {
  monkeypatchRender(this)
  originalForceUpdate.call(this)
}
