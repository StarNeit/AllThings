import React from 'react'
import InformationActions from 'store/actions/information'
import { connect } from 'react-redux'
import Link from 'components/Link'
import { AppTitle } from 'containers/App'
import {
  Text,
  List,
  SimpleLayout,
  ChevronRightListItem,
  View,
  Inset,
} from '@allthings/elements'

import { FormattedMessage } from 'react-intl'
import Localized from 'containers/Localized'
import LoadingSkeleton from './LoadingSkeleton'
import sortBy from 'lodash-es/sortBy'
import MicroappBigTitleBar from 'components/TitleBar/MicroappBigTitleBar'
import { MicroApps } from 'enums'

interface IProps {
  readonly config: MicroAppProps
  readonly loading: boolean
  readonly locale: string
  readonly topics: ReadonlyArray<{
    readonly articleCount: number
    readonly topic: {
      readonly name: IMessage
      readonly key: string
    }
  }>
}

class TopicList extends React.PureComponent<IProps & DispatchProp> {
  state = {
    showSearch: false,
  }

  componentDidMount() {
    this.props.dispatch(InformationActions.fetchTopics())
  }

  renderTopics = () => {
    return (
      <SimpleLayout>
        <List data-e2e="information-topic">{this.renderTopicItems()}</List>
      </SimpleLayout>
    )
  }

  renderTopicItems = () => {
    const { locale, topics } = this.props
    const sortedTopics = sortBy(topics, t =>
      String(t.topic.name[locale]).toLowerCase(),
    )

    return sortedTopics.map(topic => {
      const {
        articleCount,
        topic: { name, key },
      } = topic

      return (
        <Link to={`/information/topic/${key}`}>
          <ChevronRightListItem key={key}>
            <Text data-e2e={`information-topic-item-${key}`} size="l">
              <Localized messages={name} /> ({articleCount})
            </Text>
          </ChevronRightListItem>
        </Link>
      )
    })
  }

  renderContent = () => {
    const { loading, topics } = this.props

    if (topics.length === 0 && !loading) {
      return (
        <SimpleLayout>
          <View flex="flex" alignH="center" alignV="center" direction="column">
            <FormattedMessage
              id="information-topic-list.no-topics"
              description="This message is displayed if there are no topics for the current user."
              defaultMessage="There are no topics available for you yet."
            />
          </View>
        </SimpleLayout>
      )
    } else if (topics.length === 0 && loading) {
      return (
        <SimpleLayout>
          <LoadingSkeleton titleHeight={0} rows={6} />
        </SimpleLayout>
      )
    } else {
      return this.renderTopics()
    }
  }

  showSearch = () => {
    this.setState({ showSearch: true })
  }

  closeSearch = () => {
    this.setState({ showSearch: false })
  }

  render() {
    const { config } = this.props

    return (
      <SimpleLayout>
        <AppTitle>{config.label}</AppTitle>
        <MicroappBigTitleBar type={MicroApps.PROJECT} isTwoColumnLayout />
        <Inset vertical={true} />
        {this.renderContent()}
      </SimpleLayout>
    )
  }
}

export default connect((state: IReduxState) => ({
  loading: state.information.topics.loading,
  topics: state.information.topics.items,
  locale: state.app.locale,
}))(TopicList)
