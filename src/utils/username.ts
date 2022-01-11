import { defineMessages } from 'react-intl'

const messages = defineMessages({
  deletedUserUsername: {
    defaultMessage: 'Deleted user',
    description: 'Username for deleted users',
    id: 'username.deleted-user',
  },
})

/**
 * Returns the username depending on user deletion status
 * commonUsername if user is not deleted, translated generic username otherwise
 * @param {*} user
 */
export function getUsername(
  user: IUser,
  formatMessage: InjectedIntl['formatMessage'],
) {
  return user.deleted
    ? formatMessage
      ? formatMessage(messages.deletedUserUsername)
      : 'Deleted user'
    : user.username
}
