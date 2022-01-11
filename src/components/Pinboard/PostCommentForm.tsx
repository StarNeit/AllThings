import React from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import { PostForm, PostContent, PostFooter } from './'
import SendButton from 'components/SendButton'
import CommentBox from 'components/CommentBox'

const messages = defineMessages({
  commentInputPlaceholder: {
    id: 'pinboard-post-detail.comment-input-placeholder',
    description:
      'The placeholder of the comment input of the detail view of pinboard.',
    defaultMessage: 'Write a comment',
  },
  commentSend: {
    id: 'pinboard-post-detail.comment-send',
    description: 'The label of the "send a commment" button',
    defaultMessage: 'Send',
  },
})

interface IProps {
  goToOwnProfile: (id: string) => void
  location?: string
  profileImage: string
  onCommentSend: (value: string) => void
  onInput: (input: HTMLInputElement) => void
  sending: boolean
  user: Partial<IUser>
}

class PostCommentForm extends React.PureComponent<IProps & InjectedIntlProps> {
  state = {
    value: '',
  }

  handleClick = () => {
    this.props.onCommentSend(this.state.value)
    setTimeout(() => this.setState(() => ({ value: '' })), 250)
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState(() => ({ value }))
  }

  render() {
    const {
      intl,
      onInput,
      profileImage,
      onCommentSend,
      sending,
      goToOwnProfile,
      user,
      location,
      ...restProps
    } = this.props
    return (
      <PostForm {...restProps}>
        <PostContent>
          <CommentBox
            profileImage={profileImage}
            placeholder={intl.formatMessage(messages.commentInputPlaceholder)}
            value={this.state.value}
            onChange={this.handleChange}
            onRef={onInput}
            goToOwnProfile={this.props.goToOwnProfile}
            user={this.props.user}
            location="pinboard-detail"
          />
        </PostContent>
        <PostFooter>
          <SendButton
            active={this.state.value !== ''}
            location="detail"
            onClick={this.handleClick}
            sending={this.props.sending}
            text={intl.formatMessage(messages.commentSend)}
          />
        </PostFooter>
      </PostForm>
    )
  }
}

export default injectIntl(PostCommentForm, { forwardRef: true })
