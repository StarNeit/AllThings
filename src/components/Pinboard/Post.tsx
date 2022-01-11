import React from 'react'
import PostCard from './PostCard'

interface IProps {
  children?: React.ReactNodeArray
  highlightColor?: string
}

export default function Post({
  children,
  highlightColor,
  ...restProps
}: IProps) {
  return (
    <PostCard
      containerStyle={{
        borderTop: highlightColor && `2px solid ${highlightColor}`,
      }}
      {...restProps}
    >
      {children}
    </PostCard>
  )
}
