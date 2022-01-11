import { Gateway } from 'react-gateway'
import React, { useState } from 'react'
import Overlay from 'components/Overlay'
import OverlayWindow from 'components/OverlayWindow'
import UserProfileContainer from 'containers/UserProfileContainer'
import { useTheme } from '@allthings/elements/Theme'

interface IToggle {
  toggle: () => void
}

interface IProps {
  userId: string
  children?: (Toogle: IToggle) => React.ReactElement
}

const UserProfileOverlay = ({ userId, children }: IProps) => {
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const toggleOverlay = () => setOpen(oldOpen => !oldOpen)

  return (
    <>
      {open && (
        <Gateway into="root">
          <Overlay
            theme={theme}
            direction="row"
            alignH="center"
            alignV="stretch"
            onBackgroundClick={toggleOverlay}
          >
            <OverlayWindow>
              <UserProfileContainer onBack={toggleOverlay} userId={userId} />
            </OverlayWindow>
          </Overlay>
        </Gateway>
      )}
      {children({ toggle: toggleOverlay })}
    </>
  )
}

export default UserProfileOverlay
