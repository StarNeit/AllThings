import React from 'react'
import { connect } from 'react-redux'
import { AppTitle } from 'containers/App'
import { CustomTitleBar, TitleBarBackButton } from 'components/TitleBar'
import { SimpleLayout, Text, View } from '@allthings/elements'
import Microapp from 'components/Microapp'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import Ratingbar from './Ratingbar'
import SanitizedHtml from 'components/SanitizedHtml'
import Actions from 'store/actions/james'
import JamesChatOverlay from './JamesChatOverlay'
import Localized from 'containers/Localized'
import { IService } from '.'
import find from 'lodash-es/find'
import { RouteComponentProps } from 'react-router'

const styles = {
  page: css({
    paddingTop: '15px',
    background: ColorPalette.white,
  }),
  header: css({
    marginBottom: '15px',
  }),
  title: css({
    flexGrow: '1',
    paddingBottom: 3,
  }),
  button: css(
    css({
      width: 'auto',
      padding: '8px 20px',
      backgroundColor: ColorPalette.purple,
      borderRadius: '6px',
      color: ColorPalette.white,
      cursor: 'pointer',
    }),
  ),
  contentText: css({
    '& ul': {
      listStyle: 'disc',
      marginLeft: 20,
      marginBottom: 20,
    },
  }),
  imageContainer: css({
    marginBottom: 10,
  }),
  image: css({
    display: 'flex',
    maxHeight: 80,
    width: 'auto',
    marginBottom: 10,
    marginRight: 10,
  }),
}

interface IProps {
  config: MicroAppProps
  loading: boolean
  service: IService
}

class JamesServiceDetail extends React.Component<IProps & DispatchProp> {
  state = {
    chatOpen: false,
  }

  componentDidMount() {
    this.props.dispatch(Actions.fetchServices())
  }

  closeChat = () => this.setState({ chatOpen: false })
  openChat = () => this.setState({ chatOpen: true })

  sanitizeUrl = (url: string) => {
    if (url.match(/^https?:\/\//g)) {
      return url
    } else {
      return `http://${url}`
    }
  }

  handleOrderButton = () => {
    if (this.props.service.type === 'external' && this.props.service.url) {
      window.open(this.sanitizeUrl(this.props.service.url))
    } else {
      this.openChat()
    }
  }

  renderImages = () => {
    const { files } = this.props.service._embedded
    if (files) {
      const images = files.map((image: any) => {
        return (
          <img
            src={image._embedded.files.medium.url}
            key={image._embedded.files.medium.url}
            {...styles.image}
          />
        )
      })
      return (
        <View
          direction="row"
          alignH="start"
          wrap="wrap"
          {...styles.imageContainer}
        >
          {images}
        </View>
      )
    }
    return null
  }

  renderDetails = () => {
    return (
      <SimpleLayout {...styles.page} padded>
        <View>
          <Text size="xl" {...styles.title} data-e2e="james-detail-title">
            <Localized messages={this.props.service.name} />
          </Text>
        </View>
        <View direction="row" alignV="center" {...styles.header}>
          <View flex="flex">
            <Ratingbar
              rating={this.props.service.rating}
              data-e2e="james-detail-rating"
            />
          </View>
          <View direction="column" alignV="center">
            <div
              {...css(
                styles.button,
                css({ background: this.props.config.color }),
              )}
              onClick={this.handleOrderButton}
              data-e2e="james-detail-order"
            >
              <Text size="s" strong>
                Zur Bestellung
              </Text>
            </div>
          </View>
        </View>
        <View {...styles.contentText}>
          {this.renderImages()}
          <Text size="l">
            <Text
              size="l"
              color={ColorPalette.greyIntense}
              data-e2e="james-detail-subtitle"
            >
              {this.props.service._embedded.provider.name}
              <br />
              <Localized messages={this.props.service.subtitle} />
            </Text>
            <Localized messages={this.props.service.description}>
              {message => (
                <Text data-e2e="james-detail-description">
                  <SanitizedHtml
                    config={{ ADD_ATTR: ['target'] }}
                    html={message}
                  />
                </Text>
              )}
            </Localized>
          </Text>
        </View>
      </SimpleLayout>
    )
  }

  renderError = () => {
    return (
      <SimpleLayout {...css(styles.page)} padded>
        <Text size="xl" block>
          Der Service ist nicht verfügbar
        </Text>
        <Text block>
          Kehren Sie zurück zur Liste und wählen Sie einen verfügbaren Service
          aus.
        </Text>
      </SimpleLayout>
    )
  }

  renderLoading = () => {
    return (
      <SimpleLayout {...css(styles.page)} padded>
        <Text size="xl" block>
          {`Gleich geht's los`}
        </Text>
        <Text block>Der Service wird geladen!</Text>
      </SimpleLayout>
    )
  }

  render() {
    const { service, loading } = this.props
    const content = service
      ? this.renderDetails()
      : loading
      ? this.renderLoading()
      : this.renderError()
    const app = this.props.config

    return (
      <Microapp>
        <CustomTitleBar color={app.color}>
          <TitleBarBackButton to="/e-concierge" label="Zurück" />
        </CustomTitleBar>
        <AppTitle>{app._embedded.type.name}</AppTitle>
        {content}
        {this.state.chatOpen ? (
          <JamesChatOverlay
            onClose={this.closeChat}
            config={app}
            service={service}
          />
        ) : null}
      </Microapp>
    )
  }
}

export default connect(
  ({ james }: IReduxState, props: RouteComponentProps<{ id: string }>) => {
    return {
      service: find(james.services, { id: props.match.params.id }),
      loading: james.loading,
    }
  },
)(JamesServiceDetail)
