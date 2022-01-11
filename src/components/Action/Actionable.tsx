import React from 'react'

export const STATE_IDLE = 'idle'
export const STATE_PENDING = 'pending'
export const STATE_FAILED = 'FAILED'
export const STATE_OK = 'OK'

export type State = 'idle' | 'pending' | 'FAILED' | 'OK'

interface IState {
  readonly status: State
}

interface IProps extends IndexSignature {
  readonly status: State
  readonly onClick: () => void
}

interface ISelfProps extends IndexSignature {
  readonly action: () => unknown
  readonly onClick?: (promise: Promise<unknown>) => void
}

const actionable = (Component: React.ComponentType<IProps>) =>
  class extends React.PureComponent<ISelfProps, IState> {
    public static readonly displayName = `Actionable${Component.displayName}`

    public readonly state: IState = {
      status: STATE_IDLE, // pending, failed, ok
    }

    public readonly handleClick = () => {
      this.setState({ status: STATE_PENDING })
      const promise = this.props.action() as Promise<unknown>

      if (typeof promise.then !== 'function') {
        throw new Error(
          'Action passed to ActionButton must return a Promise, but did not. Check the property `action` passed to ActionButton',
        )
      }

      if (this.props.onClick) {
        this.props.onClick(promise)
      }

      promise
        .then(() => this.setState({ status: STATE_OK }))
        .catch(() => this.setState({ status: STATE_FAILED }))
    }

    public render(): JSX.Element {
      const { action, ...props } = this.props
      return (
        <Component
          {...props}
          status={this.state.status}
          onClick={this.handleClick}
        />
      )
    }
  }

export default actionable
