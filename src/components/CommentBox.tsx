import React, { useEffect, useRef, useState } from 'react'
import { css } from 'glamor'
import { ColorPalette } from '@allthings/colors'
import { ExpandingTextarea, ProfileImage, View } from '@allthings/elements'

const styles = {
  textareaContainer: {
    background: ColorPalette.white,
    border: `1px solid ${ColorPalette.text.lightGray}`,
    borderRadius: 2,
    color: ColorPalette.text.lightGray,
    marginLeft: 15,
    minHeight: 40,
    transition: 'margin .2s',
    width: '100%',
    zIndex: 1,
  },
  textareaFocus: {
    marginLeft: -40, // profile image width
  },
  profileImage: {
    opacity: 1,
    transition: '.3s',
    ':hover': {
      cursor: 'pointer',
    },
  },
  profileImageFocus: {
    opacity: 0,
    transform: 'translateX(-150%)',
  },
}

interface IProps {
  autoFocus?: boolean
  goToOwnProfile?: (id: string) => void
  location: string
  noProfile?: boolean
  onChange?: (e: React.ChangeEvent<any>) => void
  onRef?: (ref: HTMLElement) => void
  placeholder?: string
  profileImage?: string
  user?: Partial<IUser>
  value?: string
}

const CommentBox = ({
  autoFocus,
  goToOwnProfile = () => undefined,
  location,
  noProfile = false,
  onRef = () => undefined,
  placeholder,
  profileImage,
  user,
  ...props
}: IProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isInFocus, setIsInFocus] = useState(false)

  useEffect(() => {
    onRef(textareaRef.current)
  }, [textareaRef.current])

  return (
    <View direction="row">
      {!noProfile && (
        <ProfileImage
          data-e2e={`${location}-contribution-avatar`}
          image={profileImage}
          onClick={() => goToOwnProfile(user.id)}
          size="m"
          {...css(styles.profileImage, isInFocus && styles.profileImageFocus)}
        />
      )}
      <ExpandingTextarea
        autoFocus={autoFocus}
        containerStyle={css(
          styles.textareaContainer,
          !noProfile && isInFocus && styles.textareaFocus,
        )}
        data-e2e={`${location}-contribution`}
        onBlur={() => setIsInFocus(false)}
        onFocus={() => setIsInFocus(true)}
        ref={textareaRef}
        placeholder={placeholder}
        {...css({ padding: 11 })}
        {...props}
      />
    </View>
  )
}

export default CommentBox
