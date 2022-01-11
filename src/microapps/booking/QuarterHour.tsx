import React, { useCallback } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { View, Circle, Icon, Inset, ListItem, Text } from '@allthings/elements'
import { addQuarterHours, isSameQuarterHour } from 'utils/date'
import { useTheme } from '@allthings/elements/Theme'

interface IProps {
  checked?: boolean
  children?: React.ReactElement<any>
  disabled?: boolean
  onSelect: (date: Date) => void
  quarterHour: Date
  dataE2e?: string
}

const QuarterHour = ({
  disabled,
  checked,
  onSelect,
  children,
  quarterHour,
  dataE2e,
}: IProps) => {
  const { theme } = useTheme()
  const handleClick = useCallback(() => {
    disabled || onSelect(quarterHour)
  }, [disabled, onSelect, quarterHour])
  const isCurrentQuarterHour = isSameQuarterHour(quarterHour, new Date())

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
              size="s"
              name="check-filled"
              color={checked ? theme.primary : 'lightGrey'}
            />
          )}
        </Circle>
      )}
      <View direction="column">
        <Inset>
          <Text color={disabled ? 'grey' : null}>
            {isCurrentQuarterHour && (
              <Text block={false} italic color={disabled ? 'grey' : null}>
                &nbsp;
                <FormattedMessage
                  id="booking.quarterhour-picker.toquarterhour"
                  description="(currently in this quarterHour)"
                  defaultMessage="(currently in this quarterHour)"
                />
              </Text>
            )}
          </Text>
          <Text color={disabled ? 'grey' : 'greyIntense'} block={false}>
            <FormattedDate
              value={quarterHour}
              hour="numeric"
              minute="numeric"
            />
            {' - '}
            <FormattedDate
              value={addQuarterHours(quarterHour, 1)}
              hour="numeric"
              minute="numeric"
            />
          </Text>
          {children}
        </Inset>
      </View>
    </ListItem>
  )
}

export default QuarterHour
