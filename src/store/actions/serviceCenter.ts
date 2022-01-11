import createActions from 'store/createActions'
import { ConversationMessageType } from 'enums'

export interface IFetchTicketsParams extends IPaginationLinks {
  readonly reset?: boolean
}

export const uploadFile = <Response = any>(api: InjectedSDK, file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api<Response>({
    timeout: false,
    method: 'POST',
    path: 'api/v1/files',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    entity: form,
  })
}

export default createActions({
  addTicketToList(ticket) {
    return { payload: ticket }
  },

  fetchTicket(id) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })
      dispatch(this.resetConversationMessages())
      const ticket = await api({ path: `/api/v1/tickets/${id}` })

      if (ticket.status.code === 200) {
        await dispatch(
          await this.fetchConversationMessages(
            ticket.entity._embedded.conversations[0].id,
          ),
        )

        dispatch({ status: 'ok', payload: ticket.entity })
        return
      }
    }
  },

  resetConversationMessages() {
    return { payload: {} }
  },

  fetchConversationMessages(id) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })
      const conversations = await api({
        path: `/api/v1/conversations/${id}/messages`,
        params: {
          limit: -1,
        },
      })

      if (conversations.status.code === 200) {
        dispatch({
          status: 'ok',
          payload: conversations.entity,
          meta: { id },
        })
        return
      }
    }
  },

  postConversationMessage({
    conversationId,
    content,
    files,
  }: {
    conversationId: string
    content: string
    files?: ReadonlyArray<File>
  }) {
    return async (dispatch, api) => {
      dispatch({ status: 'pending' })

      const fileUploads =
        files &&
        files.length &&
        (await Promise.all(files.map(file => uploadFile(api, file))))

      const message = await api({
        method: 'POST',
        path: `/api/v1/conversations/${conversationId}/messages`,
        entity: {
          // Required by the API.
          type: files
            ? ConversationMessageType.FILE
            : ConversationMessageType.TEXT,
          content: {
            // Only append files if present!
            ...(files && files.length
              ? {
                  ...(content && { description: content }),
                  files: fileUploads
                    .map(({ entity: { id } }) => id)
                    // Filter out the failed uploads.
                    .filter(Boolean),
                }
              : { content }),
          },
        },
      })

      if (message.status.code === 201) {
        dispatch({
          status: 'ok',
          payload: message.entity,
          meta: { id: conversationId },
        })
        return
      }
    }
  },

  updateTicket(id, data) {
    return async (dispatch, api) => {
      const ticket = await api({
        method: 'PATCH',
        path: `/api/v1/tickets/${id}`,
        entity: data,
      })

      if (ticket.status.code === 200) {
        dispatch({ status: 'ok', payload: ticket.entity })
      }
    }
  },

  fetchTicketCategories() {
    return async (dispatch, api, state) => {
      const { appID } = state.app.config
      const categories = await api({
        path: `/api/v1/apps/${appID}/vocabularies/ticket-categories/terms`,
        params: {
          limit: -1,
        },
      })

      if (categories.status.code === 200) {
        dispatch({ status: 'ok', payload: categories.entity })
      }
    }
  },

  markMessageAsRead(id) {
    return async (_, api) => {
      await api({
        method: 'PATCH',
        path: `api/v1/messages/${id}`,
        entity: { read: true },
      })
    }
  },
})
