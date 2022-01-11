import React from 'react'
import { css } from 'glamor'
import MoreIcon from '@allthings/react-ionicons/lib/AndroidMoreVerticalIcon'
import { ColorPalette } from '@allthings/colors'

import { View, ProfileImage, Text } from '@allthings/elements'
import Username from '../User/Username'
import NoOp from 'utils/noop'

const styles = {
  authorCol: css({
    paddingLeft: 0,
  }),
  authorInfoWrapper: css({ minWidth: 0 }),
  cursor: css({
    ':hover': {
      cursor: 'pointer',
    },
  }),
  ellipsis: css({
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  highlightText: css({
    marginLeft: 3,
    maxWidth: '30%',
  }),
  iconCol: css({
    position: 'relative',
    paddingRight: 0,
    // Move to the right to align with comment text (in info line)
    transform: 'translateX(6px)',
    zIndex: 1,
    ':hover': {
      cursor: 'pointer',
    },
  }),
  wrapper: css({
    marginBottom: 10,
    '> *': {
      // applied on all direct children
      padding: 5,
    },
  }),
}

export interface IAuthor {
  deleted: boolean
  name: string
  profileImage: string
}

export interface IHighlight {
  color: string
  text: string
}

interface IProps {
  author: IAuthor
  availableLanguages: ReadonlyArray<string>
  currentLanguage: string
  currentLanguageIntl: string
  dateText?: string
  highlight?: IHighlight
  index?: number
  onAuthorClick?: OnClick
  onClickMore?: OnClick
  onDateClick?: OnClick
  onLanguageClick: OnClick
  renderMenu?: NoOpType
  showMoreIcon?: boolean
}

export default function PostAuthor({
  author,
  availableLanguages,
  currentLanguageIntl,
  dateText,
  highlight,
  index,
  onAuthorClick = NoOp,
  onClickMore,
  onDateClick = NoOp,
  onLanguageClick,
  renderMenu = NoOp,
  showMoreIcon,
}: IProps) {
  const indexOrDetail = typeof index === 'undefined' ? 'detail' : index
  const authorNameStyle = css({ maxWidth: highlight ? '70%' : '100%' })

  return (
    <View direction="row" {...styles.wrapper}>
      <View
        {...styles.authorCol}
        onClick={onAuthorClick}
        {...(!author.deleted && styles.cursor)}
      >
        <ProfileImage
          image={author.profileImage}
          size="m"
          data-e2e={`pinboard-new-post-${indexOrDetail}-avatar`}
        />
      </View>
      <View flex="flex" {...styles.authorInfoWrapper}>
        <View direction="row">
          <Text
            color={ColorPalette.text.primary}
            size="s"
            strong
            onClick={onAuthorClick}
            block={false}
            {...(!author.deleted && styles.cursor)}
            data-e2e={`pinboard-new-post-${indexOrDetail}-author`}
            {...styles.ellipsis}
            {...authorNameStyle}
          >
            <Username username={author.name} deleted={author.deleted} />
          </Text>
          {highlight && (
            <Text
              color={highlight.color}
              size="s"
              strong
              {...styles.ellipsis}
              {...styles.highlightText}
            >
              ({highlight.text})
            </Text>
          )}
        </View>
        <View>
          <Text
            color={ColorPalette.text.secondary}
            size="s"
            onClick={onDateClick}
            block={false}
            {...(!author.deleted && styles.cursor)}
            data-e2e={`pinboard-new-post-${indexOrDetail}-date`}
          >
            {dateText}
          </Text>
        </View>
      </View>
      {showMoreIcon && (
        <View
          direction="row"
          alignH="center"
          alignV="start"
          {...styles.iconCol}
        >
          {availableLanguages.length > 1 && (
            <Text
              color={ColorPalette.greyIntense}
              onClick={onLanguageClick}
              size="m"
              {...css({ marginRight: '10px' })}
            >
              {currentLanguageIntl}
            </Text>
          )}
          <MoreIcon
            height="20"
            width="20"
            data-e2e={`pinboard-new-post-${indexOrDetail}-actions`}
            onClick={onClickMore}
          />
          {renderMenu()}
        </View>
      )}
    </View>
  )
}
