import * as PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import FormActions from 'store/actions/form'
import { Broadcast } from 'react-broadcast'

import { IApiRequest } from 'store/api'

export const FORM_CHANNEL = 'form'

interface IProps {
  autoComplete?: 'on' | 'off'
  children: React.ReactNodeArray
  form?: object
  initialValues?: object
  name: string
  onError: (error: any) => void
  onSubmit?: () => boolean | void
  onSuccess: (response: any) => void
  request: (...args: any[]) => IApiRequest[] | IApiRequest
  style?: object
  validateConstraints: object
}

class Form extends React.Component<IProps & DispatchProp> {
  static childContextTypes = {
    formData: PropTypes.object,
    formName: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onTouch: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSubmit: () => true,
  }

  constructor(props: IProps & DispatchProp) {
    super(props)
    props.dispatch(FormActions.openForm(props.name, props.initialValues))
  }

  getChildContext() {
    return {
      formData: this.props.form || {},
      formName: this.props.name,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onTouch: this.handleTouch,
      submit: this.handleSubmit,
    }
  }

  componentWillUnmount() {
    this.props.dispatch(
      FormActions.openForm(this.props.name, this.props.initialValues),
    )
  }

  handleChange = (elementName: string, change: string) => {
    this.props.dispatch(
      FormActions.setElementValue(
        this.props.name,
        elementName,
        change,
        this.props.validateConstraints,
      ),
    )
  }

  handleTouch = (elementName: string) => {
    this.props.dispatch(
      FormActions.touchElement(
        this.props.name,
        elementName,
        this.props.validateConstraints,
      ),
    )
  }

  handleBlur = (elementName: string, value: string) => {
    if (value) {
      this.handleChange(elementName, value)
    }
    this.props.dispatch(
      FormActions.blurElement(
        this.props.name,
        elementName,
        this.props.validateConstraints,
      ),
    )
  }

  handleSubmit = (e: React.FormEvent) => {
    e && e.preventDefault()

    if (this.props.onSubmit() !== false) {
      this.props.dispatch(
        FormActions.submitForm(
          this.props.name,
          this.props.request,
          this.props.onSuccess,
          this.props.onError,
          this.props.validateConstraints,
        ),
      )
    }

    return false
  }

  submit = (e: React.FormEvent) => this.handleSubmit(e)

  render() {
    const { name, autoComplete, style, children } = this.props
    const values = this.props.form || { elements: {} }
    return (
      <Broadcast channel={FORM_CHANNEL} value={{ formName: name, values }}>
        <form
          method="POST"
          id={name}
          noValidate
          autoComplete={autoComplete}
          onSubmit={this.handleSubmit}
          style={style}
          name={name}
        >
          {children}
        </form>
      </Broadcast>
    )
  }
}

export default connect((state: IReduxState, props: IProps) => ({
  form: state.form[props.name],
}))(Form)
