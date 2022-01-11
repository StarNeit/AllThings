import React from 'react'

export interface IProps {
  readonly appID?: string
  readonly userId?: string
  readonly user: IUser
}

class Mixpanel extends React.Component<IProps> {
  public componentDidMount(): void {
    const { user, userId } = this.props
    if (userId) {
      this.identifyUser({ userId, user })
    }

    if (typeof mixpanel !== 'undefined') {
      mixpanel.register({
        appId: this.props.appID,
        version: (window as any).appVersion,
      })
    }
  }

  public componentDidUpdate(prevProps: IProps): void {
    const { user, userId } = this.props
    if (userId !== prevProps.userId) {
      this.identifyUser({ user, userId })
    }
  }

  public readonly identifyUser = ({ userId, user }: Partial<IProps>) => {
    if (typeof mixpanel !== 'undefined' && userId && user) {
      mixpanel.identify(userId)
      mixpanel.people.set({
        $createdAt: user.createdAt,
        $first_name: user.id,
        $last_name: user.type || 'user',
        $locale: user.locale,
        $profileImage: !!user.profileImage,
        type: user.type || 'user',
      })
    }
  }

  public render(): JSX.Element {
    return null
  }
}

export default Mixpanel
