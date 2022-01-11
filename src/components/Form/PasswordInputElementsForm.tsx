import React from 'react'
import { Input } from '@allthings/elements'
import NoOp from 'utils/noop'

interface IProps {
  name?: string
  onChange?: (value: string) => void
  pattern?: string
  placeholder: string
  required?: boolean
  patternMismatch?: string
}

export default class PasswordInputElementsForm extends React.Component<IProps> {
  static defaultProps = {
    onChange: NoOp,
    placeholder: 'Password',
  }

  state = { value: '' }

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value })
    this.props.onChange(event.target.value)
  }

  render() {
    const { name, placeholder, onChange, ...props } = this.props
    const { value } = this.state
    return (
      <Input
        name={name}
        type="password"
        placeholder={placeholder}
        onChange={this.onChange}
        value={value}
        {...props}
      />
    )
  }
}
