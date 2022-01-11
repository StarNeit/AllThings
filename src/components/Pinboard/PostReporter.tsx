import React from 'react'
import { css } from 'glamor'
import { between } from 'utils/math'
import { defineMessages, WrappedComponentProps, injectIntl } from 'react-intl'
import { ColorPalette } from '@allthings/colors'
import { Text, View, SwitchList, ListSpinner } from '@allthings/elements'

import PostButton from 'components/FlexButton'
import PostFooter from './PostFooter'

const styles = {
  wrapper: css({
    background: '#fff',
    maxWidth: 880,
  }),
  innerWrapper: css({ padding: 15 }),
  whyReportPost: css({
    marginBottom: '30px',
    marginTop: '15px',
  }),
}

const i18n = defineMessages({
  abortText: {
    id: 'pinboard.edit-post-abort-button-label-mod',
    description: 'Button label for the aborting of editing post',
    defaultMessage: 'Cancel',
  },
  reportPost: {
    id: 'pinboard-post.report',
    description: 'Text for button that reports a post',
    defaultMessage: 'Report',
  },
  reportSpam: {
    id: 'pinboard.report-post-spam',
    description: 'reporting a post as spam',
    defaultMessage: 'Spam',
  },
  reportPrivateContent: {
    id: 'pinboard.report-post-private',
    description: 'reporting a post as private content',
    defaultMessage: 'Private content',
  },
  reportOffensive: {
    id: 'pinboard.report-post-offensive',
    description: 'reporting a post as offensive',
    defaultMessage: 'Offensive',
  },
  whyReportPost: {
    id: 'pinboard.ask-report-reason',
    description: 'Asking why the user wants to report',
    defaultMessage: 'Why would you like to report this entry?',
  },
  postAlreadyReported: {
    id: 'pinboard.report-feedback-already-reported',
    description: 'feedback for reporting post is already reported',
    defaultMessage: 'You have already reported this entry earlier.',
  },
  couldNotReportPost: {
    id: 'pinboard.report-feedback-couldnt-report',
    description: 'feedback for reporting post is reporting failed',
    defaultMessage: 'Could not report this entry. Please try again later.',
  },
  postReportedSuccessfully: {
    id: 'pinboard.report-feedback-success',
    description: 'feedback for reporting post is successful',
    defaultMessage: 'Entry reported successfully.',
  },
  okText: {
    id: 'pinboard.report-feedback-ok-button-text',
    description: 'finishing a report',
    defaultMessage: 'Ok',
  },
})

interface IProps {
  children?: React.ReactNode
  index: number
  initialText?: string
  onReport: (id: string, reason: string) => void
  onRequestClose?: () => void
  postId: string
  reportPostStatus?: string
}

class PostReporter extends React.Component<IProps & WrappedComponentProps> {
  elementRef = React.createRef<HTMLDivElement>()

  state = {
    reportReason: 'spam',
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick, true)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, true)
  }

  handleClick = (e: MouseEvent) => {
    const {
      bottom,
      left,
      right,
      top,
    } = this.elementRef.current.getBoundingClientRect()
    if (!between(e.clientY, top, bottom) || !between(e.clientX, left, right)) {
      e.stopPropagation()
      this.triggerClose()
      return false
    }
    return false
  }

  handleReportReasonChange = (optionKey: string) =>
    this.setState({ reportReason: optionKey })

  triggerClose = () => {
    this.props.onRequestClose && this.props.onRequestClose()
  }

  handleReport = () =>
    this.props.onReport(this.props.postId, this.state.reportReason)

  renderReporterContent = (index: number) => {
    const { formatMessage } = this.props.intl
    const { reportPostStatus } = this.props
    if (!reportPostStatus) {
      return (
        <View {...styles.innerWrapper}>
          <Text
            align="center"
            color={ColorPalette.text.primary}
            {...styles.whyReportPost}
          >
            {formatMessage(i18n.whyReportPost)}
          </Text>
          <SwitchList
            disabled={false}
            onChange={this.handleReportReasonChange}
            options={{
              spam: formatMessage(i18n.reportSpam),
              private: formatMessage(i18n.reportPrivateContent),
              offensive: formatMessage(i18n.reportOffensive),
            }}
            initialActive={this.state.reportReason}
            showSpinner={false}
          />
        </View>
      )
    } else if (reportPostStatus === 'alreadyReported') {
      return (
        <View {...styles.innerWrapper}>
          <Text
            align="center"
            color={ColorPalette.text.primary}
            {...styles.whyReportPost}
          >
            {formatMessage(i18n.postAlreadyReported)}
          </Text>
        </View>
      )
    } else if (reportPostStatus === 'failed') {
      return (
        <View {...styles.innerWrapper}>
          <Text
            align="center"
            color={ColorPalette.text.primary}
            {...styles.whyReportPost}
          >
            {formatMessage(i18n.couldNotReportPost)}
          </Text>
        </View>
      )
    } else if (reportPostStatus === 'pending') {
      return (
        <View {...styles.innerWrapper}>
          <ListSpinner />
        </View>
      )
    } else {
      return (
        <View {...styles.innerWrapper}>
          <Text
            align="center"
            color={ColorPalette.text.primary}
            {...styles.whyReportPost}
            data-e2e={`pinboard-edit-${
              typeof index !== 'undefined' ? index : 'detail'
            }-post-reported-successfully`}
          >
            {formatMessage(i18n.postReportedSuccessfully)}
          </Text>
        </View>
      )
    }
  }

  render() {
    const { index, reportPostStatus } = this.props
    const { formatMessage } = this.props.intl

    return (
      <View
        ref={this.elementRef}
        {...styles.wrapper}
        flex="grow"
        direction="column"
      >
        {this.renderReporterContent(index)}
        <PostFooter>
          <PostButton
            onClick={this.triggerClose}
            data-e2e={`pinboard-edit-${
              typeof index !== 'undefined' ? index : 'detail'
            }-cancel`}
          >
            <Text size="m" color={ColorPalette.text.secondary}>
              {formatMessage(i18n[reportPostStatus ? 'okText' : 'abortText'])}
            </Text>
          </PostButton>
          {!reportPostStatus && (
            <PostButton
              onClick={this.handleReport}
              data-e2e={`pinboard-edit-${
                typeof index !== 'undefined' ? index : 'detail'
              }-report`}
            >
              <Text size="m" color={ColorPalette.text.secondary}>
                {formatMessage(i18n.reportPost)}
              </Text>
            </PostButton>
          )}
        </PostFooter>
      </View>
    )
  }
}

export default injectIntl(PostReporter)
