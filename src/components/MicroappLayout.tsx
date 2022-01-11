import React from 'react'
import { css } from 'glamor'
import { View } from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'
import { NAVIGATION_WIDTH } from './Navigation'

// @TODO: What about 'withTransition' (last arg)?
const microapp = (active: boolean, _: unknown) =>
  css({
    overflowX: 'hidden',
    [createMQ('mobile')]: {
      transform: `translate3d(${active ? `calc(100vw - 60px)` : 0}, 0, 0)`,
      // Due to an IE10-11 bug we have to use this since it also affects Mobile
      // Windows Phones with IE -> https://stackoverflow.com/questions/21142923/ie-10-11-css-transitions-with-calc-do-not-work
      msTransform: active
        ? 'translateX(100vw) translateX(-60px)'
        : 'translateX(0)',
    },
    [createMQ('tablet')]: {
      transform: active && `translate3d(${NAVIGATION_WIDTH}px, 0, 0)`,
    },
  })

interface IProps {
  active: boolean
}

export default class MicroappLayout extends React.PureComponent<IProps> {
  state = {
    withTransition: !this.props.active,
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.active !== prevProps.active) {
      this.setState({ withTransition: true })
    }
  }

  handleTransitionEnd = () => {
    this.setState({ withTransition: false })
  }

  render() {
    const { children, active } = this.props
    const { withTransition } = this.state

    return (
      <View
        direction="column"
        flex="flex"
        {...microapp(active, withTransition)}
        style={{
          transition: withTransition && '.35s ease-in-out',
        }}
        onTransitionEnd={this.handleTransitionEnd}
      >
        {children}
      </View>
    )
  }
}
