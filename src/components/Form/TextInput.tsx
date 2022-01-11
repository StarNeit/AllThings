import React from 'react'
import { defineMessages } from 'react-intl'
import Input from './Input'
import ErrorMessage from './ErrorMessage'

const messages = defineMessages({
  length: {
    id: 'error.invalid-length',
    description: 'Error message for invalid text input',
    defaultMessage: 'Must be at least {characters} chars long.',
  },
})

interface IProps {
  autoFocus?: boolean
  className?: string
  maxLength?: number
  minimumLength?: number
  name: string
  placeholder?: string
  style?: object
  value?: string
}

class TextInput extends React.Component<IProps> {
  static validationRules = {
    length: {
      message: messages.length,
    },
  }

  static defaultProps = {
    type: 'text',
    value: '',
  }

  render() {
    const { minimumLength, value, ...props } = this.props

    return (
      <label htmlFor={this.props.name} style={{ width: '100%' }}>
        <Input value={value || ''} {...props} />
        <ErrorMessage
          name={this.props.name}
          values={{ characters: minimumLength }}
        />
      </label>
    )
  }
}

export default TextInput
