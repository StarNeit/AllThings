import React from 'react'
import Meter from './Meter'
import { PasswordInputElementsForm } from 'components/Form'
import { View } from '@allthings/elements'

interface IProps {
  inputProps?: object
  indicatorStyles: {
    indicatorCount?: number
    lowValue?: number
    mediumValue?: number
    highValue?: number
    emptyColor?: string
    lowColor?: string
    mediumColor?: string
    highColor?: string
    lowMessage?: string
    mediumMessage?: string
    highMessage?: string
  }
  minLength?: number
  name?: string
  onChange?: (value: string) => void
  required?: boolean
  style?: object
  placeholder: string
  tooShort?: string
}

export default class IndicatedPasswordFieldElementsForm extends React.Component<
  IProps
> {
  static defaultProps: Partial<IProps> = {
    onChange: _ => _,
    indicatorStyles: {},
  }

  state = { score: 0 }

  calculateScore(password: string) {
    if (password.length < 8) {
      return 0
    } else if (password.length < 12) {
      return 1
    } else if (password.length < 16) {
      return 2
    } else if (password.length < 20) {
      return 3
    } else {
      return 4
    }
  }

  onChange = (value: string) => {
    this.setState({ score: this.calculateScore(value) })
    this.props.onChange(value)
  }

  render() {
    const { indicatorStyles, placeholder, onChange, ...props } = this.props

    const { score } = this.state

    return (
      <View direction="column">
        <PasswordInputElementsForm
          name="password"
          placeholder={placeholder}
          onChange={this.onChange}
          {...props}
        />
        <Meter {...indicatorStyles} score={score} />
      </View>
    )
  }
}
