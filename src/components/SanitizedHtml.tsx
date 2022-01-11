import React from 'react'
import DOMPurify from 'dompurify'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { View } from '@allthings/elements'
import sendNativeEvent from 'utils/sendNativeEvent'
import storeLocationIfStandalone from 'utils/storeLastLocation'

/**
 * Used to sanitize HTML content.
 * Makes sure DOMPurify is only used on the client side.
 */
interface IProps {
  accessToken?: string
  config?: object
  dispatch?: DispatchProp
  embeddedLayout?: boolean
  html: string
  localAnchors?: boolean
  onReady?: () => void
}

export class SanitizedHtml extends React.Component<IProps> {
  static handleContentLinkClick(e: MouseEvent) {
    const {
      hostname,
      href: url,
      target: urlTarget,
    } = e.currentTarget as HTMLAnchorElement
    const hash = url.match(/#(\w*)/)
    const isPDF = url.slice(-3) === 'pdf'
    const opensNewTab = urlTarget === '_blank'

    if (hash && hostname === location.hostname) {
      e.preventDefault()
      const elm = document.getElementById(hash[1])
      if (elm) {
        elm.scrollIntoView()
      }
    } else if (isPDF && opensNewTab) {
      storeLocationIfStandalone('', url)
    }
  }

  static handleContentLinkClickNative(e: MouseEvent, accessToken: string) {
    /* If we are an in a native environment (embeddedLayout),
      prevent the click event from firing, and instead send a native event.
      We do this to prevent external links from opening in the app. */
    e.preventDefault()
    sendNativeEvent(accessToken, {
      name: 'open-external-link',
      data: (e.currentTarget as HTMLAnchorElement).href,
    })
  }

  static defaultProps = {
    localAnchors: false,
  }

  state = {
    html: '',
  }

  view: Element = null

  componentDidMount() {
    this.setHtml(this.props)
  }

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.html !== this.props.html) {
      this.setHtml(this.props)
    }
    setTimeout(() => {
      if (this.view && this.props.localAnchors) {
        const anchors = this.view.getElementsByTagName('a')
        // tslint:disable:prefer-for-of
        for (let i = 0; i < anchors.length; i++) {
          anchors[i].onclick = this.props.embeddedLayout
            ? (e: MouseEvent) =>
                SanitizedHtml.handleContentLinkClickNative(
                  e,
                  this.props.accessToken,
                )
            : SanitizedHtml.handleContentLinkClick
        }
        // tslint:enable:prefer-for-of
      }
      this.props.onReady && this.props.onReady()
    }, 0)
  }

  setView = (view: React.ReactInstance) =>
    (this.view = (view ? findDOMNode(view) : view) as Element)

  setHtml = (props: IProps) =>
    this.setState({
      html: DOMPurify.sanitize(props.html, props.config),
    })

  render() {
    const {
      accessToken,
      dispatch,
      embeddedLayout,
      localAnchors,
      html,
      config,
      onReady,
      ...props
    } = this.props

    return (
      <View
        ref={this.setView}
        dangerouslySetInnerHTML={{
          __html: this.state.html,
        }}
        {...props}
      />
    )
  }
}

const ConnectedSanitizedHtml = connect(
  ({ app, authentication }: IReduxState) => ({
    accessToken: authentication.accessToken,
    embeddedLayout: app.embeddedLayout,
  }),
  {},
)(SanitizedHtml)

export default ConnectedSanitizedHtml
