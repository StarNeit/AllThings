import React from 'react'
import { useDropzone } from 'react-dropzone'
import { css } from 'glamor'
import NoOp from 'utils/noop'
import { DropHandler } from 'utils/filePreviews'

const styles = {
  dropzone: css({
    bottom: 0,
    display: 'none',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  }),
  dropzoneActive: css({
    backgroundColor: 'rgba(243, 245, 247, 0.87)',
    border: '4px dashed #92A4A4',
    borderRadius: '15px',
    display: 'block',
    zIndex: 10,
  }),
}

interface IProps {
  accept?: string
  multiple?: boolean
  onChoose?: DropHandler
  style?: React.CSSProperties
  children: (fn: () => void) => void
}

const FileChooser = ({
  onChoose = NoOp,
  multiple,
  accept,
  children,
  ...props
}: IProps) => {
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onChoose,
    noClick: true,
    accept,
    multiple,
  })

  return (
    <div {...getRootProps()} {...css({ outline: 'none' })} {...props}>
      <input {...getInputProps()} />
      <div {...css(styles.dropzone, isDragActive && styles.dropzoneActive)} />
      {children(open)}
    </div>
  )
}

export default FileChooser
