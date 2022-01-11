import { css } from 'glamor'
import React from 'react'

const calculateScale = (element: HTMLElement) => {
  const elementWidth = element.offsetWidth
  const parentWidth = element.parentElement.offsetWidth
  return elementWidth > parentWidth ? parentWidth / elementWidth : 1
}

const commonStyle = {
  display: 'inline-block',
}
const ScalableTextContainer = ({ children }: React.PropsWithChildren<{}>) => {
  const ref = React.useRef(null)
  const [scale, setScale] = React.useState(1)

  React.useEffect(() => {
    setScale(calculateScale(ref.current))
  }, [])

  return (
    <div
      ref={ref}
      {...css({
        ...(scale !== 1
          ? {
              ...commonStyle,
              transform: `scale(${scale}, ${scale})`,
              transformOrigin: '0 0',
            }
          : commonStyle),
      })}
    >
      {children}
    </div>
  )
}

export default ScalableTextContainer
