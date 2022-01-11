import React from 'react'
import { ColorPalette } from '@allthings/colors'
import AndroidHomeIcon from '@allthings/react-ionicons/lib/AndroidHomeIcon'
import View from '@allthings/elements/View'

import TextPlaceholder from 'components/Skeleton/TextPlaceholder'

const ContractItemSkeleton = () => (
  <View flex={100} className="contractItem">
    <View
      direction="row"
      alignH="space-between"
      alignV="center"
      className="contractItem-header"
    >
      <AndroidHomeIcon
        style={{ width: 35, height: 35, fill: ColorPalette.lightGrey }}
      />
      <View direction="column" alignV="center">
        <span className="contractItem-header-label-type">
          <TextPlaceholder
            style={{
              height: 25,
              width: 90,
              backgroundColor: ColorPalette.lightGrey,
              marginBottom: 4,
            }}
          />
        </span>
        <span className="contractItem-header-label-id">
          <TextPlaceholder
            style={{
              height: 16,
              width: 60,
              backgroundColor: ColorPalette.lightGrey,
            }}
          />
        </span>
      </View>
      <div className="contractItem-header-spacer" style={{ width: 35 }} />
    </View>
    <div className="contractItem-content">
      <TextPlaceholder style={{ height: 17, width: 150, marginBottom: 4 }} />
      <TextPlaceholder style={{ height: 17, width: 80 }} />
      <div className="contractItem-content-table">
        <View
          direction="row"
          alignH="space-between"
          style={{ marginBottom: 4 }}
        >
          <TextPlaceholder style={{ height: 17, width: 120 }} />
          <TextPlaceholder style={{ height: 17, width: 50 }} />
        </View>
        <View
          direction="row"
          alignH="space-between"
          style={{ marginBottom: 4 }}
        >
          <TextPlaceholder style={{ height: 17, width: 120 }} />
          <TextPlaceholder style={{ height: 17, width: 50 }} />
        </View>
        <View
          direction="row"
          alignH="space-between"
          style={{ marginBottom: 4 }}
        >
          <TextPlaceholder style={{ height: 17, width: 120 }} />
          <TextPlaceholder style={{ height: 17, width: 50 }} />
        </View>
        <View
          direction="row"
          alignH="space-between"
          style={{ marginBottom: 4 }}
        >
          <TextPlaceholder style={{ height: 17, width: 120 }} />
          <TextPlaceholder style={{ height: 17, width: 50 }} />
        </View>
        <View
          direction="row"
          alignH="space-between"
          style={{ marginBottom: 4 }}
        >
          <TextPlaceholder style={{ height: 17, width: 120 }} />
          <TextPlaceholder style={{ height: 17, width: 50 }} />
        </View>
      </div>
      <div className="contractItem-content-cancellation-text">
        <TextPlaceholder style={{ height: 12, width: 150 }} />
      </div>
    </div>
  </View>
)

export default ContractItemSkeleton
