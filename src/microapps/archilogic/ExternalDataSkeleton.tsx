import React from 'react'
import { ColorPalette } from '@allthings/colors'
import AndroidOpenIcon from '@allthings/react-ionicons/lib/AndroidOpenIcon'
import View from '@allthings/elements/View'

const ExternalDataSkeleton = () => (
  <View
    direction="row"
    alignH="center"
    alignV="center"
    wrap="wrap"
    style={{ padding: 15 }}
  >
    <View
      direction="column"
      style={{ maxWidth: 300, textAlign: 'center', margin: '10%' }}
    >
      <AndroidOpenIcon
        style={{
          width: 160,
          height: 160,
          fill: ColorPalette.lightGrey,
          margin: '0 auto',
        }}
      />
      ...
    </View>
  </View>
)

export default ExternalDataSkeleton
