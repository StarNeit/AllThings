import React from 'react'
import { css, keyframes } from 'glamor'

export enum STATUS {
  ERROR = 'error',
  LOADING = 'loading',
  NONE = 'none',
  SUCCESS = 'success',
}

const successAnim = keyframes('success', {
  '50%': { transform: 'translate3d(0, 0, 0)', height: 0 },
  '100%': { transform: 'translate3d(0, 0, 0)', height: '100%' },
})

const loadingAnim = keyframes('loading', {
  '0%': { transform: 'translate3d(-100%, 0, 0)' },
  '50%': { transform: 'translate3d(100%, 0, 0)' },
  '100%': { transform: 'translate3d(-100%, 0, 0)' },
})

const errorTopAnim = keyframes('error', {
  '50%': { width: '100%', height: 0 },
  '100%': { width: '100%', height: '100%' },
})

const errorBottomAnim = keyframes('error', {
  '50%': { width: 0, height: '100%' },
  '100%': { width: '100%', height: '100%' },
})

const styles = {
  wrapper: ({ colors, status, width, background, radius }: IndexSignature) =>
    css({
      overflow: status && 'hidden',
      background,
      // prevent strange issues with box-sizing
      boxShadow: `inset 0 0 0 ${width}px ${colors[STATUS.NONE]}`,
      borderRadius: radius,
    }),
  border: ({ status, animatedWidth }: IndexSignature) =>
    css({
      textAlign: 'center',
      position: 'relative',
      '&:before, &:after': {
        display: !status && 'none',
        position: 'absolute',
        content: `''`,
        width: '100%',
        height: 0,
        borderWidth: animatedWidth,
        borderStyle: 'solid',
        left: 0,
        right: 0,
        pointerEvents: 'none',
      },
      '&:before': {
        top: 0,
        left: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        transform: 'translate3d(-100%, 0, 0)',
      },
      '&:after': {
        bottom: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        transform: 'translate3d(100%, 0, 0)',
      },
    }),
  animate: ({ colors, status, duration }: IndexSignature) => {
    switch (status) {
      case STATUS.SUCCESS:
        return css({
          '&:before, &:after': {
            borderColor: colors[status],
          },
          '&:before': {
            animation: `${successAnim} ${duration / 2}ms`,
            animationFillMode: 'both',
          },
          '&:after': {
            animation: `${successAnim} ${duration / 2}ms`,
            animationDelay: `${duration / 2}ms`,
            animationFillMode: 'both',
          },
        })
      case STATUS.LOADING:
        return css({
          '&:before, &:after': {
            borderColor: colors[status],
          },
          '&:after': {
            animation: `${loadingAnim} ${duration}ms ease-in-out infinite`,
          },
        })
      case STATUS.ERROR:
      default:
        return css({
          '&:before, &:after': {
            borderColor: colors[status],
            width: 0,
          },
          '&:before': {
            transform: 'translate3d(0, 0, 0)',
            animation: `${errorTopAnim} ${duration / 2}ms`,
            animationFillMode: 'both',
          },
          '&:after': {
            top: 0,
            transform: 'translate3d(0, 0, 0)',
            animation: `${errorBottomAnim} ${duration / 2}ms`,
            animationFillMode: 'both',
          },
        })
    }
  },
}

interface IProps {
  animatedWidth?: number
  background?: string

  colors: {
    [STATUS.ERROR]: string
    [STATUS.LOADING]: string
    [STATUS.NONE]: string
    [STATUS.SUCCESS]: string
  }
  duration?: number
  radius?: number
  status: STATUS
  width?: number
}

class AnimatedBorder extends React.Component<IProps> {
  static defaultProps = {
    width: 1,
    animatedWidth: 2,
    radius: 0,
    colors: {},
  }

  defaultColors = {
    [STATUS.NONE]: 'gray',
    [STATUS.SUCCESS]: 'limegreen',
    [STATUS.LOADING]: 'orange',
    [STATUS.ERROR]: 'red',
  }

  render() {
    const {
      status,
      width,
      background,
      children,
      animatedWidth,
      duration,
      radius,
    } = this.props

    const colors = {
      ...this.defaultColors,
      ...this.props.colors,
    }

    return (
      <div
        {...styles.wrapper({
          status,
          width,
          background,
          radius,
          colors,
        })}
      >
        <div
          {...css(
            styles.border({ status, animatedWidth }),
            styles.animate({ colors, status, duration }),
          )}
        >
          {children}
        </div>
      </div>
    )
  }
}

export default AnimatedBorder
