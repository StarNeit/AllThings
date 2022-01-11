import React from 'react'
import { connect } from 'react-redux'
import { AppTitle } from 'containers/App'
import { Button, SimpleLayout, Text, View } from '@allthings/elements'
import Microapp from 'components/Microapp'
import { defineMessages, injectIntl } from 'react-intl'
import find from 'lodash-es/find'
import ServiceCenterActions from 'store/actions/serviceCenter'
import { ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { push } from 'connected-react-router'
import { TicketStatus } from 'enums'
import CommentBox from 'components/CommentBox'
import SendButton from 'components/SendButton'
import AddImageButton from 'components/AddImageButton'
import FileChooser from 'components/FileChooser'
import RemovableImage from 'components/RemovableImage'
import TicketConversation from './TicketConversation'
import { LAST_CONVERSATION_MESSAGE, MARGIN } from '.'
import ImageGalleryOverlay from 'components/ImageGalleryOverlay'
import onlyImages from 'utils/onlyImages'
import withMixpanel, { IInjectedMixpanelProps } from 'containers/withMixpanel'
import { RouteComponentProps } from 'react-router'
import get from 'lodash/get'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import { FileWithPath } from 'react-dropzone'
import {
  clearPreviews,
  enhanceWithPreviews,
  FileWithPreview,
} from 'utils/filePreviews'

const FILE_SIZE = 60 // px
const LOCATION = 'service-center-ticket'
const SCROLL_TOLERANCE = 1 // px

const messages = defineMessages({
  newRequestButton: {
    id: 'service-center.detail.titlebar.new',
    description: '"New" button in the app title bar',
    defaultMessage: 'New enquiry',
  },
  textareaPlaceholder: {
    id: 'service-center-detail.textarea.placeholder',
    description: 'Placeholder text of the reply textarea',
    defaultMessage: 'Enter your reply here',
  },
  reopenButtonText: {
    id: 'service-center-detail.reopen-button-text',
    description:
      'if ticket is closed, a button is shown with text: reopen ticket',
    defaultMessage: 'Re-open Ticket',
  },
  ticketClosedInfoText: {
    id: 'service-center-detail.ticket-closed-info-text',
    description: 'info showing a sentence that ticket is closed',
    defaultMessage:
      'This ticket is currently closed. Would you like to re-open it?',
  },
  ticketResolved: {
    id: 'service-center.detail.resolved',
    description: 'Text for the button which resolves an enquiry',
    defaultMessage: 'Resolved?',
  },
})

const styles = {
  actions: (isScrolling: boolean) =>
    css({
      backgroundColor: ColorPalette.white,
      boxShadow: `0px 0px 12px 2px rgba(0, 0, 0, ${isScrolling ? 0.1 : 0})`,
      padding: MARGIN,
      position: 'relative',
      transition: 'all 0.3s ease-out',
    }),
  textarea: css({
    border: '1px solid #E1E1E2 !important',
    borderRadius: '5px',
  }),
}

export interface IConversation {
  addingComment: boolean
  id?: string
  items: ReadonlyArray<IConversationMessage>
  loading: boolean
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

interface IState {
  comment: string
  files: readonly FileWithPreview[]
  galleryImageId: string
  isScrolling: boolean
  isSendingComment: boolean
  showGallery: boolean
}

type RouterProps = RouteComponentProps<{ id: string }>

class ServiceCenterDetail extends React.Component<
  Props &
    InjectedIntlProps &
    RouterProps &
    // FIXME: looks like mixpanel is not used
    IInjectedMixpanelProps & { config: MicroAppProps },
  IState
> {
  state: IState = {
    comment: '',
    files: [],
    galleryImageId: null,
    isScrolling: true,
    isSendingComment: false,
    showGallery: false,
  }

  trigger = true

  async componentDidMount() {
    const {
      fetchConversationMessages,
      fetchTicket,
      match,
      resetConversationMessages,
      ticket,
    } = this.props

    if (typeof ticket === 'undefined') {
      await fetchTicket(match.params.id)
    } else {
      resetConversationMessages()
      await fetchConversationMessages(ticket)
    }

    // Presumably a 404, redirect.
    if (typeof this.props.ticket === 'undefined') {
      this.props.redirect()
      return
    }

    this.scrollToLastMessage()
  }

  componentWillUnmount() {
    clearPreviews(this.state.files)
  }

  componentDidUpdate(prevProps: RouterProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.fetchTicket(this.props.match.params.id)
    }
  }

  closeTicket = () => {
    this.setState({ files: [] })
    this.props.updateTicket(this.props.ticket.id, {
      status: TicketStatus.CLOSED,
    })
  }

  getAllFiles = ({ conversation }: { conversation: IConversation }) =>
    conversation && conversation.items
      ? conversation.items.reduce(
          (acc, item) => [...acc, ...get(item, 'content._embedded.files', [])],
          [],
        )
      : []

  getTranslation = (message: string, data?: IndexSignature) =>
    this.props.intl.formatMessage(messages[message], data)

  handleChooseFiles = (droppedFiles: readonly FileWithPath[]) =>
    this.setState(({ files }) => ({
      files: files.concat(enhanceWithPreviews(droppedFiles)),
    }))

  handleOpenGallery = (id: string) => (event: React.SyntheticEvent) => {
    event.preventDefault()

    this.setState({ galleryImageId: id, showGallery: true })
  }

  handleCloseGallery = (event?: React.SyntheticEvent) => {
    event && event.preventDefault()

    this.setState({ showGallery: false })
  }

  handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    this.setState({ comment: event.currentTarget.value })

  // This handler is attached to the SimpleLayout component which already
  // provides an onScrollEnd property. However, since we want to also catch the
  // scrolling event itself, we reimplement it here.
  handleScroll = (event: React.SyntheticEvent) => {
    event.preventDefault()

    const {
      currentTarget: { clientHeight, scrollHeight, scrollTop },
    } = event

    // Trigger the callback with a tolerance.
    if (scrollTop + clientHeight + SCROLL_TOLERANCE > scrollHeight) {
      if (this.trigger) {
        this.setState({ isScrolling: false })
        this.trigger = false
      }
    } else {
      if (this.state.isScrolling === false) {
        this.setState({ isScrolling: true })
      }

      this.trigger = true
    }
  }

  markMessageAsRead = (commentId: string) => {
    this.props.markMessageAsRead(commentId)
  }

  postConversationMessage = async () => {
    const { postConversationMessage, conversation } = this.props
    const { comment, files } = this.state

    if (comment === '' && files.length === 0) {
      return
    }

    this.setState({ isSendingComment: true })

    await postConversationMessage(
      files.length
        ? {
            conversationId: conversation.id,
            content: comment,
            files,
          }
        : { conversationId: conversation.id, content: comment },
    )

    this.setState({ comment: '', files: [], isSendingComment: false })

    this.scrollToLastMessage()
  }

  removeFile = (index: number) =>
    this.setState(({ files }) => ({
      files: files.filter((_, i) => i !== index),
    }))

  reopenTicket = () => {
    const { updateTicket, ticket } = this.props
    updateTicket(ticket.id, { status: TicketStatus.WAITING_FOR_AGENT })
  }

  scrollToLastMessage = () =>
    document.querySelector(`#${LAST_CONVERSATION_MESSAGE}`).scrollIntoView()

  renderActions = () => {
    const { ticket, user } = this.props
    const { comment, files, isScrolling, isSendingComment } = this.state

    return (
      <View {...styles.actions(isScrolling)}>
        <View direction="row" wrap="wrap">
          {this.renderConversationFiles()}
        </View>
        {ticket && ticket.status === TicketStatus.CLOSED ? (
          <View alignH="space-around" alignV="center" direction="column">
            <Text {...css({ marginBottom: MARGIN })}>
              {this.getTranslation('ticketClosedInfoText')}
            </Text>
            <Button
              data-e2e="ticket-actions-reopen"
              onClick={this.reopenTicket}
            >
              {this.getTranslation('reopenButtonText')}
            </Button>
          </View>
        ) : (
          <View
            alignH="space-between"
            alignV="center"
            direction="row"
            {...css({ width: '100%' })}
          >
            <FileChooser
              multiple
              accept="image/jpeg,image/png"
              onChoose={this.handleChooseFiles}
            >
              {(openFileDialog: OnClick) => (
                <AddImageButton onClick={openFileDialog} />
              )}
            </FileChooser>
            <View flex="flex">
              <CommentBox
                autoFocus
                location={LOCATION}
                noProfile
                onChange={this.handleChange}
                placeholder={this.getTranslation('textareaPlaceholder')}
                user={user}
                value={comment}
              />
            </View>
            <View>
              <SendButton
                active={comment !== '' || files.length > 0}
                location={LOCATION}
                onClick={this.postConversationMessage}
                sending={isSendingComment}
              />
            </View>
          </View>
        )}
      </View>
    )
  }

  renderConversationFiles = () =>
    this.state.files.map((file, index) => (
      <View
        data-e2e={`ticket-message-file-${file.name}`}
        key={file.preview}
        {...css({
          height: FILE_SIZE,
          marginBottom: MARGIN,
          marginRight: MARGIN,
          width: FILE_SIZE,
        })}
      >
        <RemovableImage
          id={index}
          image={file.preview}
          onRemove={this.removeFile}
          size={FILE_SIZE}
        />
      </View>
    ))

  render() {
    const {
      config: { label },
      goBack,
      conversation,
      ticket,
      user,
    } = this.props
    const { galleryImageId, showGallery } = this.state
    const ticketIsOpen = ticket && ticket.status !== TicketStatus.CLOSED

    return (
      <Microapp
        {...css({ '> #scroll-container': { scrollBehavior: 'smooth' } })}
      >
        <View direction="row" alignH="space-between" alignV="center">
          <GenericBackTitleBar onBack={goBack} />
          {ticket && (
            <View {...css({ marginRight: 10 })}>
              <Button
                data-e2e={ticketIsOpen ? 'ticket-close' : 'ticket-reopen'}
                onClick={ticketIsOpen ? this.closeTicket : this.reopenTicket}
              >
                {this.getTranslation(
                  ticketIsOpen ? 'ticketResolved' : 'reopenButtonText',
                )}
              </Button>
            </View>
          )}
        </View>
        <AppTitle>{label}</AppTitle>
        <SimpleLayout onScroll={this.handleScroll}>
          <TicketConversation
            conversation={conversation}
            handleOpenGallery={this.handleOpenGallery}
            markMessageAsRead={this.markMessageAsRead}
            ticket={ticket}
            user={user}
          />
        </SimpleLayout>
        {this.renderActions()}
        {showGallery && (
          <ImageGalleryOverlay
            onClose={this.handleCloseGallery}
            images={this.getAllFiles({ conversation }).filter(onlyImages)}
            imageId={galleryImageId}
          />
        )}
      </Microapp>
    )
  }
}

const mapStateToProps = (state: IReduxState, props: RouterProps) => ({
  accessToken: state.authentication.accessToken,
  embeddedLayout: state.app.embeddedLayout,
  conversation: state.serviceCenter.currentConversation,
  ticket: find(state.serviceCenter.tickets.items, {
    id: props.match.params.id,
  }) as ITicket,
  user: state.authentication.user,
})

const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  goBack: () => dispatch(push('/service-center')),
  fetchTicket: (id: string) => dispatch(ServiceCenterActions.fetchTicket(id)),
  fetchConversationMessages: (ticket: ITicket) =>
    get(ticket, '_embedded.conversations[0].id') &&
    dispatch(
      ServiceCenterActions.fetchConversationMessages(
        ticket._embedded.conversations[0].id,
      ),
    ),
  markMessageAsRead: (commentId: string) =>
    dispatch(ServiceCenterActions.markMessageAsRead(commentId)),
  postConversationMessage: ({
    conversationId,
    content,
    files,
  }: {
    conversationId: string
    content: string
    files?: ReadonlyArray<File>
  }) =>
    dispatch(
      ServiceCenterActions.postConversationMessage({
        conversationId,
        content,
        files,
      }),
    ),
  redirect: () => dispatch(push('/service-center')),
  resetConversationMessages: () =>
    dispatch(ServiceCenterActions.resetConversationMessages()),
  updateTicket: (id: string, data: any) =>
    dispatch(ServiceCenterActions.updateTicket(id, data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMixpanel(injectIntl(ServiceCenterDetail)))
