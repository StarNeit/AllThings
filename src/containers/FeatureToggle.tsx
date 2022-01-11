import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash-es/get'

interface IProps {
  children: (name: IProps['name']) => React.ReactElement<any>
  isEnabled: boolean
  name: string
}

class FeatureToggle extends React.PureComponent<IProps> {
  render() {
    return this.props.isEnabled ? this.props.children(this.props.name) : null
  }
}

export default connect((state, props: IProps) => ({
  isEnabled:
    process.env.NODE_ENV !== 'production' ||
    get(state, `authentication.user.properties.${props.name}`, false),
}))(FeatureToggle)
