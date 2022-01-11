import React from 'react'
import { ColorPalette } from '@allthings/colors'
import { Text, ListItem, View } from '@allthings/elements'
import { createMQ } from '@allthings/elements/Responsive'
import { IViewProps } from '@allthings/elements/View'

import { css } from 'glamor'

interface IProps {
  alignTitle?: 'top' | 'middle' | 'bottom'
  children?: React.ReactElement<any> | React.ReactNodeArray
  description?: string
  labelFor?: string
  onClick?: OnClick
  title?: string
  wrap?: IViewProps['wrap']
}

export default function SettingsListItem({
  children,
  description,
  labelFor,
  onClick,
  title,
  alignTitle = 'middle',
  wrap,
  ...rest
}: IProps) {
  const align =
    alignTitle === 'middle'
      ? 'center'
      : alignTitle === 'bottom'
      ? 'end'
      : undefined

  return (
    <label onClick={onClick} htmlFor={labelFor}>
      <ListItem {...rest}>
        <View
          alignH="space-between"
          direction="row"
          flex={100}
          wrap={wrap}
          {...css({ [createMQ('mobile')]: { flexDirection: 'row' } })}
        >
          {(title || description) && (
            <View direction="column" flex={'auto'} alignH={align}>
              {title && (
                <Text strong color={ColorPalette.text.secondary}>
                  {title}
                </Text>
              )}
              {description && (
                <Text
                  autoBreak
                  size="s"
                  {...css({
                    color: ColorPalette.text.gray,
                    maxWidth: '250px',
                    padding: '15px 10px 0 0',
                  })}
                >
                  {description}
                </Text>
              )}
            </View>
          )}
          {children}
        </View>
      </ListItem>
    </label>
  )
}
