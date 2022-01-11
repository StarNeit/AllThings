import { ColorPalette } from '@allthings/colors'
import React from 'react'
import { push } from 'connected-react-router'
import { css } from 'glamor'
import AppIntroContainer from 'pages/AppIntroContainer'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import AppActions from 'store/actions/app'
import { View, Text } from '@allthings/elements'

import AuthActions from 'store/actions/authentication'

interface IProps {
  isCheckedIn: boolean
}

class LogoutProxy extends React.PureComponent<DispatchProp & IProps> {
  async componentDidMount() {
    await this.props.dispatch(AuthActions.logout())
    await this.props.dispatch(AppActions.userLoggedInBefore(false))

    this.props.dispatch(push('/'))
  }

  content = (
    <View
      direction="column"
      alignH="center"
      alignV="center"
      {...(this.props.isCheckedIn ? css({ height: 'calc(100vh - 70px)' }) : {})}
    >
      <Text
        color={ColorPalette.greyIntense}
        size="xl"
        strong
        {...css({
          backgroundColor: this.props.isCheckedIn
            ? ColorPalette.whiteIntense
            : ColorPalette.white,
          borderRadius: '2px',
          padding: '20px',
        })}
      >
        <FormattedMessage
          id="logout-proxy.message"
          description="Message briefly displayed when the logged out action is performed"
          defaultMessage="See you soon again!"
        />
      </Text>
    </View>
  )

  render() {
    return this.props.isCheckedIn ? (
      this.content
    ) : (
      <AppIntroContainer>{this.content}</AppIntroContainer>
    )
  }
}

export default connect((state: IReduxState) => ({
  isCheckedIn: state.authentication.isCheckedIn,
}))(LogoutProxy)
