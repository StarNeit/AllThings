import React from 'react'
import { ColorPalette } from '@allthings/colors'
import AlertIcon from '@allthings/react-ionicons/lib/AlertIcon'
import HelpIcon from '@allthings/react-ionicons/lib/HelpIcon'
import BugIcon from '@allthings/react-ionicons/lib/BugIcon'

interface IProps {
  color?: string
  style?: object
  type?: string
  width?: number
}

function SingleIcon({
  color = ColorPalette.lightGreyIntense,
  width = 92,
  style = { margin: '20px' },
  type = 'alert',
}: IProps) {
  const iconStyle = {
    fill: color,
    width,
    ...style,
  }
  let icon

  switch (type) {
    case 'alert':
      icon = <AlertIcon style={{ ...iconStyle }} />
      break
    case 'help':
      icon = <HelpIcon style={{ ...iconStyle }} />
      break
    case 'bug':
      icon = <BugIcon style={{ ...iconStyle }} />
      break
  }

  return (
    <div className="singleIcon" style={{ ...style }}>
      {icon}
    </div>
  )
}

export default SingleIcon
