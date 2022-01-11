import React, { ReactChild, useState } from 'react'
import ThingOverlay from './ThingOverlay'

export interface IToggle {
  open: () => void
}

interface IProps {
  children: (Toggle: IToggle) => ReactChild
  type: string
  thingId?: string
  onChange?: (thing: any) => void
  pushToThing?: boolean
}

const ThingOverlayToggle = ({
  type,
  thingId,
  onChange,
  pushToThing = true,
  children,
}: IProps) => {
  const [open, setOpen] = useState(false)
  const handleToggle = () => setOpen(!open)

  return (
    <>
      {open && (
        <ThingOverlay
          onRequestClose={handleToggle}
          type={type}
          thingId={thingId}
          onChange={(thing: any) => {
            setOpen(false)
            onChange && onChange(thing)
          }}
          pushToThing={pushToThing}
        />
      )}
      {children({ open: handleToggle })}
    </>
  )
}

export default ThingOverlayToggle
