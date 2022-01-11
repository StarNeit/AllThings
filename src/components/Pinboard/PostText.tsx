import React from 'react'
import { View, ReadMore, Text } from '@allthings/elements'
import { css } from 'glamor'
import RichMediaHtmlContent from 'components/RichMediaHtmlContent'
import { defineMessages, injectIntl, WrappedComponentProps } from 'react-intl'
import { addHyperlinksToText } from 'utils/hyperlink'

const messages = defineMessages({
  readMoreLabel: {
    id: 'app.read-more-label',
    description: 'The label for the read more link',
    defaultMessage: 'Read more...',
  },
})

interface IProps {
  autoBreak?: boolean
  initiallyCollapsed?: boolean
  children: string
  containerStyle?: object
  disableHyperlinks?: boolean
}

const PostText = ({
  children,
  containerStyle,
  disableHyperlinks,
  initiallyCollapsed,
  ...props
}: IProps & WrappedComponentProps) => {
  const text = disableHyperlinks ? children : addHyperlinksToText(children)
  const { formatMessage } = props.intl

  const content = (
    <Text size="l" {...props}>
      <RichMediaHtmlContent html={text} />
    </Text>
  )

  return (
    <View {...css(containerStyle)}>
      {initiallyCollapsed ? (
        <ReadMore
          readMoreLabel={formatMessage(messages.readMoreLabel)}
          threshold={60}
        >
          {content}
        </ReadMore>
      ) : (
        content
      )}
    </View>
  )
}

export default injectIntl(PostText)
