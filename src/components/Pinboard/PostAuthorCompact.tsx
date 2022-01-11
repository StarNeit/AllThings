import React from 'react'
import { css } from 'glamor'
import { View, ProfileImage, Text } from '@allthings/elements'
import MoreIcon from '@allthings/react-ionicons/lib/AndroidMoreVerticalIcon'
import Username from '../User/Username'
import NoOp from 'utils/noop'
import { IAuthor, IHighlight } from './PostAuthor'

const styles = {
  wrapper: css({
    marginBottom: 10,
    '> *': {
      // applied on all direct children
      padding: 5,
    },
  }),
  authorCol: css({
    paddingLeft: 0,
  }),
  cursor: css({
    ':hover': {
      cursor: 'pointer',
    },
  }),
  iconCol: css({
    position: 'relative',
    display: 'inline-block',
    paddingRight: 0,
    // Move to the right to align with comment text (in info line)
    transform: 'translateX(6px)',
    zIndex: 1,
    ':hover': {
      cursor: 'pointer',
    },
  }),
}

interface IProps {
  author: IAuthor
  dateText: string
  highlight?: IHighlight
  index: number
  onAuthorClick: () => void
  onClickMore: () => void
  onDateClick?: () => void
  renderMenu: () => void
  showMoreIcon: boolean
}

export default function PostAuthorCompact({
  author,
  index,
  onAuthorClick = NoOp,
  dateText,
  highlight,
  onDateClick = NoOp,
  showMoreIcon = false,
  renderMenu,
  onClickMore,
}: IProps) {
  const indexOrDetail = typeof index === 'undefined' ? 'detail' : index
  return (
    <View
      direction="row"
      {...styles.wrapper}
      alignV="center"
      alignH="space-between"
    >
      <View
        {...styles.authorCol}
        data-e2e={`pinboard-detail-new-comment-${index}-avatar`}
        onClick={onAuthorClick}
        {...(!author.deleted && styles.cursor)}
      >
        <ProfileImage image={author.profileImage} size="s" />
      </View>
      <View direction="column" flex="flex">
        {highlight && (
          <View>
            <Text color={highlight.color} size="s" strong>
              {highlight.text}
            </Text>
          </View>
        )}
        <View>
          <Text
            color="#626262"
            size="s"
            strong
            onClick={onAuthorClick}
            block={false}
            {...(!author.deleted && styles.cursor)}
            data-e2e={`pinboard-detail-new-comment-${index}-username`}
          >
            <Username username={author.name} deleted={author.deleted} />
          </Text>
        </View>
      </View>
      <View>
        <Text
          color="#626262"
          size="s"
          onClick={onDateClick}
          block={false}
          data-e2e={`pinboard-detail-new-comment-${index}-date`}
        >
          {dateText}
        </Text>
      </View>
      {showMoreIcon && (
        <View
          {...styles.iconCol}
          onClick={onClickMore}
          data-e2e={`pinboard-new-post-${indexOrDetail}-actions`}
        >
          <MoreIcon height="20" width="20" />
          {renderMenu()}
        </View>
      )}
    </View>
  )
}
