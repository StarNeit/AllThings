import React from 'react'
import filters from 'utils/filters'
import ThingListItem from './ThingListItem'
import { View, SimpleLayout } from '@allthings/elements'
import NetworkError from 'components/NetworkError'
import PagedDataProvider, { IData } from 'containers/PagedDataProvider'
import { IThing } from '.'

export interface IListThings {
  fetchNext: () => void
  loading: boolean
  refetch: () => void
  things: any
}
interface IProps {
  filter: ReadonlyArray<any>
  deletedThings: ReadonlyArray<string>
  children: (list: IListThings) => React.ReactNode
  onClickThing: (thingId: string) => void
}
export default class ListThings extends React.Component<IProps> {
  static defaultProps: Partial<IProps> = {
    filter: [],
  }

  renderThings = (pages: ReadonlyArray<ReadonlyArray<IThing>>) => {
    return pages.length === 0 ? <View /> : this.renderList(pages)
  }

  renderList = (pages: ReadonlyArray<ReadonlyArray<IThing>>) =>
    pages
      .reduce((things, thing) => things.concat(thing))
      .map(thing => this.renderThing(thing))

  renderThing = (thing: IThing) => {
    const { id, name, status, _embedded, properties } = thing
    const { coverImage, files } = _embedded
    const coverImageSrc = coverImage
      ? coverImage._embedded.files.small.url
      : null
    const price = properties.price || ''
    const images = files.filter((f: IFile) => f.type.substr(0, 5) === 'image')

    return (
      <ThingListItem
        deleted={this.props.deletedThings.indexOf(id) !== -1}
        coverImage={coverImageSrc}
        onClick={this.props.onClickThing}
        id={id}
        images={images}
        key={id}
        name={name}
        price={price}
        status={status}
      />
    )
  }

  renderError = ({ refetch }: any) => <NetworkError refetch={refetch} />

  render() {
    return (
      <PagedDataProvider
        renderError={this.renderError}
        path="api/v2/things"
        params={{ limit: 25, filter: filters(this.props.filter) }}
      >
        {({ loading, pages, fetchNext, refetch }: IData<readonly IThing[]>) => (
          <SimpleLayout onScrollEnd={fetchNext} onPullDown={refetch}>
            {this.props.children({
              fetchNext,
              loading,
              refetch,
              things: pages.length > 0 && this.renderThings(pages),
            })}
          </SimpleLayout>
        )}
      </PagedDataProvider>
    )
  }
}
