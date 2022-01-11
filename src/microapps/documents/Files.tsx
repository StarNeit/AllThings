import React from 'react'
import sortBy from 'lodash-es/sortBy'
import formatBytes from 'utils/formatBytes'
import { formatListItem } from 'utils/formatStrings'
import IosDownloadOutlineIcon from '@allthings/react-ionicons/lib/IosDownloadOutlineIcon'
import { List } from '@allthings/elements'
import DocumentListItem from './DocumentListItem'
import Link from 'components/Link'
import { IFile } from '.'

interface IProps {
  files?: readonly IFile[]
  onFileSeen: (fileId: string) => void
}

class Files extends React.Component<IProps> {
  handleClick = (fileId: string, seenByMe: boolean) => () => {
    if (!seenByMe) {
      this.props.onFileSeen(fileId)
    }
  }

  renderFile = (file: IFile) => {
    const { extension, id, name, seenByMe, size, _embedded } = file
    const fileUrl = _embedded.files.original.url

    return (
      <Link to={fileUrl} key={id} name={name} setLastLocation target="_blank">
        <DocumentListItem
          alignV="center"
          data-e2e={`documents-item-file-${id}`}
          highlight={!seenByMe}
          icon={IosDownloadOutlineIcon}
          info={extension.toUpperCase()}
          onClick={this.handleClick(id, seenByMe)}
          size={formatBytes(size, 0)}
          text={formatListItem(name)}
          url={fileUrl}
          wrap="nowrap"
        />
      </Link>
    )
  }

  render() {
    const { files } = this.props

    return (
      files?.length > 0 && (
        <List>
          {sortBy(files, (f: any) => f.name).map((file: IFile) =>
            this.renderFile(file),
          )}
        </List>
      )
    )
  }
}

export default Files
