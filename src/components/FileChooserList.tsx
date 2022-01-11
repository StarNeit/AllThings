import { Icon, Spinner, View } from '@allthings/elements'
import { css } from 'glamor'
import React, { ReactNode } from 'react'
import { ColorPalette } from '@allthings/colors/dist'
import RemovableImage from 'components/RemovableImage'

interface IFileChooserListProps {
  onClickAdd: () => void
  isUploading: boolean
  files: readonly IFile[]
  onRemoveFile: (file: IFile) => void
  children?: ReactNode
}
const ITEM_SIZE = 95
const GUTTER = 3

const FileChooserList = ({
  onClickAdd,
  isUploading = false,
  files = [],
  onRemoveFile,
  children,
}: IFileChooserListProps) => (
  <View
    {...css({ background: '#fff', margin: `0 -${GUTTER}px`, padding: 10 })}
    direction="row"
    wrap="wrap"
  >
    <View
      direction="row"
      alignV="center"
      alignH="center"
      onClick={onClickAdd}
      {...css({
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        border: `2px dashed ${ColorPalette.lightGreyIntense}`,
        borderRadius: 2,
        margin: GUTTER,
      })}
    >
      {isUploading ? (
        <Spinner size={ITEM_SIZE / 2} />
      ) : (
        <Icon
          name="picture-add-filled"
          color={ColorPalette.lightGreyIntense}
          size={ITEM_SIZE / 2}
        />
      )}
    </View>
    {files.map((file, index) => (
      <View {...css({ margin: GUTTER })} key={file.id}>
        <RemovableImage
          id={file.id}
          image={file.files.small.url}
          onRemove={() => onRemoveFile(file)}
          size={ITEM_SIZE}
          data-e2e={`file-upload-delete-button-${index}`}
        />
      </View>
    ))}
    {children}
  </View>
)

export default FileChooserList
