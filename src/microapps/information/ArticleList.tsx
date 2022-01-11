import React from 'react'
import PagedDataProvider, { IData } from 'containers/PagedDataProvider'
import { connect } from 'react-redux'
import sortBy from 'lodash-es/sortBy'
import Localized, { getLocalized } from 'containers/Localized'
import { View } from '@allthings/elements'
import LoadingSkeleton from './LoadingSkeleton'
import { FormattedMessage } from 'react-intl'
import {
  ChevronRightListItem,
  GroupedCardList,
  SimpleLayout,
  Text,
} from '@allthings/elements'
import { push } from 'connected-react-router'
import { RouteComponentProps } from 'react-router'
import { Locale } from 'enums'
import HorizontalRouterMicroapp from 'components/HorizontalRouterMicroapp'
import { IArticle } from '.'
import GenericBackTitleBar from 'components/TitleBar/GenericBackTitleBar'

export const sortByTitle = (locale: Locale) => (a: IArticle) => {
  if (a._embedded.translations[locale]) {
    return String(a._embedded.translations[locale].title).toLowerCase()
  }
  if (a._embedded.translations[Locale.en_US]) {
    return String(a._embedded.translations[Locale.en_US].title).toLowerCase()
  }
  if (a._embedded.translations[Locale.de_DE]) {
    return String(a._embedded.translations[Locale.de_DE].title).toLowerCase()
  }
  if (a._embedded.translations[Locale.fr_FR]) {
    return String(a._embedded.translations[Locale.fr_FR].title).toLowerCase()
  }
  const firstFoundLocale = Object.keys(a._embedded.translations)[0]
  return String(a._embedded.translations[firstFoundLocale].title).toLowerCase()
}

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

class ArticleList extends React.PureComponent<Props> {
  renderList = (pages: ReadonlyArray<ReadonlyArray<IArticle>>) => {
    const { locale, topic, onArticleClick } = this.props

    return (
      <GroupedCardList
        data-e2e="information-article-topic-title"
        data-e2e-title={topic.key}
        title={getLocalized(topic.name, locale)}
      >
        {sortBy(
          pages.reduce((articles, article) => articles.concat(article)),
          sortByTitle(locale),
        ).map(item => (
          <ChevronRightListItem
            flex="auto"
            key={item.id}
            onClick={() => onArticleClick(item.id, topic.key)}
            data-e2e={`information-article-item-${item.id}`}
          >
            <Localized messages={item._embedded.translations}>
              {localized => <Text size="l">{(localized as any).title}</Text>}
            </Localized>
          </ChevronRightListItem>
        ))}
      </GroupedCardList>
    )
  }

  renderArticleList() {
    const { topicKey, periodId } = this.props

    return (
      <PagedDataProvider
        path={`api/v1/utilisation-periods/${periodId}/articles?filter[category]=eq:${topicKey}`}
        params={{ limit: 30 }}
      >
        {({ loading, pages, fetchNext }: IData<readonly IArticle[]>) => (
          <>
            <GenericBackTitleBar onBack={this.props.goToInformation} />
            <SimpleLayout onScrollEnd={fetchNext}>
              {loading && pages.length === 0 && this.renderLoading()}
              {pages.length > 0 && this.renderList(pages)}
            </SimpleLayout>
          </>
        )}
      </PagedDataProvider>
    )
  }

  renderNoArticleInfo() {
    return (
      <SimpleLayout>
        <View flex="flex" alignH="center" alignV="center" direction="column">
          <Text
            className="contentList-title"
            data-e2e="information-article-empty-topic-title"
            size="l"
            style={{ borderBottom: 0, display: 'block' }}
          >
            <FormattedMessage
              id="information-article-list.topic-no-articles"
              description="Info that no articles are defined for topic"
              defaultMessage="No articles defined for topic: {topic}"
              values={{ topic: this.props.topicKey }}
            />
          </Text>
        </View>
      </SimpleLayout>
    )
  }

  renderLoading() {
    return (
      <SimpleLayout>
        <LoadingSkeleton rows={3} />
      </SimpleLayout>
    )
  }

  render() {
    return (
      <HorizontalRouterMicroapp>
        {this.renderArticleList()}
      </HorizontalRouterMicroapp>
    )
  }
}

const mapStateToProps = (
  { app, authentication, information: { topics } }: IReduxState,
  { match }: RouteComponentProps<{ key: string }>,
) => ({
  locale: app.locale,
  periodId: authentication.user.activePeriod.id,
  topic:
    topics.items.length > 0
      ? topics.items.find(({ topic }) => topic.key === match.params.key).topic
      : undefined,
  topicKey: match.params.key,
})
const mapDispatchToProps = (dispatch: FunctionalDispatch) => ({
  onArticleClick: (id: string, topic: string) =>
    dispatch(push(`/information/topic/${topic}/${id}`)),
  goToInformation: () => dispatch(push('/information')),
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleList)
