import React from 'react'
import { SquareIconButton } from '@allthings/elements'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

interface IProps {
  label?: string
  to?: string
  onClick?: (e: React.MouseEvent) => void
}

const TitleBarBackButton = ({ onClick, label, ...props }: IProps) => (
  <SquareIconButton
    icon="arrow-left-filled"
    iconSize="xs"
    iconColor="white"
    onClick={onClick}
    {...props}
  />
)

const mapDispatchToProps = (dispatch: FunctionalDispatch, props: IProps) => ({
  onClick: (e: React.MouseEvent) => {
    if (props.onClick) {
      props.onClick(e)
    }
    if (props.to) {
      dispatch(push(props.to))
    }
  },
})

export default connect(
  null,
  mapDispatchToProps,
)(TitleBarBackButton)
