import React from 'react'
import { getLocalized } from 'containers/Localized'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

interface IProps {
  children: object | string
  locale: string
}

class AppTitle extends React.PureComponent<IProps> {
  render() {
    return (
      <Helmet
        title={
          (typeof this.props.children === 'string'
            ? this.props.children
            : getLocalized(this.props.children, this.props.locale)) as string
        }
      />
    )
  }
}

export default connect((state: IReduxState) => ({ locale: state.app.locale }))(
  AppTitle,
)
