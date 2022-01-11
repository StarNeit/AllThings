import createReducers from 'store/createReducers'
import merge from 'lodash-es/merge'
import uniqBy from 'lodash-es/uniqBy'
import { Locale } from 'enums'

interface IArticleItem {
  readonly id: string
  readonly category: string
  readonly headerImageResizingStrategy: string
  readonly _embedded: {
    readonly topic: {
      readonly key: string
    }
    readonly translations: IndexSignature
  }
}

interface IState {
  readonly topics: {
    readonly loading: boolean
    readonly items: ReadonlyArray<{
      readonly articleCount: number
      readonly topic: {
        readonly id: string
        readonly key: string
        readonly name: LocalizedMessage
        readonly description: LocalizedMessage
      }
    }>
  }

  readonly articles: {
    readonly loading: boolean
    readonly items: {}
  }

  readonly article: {
    readonly loading: boolean
    readonly item: IArticleItem
    readonly error?: boolean
    readonly images: ReadonlyArray<IFile>
    readonly files: ReadonlyArray<IFile>
  }
}
const initialState: IState = {
  topics: {
    loading: true,
    items: [],
  },
  articles: {
    loading: true,
    items: {},
  },
  article: {
    loading: true,
    error: false,
    item: {} as IArticleItem,
    files: [],
    images: [],
  },
}

const findAvailableTranslation = (
  translations: IndexSignature<IndexSignature, Locale>,
  locale: Locale,
) => {
  if (translations[locale]) {
    return translations[locale]
  }
  if (translations[Locale.en_US]) {
    return translations[Locale.en_US]
  }
  if (translations[Locale.de_DE]) {
    return translations[Locale.de_DE]
  }
  if (translations[Locale.fr_FR]) {
    return translations[Locale.fr_FR]
  }
  const firstFoundLocale = Object.keys(translations)[0]
  return translations[firstFoundLocale]
}

export default createReducers(initialState, {
  fetchTopics(state, { payload, status }) {
    switch (status) {
      case 'loading':
        return merge({}, state, { topics: { loading: true } })

      case 'ok':
        const {
          _embedded: { items },
        } = payload

        return Object.assign({}, state, { topics: { loading: false, items } })

      case 'error':
        return merge({}, state, { topics: { loading: false } })

      default:
        return state
    }
  },

  fetchArticles(state, { payload, status, locale }) {
    switch (status) {
      case 'loading':
        return merge({}, state, { articles: { loading: true } })

      case 'ok':
        const localeItems = state.articles.items[locale] || []
        const items = uniqBy(localeItems.concat(payload), 'id')

        return Object.assign({}, state, {
          articles: {
            loading: false,
            items: {
              [locale]: items,
            },
          },
        })

      case 'error':
        return merge({}, state, { articles: { loading: false } })

      default:
        return state
    }
  },

  fetchArticle(state, { payload, status, locale }) {
    switch (status) {
      case 'loading':
        return merge({}, state, { article: { loading: true, error: false } })

      case 'ok':
        const allFiles = [] as IFile[]
        let allImages = []
        let allDownloads = []

        if (payload._embedded.files) {
          ;(payload._embedded.files as IFile[]).map(f => {
            allFiles.push(f)
          })
        }

        const translation = findAvailableTranslation(
          payload._embedded.translations,
          locale,
        )

        if (translation._embedded.files) {
          ;(translation._embedded.files as IFile[]).map(f => {
            allFiles.push(f)
          })
        }
        allImages = allFiles.filter(file => {
          return file.type.substr(0, 5) === 'image'
        })
        allDownloads = allFiles.filter(file => {
          return file.type.substr(0, 5) !== 'image'
        })

        return Object.assign({}, state, {
          article: {
            loading: false,
            item: payload,
            images: allImages,
            files: allDownloads,
          },
        })
      case 'error':
        return merge({}, state, { article: { loading: false, error: true } })
      default:
        return state
    }
  },
})
