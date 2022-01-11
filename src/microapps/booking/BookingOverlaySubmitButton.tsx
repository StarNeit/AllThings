import React from 'react'
import { View, Icon, Text, FloatingButton } from '@allthings/elements'
import TwoStates from 'components/TwoStates'
import { css } from 'glamor'

interface IProps {
  active: boolean
  activeLabel: string
  disabled: boolean
  label: string
  onClick: OnClick
  type: 'submit' | 'button'
}

class BookingOverlaySubmitButton extends React.Component<IProps> {
  handleClick = (e: React.MouseEvent) =>
    this.props.onClick && !this.props.disabled && this.props.onClick(e)

  render() {
    const { active, activeLabel, label, onClick, ...props } = this.props
    return (
      <FloatingButton
        data-e2e="booking-overlay-submit-button"
        {...props}
        {...css({ alignItems: 'flex-start' })}
        onClick={this.handleClick}
      >
        <TwoStates active={active ? 1 : 0}>
          <View
            direction="row"
            alignV="center"
            alignH="center"
            style={{ height: '47px' }}
          >
            <Text strong color="white" align="center">
              {label}
            </Text>
            &nbsp;
            <Icon name="calendar-check" size="xs" color="white" />
          </View>
          <View direction="column" alignH="center" style={{ height: '47px' }}>
            <Text strong color="white" align="center">
              {activeLabel}
            </Text>
          </View>
        </TwoStates>
      </FloatingButton>
    )
  }
}

export default BookingOverlaySubmitButton
