import { ColorPalette } from '@allthings/colors'
import { Icon, View } from '@allthings/elements'
import { css } from 'glamor'
import React from 'react'

const styles = {
  icon: css({
    display: 'inline-block',
    marginTop: '17%',
    marginLeft: '13%',
  }),
  iconWrapper: css({
    borderRadius: '50%',
    height: '50px',
    width: '50px',
    backgroundColor: ColorPalette.whiteIntense,
  }),
}

const CheckinIcon = () => (
  <View {...styles.iconWrapper}>
    <Icon
      name="login-key-filled"
      color={ColorPalette.grey}
      size={30}
      {...styles.icon}
    />
  </View>
)

export default CheckinIcon
