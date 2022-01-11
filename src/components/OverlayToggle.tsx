import React, { Fragment, ReactChild } from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

export interface IToggle {
  open: (data?: {}) => void
}

interface IRenderOverlay {
  toggle: () => void
}

interface IProps {
  children: (Toggle: IToggle) => ReactChild
  overlay?: React.ComponentType<{
    onRequestClose: () => void
    overlayData?: {}
  }>
  hashName?: string
  renderOverlay?: (arg: IRenderOverlay) => JSX.Element
}

interface IState {
  data?: {}
  open: boolean
}

class OverlayToggle extends React.Component<
  IProps & RouteComponentProps,
  IState
> {
  state = {
    data: {},
    open: false,
  }

  componentDidMount() {
    const { location, hashName } = this.props
    if (hashName && location.hash === `#${hashName}`) {
      this.handleToggle()
    }
  }

  componentDidUpdate(prevProps: IProps & RouteComponentProps) {
    const { hashName, location } = this.props
    const { hash } = location
    if (
      hashName &&
      prevProps.location.hash !== hash &&
      hash === `#${hashName}`
    ) {
      this.handleToggle()
    }
  }

  handleToggle = (data?: {}) =>
    this.setState(({ open }) => ({ data, open: !open }))

  renderOverlay = () => {
    const { renderOverlay, overlay } = this.props
    return renderOverlay
      ? renderOverlay({ toggle: this.handleToggle })
      : React.createElement(overlay, {
          overlayData: this.state.data,
          onRequestClose: this.handleToggle,
        })
  }

  render() {
    const { children } = this.props
    return (
      <Fragment>
        {this.state.open && this.renderOverlay()}
        {children({ open: this.handleToggle })}
      </Fragment>
    )
  }
}

export default withRouter(OverlayToggle)
