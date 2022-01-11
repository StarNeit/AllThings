import React from 'react'
import { ListPicker } from './'
import FormElement, { IChildProps } from 'components/Form/FormElement'

interface IProps {
  name?: string
  onBlur: () => void
  onChange: (id: string, key: string) => void
  triggerHide: () => void
  value?: string
}

class ListPickerFormElement extends React.Component<IProps & IChildProps> {
  handleItemChoose = (id: string, key: string) => this.props.onChange(id, key)

  handleHide() {
    this.props.onBlur()
    this.props.triggerHide()
  }

  render() {
    const { value, onChange, onBlur, children, name, ...props } = this.props

    return (
      <ListPicker
        chosenItem={value}
        name={name}
        onItemChoose={this.handleItemChoose}
        triggerHide={this.handleHide}
        {...props}
      >
        {children}
      </ListPicker>
    )
  }
}

export default FormElement(ListPickerFormElement)
