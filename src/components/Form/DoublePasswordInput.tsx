// tslint:disable-next-line:no-implicit-dependencies
import { IndicatedPasswordField } from 'components/IndicatedPasswordField'
import React from 'react'
import { defineMessages } from 'react-intl'
import PasswordInput from './PasswordInput'

const messages = defineMessages({
  notEqual: {
    defaultMessage: 'Your passwords must be the same',
    description: 'Hint, when the users did not enter the same password twice',
    id: 'error.passwords-not-equal',
  },
})

export const ValidationRules = {
  confirmPassword: {
    equality: {
      attribute: 'password',
      message: messages.notEqual,
    },
    ...PasswordInput.validationRules,
  },
  password: {
    ...PasswordInput.validationRules,
  },
}

interface IDoublePasswordInputProps {
  readonly name?: string
  readonly placeholder?: string
  readonly repeatPlaceholder?: string
  readonly style?: object
}

const DoublePasswordInput = ({
  placeholder,
  repeatPlaceholder,
  style = {},
}: IDoublePasswordInputProps): JSX.Element => (
  <div style={{ ...style, width: '100%' }}>
    <IndicatedPasswordField
      name="password"
      data-e2e="password"
      placeholder={placeholder}
    />
    <div>
      <PasswordInput
        name="confirmPassword"
        data-e2e="password-repeat"
        placeholder={repeatPlaceholder}
      />
    </div>
  </div>
)

export default DoublePasswordInput
