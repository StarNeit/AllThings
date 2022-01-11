import React from 'react'
import FormElement, { IChildProps } from './FormElement'

export interface IProps {
  autoFocus?: boolean
  onChange?: (value: string) => void
  style?: object
}

class Input extends React.Component<IProps & IChildProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(e.target.value)

  handleBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    this.props.onBlur(e.target.value)

  render() {
    const { onTouch, onChange, onBlur, value, ...props } = this.props

    return (
      <input
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onInput={this.handleChange}
        value={value || ''}
        {...props}
      />
    )
  }
}

export default FormElement(Input)
