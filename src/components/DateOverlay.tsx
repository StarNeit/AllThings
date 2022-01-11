import React from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'

const wrapper = css({
  position: 'relative',
})

const content = css({
  backgroundColor: ColorPalette.blueIntense,
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  position: 'absolute',
  left: 'calc(50% - 4px)',
})

const DateOverlay = () => {
  return (
    <div {...css(wrapper)}>
      <div {...css(content)} />
    </div>
  )
}

export default DateOverlay
