import React from 'react'
import { Icon, ListItem, Text } from '@allthings/elements'
import { alpha, ColorPalette } from '@allthings/colors'
import { css } from 'glamor'
import Link from 'components/Link'

const MARGIN = 10

const styles = {
  icon: css({
    margin: `${MARGIN}px`,
  }),
  item: css({
    cursor: 'pointer',
    width: '100%',
    ':hover': {
      background: alpha(ColorPalette.lightGrey, 0.2),
    },
  }),
  itemText: css({
    flex: 'auto',
    padding: `${MARGIN}px`,
  }),
}

interface IProps {
  message: string
  url: string
}

export const Item = ({ message, url, ...props }: IProps) => (
  <Link to={url} target="_blank" {...props}>
    <ListItem alignH="space-between" {...styles.item}>
      <Text block color={ColorPalette.greyIntense} strong {...styles.itemText}>
        {message}
      </Text>
      <Icon
        color={ColorPalette.greyIntense}
        name="download"
        size="m"
        {...styles.icon}
      />
    </ListItem>
  </Link>
)
