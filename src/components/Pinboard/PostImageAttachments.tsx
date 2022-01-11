import React from 'react'
import { css } from 'glamor'
import { View, Text } from '@allthings/elements'
import RectangleFittedImage from 'components/RectangleFittedImage'
import NoOp from 'utils/noop'

const styles = {
  moreImages: css({
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
    background: 'rgba(0, 0, 0, 0.4)',
  }),
  moreImagesText: css({
    padding: 10,
  }),
}

interface IProps {
  e2e?: string
  onClick: OnClick
  moreImagesText: (length: number) => string
  images: NonEmptyImageArray
}

export default function PostImageAttachments({
  e2e,
  images,
  moreImagesText,
  onClick = NoOp,
}: IProps) {
  if (!images) {
    return null
  }

  const [firstImage, ...restImages] = images

  return (
    <View
      data-e2e={e2e && `${e2e}-fitted-image`}
      {...css({ margin: '10px -15px -15px -15px', cursor: 'pointer' })}
    >
      <RectangleFittedImage
        image={firstImage.url}
        imageWidth={firstImage.width}
        imageHeight={firstImage.height}
        onClick={onClick}
      >
        {restImages.length && (
          <View
            direction="row"
            alignH="end"
            alignV="center"
            data-e2e={`${e2e}-more-images-label`}
            {...styles.moreImages}
          >
            <Text strong size="m" color="white" {...styles.moreImagesText}>
              {moreImagesText(restImages.length)}
            </Text>
          </View>
        )}
      </RectangleFittedImage>
    </View>
  )
}
