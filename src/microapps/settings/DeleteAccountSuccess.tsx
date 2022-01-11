import React from 'react'
import { connect } from 'react-redux'
import { css } from 'glamor'
import { FormattedMessage } from 'react-intl'
import { View, Text } from '@allthings/elements'
import DeleteAccountSuccessIcon from './DeleteAccountSuccessIcon'
import authentication from '../../store/actions/authentication'

const styles = {
  paddingTop: css({
    paddingTop: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
  }),
  padding: css({
    paddingTop: '2vh',
    paddingBottom: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
    // IE hack! Otherwise text goes wild...
    '@media all and (min-width: 880px)': {
      maxWidth: 430,
    },
  }),
  mainContainer: css({
    height: 500,
    width: '100%',
  }),
  secondaryContainer: css({ maxWidth: 320, maxHeight: 500, width: 320 }),
}

class DeleteAccountSuccess extends React.PureComponent<DispatchProp> {
  componentDidMount() {
    setTimeout(() => {
      this.props.dispatch(authentication.logout())
    }, 2000)
  }

  render = () => (
    <View
      direction="column"
      alignV="center"
      alignH="space-around"
      {...styles.mainContainer}
      data-e2e="delete-account-success"
    >
      <View
        flex="flex"
        direction="column"
        alignV="center"
        alignH="space-around"
        {...styles.secondaryContainer}
      >
        <Text
          size="xl"
          color="secondary"
          strong
          align="center"
          {...styles.paddingTop}
        >
          <FormattedMessage
            id="account-delete-overlay.success-title"
            description="Account delete success screen title."
            defaultMessage="We'll miss you?"
          />
        </Text>
        <DeleteAccountSuccessIcon />
        <Text align="center" color="grey" {...styles.padding}>
          <FormattedMessage
            id="account-delete-overlay.success-description"
            description="Account delete success screen description."
            defaultMessage="Your account has been deleted. You'll be logged out now."
          />
        </Text>
      </View>
    </View>
  )
}

export default connect()(DeleteAccountSuccess)
