import React from 'react'
import PostButton from 'components/FlexButton'
import { css } from 'glamor'
import { Text } from '@allthings/elements'
import { Post, PostSpacer } from 'components/Pinboard'

const styles = css({
  background: 'white',
  padding: 14,
  cursor: 'pointer',
})

interface IProps {
  postId: string
  'data-e2e'?: string
  children: string
  onClick?: (event: MouseEvent, id: string) => void
}

export default class CommentLoaderButton extends React.Component<IProps> {
  handleClick = (e: MouseEvent) => {
    const { onClick, postId } = this.props
    if (onClick) {
      onClick(e, postId)
    }
  }

  render() {
    const { children, postId, ...restProps } = this.props
    delete restProps['data-e2e']
    const e2e = this.props['data-e2e']
      ? { 'data-e2e': this.props['data-e2e'] }
      : {}

    return (
      <Post {...restProps}>
        <PostButton onClick={this.handleClick} {...styles} {...e2e}>
          <Text size="m">{children}</Text>
        </PostButton>
        <PostSpacer height={1} background={'#e7ecee'} />
      </Post>
    )
  }
}
