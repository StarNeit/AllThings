import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { View, ListSpinner, GroupedCardList } from '@allthings/elements'
import UserListItem from 'components/WhoIsWho/UserListItem'
import get from 'lodash-es/get'

const i18n = defineMessages({
  myUser: {
    id: 'who-is-who.list.myuser',
    description: 'Text for my user',
    defaultMessage: 'My user',
  },
})

interface IUser {
  id: string
  username: string
}

interface IProps {
  isLoadingNextPage: boolean
  onClickUser: (id: string, name?: string) => void
  pages: ReadonlyArray<ReadonlyArray<IUser>>
  selfUser?: IUser
}

class UsersGroupedList extends React.Component<IProps & InjectedIntlProps> {
  groupUsers = (
    usersByLetter: { [key: string]: Array<{ username: string }> },
    user: { username: string },
  ) => {
    const currentIndex = user.username.toUpperCase().charCodeAt(0)
    const currentArray = usersByLetter[currentIndex] || []
    currentArray.push(user)
    usersByLetter[currentIndex] = currentArray
    return usersByLetter
  }

  handleClick = (userId: string, name: string) =>
    this.props.onClickUser(userId, name)

  renderMyself = () => (
    <GroupedCardList title={this.props.intl.formatMessage(i18n.myUser)}>
      <UserListItem
        onClick={this.handleClick}
        key={this.props.selfUser.id}
        deleted={false}
        id={this.props.selfUser.id}
        name={this.props.selfUser.username}
        additional=""
        data-e2e="who-is-who-self-user-list-item"
        profileImage={get(this.props.selfUser, 'profileImage.files.thumb.url')}
      />
    </GroupedCardList>
  )

  renderGroup = (title: string, users: ReadonlyArray<IUser>) => (
    <GroupedCardList title={title} key={title}>
      {users.map(user => (
        <UserListItem
          onClick={this.handleClick}
          key={user.id}
          deleted={false}
          id={user.id}
          name={user.username}
          additional=""
          data-e2e={`whoiswho-user--${
            user && user.username && user.username.split
              ? user.username
                  .split(' ')
                  .join('_')
                  .toLowerCase()
              : 'no_name'
          }`}
          profileImage={get(user, '_embedded.profileImage.files.thumb.url')}
        />
      ))}
    </GroupedCardList>
  )

  render() {
    const { pages, selfUser, isLoadingNextPage } = this.props

    if (!(pages.length > 0)) {
      return null
    }

    return (
      <View>
        {selfUser && this.renderMyself()}
        {selfUser
          ? pages
              .reduce((allUsers, users) => allUsers.concat(users), [])
              .filter(user => user.id !== selfUser.id)
              .reduce(this.groupUsers, [] as any)
              .map((users: ReadonlyArray<IUser>, charCode: number) =>
                this.renderGroup(String.fromCharCode(charCode), users),
              )
          : pages
              .reduce((allUsers, users) => allUsers.concat(users), [])
              .reduce(this.groupUsers, [] as any)
              .map((users: ReadonlyArray<IUser>, charCode: number) =>
                this.renderGroup(String.fromCharCode(charCode), users),
              )}
        {isLoadingNextPage && <ListSpinner />}
      </View>
    )
  }
}

export default injectIntl(UsersGroupedList)
