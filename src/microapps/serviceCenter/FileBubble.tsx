import React from 'react'
import { Icon, Text, View } from '@allthings/elements'
import { css } from 'glamor'
import RectangleFittedImage from 'components/RectangleFittedImage'
import { alpha, ColorPalette } from '@allthings/colors'
import formatBytes from 'utils/formatBytes'

const FILE_BUBBLE_DEFAULT_MARGIN = 15 // px
const FILE_BUBBLE_EXTENDED_MARGIN = 70 // px
const MARGIN = 10 // px
const PDF_TYPE = 'application/pdf'

interface IProps {
  fileId: string
  files: ReadonlyArray<IFile>
  isByCurrentUser: boolean
  openGallery: (id: string) => (event: React.SyntheticEvent) => void
}

const FileBubble = ({
  fileId,
  files: bubbleFiles,
  isByCurrentUser,
  openGallery,
}: IProps) => {
  const currentFile = bubbleFiles.filter(file => file.id === fileId)[0]
  const isPdf = currentFile.type === PDF_TYPE

  return (
    <View
      {...css({
        borderRadius: 6,
        boxShadow: '2px 3px 3px 0px rgba(211, 211, 211, .25)',
        cursor: 'pointer',
        // Simulate a similar spacing to the one used for the
        // ChatBubble.
        margin: `-${MARGIN}px ${
          isByCurrentUser
            ? FILE_BUBBLE_EXTENDED_MARGIN
            : FILE_BUBBLE_DEFAULT_MARGIN
        }px ${FILE_BUBBLE_DEFAULT_MARGIN}px ${
          isByCurrentUser
            ? FILE_BUBBLE_DEFAULT_MARGIN
            : FILE_BUBBLE_EXTENDED_MARGIN
        }px`,
        ...(isPdf && {
          background: alpha(ColorPalette.grey, 0.6),
          cursor: 'pointer',
          ':hover': {
            background: alpha(ColorPalette.grey, 0.7),
          },
        }),
      })}
    >
      {isPdf ? (
        <View
          alignH="center"
          alignV="center"
          direction="column"
          onClick={() => window.open(currentFile.files.original.url, '_blank')}
          {...css({ padding: MARGIN })}
        >
          <Icon color={ColorPalette.white} name="file-document" size="l" />
          <Text align="center" size="s" {...css({ marginTop: MARGIN })}>
            {currentFile.name}
          </Text>
          <Text color={alpha(ColorPalette.lightBlackIntense, 0.5)} size="s">
            {formatBytes(currentFile.files.original.size)}
          </Text>
        </View>
      ) : (
        <RectangleFittedImage
          image={currentFile && currentFile.files.medium.url}
          onClick={openGallery(currentFile.id)}
          {...css({ borderRadius: 6 })}
        />
      )}
    </View>
  )
}

export default FileBubble
