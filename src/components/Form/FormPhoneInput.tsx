import React from 'react'
import FormElement, { IChildProps } from './FormElement'
import ErrorMessage from './ErrorMessage'
import { PhoneInput } from '@allthings/elements'

interface IProps {
  defaultValue?: string
  name: string
  placeholder: string
  value?: string
}

class FormPhoneInput extends React.Component<IProps & IChildProps> {
  static defaultProps = {
    value: '',
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(e.target.value)

  // We don't want the parent form to be submitted when pressing ENTER.
  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.which === 13 && e.preventDefault()

  render() {
    const {
      onTouch,
      onChange,
      onBlur,
      defaultValue,
      value,
      placeholder,
      ...props
    } = this.props

    return (
      <label htmlFor={this.props.name} style={{ width: '100%' }}>
        <PhoneInput
          data-e2e="service-center-overlay-phonenumber"
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          defaultValue={defaultValue}
          name="phoneNumber"
          placeholder={placeholder}
          {...props}
        />
        <ErrorMessage name={this.props.name} />
      </label>
    )
  }
}

export default FormElement(FormPhoneInput)
