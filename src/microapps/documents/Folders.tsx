import React from 'react'
import sortBy from 'lodash-es/sortBy'
import { formatListItem } from 'utils/formatStrings'
import IosFolderOutlineIcon from '@allthings/react-ionicons/lib/IosFolderOutlineIcon'
import { List } from '@allthings/elements'
import DocumentListItem from './DocumentListItem'
import { countDeep, someDeep } from 'utils/documents'
import { IDirectory, IFile } from '.'

interface IProps extends IDirectory {
  onClick?: OnClick
}

class Folders extends React.Component<IProps> {
  handleClick = (folderName: string) => {
    const folder = this.props.folders.filter(f => {
      const name = formatListItem(f.name, false)
      return name === folderName
    })
    if (folder.length) {
      this.props.onClick(folder[0])
    } else {
      throw new Error(`No folder with name ${folderName}`)
    }
  }

  checkUnseenFiles = (file: IFile) => file.seenByMe === false

  renderFolder = (folder: IDirectory, index: number) => {
    const { name: rawName } = folder
    const name = formatListItem(rawName, false)
    const hasUnseenFiles = someDeep(folder, this.checkUnseenFiles)
    const filesCount = countDeep(folder)

    return (
      <DocumentListItem
        data-e2e={`documents-item-folder-${index}`}
        highlight={hasUnseenFiles}
        icon={IosFolderOutlineIcon}
        info={filesCount}
        key={`folder-${index}`}
        onClick={this.handleClick as any}
        text={name}
      />
    )
  }

  render() {
    const { folders } = this.props
    return (
      folders?.length > 0 && (
        <List>
          {sortBy(folders, folder => folder.name).map((folder, i) =>
            this.renderFolder(folder, i),
          )}
        </List>
      )
    )
  }
}

export default Folders
