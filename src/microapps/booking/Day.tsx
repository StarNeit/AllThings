import React from 'react'
import isSameDay from 'date-fns/isSameDay'
import { FormattedDate, FormattedMessage } from 'react-intl'
import {
  Inset,
  Text,
  ListItem,
  Icon,
  Checkmark,
  Circle,
  View,
} from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'

interface IProps {
  checked?: boolean
  day: Date
  disabled?: boolean
  onSelect: (day: Date) => void
  'data-e2e': string
}

class Day extends React.Component<IProps> {
  state = { highlight: false }

  handleClick = () => this.props.disabled || this.props.onSelect(this.props.day)
  highlight = () => this.setState({ highlight: true })
  unhighlight = () => this.setState({ highlight: false })

  render() {
    const { disabled, checked, children, day } = this.props
    const isToday = isSameDay(day, new Date())
    return (
      <ListItem
        data-e2e={this.props['data-e2e']}
        onClick={this.handleClick}
        onMouseDown={this.highlight}
        onMouseUp={this.unhighlight}
        onMouseLeave={this.unhighlight}
        backgroundColor={
          this.state.highlight ? ColorPalette.lightGrey : ColorPalette.white
        }
      >
        {disabled ? (
          <Circle outline fill={false} outlineColor="lightGrey">
            <Icon size="xs" name="remove-filled" color="lightGrey" />
          </Circle>
        ) : (
          <Checkmark checked={checked} disabled={disabled} />
        )}

        <View direction="column">
          <Inset>
            <Text color={disabled ? 'grey' : null}>
              <FormattedDate value={day} weekday="long" />
              {isToday && (
                <Text block={false} italic color={disabled ? 'grey' : null}>
                  &nbsp;
                  <FormattedMessage
                    id="booking.day-picker.today"
                    description="(Today)"
                    defaultMessage="(Today)"
                  />
                </Text>
              )}
            </Text>
            <Text color={disabled ? 'grey' : 'greyIntense'} block={false}>
              <FormattedDate
                value={day}
                year="2-digit"
                month="short"
                day="2-digit"
              />
            </Text>
            {children}
          </Inset>
        </View>
      </ListItem>
    )
  }
}

export default Day
