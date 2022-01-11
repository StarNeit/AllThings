import React from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { Button } from '@allthings/elements'

const styles = {
  button: (flavour: string) =>
    css({
      display: 'block',
      height: '45px',
      overflow: 'hidden',
      padding: '4px 8px',
      width:
        ((flavour === 'facebook' || flavour === 'google') && '50%') || '100%',
    }),
  label: css({
    color: 'white',
    fontSize: '16px',
  }),
  withIcon: css({
    paddingLeft: '15px',
  }),
}

const backgroundColor = (flavour: string) =>
  (flavour === 'facebook' && ColorPalette.social.facebook) ||
  (flavour === 'google' && ColorPalette.social.google) ||
  ColorPalette.blue

interface IProps {
  disabled?: boolean
  flavour?: 'facebook' | 'google'
  label?: string
  onClick?: OnClick
  type?: 'reset' | 'submit' | 'button'
  withIcon?: boolean
  style?: unknown
  form?: string
}

const LoginButton = ({
  children,
  disabled = false,
  flavour,
  onClick,
  type = 'button',
  withIcon,
  ...restProps
}: React.PropsWithChildren<IProps>) => (
  <Button
    backgroundColor={backgroundColor(flavour)}
    disabled={disabled}
    onClick={onClick}
    type={type}
    {...styles.button(flavour)}
    {...restProps}
  >
    <div {...css(styles.label, withIcon && styles.withIcon)}>{children}</div>
  </Button>
)

export default LoginButton
