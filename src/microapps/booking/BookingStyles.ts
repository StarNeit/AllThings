import { css } from 'glamor'

export default {
  paddingTop: css({
    paddingTop: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
  }),
  paddingBot: css({
    paddingBottom: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
  }),
  padding: css({
    paddingTop: '2vh',
    paddingBottom: '2vh',
    paddingLeft: '50px',
    paddingRight: '50px',
    // IE hack! Otherwise text goes wild...
    '@media all and (min-width: 880px)': {
      maxWidth: 430,
    },
  }),
  mainContainer: css({
    width: '100%',
  }),
}
