import React, { PropsWithChildren } from 'react'
import { Inset, Text, Theme, View } from '@allthings/elements'
import { css } from 'glamor'

// @todo use GroupTitle from elements, only thing "blocking" is the text color
const GroupTitle = ({
  active,
  children,
  theme,
  ...props
}: PropsWithChildren<{
  active: boolean
  theme: ITheme
  onClick: () => void
}>) => (
  <Inset horizontal vertical {...props}>
    <Text size="l" strong color={active ? theme.primary : 'titleColor'}>
      {children}
    </Text>
  </Inset>
)

interface IProps {
  children?: ReadonlyArray<JSX.Element>
  headers: ReadonlyArray<string>
}

const BookingOverviewTabs = ({ headers, children }: IProps) => {
  const [activeTab, setActiveTab] = React.useState(0)

  const formattedHeaders = headers.map((header, index) => (
    <Theme key={index}>
      {({ theme }: { theme: ITheme }) => (
        <GroupTitle
          active={activeTab === index}
          key={index}
          onClick={() => setActiveTab(index)}
          theme={theme}
          {...css({
            flex: 1,
            ':hover': { cursor: 'pointer' },
            borderBottom:
              activeTab === index && headers.length > 1
                ? `2px solid ${theme.primary}`
                : '',
          })}
        >
          {header}
        </GroupTitle>
      )}
    </Theme>
  ))

  const formattedChildren = children.map((child, index) => (
    <View
      key={index}
      {...css({
        display: activeTab === index ? 'block' : 'none',
        flex: 'auto',
        width: activeTab === index ? '100%' : '0%',
      })}
    >
      {child}
    </View>
  ))

  return (
    <View direction="column" flex="grow">
      <View direction="row" alignV="center" alignH="start" key="header">
        {formattedHeaders}
      </View>
      {formattedChildren}
    </View>
  )
}

export default BookingOverviewTabs
