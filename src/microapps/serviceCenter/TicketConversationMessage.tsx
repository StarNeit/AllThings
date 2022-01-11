import { alpha, ColorPalette } from '@allthings/colors'
import { ConversationMessageType } from 'enums'
import { css } from 'glamor'
import { dateFromISO8601 } from 'utils/date'
import {
  IExtendedConversationMessage,
  LAST_CONVERSATION_MESSAGE,
  MARGIN,
  MESSAGE_MAX_WIDTH,
} from '.'
import { ChatBubble, Icon, Text, View } from '@allthings/elements'
import FileBubble from './FileBubble'
import get from 'lodash-es/get'
import React, { useEffect } from 'react'
import RectangleFittedImage from 'components/RectangleFittedImage'
import TicketBubbleContent from './TicketBubbleContent'
import { injectIntl } from 'react-intl'
import formatBytes from 'utils/formatBytes'

const PDF_TYPE = 'application/pdf'

interface IProps {
  files: ReadonlyArray<IFile>
  handleOpenGallery: (id: string) => (event: React.SyntheticEvent) => void
  index: number
  isLastMessagesSection: boolean
  item: IExtendedConversationMessage
  items: ReadonlyArray<IExtendedConversationMessage>
  markMessageAsRead: (id: string) => void
  ticket: ITicket
  user: Partial<IUser>
}

const TicketConversationMessage = ({
  files,
  handleOpenGallery,
  index,
  intl: { formatTime },
  isLastMessagesSection,
  item,
  items,
  markMessageAsRead,
  ticket: {
    _embedded: { createdBy: ticketCreatedBy },
  },
  user: { id: userId },
}: IProps & InjectedIntlProps) => {
  const isLastMessage = items.length === index + 1 && isLastMessagesSection
  const id = {
    id: isLastMessage ? LAST_CONVERSATION_MESSAGE : `${item.id}-${index}`,
  }
  const isByCurrentUser =
    (item._embedded && item._embedded.createdBy
      ? item._embedded.createdBy.id
      : ticketCreatedBy.id) === userId

  // Use a custom bubble for the injected ticket's files.
  if (!item.hasOwnProperty('type') && !item.hasOwnProperty('categoryName')) {
    const filesAreFromCurrentUser = items[0]._embedded.createdBy.id === userId

    return (
      <View
        alignH={filesAreFromCurrentUser ? 'end' : 'start'}
        direction="row"
        key={item.originalFilename}
      >
        <View
          data-e2e={`ticket-conversation-file-${item.originalFilename}`}
          flex="grow"
          {...css({ maxWidth: MESSAGE_MAX_WIDTH })}
          {...id}
        >
          <FileBubble
            fileId={item.id}
            files={files}
            isByCurrentUser={filesAreFromCurrentUser}
            openGallery={handleOpenGallery}
          />
        </View>
      </View>
    )
  }

  useEffect(() => {
    if (!item.read && !isByCurrentUser) {
      markMessageAsRead(item.id)
    }
  }, [])

  return (
    <View
      alignH={isByCurrentUser ? 'end' : 'start'}
      direction="row"
      key={item.id}
    >
      <View
        flex="grow"
        {...id}
        {...(!item.hasOwnProperty('categoryName') && {
          'data-e2e-message':
            item.type === ConversationMessageType.FILE
              ? item.content.description !== null
                ? item.content.description
                : item.content._embedded.files &&
                  item.content._embedded.files[0] &&
                  item.content._embedded.files[0].originalFilename
              : item.content.content,
        })}
        {...css({
          ...(item.type === ConversationMessageType.FILE && {
            cursor: 'pointer',
          }),
          maxWidth: MESSAGE_MAX_WIDTH,
        })}
      >
        <ChatBubble
          background={
            isByCurrentUser
              ? alpha(ColorPalette.lightBlue, 0.2)
              : ColorPalette.white
          }
          date={formatTime(dateFromISO8601(item.createdAt))}
          direction={isByCurrentUser ? 'right' : 'left'}
          text={
            // First case: the main ticket.
            item.hasOwnProperty('categoryName') ? (
              <TicketBubbleContent item={item} />
            ) : // Second case: a message.
            item.type === ConversationMessageType.FILE ? (
              // File message.
              item.content.description !== null ? (
                item.content.description
              ) : // Display the first file in the bubble itself.
              item.content._embedded.files &&
                item.content._embedded.files[0] &&
                item.content._embedded.files[0].type === PDF_TYPE ? (
                <View
                  alignH="center"
                  alignV="center"
                  direction="column"
                  onClick={() =>
                    window.open(
                      item.content._embedded.files[0].files.original.url,
                      '_blank',
                    )
                  }
                  {...css({
                    background: alpha(ColorPalette.grey, 0.6),
                    borderRadius: 6,
                    padding: MARGIN,
                    whiteSpace: 'normal',
                  })}
                >
                  <Icon
                    color={ColorPalette.white}
                    name="file-document"
                    size="l"
                  />
                  <Text align="center" size="s" {...css({ marginTop: MARGIN })}>
                    {item.content._embedded.files[0].name}
                  </Text>
                  <Text
                    color={alpha(ColorPalette.lightBlackIntense, 0.5)}
                    size="s"
                  >
                    {formatBytes(
                      item.content._embedded.files[0].files.original.size,
                    )}
                  </Text>
                </View>
              ) : (
                <RectangleFittedImage
                  image={item.content._embedded.files[0].files.medium.url}
                  onClick={handleOpenGallery(
                    item.content._embedded.files[0].id,
                  )}
                  {...css({ borderRadius: 6 })}
                />
              )
            ) : (
              // Text message
              item.content.content
            )
          }
          userImage={get(
            item,
            '_embedded.createdBy._embedded.profileImage._embedded.files.thumb.url',
          )}
          userName={item._embedded.createdBy.username}
        />
        {item.type === ConversationMessageType.FILE &&
          item.content._embedded.files
            // Skip the first one if there's no description as it's
            // already displayed in the ChatBubble.
            .slice(item.content.description === null ? 1 : 0)
            .map(({ id: fileId }) => (
              <FileBubble
                fileId={fileId}
                files={item.content._embedded.files}
                isByCurrentUser={isByCurrentUser}
                key={fileId}
                openGallery={handleOpenGallery}
              />
            ))}
      </View>
    </View>
  )
}

export default injectIntl(TicketConversationMessage)
