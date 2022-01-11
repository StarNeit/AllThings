import { View } from '@allthings/elements'
// tslint:disable:no-implicit-dependencies
import { PasswordInputElementsForm } from 'components/Form'
import { IndicatedPasswordFieldElementsForm } from 'components/IndicatedPasswordField'
// tslint:enable:no-implicit-dependencies
import { css } from 'glamor'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useState } from 'react'

const passwordMinLength = 8

const messages = defineMessages({
  notEqual: {
    defaultMessage: 'Your passwords must be the same',
    description: 'Hint, when the users did not enter the same password twice',
    id: 'error.passwords-not-equal',
  },
  tooShort: {
    defaultMessage:
      'Your password must be at least {passwordMinLength} characters long',
    description: 'Hint, when the users did not enter a long enough password',
    id: 'error.passwords-too-short',
  },
})

interface IProps {
  readonly repeatPlaceholder?: string
  readonly placeholder?: string
  readonly containerStyle?: object
}

const DoublePasswordInputElementsForm = ({
  placeholder,
  repeatPlaceholder,
  containerStyle,
}: IProps) => {
  const [passwordValue, setPasswordValue] = useState('')
  const { formatMessage } = useIntl()

  const handlePasswordChange = (password: string) => setPasswordValue(password)

  return (
    <View direction="column" {...css(containerStyle)}>
      <IndicatedPasswordFieldElementsForm
        name="password"
        data-e2e="password"
        placeholder={placeholder}
        onChange={handlePasswordChange}
        minLength={passwordMinLength}
        tooShort={formatMessage(messages.tooShort, { passwordMinLength })}
        required
      />
      <PasswordInputElementsForm
        data-e2e="password-repeat"
        placeholder={repeatPlaceholder}
        pattern={passwordValue}
        patternMismatch={formatMessage(messages.notEqual)}
        required
      />
    </View>
  )
}

export default DoublePasswordInputElementsForm
