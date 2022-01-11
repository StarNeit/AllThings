import React from 'react'
import { css } from 'glamor'
import { PostContent, PostFooter, PostForm } from './'
import PostAddImageButton from 'components/AddImageButton'
import SendButton from 'components/SendButton'
import CommentBox from 'components/CommentBox'
import FileChooser from 'components/FileChooser'
import { View } from '@allthings/elements'
import RemovableImage from 'components/RemovableImage'
import { injectIntl, defineMessages } from 'react-intl'
import { FileWithPath } from 'react-dropzone'

import VisibilitySelector, {
  IVisibilityScopeProps,
} from 'components/Pinboard/VisibilityScope/VisibilitySelector'
import {
  clearPreviews,
  enhanceWithPreviews,
  FileWithPreview,
} from 'utils/filePreviews'

const messages = defineMessages({
  newPostPlaceholder: {
    id: 'pinboard.new-message-placeholder',
    description: 'Placeholder text for new posts',
    defaultMessage: "What's on you mind?",
  },
  addImageButtonLabel: {
    id: 'pinboard.add-image-button-label',
    description: 'Button label for the add image button',
    defaultMessage: 'Add image',
  },
  sendButtonLabel: {
    id: 'pinboard.send-button-label',
    description: 'Button label for the send button',
    defaultMessage: 'Send',
  },
})

const styles = {
  uploadWrapper: css({
    marginTop: 10,
  }),
  uploadImage: css({
    width: 60,
    marginRight: 10,
    marginBottom: 10,
  }),
}

interface IProps {
  autoFocus: boolean
  goToOwnProfile: (id: string) => void
  isSending: boolean
  onSend: (
    text: string,
    files: readonly FileWithPath[],
    channels: readonly string[],
  ) => void
  onRef?: (ref: HTMLElement) => void
  profileImage: string
  user: Partial<IUser>
  visibilityScopes: ReadonlyArray<IVisibilityScopeProps>
}

interface IState {
  channel: unknown
  files: readonly FileWithPreview[]
  scopeId: string
  text: string
}

class FeedForm extends React.PureComponent<IProps & InjectedIntlProps, IState> {
  state: IState = {
    channel: null,
    scopeId: this.getInitialScopeId(),
    files: [],
    text: '',
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.isSending === false && prevProps.isSending === true) {
      this.setState({ files: [], text: '' })
    }

    if (
      this.props.visibilityScopes.length !== 0 &&
      prevProps.visibilityScopes.length === 0
    ) {
      this.setState({ scopeId: this.getInitialScopeId(this.props) })
    }
  }

  componentWillUnmount() {
    clearPreviews(this.state.files)
  }

  getInitialScopeId(props = this.props) {
    return props.visibilityScopes.length > 0 && props.visibilityScopes[0].id
  }

  handleChoose = (droppedFiles: readonly FileWithPath[]) =>
    this.setState(({ files }) => ({
      files: files.concat(enhanceWithPreviews(droppedFiles)),
    }))
  handleScopeSelect = (scopeId: string) => this.setState({ scopeId })
  removeFile = (index: number) =>
    this.setState(({ files }) => ({
      files: files.filter((_, i) => i !== index),
    }))

  handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    this.setState({ text: e.target.value })

  handleSend = () => {
    const trimmedPostText = this.state.text && this.state.text.trim()
    if (trimmedPostText) {
      const { channels } = this.props.visibilityScopes.find(
        scope => scope.id === this.state.scopeId,
      )

      this.props.onSend(trimmedPostText, this.state.files, channels)
    } else {
      this.setState({ text: trimmedPostText })
    }
  }

  renderFiles() {
    return this.state.files.map((file, index) => (
      <View
        key={file.preview}
        {...styles.uploadImage}
        data-e2e={`file-upload-image-${index}`}
      >
        <RemovableImage
          id={index}
          data-e2e={`file-upload-delete-button-${index}`}
          size={60}
          image={file.preview}
          onRemove={this.removeFile}
        />
      </View>
    ))
  }

  render() {
    const { formatMessage } = this.props.intl
    const placeholder = formatMessage(messages.newPostPlaceholder)

    return (
      <PostForm id="create">
        <FileChooser
          multiple
          accept="image/jpeg,image/png"
          onChoose={this.handleChoose}
        >
          {openFileDialog => (
            <View>
              <PostContent>
                <CommentBox
                  autoFocus={this.props.autoFocus}
                  goToOwnProfile={this.props.goToOwnProfile}
                  location="pinboard"
                  onChange={this.handleChange}
                  onRef={this.props.onRef}
                  placeholder={placeholder}
                  profileImage={this.props.profileImage}
                  user={this.props.user}
                  value={this.state.text}
                />
                {this.state.scopeId && (
                  <VisibilitySelector
                    selectedScopeId={this.state.scopeId}
                    onSelect={this.handleScopeSelect}
                    visibilityScopes={this.props.visibilityScopes}
                  />
                )}
                <View direction="row" wrap="wrap" {...styles.uploadWrapper}>
                  {this.renderFiles()}
                </View>
              </PostContent>
              <PostFooter>
                <PostAddImageButton
                  text={formatMessage(messages.addImageButtonLabel)}
                  onClick={openFileDialog}
                />
                <SendButton
                  active={this.state.text !== ''}
                  location="pinboard"
                  onClick={this.handleSend}
                  sending={this.props.isSending}
                  text={formatMessage(messages.sendButtonLabel)}
                />
              </PostFooter>
            </View>
          )}
        </FileChooser>
      </PostForm>
    )
  }
}

export default injectIntl(FeedForm)
