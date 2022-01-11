import React from 'react'
import { Provider } from 'react-redux'
import PostComment from './PostComment'
import { PostText } from 'components/Pinboard'

const store = global.mockStore({
  authentication: {
    accessToken: 'abcd1234',
  },
  app: {
    embeddedLayout: false,
  },
})

describe('PostComment', () => {
  it('Render Post Comment with new line', async () => {
    const content = global.mountIntl(
      <Provider store={store}>
        <PostComment
          text={'cool comment\n text'}
          date={new Date().toString()}
          onAuthorClick={jest.fn()}
          user={'_embedded.user' as any}
          index={1}
          viewerId={'user.id'}
          reportCommentStatus={''}
          handleReport={jest.fn()}
          commentId={'id'}
        />
      </Provider>,
    )

    expect(content.find(PostText).props()).toMatchObject({ autoBreak: true })
  })
})
