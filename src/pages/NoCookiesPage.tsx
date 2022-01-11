import React from 'react'
import { FormattedMessage } from 'react-intl'
import { CookieChecker } from 'containers/NoCookies'
import FullPageInformation, {
  ImageColumn,
  TextColumn,
} from 'components/FullPageInformation'
import { getStaticImage } from 'utils/getStaticImage'

interface IProps {
  browserInfo: {
    image: string
    link?: string
    name: string
  }
  onLogoClick: OnClick
}

class NoCookies extends React.Component<IProps> {
  state = { cookieCheckerVisible: false }

  cookieCheckingCallback = () => {
    /*
     * This method will be called only if the cookie-monster endpoint
     * returns a 400, otherwise a redirect occurs.
     */
    this.setState({ cookieCheckerVisible: false })
  }

  handleClick = () => {
    //    window.location.reload()
    this.setState({ cookieCheckerVisible: true })
  }

  renderCookierChecker = () => {
    if (this.state.cookieCheckerVisible) {
      return <CookieChecker callback={this.cookieCheckingCallback} />
    } else {
      return null
    }
  }

  renderRetryButton = () => {
    if (!this.state.cookieCheckerVisible) {
      return (
        <button
          className="onpageButton"
          onClick={this.handleClick}
          style={{ width: '210px' }}
        >
          <span className="onpageButton-label">
            <FormattedMessage
              id="no-cookies.retry"
              description="The button to try if cookies are enabled"
              defaultMessage="Try again"
            />
          </span>
        </button>
      )
    } else {
      return null
    }
  }

  render() {
    const { browserInfo } = this.props

    return (
      <FullPageInformation onLogoClick={this.props.onLogoClick}>
        {this.renderCookierChecker()}
        <ImageColumn source={getStaticImage(`browser/${browserInfo.image}`)} />
        <TextColumn>
          <h1
            className="mainContent-title"
            style={{ textAlign: 'initial', fontSize: 36 }}
          >
            <FormattedMessage
              id="no-cookies.title"
              description="The error title when the cookies are disabled"
              defaultMessage="Cookies disabled"
            />
          </h1>
          <div className="mainContent-body">
            <p className="paragraph">
              <FormattedMessage
                id="no-cookies.message"
                description="The error message when the cookies are disabled"
                defaultMessage="Your browser's cookies are disabled. Please enable them to use the app."
              />
            </p>

            {browserInfo.link ? (
              <p className="paragraph">
                <FormattedMessage
                  id="no-cookies.hint-text"
                  description="More information about "
                  defaultMessage="Please see this document on how to enable cookies for your browser {browser}:"
                  values={{
                    browser: browserInfo.name,
                  }}
                />
                <br />
                <a href={browserInfo.link}>{browserInfo.link}</a>
              </p>
            ) : null}
          </div>
          {this.renderRetryButton()}
        </TextColumn>
      </FullPageInformation>
    )
  }
}

export default NoCookies
