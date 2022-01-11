import React, { PureComponent } from 'react'
import {
  Post,
  PostContent,
  PostText,
  PostSpacer,
  PostAuthorCompact,
  PostOverlayMenu,
  PostReporter,
} from 'components/Pinboard'
import get from 'lodash-es/get'
import { Text } from '@allthings/elements'
import { ColorPalette } from '@allthings/colors'
import { defineMessages, injectIntl, MessageDescriptor } from 'react-intl'
import { css } from 'glamor'
import Overlay from 'components/Overlay'
import { Gateway } from 'react-gateway'
import NoOp from 'utils/noop'
import Theme from '@allthings/elements/Theme/Theme'

const i18n = defineMessages({
  writeButtonLabel: {
    id: 'pinboard.write-post-button-label',
    description: 'Button label for the write post button',
    defaultMessage: 'write',
  },
  reportPost: {
    id: 'pinboard-post.report',
    description: 'Text for button that reports a post',
    defaultMessage: 'Report',
  },
})

interface IProps {
  commentId: string
  date: string
  handleReport?: (_: unknown) => any
  index: number // e2e-tests
  onAuthorClick: OnClick
  reportCommentStatus?: string
  text: string
  user: {
    deleted: boolean
    id: string
    username: string
    _embedded: {
      profileImage: object
    }
  }
  viewerId: string
}

interface IState {
  reportMode: boolean
  showMenu: boolean
}

class PostComment extends PureComponent<IProps & InjectedIntlProps, IState> {
  static defaultProps = {
    handleReport: NoOp,
  }

  state = {
    showMenu: false,
    reportMode: false,
  }

  closeReport = () => this.setState({ showMenu: false, reportMode: false })

  formatMessage = (message: MessageDescriptor, options = {}) =>
    this.props.intl.formatMessage(message, options)

  handleAuthorClick =
    !this.props.user.deleted &&
    (() => this.props.onAuthorClick(this.props.user.id))

  handleReportMode = () => this.setState({ showMenu: false, reportMode: true })

  toggleMenu = () => this.setState(({ showMenu }) => ({ showMenu: !showMenu }))

  renderOthersCommentMenuContent = () => {
    const { index } = this.props
    return (
      <PostOverlayMenu onRequestClose={this.toggleMenu}>
        <Text
          size="m"
          key="report"
          color={ColorPalette.text.primary}
          onClick={this.handleReportMode}
          data-e2e={`pinboard-new-post-${
            typeof index !== 'undefined' ? index : 'detail'
          }-actions-report`}
        >
          {this.formatMessage(i18n.reportPost)}
        </Text>
      </PostOverlayMenu>
    )
  }

  isViewersComment = () => this.props.viewerId === this.props.user.id

  renderReporter = (index: number, commentId: string) => (
    <Theme>
      {({ theme }) => (
        <Gateway into="root">
          <Overlay
            direction="row"
            alignH="center"
            alignV="center"
            {...css({ padding: 10 })}
            theme={theme}
          >
            <PostReporter
              index={index}
              onRequestClose={this.closeReport}
              onReport={this.props.handleReport}
              reportPostStatus={this.props.reportCommentStatus}
              postId={commentId}
            />
          </Overlay>
        </Gateway>
      )}
    </Theme>
  )

  renderMenu = () => {
    if (!this.state.showMenu || this.isViewersComment()) {
      return null
    }

    return this.isViewersComment()
      ? // @TODO: renderOwnCommentMenuContent method doesn't exist... thx TS!
        null // this.renderOwnCommentMenuContent()
      : this.renderOthersCommentMenuContent()
  }

  renderText = (text: string, index: number) => (
    <PostText
      autoBreak={true}
      data-e2e={`pinboard-detail-new-comment-text-${index}`}
    >
      {text}
    </PostText>
  )

  render() {
    const { text, date, user, index, commentId } = this.props
    return (
      <Post data-e2e={`pinboard-comment-${index}`}>
        <PostContent>
          <PostAuthorCompact
            index={index}
            onAuthorClick={this.handleAuthorClick}
            author={{
              name: user.username,
              deleted: user.deleted,
              profileImage: get(
                user,
                '_embedded.profileImage.files.medium.url',
              ),
            }}
            showMoreIcon={!this.isViewersComment()}
            dateText={date}
            renderMenu={this.renderMenu}
            onClickMore={this.toggleMenu}
          />
          {this.state.reportMode
            ? this.renderReporter(index, commentId)
            : this.renderText(text, index)}
        </PostContent>
        <PostSpacer height={1} background={'#e7ecee'} />
      </Post>
    )
  }
}

export default injectIntl(PostComment, { forwardRef: true })
