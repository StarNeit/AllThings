import { createMQ } from '@allthings/elements/Responsive'
import { Spacer, Text, View } from '@allthings/elements'
import { css } from 'glamor'
import React from 'react'
import { connect } from 'react-redux'

const styles = {
  subtitle: css({
    fontWeight: '300',
    lineHeight: '1.1em',
    fontSize: '24px !important',
    [createMQ('desktop', 'tablet')]: {
      fontSize: '34px !important',
    },
  }),
  title: css({
    fontWeight: '700',
    lineHeight: '1.1em',
    fontSize: '38px !important',
    hyphens: 'auto',
    [createMQ('desktop', 'tablet')]: {
      fontSize: '54px !important',
    },
  }),
}

type Props = ReturnType<typeof mapStateToProps>

class AppIntro extends React.PureComponent<Props> {
  public render(): JSX.Element {
    const { appName, appSubTitle, appTitle, language } = this.props

    return (
      <View direction="column">
        <Text
          data-e2e="login-intro-title"
          size="giant"
          lang={language}
          {...styles.title}
        >
          {appTitle || appName}
        </Text>
        <Spacer height="5vh" />
        <Text data-e2e="login-intro-subtitle" size="giant" {...styles.subtitle}>
          {appSubTitle}
        </Text>
      </View>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  appName: state.app.config.appName,
  appSubTitle:
    state.app.config.slogan[state.app.locale] ||
    state.app.config.slogan.en_US ||
    state.app.config.appSubTitle,
  appTitle: state.app.config.appTitle,
  language: (state.app.locale && state.app.locale.split('_')[0]) || 'en',
})

export default connect(mapStateToProps)(AppIntro)
