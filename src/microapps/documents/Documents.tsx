import React from 'react'
import DocumentsActions from 'store/actions/documents'
import { connect } from 'react-redux'
import { AppTitle } from 'containers/App'
import Microapp from 'components/Microapp'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import LoadingSkeleton from './LoadingSkeleton'
import Folders from './Folders'
import Files from './Files'
import { ColorPalette } from '@allthings/colors'
import { formatListItem } from 'utils/formatStrings'
import AndroidCloudIcon from '@allthings/react-ionicons/lib/AndroidCloudIcon'
import { List, View, Text, SimpleLayout } from '@allthings/elements'
import { IDirectory } from '.'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from '../../enums'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'
import { css } from 'glamor'
import { setSeenByMeDeep } from 'utils/documents'

interface IProps {
  config: MicroAppProps
  directory: IDirectory
  loading: boolean
  locale: string
}

interface IState {
  currentFolderLabel: string
  parent: IDirectory
}

class Documents extends React.PureComponent<IProps & DispatchProp, IState> {
  state: IState = {
    currentFolderLabel: '',
    parent: { files: null, folders: null },
  }

  componentDidMount() {
    this.props.dispatch(DocumentsActions.fetchDocuments())
  }

  changeDir = (dir: IDirectory) => {
    this.props.dispatch(DocumentsActions.changeDir(dir))
    this.setState({
      parent: dir.parent || {},
      currentFolderLabel: dir.name ? formatListItem(dir.name, false) : '',
    })
  }

  markRead = (fileId: string) => {
    this.props.dispatch(DocumentsActions.markRead(fileId))

    // due to non-obvious architectural solution, we need to update redux state and local state
    if (this.state.currentFolderLabel) {
      this.setState(({ parent }) => ({
        parent: setSeenByMeDeep(parent, fileId),
      }))
    }
  }

  renderTitleBar = () =>
    this.state.parent.folders ? (
      <GenericBackTitleBar onBack={() => this.changeDir(this.state.parent)} />
    ) : (
      <View {...css({ marginBottom: 15 })}>
        <MicroappBigTitleBar type={MicroApps.DOCUMENTS} />
      </View>
    )

  renderCurrentFolderLabel = () =>
    this.state.currentFolderLabel && (
      <Text
        className="contentList-title"
        data-e2e="documents-title"
        data-e2e-title={this.state.currentFolderLabel}
        style={{ display: 'block' }}
      >
        {this.state.currentFolderLabel}
      </Text>
    )

  renderNoFilesSharedYet = () => (
    <View
      direction="row"
      alignH="center"
      alignV="center"
      data-e2e="documents-no-items"
    >
      <View
        direction="column"
        style={{ maxWidth: 300, textAlign: 'center', margin: '10%' }}
      >
        <AndroidCloudIcon
          style={{
            width: 160,
            height: 160,
            fill: ColorPalette.lightGrey,
            margin: '0 auto',
          }}
        />
        <span
          style={{
            color: ColorPalette.text.primary,
            fontSize: 20,
            marginBottom: 30,
          }}
        >
          <FormattedMessage
            id="documents-list.no-items"
            description="This message is displayed if there are no documents for the current user."
            defaultMessage="No files have been shared with you yet."
          />
        </span>
        <span style={{ color: ColorPalette.lightGreyIntense }}>
          <FormattedHTMLMessage
            id="documents-list.no-items-hint"
            description="Hint to drop a message in service center if no documents are defined."
            defaultMessage="You think something should be displayed here?<br/>Leave us a message via the <a href='/service-center'>service-center</a>."
          />
        </span>
      </View>
    </View>
  )

  renderFoldersAndFiles = (directory: IDirectory) => (
    <div className="contentList">
      {this.renderCurrentFolderLabel()}
      <List data-e2e="documents-items">
        <Folders {...directory} onClick={this.changeDir} />
        <Files {...directory} onFileSeen={this.markRead} />
      </List>
    </div>
  )

  renderSkeleton = () => <LoadingSkeleton titleHeight={0} rows={6} />

  renderContent() {
    const { directory, loading } = this.props
    const { files, folders } = directory
    const filesDontExist = files.length === 0 && folders.length === 0

    return filesDontExist
      ? loading
        ? this.renderSkeleton()
        : this.renderNoFilesSharedYet()
      : this.renderFoldersAndFiles(directory)
  }

  render() {
    const app = this.props.config

    return (
      <Microapp>
        <SimpleLayout padded={'horizontal'}>
          <AppTitle>{app.label}</AppTitle>
          {this.renderTitleBar()}
          <SimpleLayout>{this.renderContent()}</SimpleLayout>
        </SimpleLayout>
      </Microapp>
    )
  }
}

export default connect(({ app, documents }: IReduxState) => ({
  directory: documents.directory,
  loading: documents.loading,
  locale: app.locale,
}))(Documents)
