import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { css } from 'glamor'
import { alpha, ColorPalette } from '@allthings/colors'

import { View, Text } from '@allthings/elements'
import AllthingsLogoWithText from 'components/AllthingsLogoWithText'

interface IProps {
  appName?: string
  splashScreenImage?: string
}

class PoweredBy extends React.PureComponent<IProps> {
  render() {
    const { splashScreenImage } = this.props

    return (
      <View
        data-e2e="login-powered-by"
        direction="row"
        alignH="center"
        alignV="center"
      >
        <View>
          <Text
            color={alpha(ColorPalette.grey, 0.8)}
            size="xs"
            {...css({ marginRight: '10px', textAlign: 'right' })}
          >
            <FormattedMessage
              id="powered-by"
              description="Powered by message e.g. on the login screen"
              defaultMessage="powered by"
            />
          </Text>
        </View>
        {splashScreenImage ? (
          <img
            src={splashScreenImage}
            style={{ maxHeight: '25px', maxWidth: '100px' }}
          />
        ) : (
          <AllthingsLogoWithText
            color={alpha(ColorPalette.darkBlueIntense, 0.8)}
            data-e2e="service-chooser-opener"
            style={{
              maxHeight: '200px',
              maxWidth: '200px',
            }}
          />
        )}
        <View flex="flex" />
      </View>
    )
  }
}

export default connect((state: IReduxState) => ({
  splashScreenImage: state.app.config.splashScreenImage,
}))(PoweredBy)
