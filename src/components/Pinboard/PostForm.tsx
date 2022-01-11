import React from 'react'
import PostCard from './PostCard'

const style = {
  wrapper: {
    background: '#fff',
    position: 'relative',
    width: '100%',
    // The component should be above the posts (its menu in particular)!
    zIndex: 4,
  },
}

interface IProps {
  children: React.ReactNode
  id?: string
}

export default function PostForm({ children, ...props }: IProps) {
  return (
    <PostCard containerStyle={style.wrapper} {...props}>
      {children}
    </PostCard>
  )
}
