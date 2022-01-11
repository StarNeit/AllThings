import React, { PureComponent, ReactNode } from 'react'
import withRequest, { IWithRequest, IRequest, IResponse } from './withRequest'
import isEqual from 'lodash-es/isEqual'

export interface IData {
  isDone: boolean
  result: IResponse
  error?: any
  refetch: () => void
}
interface IProps {
  children: (data: IData) => ReactNode
  request: IRequest
}

interface IState {
  error?: string
  isDone: boolean
  result: IResponse
}

class DataProvider extends PureComponent<IProps & IWithRequest, IState> {
  state: IState = {
    isDone: false,
    result: null,
    error: null,
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  componentDidUpdate(prevProps: IProps) {
    if (isEqual(prevProps.request, this.props.request) === false) {
      this.fetchData(this.props)
    }
  }

  refetch = () => this.fetchData(this.props)

  async fetchData(props: IProps & IWithRequest) {
    try {
      const { request, createRequest } = props
      const result = await createRequest({ ...request })
      this.setState({ result, isDone: true })
    } catch (error) {
      this.setState({ error })
    }
  }

  render() {
    const { isDone, result, error } = this.state

    return React.Children.only(
      this.props.children({ isDone, result, error, refetch: this.refetch }),
    )
  }
}

export default withRequest(DataProvider)
