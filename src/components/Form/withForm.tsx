import * as PropTypes from 'prop-types'
import React from 'react'

export default (FormComponent: React.ComponentType<{ form: unknown }>) =>
  class extends React.Component {
    static displayName = `withForm(${FormComponent.displayName})`
    static contextTypes = {
      formData: PropTypes.object,
      formName: PropTypes.string.isRequired,
      onBlur: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
      onTouch: PropTypes.func.isRequired,
      submit: PropTypes.func.isRequired,
    }

    render() {
      return <FormComponent {...this.props} form={this.context} />
    }
  }
