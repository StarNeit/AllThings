import React from 'react'
import { CountIndicator, Icon, Relative, View } from '@allthings/elements'
import { css } from 'glamor'
import { useTheme } from '@allthings/elements/Theme'
import { colorCode } from '@allthings/elements/utils/propTypes/color'

const appBar = (backgroundColor: string) =>
  css({
    backgroundColor: colorCode(backgroundColor),
    height: '60px',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0px -1px 5px rgba(0,0,0,0.3)',
  })

interface IButtonProps {
  background?: string
  onClick: OnClick
}

const Button: React.ComponentType<IButtonProps> = ({
  children,
  background,
  onClick,
}) => (
  <View
    onClick={onClick}
    style={{
      background,
      borderLeft: '1px solid rgba(126,140,141,0.2)',
      width: '60px',
      height: '60px',
    }}
    direction="column"
    alignH="center"
    alignV="center"
  >
    {children}
  </View>
)

interface IPlusButtonProps {
  color: string
  onClick: OnClick
}

const PlusButton = ({ onClick, color }: IPlusButtonProps) => (
  <Button onClick={onClick}>
    <Icon
      name="plus-light-filled"
      style={{ height: '26px', width: '26px' }}
      color={color}
      size="s"
    />
  </Button>
)

interface INotificationProps {
  color?: string
  count: number
  onClick: OnClick
}

const Notification = ({ count, onClick, color }: INotificationProps) => (
  <Button onClick={onClick}>
    <Relative>
      {count > 0 && <CountIndicator count={count} top={-5} right={-5} />}
      <Icon
        name="alarm-filled"
        style={{ height: '26px', width: '26px' }}
        color={color}
        size="s"
      />
    </Relative>
  </Button>
)

interface IAppBarProps {
  notificationCount: number
  onBellClick: OnClick
  onPlusClick: OnClick
  onTileClick: OnClick
  showClose: boolean
}

const AppBar = ({
  notificationCount,
  onTileClick,
  onBellClick,
  onPlusClick,
  showClose,
  ...props
}: IAppBarProps) => {
  const { theme } = useTheme()

  const color = theme.primary
  const textColor = theme.contrast

  return (
    <View
      {...appBar(color)}
      direction="row"
      alignH="space-between"
      alignV="center"
      {...props}
    >
      <Button onClick={onTileClick}>
        {showClose ? (
          <Icon
            name="remove-filled"
            style={{ height: '26px', width: '26px' }}
            size="s"
            color={textColor}
          />
        ) : (
          <Icon
            name="tile-filled"
            style={{ height: '26px', width: '26px' }}
            size="s"
            color={textColor}
          />
        )}
      </Button>
      <View direction="row" alignH="center" alignV="center">
        <Notification
          color={textColor}
          count={notificationCount}
          onClick={onBellClick}
        />
        <PlusButton onClick={onPlusClick} color={textColor} />
      </View>
    </View>
  )
}

export default AppBar
