import React from 'react'
import { defineMessages } from 'react-intl'
import Input, { IProps as InputProps } from './Input'
import ErrorMessage from './ErrorMessage'

const messages = defineMessages({
  length: {
    id: 'error.password-length',
    description: 'Error message for invalid password',
    defaultMessage: 'Password length must be between 8 and 255 characters.',
  },
  presence: {
    id: 'error.password-not-set',
    description: 'Error message for invalid password',
    defaultMessage: 'Please enter a password',
  },
})

export const validationRules = {
  length: {
    minimum: 8,
    maximum: 255,
    message: messages.length,
  },
  presence: {
    message: messages.presence,
  },
}

interface IProps {
  name: string
  value: string
}

class PasswordInput extends React.Component<IProps & InputProps> {
  static validationRules = validationRules

  static defaultProps = {
    placeholder: 'Password',
    type: 'password',
    value: '',
  }

  render() {
    return (
      <label
        htmlFor={this.props.name}
        style={{ width: '100%', position: 'relative' }}
      >
        <ErrorMessage name={this.props.name} data-e2e="password-error-hint" />
        <Input {...this.props} />
      </label>
    )
  }
}

export default PasswordInput
