import React, { PureComponent, ReactNode } from 'react'
import withRequest, { IWithRequest } from './withRequest'
import get from 'lodash-es/get'
import has from 'lodash-es/has'

export interface IData<T = any> {
  loading: boolean
  refetch: () => void
  pages: ReadonlyArray<T>
  fetchNext: () => void
  hasNextPage: boolean
}

interface IError {
  refetch: () => void
  error?: string
}

interface IProps {
  children: (data: IData) => ReactNode
  path: string
  limit?: number
  renderError?: (error: IError) => ReactNode
  params: any
  onRefetch?: () => void
  shouldRefetch?: boolean
}

interface IState {
  loading: boolean
  error: boolean
  pageResults: ReadonlyArray<any>
}
class PagedDataProvider<T = any> extends PureComponent<
  IProps & IWithRequest,
  IState
> {
  static defaultProps = {
    limit: 15,
  }

  state: IState = {
    loading: true,
    pageResults: [],
    error: false,
  }

  componentDidMount() {
    this.fetchPage({ path: '', flushPreviousPages: true })
  }

  componentDidUpdate({
    path: prevPath,
    shouldRefetch: prevShouldRefetch,
  }: IProps) {
    const { path, shouldRefetch } = this.props
    if ((!prevShouldRefetch && shouldRefetch) || prevPath !== path) {
      this.refetch()
    }
  }

  fetchPage = async ({
    path,
    flushPreviousPages,
  }: {
    path: string
    flushPreviousPages: boolean
  }) => {
    const { path: basePath, limit, params } = this.props

    const result = await this.props.createRequest({
      method: 'GET',
      path: path || basePath,
      params: {
        limit,
        ...params,
      },
    })

    if (result.status.code === 200) {
      this.setState(_ => ({
        pageResults: flushPreviousPages
          ? [result]
          : [...this.state.pageResults, result],
        loading: false,
        error: false,
      }))
    } else {
      this.setState(_ => ({
        loading: false,
        error: true,
      }))
    }
  }

  fetchNext = () => {
    const { pageResults } = this.state
    const pages = pageResults.length
    const next = get(pageResults[pages - 1], 'entity._links.next.href')
    if (pages > 0 && next) {
      this.setState({ loading: true })
      this.fetchPage({ path: next, flushPreviousPages: false })
    }
  }

  refetch = () => {
    this.setState({
      loading: true,
      error: false,
    })
    this.fetchPage({ path: '', flushPreviousPages: true })
    this.props.onRefetch && this.props.onRefetch()
  }

  renderError = () => {
    return this.props.renderError
      ? this.props.renderError({ refetch: this.refetch })
      : null
  }

  render() {
    const { loading, pageResults, error } = this.state

    if (error) {
      return this.renderError()
    } else {
      const args = {
        loading,
        refetch: this.refetch,
        pages: pageResults.map(page => page.entity._embedded.items) as IData<
          T
        >['pages'],
        fetchNext: this.fetchNext,
        hasNextPage: has(
          pageResults[pageResults.length - 1],
          'entity._links.next.href',
        ),
      }

      return React.Children.only(this.props.children(args))
    }
  }
}

export default withRequest(PagedDataProvider)
