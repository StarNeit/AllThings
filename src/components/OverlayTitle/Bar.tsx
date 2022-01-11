import React from 'react'
import { connect } from 'react-redux'
import find from 'lodash-es/find'

interface IProps {
  appTheme?: string
  config?: MicroAppProps
}

class Bar extends React.Component<React.PropsWithChildren<IProps>> {
  render(): JSX.Element {
    const app = this.props.config

    return (
      <div
        className="mainOverlay-bar"
        style={app ? { backgroundColor: app.color } : {}}
      >
        {this.props.children}
      </div>
    )
  }
}

export default connect((state: IReduxState, props: IProps) => ({
  config: find(state.app.microApps, { type: props.appTheme }),
}))(Bar)
