import React from 'react'
import { connect } from 'react-redux'
import WhoIsWho from 'store/actions/whoIsWho'
import { AppTitle } from 'containers/App'
import { SimpleLayout } from '@allthings/elements'
import { push } from 'connected-react-router'
import Auth from 'store/actions/authentication'
import WhoIsWhoOnboarding from './WhoIsWhoOnboarding'
import UsersGroupedList from 'components/UsersGroupedList'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from 'enums'

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    config: MicroAppProps
  }

class WhoIsWhoList extends React.Component<Props> {
  componentDidMount() {
    if (this.props.profileIsPublic) {
      this.props.openUserList()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.profileIsPublic && !prevProps.profileIsPublic) {
      this.props.openUserList()
    }
  }

  renderOnboarding = () => (
    <WhoIsWhoOnboarding
      username={this.props.selfUser.username}
      config={this.props.config}
      onButtonPress={this.props.setProfilePublic}
    />
  )

  render() {
    const {
      config,
      selfUser,
      pages,
      isLoadingNextPage,
      navigateToUser,
    } = this.props

    if (!this.props.profileIsPublic) {
      return this.renderOnboarding()
    }

    return (
      <HorizontalRouterMicroapp>
        <AppTitle>{config.label}</AppTitle>
        <SimpleLayout padded="horizontal" onScrollEnd={this.props.onScrollEnd}>
          <MicroappBigTitleBar type={MicroApps.WHO_IS_WHO} />
          {pages.length > 0 && (
            <UsersGroupedList
              selfUser={selfUser}
              pages={pages}
              isLoadingNextPage={isLoadingNextPage}
              onClickUser={navigateToUser}
            />
          )}
        </SimpleLayout>
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  isLoadingNextPage: state.whoIsWho.isLoadingNextPage,
  pages: state.whoIsWho.pages,
  profileIsPublic: state.authentication.user.publicProfile,
  selfUser: state.authentication.user as IUser,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  navigateToUser: (userId: string) =>
    dispatch(push(`/who-is-who/profile/${userId}`)),
  openUserList: () => dispatch(WhoIsWho.openUserList()),
  onScrollEnd: () => dispatch(WhoIsWho.fetchNextUserListPage()),
  setProfilePublic: () => dispatch(Auth.changeDetails({ publicProfile: true })),
})

export default connect(mapStateToProps, mapDispatchToProps)(WhoIsWhoList)
