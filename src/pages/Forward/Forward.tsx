import React from 'react'
import { connect } from 'react-redux'
import { View, Text, SimpleLayout } from '@allthings/elements'
import Microapp from 'components/Microapp'
import ForwardPageIcon from './ForwardPageIcon'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { FormattedMessage } from 'react-intl'
import { createRequest } from 'store/api'
import get from 'lodash-es/get'
import Link from 'components/Link'
import { RouteComponentProps } from 'react-router'

const styles = {
  title: css({
    marginBottom: '30px',
  }),
  forwardPageIconContainer: css({
    marginBottom: '20px',
  }),
  calmingText: css({
    marginBottom: '30px',
    maxWidth: '220px',
  }),
  caringText: css({
    maxWidth: '220px',
    marginBottom: '20px',
  }),
}

interface IProps {
  accessToken: string
  clientID: string
  environment: string
  hostname: string
}

interface IState {
  readonly redirectTarget: any
}

class Forward extends React.Component<
  IProps & RouteComponentProps<{ shortId: string }>
> {
  state: IState = {
    redirectTarget: null,
  }

  redirectTimeout: NodeJS.Timeout = null

  async componentDidMount() {
    const config = {
      hostname: this.props.hostname,
      environment: this.props.environment,
      clientID: this.props.clientID,
    }
    this.redirectTimeout = setInterval(this.redirectUser, 5000)
    const redirectTarget = await createRequest(config)({
      method: 'GET',
      path: `api/v1/short-ids/${this.props.match.params.shortId}`,
      accessToken: this.props.accessToken,
    })
    this.setState({ redirectTarget })
  }

  componentWillUnmount() {
    clearInterval(this.redirectTimeout)
  }

  redirectUser = () => {
    const { redirectTarget } = this.state
    if (redirectTarget) {
      clearInterval(this.redirectTimeout)
      if (redirectTarget.entity && redirectTarget.entity.redirectUri) {
        window.location = redirectTarget.entity.redirectUri
      } else {
        this.props.history.push({
          pathname: '/404',
        })
      }
    }
  }

  render() {
    const redirectUrl = get(this.state.redirectTarget, 'entity.redirectUri')
    return (
      <Microapp>
        <SimpleLayout padded>
          <View flex="flex" alignH="center" alignV="center" direction="column">
            <View fill alignH="center" alignV="center" direction="column">
              <Text
                strong
                size="xl"
                align="center"
                color={ColorPalette.greyIntense}
                {...styles.title}
              >
                <FormattedMessage
                  id="forwarding-page.title"
                  description="title to show at redirection"
                  defaultMessage="You will be redirected..."
                />
              </Text>
              <View {...styles.forwardPageIconContainer}>
                <ForwardPageIcon />
              </View>
              <Text align="center" {...styles.calmingText}>
                <FormattedMessage
                  id="forwarding-page.calming-text1"
                  description="calming message to show at redirection"
                  defaultMessage="No worries, we will continue in a couple of seconds..."
                />
              </Text>
              <Text strong align="center" {...styles.caringText}>
                <FormattedMessage
                  id="forwarding-page.calming-text2"
                  description="another calming message to show at redirection"
                  defaultMessage="We are forwarding you to the requested page!"
                />
              </Text>
              {redirectUrl && <Link to={redirectUrl}>{redirectUrl}</Link>}
            </View>
          </View>
        </SimpleLayout>
      </Microapp>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  hostname: state.app.hostname,
  environment: state.app.environment,
  clientID: state.app.config.clientID,
  accessToken: state.authentication.accessToken,
})

export default connect(mapStateToProps)(Forward)
