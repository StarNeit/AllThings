import React from 'react'
import Recaptcha from 'react-google-recaptcha'

import FormElement, { IChildProps } from 'components/Form/FormElement'

interface IProps extends IChildProps {
  siteKey: string
}

interface IState {
  value: string
}

class RecaptchaInput extends React.PureComponent<IProps, IState> {
  state = {
    value: '',
  }

  handleChange = (value: string) => {
    this.setState({ value })
    this.props.onChange(value)
  }

  render() {
    const { siteKey, onTouch, onChange, onBlur, ...restProps } = this.props

    return (
      <Recaptcha
        {...restProps}
        sitekey={siteKey}
        onChange={this.handleChange}
      />
    )
  }
}

export default FormElement(RecaptchaInput)
