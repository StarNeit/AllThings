import React from 'react'
import FormElement, { IChildProps } from './FormElement'
import ErrorMessage from './ErrorMessage'

interface IProps {
  name: string
  value?: string
}

class Textarea extends React.Component<IProps & IChildProps> {
  static defaultProps = {
    value: '',
  }

  handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => this.props.onChange((e.target as HTMLTextAreaElement).value)

  render() {
    const { name, onTouch, onChange, onBlur, value, ...props } = this.props

    return (
      <label htmlFor={name} style={{ width: '100%' }}>
        <textarea
          onChange={this.handleChange}
          onKeyUp={this.handleChange}
          value={value || ''}
          {...props}
        />
        <ErrorMessage name={name} />
      </label>
    )
  }
}

export default FormElement(Textarea)
