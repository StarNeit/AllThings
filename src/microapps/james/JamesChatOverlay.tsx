import React from 'react'
import { Gateway } from 'react-gateway'
import Overlay from 'components/Overlay'
import James from './JamesChatLog'
import { View } from '@allthings/elements'
import {
  Bar,
  BarTitle,
  ButtonGroup,
  CloseButton,
} from 'components/OverlayTitle'
import StickyTextarea from './StickyTextarea'
import IosPaperplaneIcon from '@allthings/react-ionicons/lib/IosPaperplaneIcon'
import Query from './com/ApiAi'
import generateServiceMail from './ServiceMail'
import Actions from 'store/actions/james'
import { getLocalized } from 'containers/Localized'
import Message from './Message'

import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { css } from 'glamor'
import { IService, IMessage } from '.'

const styles = {
  chat: css({
    maxWidth: 880,
    boxShadow: '0 0 100px rgba(0,0,0,.4)',
  }),
  sendIconStyle: (fill: string) =>
    css({
      height: 40,
      width: 40,
      margin: '0 15px',
      transform: 'rotate(45deg)',
      fill,
    }),
}

interface IOwnProps {
  readonly onClose: () => void
  readonly config: MicroAppProps
  readonly service: IService
}

type Props = ReturnType<typeof mapStateToProps> & IOwnProps

interface IState {
  readonly messages: IMessage[]
  readonly parameters: IndexSignature
  readonly text: string
  readonly finished: boolean
}

class JamesChatOverlay extends React.Component<Props & DispatchProp, IState> {
  mounted = false

  // tslint:disable:no-bitwise
  uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
  // tslint:enable:no-bitwise

  state: IState = {
    messages: [],
    parameters: {},
    text: '',
    finished: false,
  }

  componentDidMount() {
    this.mounted = true
    const {
      city,
      country,
      houseNumber,
      postalCode,
      street,
    } = this.props.user.unit._embedded.address
    Query({
      sessionId: this.uuid,
      event: {
        name: this.getContextName(),
        data: {
          address: `${street} ${houseNumber}, ${postalCode} ${city}, ${country}`,
        },
      },
      contexts: [
        {
          name: this.getContextName(),
          lifespan: 99,
        },
      ],
      lang: 'de',
      timezone: 'Europe/Berlin',
    })
      .then(this.greetUser)
      .then(this.addResponse)
  }

  componentWillUnmount = () => (this.mounted = false)

  getContextName = () => `order-${this.props.service.type}`

  handleSubmit = (e: MouseEvent) => {
    e && e.preventDefault()
    const { text } = this.state
    if (text) {
      Query({
        sessionId: this.uuid,
        query: text,
        contexts: [
          {
            name: this.getContextName(),
            lifespan: 99,
          },
        ],
        lang: 'de',
        timezone: 'Europe/Berlin',
      }).then(this.addResponse)

      this.setState({
        messages: this.state.messages.concat(new Message(text)),
        text: '',
      })
    }
  }

  greetUser = (response: any) => {
    if (this.mounted) {
      const message = new Message(
        `Hallo ${this.props.user.username}!`,
        new Date(),
        false,
      )
      this.setState({
        messages: this.state.messages.concat(message),
      })
    }

    return response
  }

  addResponse = ({ entity }: any) => {
    if (this.mounted) {
      const action = entity.result.action
      const actions = action.split(',')

      if (actions.indexOf('confirm-order-send-email') >= 0) {
        this.props.dispatch(
          Actions.placeOrder(
            this.props.service.id,
            this.state.parameters,
            generateServiceMail({
              Bestellung: getLocalized(
                this.props.service.name,
                this.props.locale,
              ),
              Name: this.props.user.username,
              'E-Mail': this.props.user.email,
              ...this.state.parameters,
            }),
          ),
        )
      }

      if (actions.indexOf('end-conversation') >= 0) {
        this.setState({ finished: true })
      }

      const message = new Message(
        entity.result.speech,
        new Date(entity.timestamp),
        false,
      )

      this.setState({
        parameters: { ...this.state.parameters, ...entity.result.parameters },
        messages: this.state.messages.concat(message),
      })
    }
  }

  handleChange = (text: string) => this.setState({ text })

  handleClose = () => {
    this.props.onClose()
    this.props.dispatch(push('/e-concierge'))
  }

  dontCloseOverlayOnClick = (e: React.MouseEvent) => e.stopPropagation()

  render() {
    const { config, user, onClose } = this.props
    return (
      <Gateway into="root">
        <Overlay
          alignH="center"
          alignV="stretch"
          direction="row"
          onBackgroundClick={onClose}
          {...css({ height: '100vh' })}
        >
          <View
            {...styles.chat}
            flex="grow"
            direction="column"
            onClick={this.dontCloseOverlayOnClick}
          >
            <Bar appTheme={config.type}>
              <BarTitle>Wie kann ich helfen?</BarTitle>
              <ButtonGroup>
                <CloseButton onClick={onClose} />
              </ButtonGroup>
            </Bar>
            <James
              messages={this.state.messages}
              finished={this.state.finished}
              triggerClose={this.handleClose}
              user={user}
              config={config}
            />
            <StickyTextarea
              autoFocus
              placeholder={'Was möchtest du sagen?'}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              value={this.state.text}
              disabled={this.state.finished}
              icon={
                <IosPaperplaneIcon {...styles.sendIconStyle(config.color)} />
              }
            />
          </View>
        </Overlay>
      </Gateway>
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  locale: state.app.locale,
  user: state.authentication.user,
})

export default connect(mapStateToProps)(JamesChatOverlay)
