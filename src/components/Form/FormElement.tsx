import * as PropTypes from 'prop-types'
import React from 'react'
import { Subscriber } from 'react-broadcast'
import { FORM_CHANNEL } from 'containers/Form/Form'
import NoOp from 'utils/noop'

export interface IChildProps {
  onChange: (value: string) => void
  onTouch: () => void
  onBlur: (value: string) => void
  value?: string
}

interface IProps {
  chooseLabel?: JSX.Element
  className?: string
  defaultValue?: string
  items?: ReadonlyArray<any>
  name: string
  onBlur?: (...args: unknown[]) => void
  onChange?: (...args: unknown[]) => void
  onTouch?: (...args: unknown[]) => void
  placeholder?: string
  position?: string
  rows?: string
  siteKey?: string
  triggerHide?: () => void
  type?: string
  value?: unknown
}

export default function(FormComponent: React.ComponentType<IChildProps>) {
  class FormElement extends React.Component<IProps> {
    static contextTypes = {
      formData: PropTypes.object,
      formName: PropTypes.string.isRequired,
      onBlur: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
      onTouch: PropTypes.func.isRequired,
    }

    static defaultProps = {
      onBlur: NoOp,
      onChange: NoOp,
      onTouch: NoOp,
    }

    componentDidMount() {
      const { value } = this.props
      value !== '' && this.handleBlur(value)
    }

    handleChange = (change: string, ...args: unknown[]) => {
      this.context.onChange(this.props.name, change)
      this.props.onChange(change, ...args)
    }

    handleTouch = (...args: unknown[]) => {
      this.context.onTouch(this.props.name)
      this.props.onTouch(args)
    }

    handleBlur = (change: unknown) => {
      this.context.onBlur(this.props.name, change)
      this.props.onBlur(change)
    }

    render() {
      return (
        <Subscriber channel={FORM_CHANNEL}>
          {({ values }) => (
            <FormComponent
              {...this.props}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              onTouch={this.handleTouch}
              value={values.elements[this.props.name]}
            />
          )}
        </Subscriber>
      )
    }
  }

  return FormElement
}
