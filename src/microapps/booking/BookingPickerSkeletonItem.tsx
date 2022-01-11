import React from 'react'
import { Inset, ListItem, View, Circle } from '@allthings/elements'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'

const BookingPickerSkeletonItem = () => (
  <ListItem>
    <Circle outline fill={false} outlineColor="lightGrey" />
    <View direction="column">
      <Inset>
        <View
          {...css({
            backgroundColor: ColorPalette.lightGrey,
            height: '13px',
            width: '85px',
            marginBottom: '8px',
          })}
        />
        <View
          {...css({
            backgroundColor: ColorPalette.lightGrey,
            height: '13px',
            width: '85px',
          })}
        />
      </Inset>
    </View>
  </ListItem>
)

export default BookingPickerSkeletonItem
