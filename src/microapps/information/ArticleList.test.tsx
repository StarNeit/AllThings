import { sortByTitle } from './ArticleList'
import { Locale } from '../../enums'

const dummyArticle = {
  id: '1',
  _embedded: {
    translations: {
      en_US: {
        title: 'text in English',
      },
      de_DE: {
        title: 'text in German',
      },
      fr_FR: {
        title: 'text in French',
      },
    },
  },
}

const dummyArticle2 = {
  id: '2',
  _embedded: {
    translations: {
      de_DE: {
        title: 'text in German',
      },
      fr_FR: {
        title: 'text in French',
      },
    },
  },
}

const dummyArticle3 = {
  id: '3',
  _embedded: {
    translations: {
      fr_FR: {
        title: 'text in French',
      },
      it_IT: {
        title: 'text in French',
      },
    },
  },
}

const dummyArticle4 = {
  id: '4',
  _embedded: {
    translations: {
      it_IT: {
        title: 'text in Italian',
      },
      pt_PT: {
        title: 'text in Portuguese',
      },
    },
  },
}

describe('ArticleList', () => {
  describe('sortByTitle', () => {
    it('Locale exist in article', async () => {
      expect(sortByTitle(Locale.de_DE)(dummyArticle)).toBe('text in german')
    })
    it('Locale do not exist in article', async () => {
      expect(sortByTitle(Locale.it_IT)(dummyArticle)).toBe('text in english')
    })
    it('Locale do not exist in article | article do not have English translation', async () => {
      expect(sortByTitle(Locale.it_IT)(dummyArticle2)).toBe('text in german')
    })
    it('Locale do not exist in article | article do not have English or German translation', async () => {
      expect(sortByTitle(Locale.it_IT)(dummyArticle3)).toBe('text in french')
    })
    it('Locale do not exist in article | article do not have English, German or French translation | first found must be picked', async () => {
      expect(sortByTitle(Locale.it_IT)(dummyArticle4)).toBe('text in italian')
    })
  })
})
