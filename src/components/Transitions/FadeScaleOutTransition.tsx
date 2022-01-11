import React from 'react'
import { css } from 'glamor'
import { Transition } from 'react-transition-group'

const styles = {
  default: (timeout: number) => ({
    transition: `${timeout}ms ease-in-out`,
    opacity: 1,
    transform: 'scale(1)',
  }),
  exiting: {
    opacity: 0,
    transform: `scale(1.1)`,
  },
}

interface IProps {
  children: React.ReactElement<{}>
  timeout: number
  unmountOnExit?: boolean
}

const FadeScaleOutTransition = ({
  timeout = 1000,
  children,
  ...props
}: IProps) => (
  <Transition timeout={timeout} {...props}>
    {status =>
      React.cloneElement(children, {
        ...children.props,
        ...css(styles.default(timeout), styles[status]),
      })
    }
  </Transition>
)

export default FadeScaleOutTransition
