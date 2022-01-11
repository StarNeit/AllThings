import React from 'react'
import { View } from '@allthings/elements'
import Image from 'components/Image'

export default ({ name, image }: { name: string; image: string }) => (
  <View
    flex="flex"
    style={{
      maxHeight: '200px',
      maxWidth: '40%',
      paddingRight: '20px',
    }}
  >
    <Image
      alt={name}
      className="contentImage"
      src={image}
      srcFallback={`${process.env.CDN_HOST_URL_PREFIX ||
        ''}/static/img/marketplace_no_img_fallback.png`}
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  </View>
)
