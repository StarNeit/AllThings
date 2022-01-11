import React from 'react'
import Meter from './Meter'
import PasswordInput from 'components/Form/PasswordInput'
import NoOp from 'utils/noop'

interface IProps {
  inputProps?: object
  indicatorStyles: {
    emptyColor?: string
    highColor?: string
    highMessage?: string
    highValue?: number
    indicatorCount?: number
    lowColor?: string
    lowMessage?: string
    lowValue?: number
    mediumColor?: string
    mediumMessage?: string
    mediumValue?: number
  }
  minLength?: number
  name: string
  onChange?: (value: string) => void
  placeholder?: string
  style?: object
}

export default class IndicatedPasswordField extends React.Component<IProps> {
  static defaultProps = {
    onChange: NoOp,
    indicatorStyles: {},
  }

  state = { score: 0 }

  calculateScore = (password: string) => {
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

  handleChange = (value: string) => {
    this.setState({ score: this.calculateScore(value) })
    this.props.onChange(value)
  }

  render() {
    const { indicatorStyles, ...restProps } = this.props

    const { score } = this.state

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <PasswordInput {...restProps} onChange={this.handleChange} />
        <Meter {...indicatorStyles} score={score} />
      </div>
    )
  }
}
