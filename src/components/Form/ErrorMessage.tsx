import has from 'lodash-es/has'
import * as PropTypes from 'prop-types'
import React from 'react'
import { injectIntl } from 'react-intl'
import InputError from './InputError'

interface IProps {
  readonly name?: string
  readonly values?: IndexSignature<string | number>
}

class ErrorMessage extends React.Component<IProps & InjectedIntlProps> {
  public static readonly contextTypes = {
    formData: PropTypes.object,
  }

  public render(): JSX.Element {
    const { formData } = this.context
    const { values, name, ...props } = this.props

    if (
      has(formData, `validation[${name}]`) &&
      formData.invalidElement === name
    ) {
      const elementValidation = formData.validation[name]

      return (
        <InputError
          data-e2e={`input-error-${name}`}
          isValid={false}
          timestamp={elementValidation.timestamp}
          {...props}
        >
          {this.props.intl.formatMessage(elementValidation.error, values)}
        </InputError>
      )
    }

    return null
  }
}

export default injectIntl(ErrorMessage)
