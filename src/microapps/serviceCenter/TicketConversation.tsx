import React, { Fragment } from 'react'
import { MARGIN } from '.'
import { ListSpinner, Pill, View } from '@allthings/elements'
import { alpha, ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import { dateFromISO8601, isYesterday, isToday } from 'utils/date'
import FlipMove from 'react-flip-move'
import { IConversation } from './ServiceCenterDetail'
import TicketConversationMessages from './TicketConversationMessages'
import { injectIntl } from 'react-intl'
import { ConversationMessageType } from 'enums'
import TicketEmptyMessage from './TicketEmptyMessage'

const animations: FlipMoveAnimations = {
  commentsAppear: {
    from: { opacity: '0', transform: 'translateX(-100%)' },
    to: { opacity: '1', transform: 'translateX(0%)' },
  },
  commentsLeave: 'fade',
}

interface IProps {
  conversation: IConversation
  handleOpenGallery: (id: string) => (event: React.SyntheticEvent) => void
  markMessageAsRead: (id: string) => void
  user: Partial<IUser>
  ticket: ITicket
}

const TicketConversation = ({
  conversation,
  handleOpenGallery,
  intl: { formatDate },
  markMessageAsRead,
  ticket,
  user,
}: IProps & InjectedIntlProps) => {
  if (conversation.loading || !ticket) {
    return <ListSpinner {...css({ margin: MARGIN })} />
  }

  if (!conversation.items.length) {
    return <TicketEmptyMessage />
  }

  const [
    {
      _embedded: {
        category: { id: categoryId, name: categoryName },
        files,
      },
      createdAt: ticketCreatedAt,
      id: ticketId,
      title,
    },
    { locale },
  ] = [ticket, user]

  // Since the ticket's description is replicated as the first message, use it
  // instead of the description.
  const [firstItem, ...conversationItems] = conversation.items

  const feed = [
    // Use the ticket as a first visible ChatBubble.
    {
      _embedded: {
        // Weird logic here: in order to know who is the real creator of the
        // ticket, we have to check the first conversation message.
        createdBy: firstItem._embedded.createdBy,
      },
      categoryId,
      categoryName: categoryName[locale],
      // However use the first message content instead of the
      // of the ticket's description.
      content:
        firstItem.type === ConversationMessageType.TEXT
          ? firstItem.content.content
          : firstItem.content.description,
      createdAt: ticketCreatedAt,
      id: ticketId,
      read: true,
      title,
    },
    // Inject the ticket's files too.
    ...files.map(({ files: innerFiles, id, originalFilename }) => ({
      createdAt: ticketCreatedAt,
      id,
      originalFilename,
      url: innerFiles && innerFiles.medium && innerFiles.medium.url,
    })),
    ...conversationItems,
  ].reduce(
    (acc, item) => {
      const date = dateFromISO8601(item.createdAt)

      if (isYesterday(date)) {
        return { ...acc, yesterday: [...acc.yesterday, item] }
      }

      if (isToday(date)) {
        return { ...acc, today: [...acc.today, item] }
      }

      // Default
      // split('T').shift() => fix for safari RangeError: date value is not finite in DateTimeFormat.format()
      const dateKey = formatDate(item.createdAt.split('T').shift())

      return {
        ...acc,
        [dateKey]: acc[dateKey] ? [...acc[dateKey], item] : [item],
      }
    },
    { today: [], yesterday: [] },
  )

  return (
    <View>
      <FlipMove
        duration={500}
        enterAnimation={animations.commentsAppear}
        leaveAnimation={animations.commentsLeave}
      >
        {Object.entries(feed)
          .reverse()
          // Drop the eventual empty sections (yesterday / today).
          .filter(([_, items]) => items.length)
          .map(([date, items], index, entries) => (
            <Fragment key={date}>
              <View
                alignH="center"
                alignV="center"
                direction="row"
                {...css({ marginTop: MARGIN })}
              >
                <Pill
                  color={alpha(ColorPalette.lightGreyIntense, 0.6)}
                  label={date}
                  {...css({ marginBottom: MARGIN })}
                />
              </View>
              <TicketConversationMessages
                files={files}
                handleOpenGallery={handleOpenGallery}
                isLastMessagesSection={index + 1 === entries.length}
                items={items}
                markMessageAsRead={markMessageAsRead}
                ticket={ticket}
                user={user}
              />
            </Fragment>
          ))}
      </FlipMove>
    </View>
  )
}

export default injectIntl(TicketConversation)
