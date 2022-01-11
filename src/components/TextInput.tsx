import React from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { View, Text } from '@allthings/elements'
import { flexType } from '@allthings/elements/View'

interface IProps {
  flex?: flexType
  initialValue?: string
  onBlur?: (value: string) => void
  placeholder?: string
  type?: string
  validateField: (field: string) => IndexSignature<string> | undefined
}

interface IState {
  invalidErrorMsg: string
  value: string
  valueValid: boolean
}

export default class TextInput extends React.Component<IProps, IState> {
  static defaultProps = {
    validateField: (): IndexSignature<string> | undefined => undefined,
  }

  constructor(props: IProps) {
    super(props)
    this.state = {
      value: props.initialValue,
      valueValid: true,
      invalidErrorMsg: '',
    }
  }

  inputField: HTMLInputElement = null

  handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.inputField && this.inputField.blur()
    }
  }
  getErrorMsg = (invalidObj: IndexSignature<string>) => {
    return Object.values(invalidObj)[0][0]
      .split(' ')
      .slice(1)
      .join(' ')
  }
  handleBlur = () => {
    const invalidObj = this.props.validateField(this.state.value)
    if (invalidObj) {
      this.setState({
        valueValid: false,
        invalidErrorMsg: this.getErrorMsg(invalidObj),
      })
    } else {
      this.setState({ valueValid: true, invalidErrorMsg: '' })
      this.props.onBlur(this.state.value)
    }
  }
  attachRef = (ref: HTMLInputElement) => (this.inputField = ref)
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const invalidObj = this.props.validateField(e.target.value)
    if (invalidObj) {
      this.setState({
        value: e.target.value,
        valueValid: false,
        invalidErrorMsg: this.getErrorMsg(invalidObj),
      })
    } else {
      this.setState({
        value: e.target.value,
        valueValid: true,
        invalidErrorMsg: '',
      })
    }
  }

  render() {
    const {
      placeholder,
      onBlur,
      type,
      initialValue,
      validateField,
      flex,
      ...props
    } = this.props
    return (
      <View direction="column" flex={flex}>
        <input
          type={type || 'text'}
          placeholder={placeholder}
          value={this.state.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          onBlur={this.handleBlur}
          ref={this.attachRef}
          {...props}
          {...css({
            textOverflow: 'ellipsis',
            textAlign: 'right',
            border: 'none',
            color: ColorPalette.text.primary,
            '::placeholder': {
              color: ColorPalette.text.gray,
            },
          })}
        />
        {this.state.valueValid ? null : (
          <Text size="m" color={ColorPalette.red} align="right">
            {this.state.invalidErrorMsg}
          </Text>
        )}
      </View>
    )
  }
}
