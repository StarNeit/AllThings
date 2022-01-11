import React, { useCallback } from 'react'
import isSameHour from 'date-fns/isSameHour'
import addHours from 'date-fns/addHours'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { View, Circle, Icon, Inset, ListItem, Text } from '@allthings/elements'
import { useTheme } from '@allthings/elements/Theme'

interface IProps {
  checked?: boolean
  children?: React.ReactElement<any>
  disabled?: boolean
  hour: Date
  onSelect: (date: Date) => void
  dataE2e?: string
}

const Hour = ({
  disabled,
  checked,
  children,
  hour,
  onSelect,
  dataE2e,
}: IProps) => {
  const { theme } = useTheme()
  const handleClick = useCallback(() => {
    disabled || onSelect(hour)
  }, [disabled, onSelect, hour])

  return (
    <ListItem onClick={handleClick} data-e2e={dataE2e}>
      {disabled ? (
        <Circle outline fill={false} outlineColor="lightGrey">
          <Icon size="xs" name="remove-filled" color="lightGrey" />
        </Circle>
      ) : (
        <Circle
          outline
          fill={false}
          outlineColor={checked ? theme.primary : 'lightGrey'}
        >
          {checked && (
            <Icon
              size="xs"
              name="check-filled"
              color={checked ? theme.primary : 'lightGrey'}
            />
          )}
        </Circle>
      )}
      <View direction="column">
        <Inset>
          <Text color={disabled ? 'grey' : null}>
            {isSameHour(hour, new Date()) && (
              <Text block={false} italic color={disabled ? 'grey' : null}>
                &nbsp;
                <FormattedMessage
                  id="booking.hour-picker.tohour"
                  description="(currently in this hour)"
                  defaultMessage="(currently in this hour)"
                />
              </Text>
            )}
          </Text>
          <Text color={disabled ? 'grey' : 'greyIntense'} block={false}>
            <FormattedDate value={hour} hour="numeric" />
            {' - '}
            <FormattedDate value={addHours(hour, 1)} hour="numeric" />
          </Text>
          {children}
        </Inset>
      </View>
    </ListItem>
  )
}

export default Hour
