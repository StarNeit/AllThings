import React, { Component, PropsWithChildren } from 'react'
import { connect } from 'react-redux'
import FlipMove from 'react-flip-move'
import { View } from '@allthings/elements'
import { isIE11 } from 'utils/guessBrowser'

interface IProps {
  appearAnimation?: FlipMove.AnimationProp
  duration?: number
  enterAnimation?: FlipMove.AnimationProp
  leaveAnimation?: FlipMove.AnimationProp
  style?: FlipMove.Styles
  userAgent: string
}

class FlipMoveIEWrapper extends Component<
  PropsWithChildren<IProps & DispatchProp>
> {
  render() {
    const { userAgent, children, dispatch, ...props } = this.props
    return (
      // Quirky and UGLY bugfix to avoid broken IE11 layout when loading the page
      // with a post detail view URL. (FlipMove causes in combination with
      // HorizontalRouter the swiped column to appear ON TOP of the navbar!)
      isIE11(userAgent) ? (
        <View>{children}</View>
      ) : (
        <FlipMove {...props}>{children}</FlipMove>
      )
    )
  }
}

const mapStateToProps = ({ app }: IReduxState) => ({
  userAgent: app.userAgent,
})

export default connect(mapStateToProps)(FlipMoveIEWrapper)
