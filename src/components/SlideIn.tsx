import React, { PropsWithChildren } from 'react'
import Transition from 'react-transition-group/Transition'
import { Absolute } from '@allthings/elements'

const duration = 500

const defaultStyle = {
  transition: `transform ${duration}ms ease-in-out`,
  transform: 'translateY(-100%)',
  width: '100%',
}

const transitionStyles = {
  entering: { transform: 'translateY(0)' },
  entered: { transform: 'translateY(0)' },
  exiting: { transform: 'translateY(-100%)' },
  exited: { transform: 'translateY(-100%)' },
}

interface IProps {
  in: boolean
}

const SlideIn = ({ in: inProp, children }: PropsWithChildren<IProps>) => (
  <Transition in={inProp} mountOnEnter appear timeout={duration}>
    {state => (
      <Absolute
        direction="row"
        alignV="center"
        alignH="center"
        style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}
      >
        {children}
      </Absolute>
    )}
  </Transition>
)

export default SlideIn
