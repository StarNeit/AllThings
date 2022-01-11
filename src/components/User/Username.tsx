import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

interface IProps {
  username: string
  deleted: boolean
}

class Username extends React.Component<IProps> {
  render() {
    const { deleted, username } = this.props
    return deleted ? (
      <FormattedMessage
        id="username.deleted-user"
        description="Username for deleted users"
        defaultMessage="Deleted user"
      />
    ) : (
      <Fragment>{username}</Fragment>
    )
  }
}

export default Username
