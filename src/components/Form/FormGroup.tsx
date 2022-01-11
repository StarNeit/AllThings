import React from 'react'
import InputError from './InputError'

interface IProps {
  message?: string
}

export default class FormGroup extends React.Component<IProps> {
  render() {
    const { message, children } = this.props
    return (
      <div className="formGroup">
        {message ? <InputError>{message}</InputError> : null}
        <div className="formGroup-items">{children}</div>
      </div>
    )
  }
}
