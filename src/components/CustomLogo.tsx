import React, { useEffect, useState } from 'react'
import { Theme, View } from '@allthings/elements'

const SIZE = 32.5 // same as the Element's Icon.

interface IProps {
  url: string
  color: string
}

const CustomLogo = ({ url, color }: IProps) => {
  // Use a fallback url (external content icon). This should actually never be
  // used since we are the ones responsible for uploading the custom SVG icons!
  const fallbackUrl =
    'https://static.allthings.me/react-icons/production/logoutFilled.svg'
  const [unsafeHTMLContent, setUnsafeHTMLContent] = useState('')

  // TODO: Use Suspense when stable and available.
  // See: https://stackoverflow.com/a/53572588
  const fetchCustomLogo = async (customLogoUrl: string) => {
    const response = await fetch(customLogoUrl)

    if (response.status === 200) {
      setUnsafeHTMLContent(await response.text())
    } else {
      const fallbackResponse = await fetch(fallbackUrl)

      // We assume that the fallback is always available!
      setUnsafeHTMLContent(await fallbackResponse.text())
    }
  }

  useEffect(() => {
    fetchCustomLogo(url)
  }, [url])

  return (
    <Theme>
      {({ colorize }: { colorize: (color: string) => string }) => (
        <View
          alignH="center"
          alignV="center"
          dangerouslySetInnerHTML={{ __html: unsafeHTMLContent }}
          style={{
            fill: colorize(color),
            height: SIZE,
            width: SIZE,
          }}
        />
      )}
    </Theme>
  )
}

export default CustomLogo
