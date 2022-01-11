import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createRequest } from 'store/api'

export interface IResponse<E = any> {
  status: {
    code: number
  }
  entity: E
}
export interface IWithRequest {
  createRequest: <E = any>(request: IRequest) => Promise<IResponse<E>>
}

export interface IRequest {
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE'
  path: string
  params?: unknown
  entity?: unknown
  accessToken?: string
  clientID?: boolean
  requiresCsrf?: boolean
}

interface IProps extends IndexSignature {
  accessToken?: string
  clientID?: string
  hostname?: string
}

export default <P extends IWithRequest>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<Omit<P, keyof IWithRequest>> => {
  class ComponentWithRequest extends Component<IProps> {
    static displayName = `withRequest(${WrappedComponent.displayName})`

    request = (request: IRequest) => {
      const { hostname, clientID, accessToken } = this.props
      request.accessToken = accessToken

      return createRequest({
        hostname,
        clientID,
      })(request)
    }

    render() {
      const {
        hostname,
        environment,
        clientID,
        accessToken,
        ...props
      } = this.props

      return <WrappedComponent createRequest={this.request} {...(props as P)} />
    }
  }

  return connect((state: IReduxState) => ({
    accessToken: state.authentication.accessToken,
    clientID: state.app.config.clientID,
    hostname: state.app.hostname,
  }))(ComponentWithRequest) as any
}
