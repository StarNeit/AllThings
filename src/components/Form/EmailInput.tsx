import React from 'react'
import { defineMessages } from 'react-intl'
import ErrorMessage from './ErrorMessage'
import Input from './Input'

const messages = defineMessages({
  email: {
    defaultMessage: 'Invalid email address',
    description: 'Error message for invalid email address',
    id: 'error.invalid-email',
  },
})

interface IProps {
  readonly name: string
  readonly placeholder?: string
  readonly style?: object
}

export default class EmailInput extends React.Component<IProps> {
  public static readonly validationRules = {
    email: {
      message: messages.email,
    },
    presence: {
      message: messages.email,
    },
  }

  public static readonly defaultProps = {
    type: 'email',
    value: '',
  }

  public render(): JSX.Element {
    return (
      <label htmlFor={this.props.name} style={{ width: '100%' }}>
        <ErrorMessage name={this.props.name} />
        <Input type="email" {...this.props} />
      </label>
    )
  }
}
