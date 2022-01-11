import { IExtendedConversationMessage } from '.'
import React, { Fragment } from 'react'
import { injectIntl } from 'react-intl'
import TicketConversationMessage from './TicketConversationMessage'

interface IProps {
  files: ReadonlyArray<IFile>
  handleOpenGallery: (id: string) => (event: React.SyntheticEvent) => void
  isLastMessagesSection: boolean
  items: ReadonlyArray<IExtendedConversationMessage>
  markMessageAsRead: (id: string) => void
  ticket: ITicket
  user: Partial<IUser>
}

const TicketConversationMessages = ({
  items,
  ...props
}: IProps & InjectedIntlProps) => (
  <Fragment>
    {items.map((item: IExtendedConversationMessage, index) => (
      <TicketConversationMessage
        key={index}
        items={items}
        item={item}
        index={index}
        {...props}
      />
    ))}
  </Fragment>
)

export default injectIntl(TicketConversationMessages)
